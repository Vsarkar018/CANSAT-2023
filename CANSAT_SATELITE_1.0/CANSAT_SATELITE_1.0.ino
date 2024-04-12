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
#define BUFFER_SIZE 128

// Initialize buffer with all elements set to '\0'
char buffer[BUFFER_SIZE] = { '\0' };
 
Servo paraServo, esc;
float thresholdAltitude = 580;
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
int initial_state = 10 ;

TinyGPSPlus gps;
SoftwareSerial ss(0, 1); // RX, TX pins for GPS module


File dataFile;

// Xbeee
XBee xbee = XBee();
XBeeAddress64 addr64 = XBeeAddress64(0x0013a200, 0x41f45000);
ZBTxRequest zbTx;
XBeeResponse response = XBeeResponse();
ZBRxResponse rx = ZBRxResponse();


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
struct orientation{
   float x = 0.0;
  float y = 0.0;
  float z = 0.0;
};
accelerometer accelerometerData;
gyro gyroSpinRate;
orientation orientationData;



//OLCD Display
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#define SCREEN_WIDTH 128 // OLED display width, in pixels
#define SCREEN_HEIGHT 32 // OLED display height, in pixels
#define OLED_RESET -1     // Reset pin # (or -1 if sharing Arduino reset pin)
#define SCREEN_ADDRESS 0x3C // I2C address of the OLED display
Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, &Wire2, OLED_RESET);



int state = 0 ;

//variables for testing purpose
char test_status[32];
int buzzer = 30;
void setup()
{
  Serial2.begin(9600);
  xbee.setSerial(Serial2);
//  BLDC SETUP
   esc.attach(33,  1000, 2000); 
   delay(1000);
   esc.write(0);
   delay(1000);
   esc.write(20);
   delay(1000);
    esc.write(60);
   delay(1000);
   esc.write(80);
   delay(1000);
   esc.write(100);
   delay(1000);
   esc.write(140);
   delay(1000);
   esc.write(180);
  
  paraServo.attach(14);
  paraServo.write(0);
  
  ss.begin(9600);
  

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
  pinMode(buzzer,OUTPUT);

  //OLCD Display
  display.begin(SSD1306_SWITCHCAPVCC, SCREEN_ADDRESS);
  display.clearDisplay();
  display.display();


  delay(1000);
 
//  if (!(SD.exists("telemetry.csv") && SD.open("telemetry.csv").size() > 0)) {
    transmit_initial_telemetry(state);
    state = 1;
    transmit_initial_telemetry(state);
    test();
    state = 2;
    transmit_initial_telemetry(state);    
//  }
}
int startTelemetryFlag = 0;
void loop()
{
  Serial2.flush();
  receieve_packet();
  currentMillis = millis();
  if (currentMillis - previousMillis >= interval && startTelemetryFlag )
  {
    timeStamping = currentMillis / 1000;
    get_data();
    generateTelemetry();
    transmitTelemetry(telemetry);
    writeDatainSD();
    previousMillis = currentMillis;
  }
  activateBuzzer();
  display.clearDisplay();
  displayVoltage();
  displayTeamName();
  display.display();
delay(BNO055_SAMPLERATE_DELAY_MS );
}
float alitude_dif = 0;
float prev_acc = 0;
float prev_alti = 0;
float acce_diff = 0;
void get_data(){
    altitudee = bmp.readAltitude(SEALEVELPRESSURE_HPA) - altitudeeOffset;
   if (altitudee > 0 && altitudeeFlag && altitudee < 1500){
     altitudeeOffset = altitudee;
     altitudeeFlag = 0; 
   }
   if(altitudee > 1500){
    altitudee = 0 ;
   }
   
  pressure = bmp.pressure;
  temperature = bmp.temperature;
  voltage = getVoltage(); 
  gps_data();
  getAccelerometerData();
  getGyroSpinRate();
  getOrientation();
  state = findState(altitudee,accelerometerData.z);
  alitude_dif = altitudee - prev_alti;
  acce_diff = accelerometerData.z - prev_acc;
  if(prev_alti == 0){
    alitude_dif = 0;
  }
  if (prev_acc == 0){
    acce_diff = 0;
  }
  prev_alti = altitudee;
  prev_acc = accelerometerData.z;
  
}
void generateTelemetry()
{
  packetCount++;
  snprintf(telemetry, MAX_TELEMETRY_SIZE,
           "%s,%lu,%u,%.1f,%u,%.1f,%.2f,%lu,%.4f,%.4f,%.1f,%d,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f,%d\r\n",
           teamID, timeStamping, packetCount, altitudee, pressure,
           temperature, voltage, gnssTime, gnssLatitude, gnssLongitude,
           gnssAltitude, gnssSats, accelerometerData.x, accelerometerData.y,
           accelerometerData.z, gyroSpinRate.x, gyroSpinRate.y, gyroSpinRate.z,orientationData.x,orientationData.y,orientationData.z  ,state+3);
}
bool transmitTelemetry(char data[]){
  zbTx = ZBTxRequest(addr64, (uint8_t *)data, strlen(data));
   xbee.send(zbTx);
   return true;
}
char initi_tele[32];
void transmit_initial_telemetry(int inti_state){
//  snprintf(initi_tele, 32,"%d,%.2f,%.2f,%.2f\r\n",inti_state,alitude_dif,altitudee,acce_diff);
  snprintf(initi_tele, 32,"%d,\r\n",inti_state);
  transmitTelemetry(initi_tele);
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
 return (voltageRef*2.2)/224.2;
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
void getOrientation()
{
  sensors_event_t orientationDataEvent;
  bno.getEvent(&orientationDataEvent, Adafruit_BNO055::VECTOR_EULER);
  orientationData.x = orientationDataEvent.gyro.x;
  orientationData.y = orientationDataEvent.gyro.y;
  orientationData.z = orientationDataEvent.gyro.z;
}

void displayVoltage() {
  display.setTextSize(3);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(15, 10);
  display.print(voltage );
  display.print(F("V"));
}

void displayTeamName() {
  display.setTextSize(1);
  display.setTextColor(SSD1306_WHITE);
  display.setCursor(0, 0);
  display.print(F("DEBRIS"));
}


void opentParachute(){
  if (altitudee > thresholdAltitude && altitudee < 1500){
    parachuteFlag = 1 ;
  }
  if (parachuteFlag && altitudee < thresholdAltitude){
    paraServo.write(0);
    paraServo.write(180);
  }

}

static void gps_data()
{
   
if (gps.location.isValid()) 
 {
  gnssLongitude = gps.location.lng();
  gnssLatitude =  gps.location.lat();
  }
  if(gps.satellites.isValid()){
    gnssSats = gps.satellites.value();
  }
if( gps.altitude.isValid()){
  gnssAltitude = gps.altitude.meters();
}
  gnssTime =gps.time.second();
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

void activateBuzzer(){
//  if(altitudee < 30 && state == 6 ){
//    digitalWrite(buzzer,1);
//  }else{
    digitalWrite(buzzer,0);
//  }
}

bool test(){
  delay(1000);
 if(bno.begin() && bmp.begin_I2C(119, &Wire) && ss.available() ){
  delay(2000);
  Serial8.begin(9600); 
  if(Serial8.available()){
    return true;
  }
 } 
 delay(2000);
 return true; 
}
void receieve_packet(){
  xbee.readPacket();
  
  if (xbee.getResponse().isAvailable()) {
    if (xbee.getResponse().getApiId() == ZB_RX_RESPONSE) {
      xbee.getResponse().getZBRxResponse(rx);
      int len = rx.getDataLength();
      char data[len + 1];
      for (int i = 0; i < len; i++) {
        data[i] = rx.getData(i);
      }
      data[len] = '\0'; // Null-terminate the string
      startTelemetryFlag = atoi(data);
    }
  }
}

float u = 0 ,v;
void velocity(){
  double tiltAngle = orientationData.x * DEG_TO_RAD;
  double xAccel = linearAccelData.acceleration.x * cos(tiltAngle);
  double timee = BNO055_SAMPLERATE_DELAY_MS / 1000.0;
  v = u + timee;
}
