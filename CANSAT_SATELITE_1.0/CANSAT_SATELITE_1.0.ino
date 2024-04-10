#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <XBee.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>
#include <SD.h>
#include <TinyGPSPlus.h>
#include <SoftwareSerial.h>
#include <Servo.h> 
#include "state_logic.h"
 
Servo paraServo, esc;
float thresholdAltitude = 251;
int parachuteFlag = 0;
const long interval = 500;
unsigned long previousMillis = 0;
unsigned long currentMillis = 0;
int  voltageRefPin = 40;
float voltageRef = 0.0;
int altitudeeFlag = 1 ;
float altitudeeOffset = 0 ;
float prev_altitude = 0;
float alti_diff = 0; 
TinyGPSPlus gps;
SoftwareSerial ss(0, 1); // RX, TX pins for GPS module


File dataFile;

// Xbeee
XBee xbee = XBee();
XBeeAddress64 addr64 = XBeeAddress64(0x0013a200, 0x41f45000);
ZBTxRequest zbTx;

// BNO
uint16_t BNO055_SAMPLERATE_DELAY_MS = 100;
Adafruit_BNO055 bno = Adafruit_BNO055(55, 0x28, &Wire1);

// BMP
#include "Adafruit_BMP3XX.h"
#define SEALEVELPRESSURE_HPA (1013.25)
Adafruit_BMP3XX bmp;



// Telemetry
#define MAX_TELEMETRY_SIZE 128
char telemetry[MAX_TELEMETRY_SIZE];

// Sensor Readings......

const char *teamID = "2022ASI-043";
unsigned int packetCount = 0;
unsigned long timeStamping = currentMillis / 1000;
float altitudee = 0;
unsigned int pressure = 0;
float temperature = 0;
float voltage = 0;
unsigned long gnssTime = 0;
float gnssLatitude = 0;
float gnssLongitude = 0;
float gnssAltitude = 0;
int gnssSats = 0;


struct gyro
{
  float x = 0.0;
  float y = 0.0;
  float z = 0.0;
};

struct accelerometer
{
  float x = 0.0;
  float y = 0.0;
  float z = 0.0;
};

accelerometer accelerometerData;
gyro gyroSpinRate;



//OLCD Display
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 // OLED display height, in pixels
#define OLED_RESET -1     // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C // I2C address of the OLED display
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire2, OLED_RESET);
int state ;



void setup()
{


// BLDC SETUP
  // esc.attach(33,  1000, 2000); 
  // delay(2000);
  // esc.write(0);
  // delay(2000);
  // esc.write(20);
  // delay(2000);
  // esc.write(40);
  // delay(2000);
  //  esc.write(60);
  // delay(2000);
  // esc.write(80);
  // delay(2000);
  // esc.write(100);
  // delay(2000);
  //  esc.write(120);
  // delay(2000);
  // esc.write(140);
  // delay(2000);
  // esc.write(160);
  // delay(2000);
  // esc.write(180);



  paraServo.attach(14);
  paraServo.write(0);
  Serial2.begin(9600);
  ss.begin(9600);
  xbee.setSerial(Serial2);

  //BNO 
  bno.begin();

  //BMP setup
  bmp.begin_I2C(119, &Wire);
  bmp.setTemperatureOversampling(BMP3_OVERSAMPLING_8X);
  bmp.setPressureOversampling(BMP3_OVERSAMPLING_4X);
  bmp.setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);
  bmp.setOutputDataRate(BMP3_ODR_50_HZ);

  SD.begin(BUILTIN_SDCARD);

  pinMode(voltageRefPin,INPUT);

  //OLCD Display
  display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS);
  display.clearDisplay();
  display.display();


  delay(1000);
}

void loop()
{
  currentMillis = millis();
  if (currentMillis - previousMillis >= interval)
  {
    // Serial.println("Transmitting.....");
    timeStamping = currentMillis / 1000;
    generateTelemetry();
    transmitTelemetry();
    writeDatainSD();
    previousMillis = currentMillis;
  }
  display.clearDisplay();
//  // // displayVoltage();
//  // // displayTeamName();
//  // // displayStateAbbreviation();
   displayFlag();
   displayAltitude();
   display.display();
//  // opentParachute();
//  esc.write(100);
//Serial.println(gnssLongitude);
//Serial.println(gnssLatitude);
}

void generateTelemetry()
{
  packetCount++;
  altitudee = bmp.readAltitude(SEALEVELPRESSURE_HPA) - altitudeeOffset ;
  
  // if (altitudee > 0 && altitudeeFlag && altitudee < 1500){
  //   altitudeeOffset = altitudee;
  //   altitudeeFlag = 0; 
  // }
  // prev_alti = altitudee;

  pressure = bmp.pressure;
  temperature = bmp.temperature;
  voltage = getVoltage();
  gnssTime =gps.time.second(); 
//  gnssLongitude = gps.location.lng();
   lati(gps.location.lat(), gps.location.isValid(), 11, 6);
   lngi(gps.location.lng(), gps.location.isValid(), 11, 6);
  gnssAltitude = gps.altitude.meters();
  gnssSats = gps.satellites.value();
  getAccelerometerData();
  getGyroSpinRate();
  float alit_diff = altitudee -  prev_altitude;
  snprintf(telemetry, MAX_TELEMETRY_SIZE,
           "%s,%lu,%u,%.1f,%u,%.1f,%.2f,%lu,%.4f,%.4f,%.1f,%d,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%d\r\n",
           teamID, timeStamping, packetCount, altitudee, pressure,
           temperature, voltage, gnssTime, gnssLatitude, gnssLongitude,
           gnssAltitude, gnssSats, accelerometerData.x, accelerometerData.y, accelerometerData.z, gyroSpinRate.x, gyroSpinRate.y, gyroSpinRate.z,state);
            // snprintf(telemetry, MAX_TELEMETRY_SIZE,
          //  "%.1f,%.1f,%d\r\n",
          // altitudee,alit_diff,state);
          
}

void transmitTelemetry()
{
  zbTx = ZBTxRequest(addr64, (uint8_t *)telemetry, strlen(telemetry));
  xbee.send(zbTx);
}


void writeDatainSD(){

  dataFile = SD.open("telemetry.csv", FILE_WRITE);
  if (dataFile)
  {
    dataFile.println(telemetry);
    dataFile.close();
  }
  else
  {
    Serial.println("Error opening telemetry.csv for writing");
  }

}

float getVoltage()
{
  voltageRef = analogRead(voltageRefPin);
 return (voltageRef*113)/1000;
}

void getAccelerometerData()
{
  sensors_event_t accelerometerEvent;
  bno.getEvent(&accelerometerEvent, Adafruit_BNO055::VECTOR_ACCELEROMETER);
  accelerometerData.x = accelerometerEvent.acceleration.x;
  accelerometerData.y = accelerometerEvent.acceleration.y;
  accelerometerData.z = accelerometerEvent.acceleration.z;
}

void getGyroSpinRate()
{
  sensors_event_t gyroEvent;
  bno.getEvent(&gyroEvent, Adafruit_BNO055::VECTOR_GYROSCOPE);
  gyroSpinRate.x = gyroEvent.gyro.x;
  gyroSpinRate.y = gyroEvent.gyro.y;
  gyroSpinRate.z = gyroEvent.gyro.z;
}


void displayVoltage() {
  display.setTextSize(3);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(15, 10);
  display.print(voltage);
  display.print(F("V"));
}

void displayTeamName() {
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print(F("DEBRIS"));
}

void displayStateAbbreviation() {
  String stateAbbreviation = "THE STATE";
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(55, 0);
  display.print(stateAbbreviation);
}


void opentParachute(){
  if (altitudee > thresholdAltitude && altitudee < 1500){
    parachuteFlag = 1 ;
  }
  if (parachuteFlag && altitudee < thresholdAltitude){
    paraServo.write(180);
    paraServo.write(0);
    paraServo.write(180);
  }

}

void displayAltitude() {
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 15);
  display.print(gnssLongitude);
}


void displayFlag() {  // String stateAbbreviation = "THE STATE";
  display.setTextSize(2);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print(gnssLatitude);
}


static void lati(float val, bool valid, int len, int prec)
{
if (valid) 
 {
  gnssLatitude = val;

  }
  smartDelay(0);
}
static void lngi(float val, bool valid, int len, int prec)
{
if (valid) 
 {
  gnssLongitude = val;
  }
  smartDelay(0);
}
static void smartDelay(unsigned long ms) {
  unsigned long start = millis();
  do {
    while (ss.available()) {
      gps.encode(ss.read());
    }
  } while (millis() - start < ms);
}
