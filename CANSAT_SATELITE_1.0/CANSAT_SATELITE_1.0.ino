#include <Wire.h>
#include <SPI.h>
#include <Adafruit_Sensor.h>
#include <XBee.h>
#include <Adafruit_BNO055.h>
#include <utility/imumaths.h>

// Xbeee
XBee xbee = XBee();
XBeeAddress64 addr64 = XBeeAddress64(0x0013a200, 0x41f4525e);
ZBTxRequest zbTx;

// BNO
uint16_t BNO055_SAMPLERATE_DELAY_MS = 100;
Adafruit_BNO055 bno = Adafruit_BNO055(55, 0x28, &Wire);

// BMP
#include "Adafruit_BMP3XX.h"
#define SEALEVELPRESSURE_HPA (1013.25)
Adafruit_BMP3XX bmp;

const long interval = 800;
unsigned long previousMillis = 0;
unsigned long currentMillis = 0;

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

void setup()
{
  Serial.begin(9600);
  while (!Serial)
    delay(10);

  Serial1.begin(9600);
  xbee.setSerial(Serial1);

  if (!bno.begin())
  {
    /* There was a problem detecting the BNO055 ... check your connections */
    Serial.print("Ooops, no BNO055 detected ... Check your wiring or I2C ADDR!");
    while (1)
      ;
  }
  // BMP setup
  if (!bmp.begin_I2C(119, &Wire1))
  {
    Serial.println("Could not find a valid BMP3 sensor, check wiring!");
    while (1)
      ;
  }
  bmp.setTemperatureOversampling(BMP3_OVERSAMPLING_8X);
  bmp.setPressureOversampling(BMP3_OVERSAMPLING_4X);
  bmp.setIIRFilterCoeff(BMP3_IIR_FILTER_COEFF_3);
  bmp.setOutputDataRate(BMP3_ODR_50_HZ);

  delay(1000);
}

void loop()
{
  currentMillis = millis();
  if (currentMillis - previousMillis >= interval)
  {
    Serial.println("Transmitting.....");
    timeStamping = currentMillis / 1000;
    generateTelemetry();
    previousMillis = currentMillis;
  }
  Serial.println();
}

void generateTelemetry()
{
  packetCount++;
  // altitudee = 343;;
  altitudee = bmp.readAltitude(SEALEVELPRESSURE_HPA);
  // pressure = 342.34;
  pressure = bmp.pressure;
  // temperature = 34;;
  temperature = bmp.temperature;
  voltage = getVoltage();
  gnssTime = getGnssTime();
  gnssLongitude = getGnssLongitude();
  gnssLatitude = getGnssLatitude();
  gnssAltitude = getGnssAltitude();
  gnssSats = getGnssSats();
  getAccelerometerData();
  getGyroSpinRate();

  snprintf(telemetry, MAX_TELEMETRY_SIZE,
           "%s,%lu,%u,%.1f,%u,%.1f,%.2f,%lu,%.4f,%.4f,%.1f,%d,%.2f,%.2f,%.2f,%.2f,%.2f,%.2f\r\n",
           teamID, timeStamping, packetCount, altitudee, pressure,
           temperature, voltage, gnssTime, gnssLatitude, gnssLongitude,
           gnssAltitude, gnssSats, accelerometerData.x, accelerometerData.y, accelerometerData.z, gyroSpinRate.x, gyroSpinRate.y, gyroSpinRate.z);

  transmitTelemetry();
}

void transmitTelemetry()
{
  Serial.println(telemetry);
  Serial.println("Send ");
  zbTx = ZBTxRequest(addr64, (uint8_t *)telemetry, strlen(telemetry));
  xbee.send(zbTx);
  Serial.print("Telemetry = ");
  Serial.println(telemetry);
}

float getVoltage()
{
  return 3.00;
}
unsigned int getGnssTime()
{
  return 343;
}

float getGnssLongitude()
{
  return 23424.0;
}

float getGnssLatitude()
{
  return 343.343;
}
float getGnssAltitude()
{
  return 34343.00;
}

int getGnssSats()
{
  return 3;
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

// float getPressure(){
//   float pres = bmp.pressure;
//   Serial.print("Pressure = ");
//   Serial.println(pres);
//   Serial.println(" Pa");
//   return pres;
// }
//
// float getTemperaturee(){
//   float temp = bmp.temperature;
//   Serial.print("Temperature = ");
//   Serial.println(temp);
//   Serial.println(" *C");
//   return temp;
// }
//
// float getAltitude(){
//   float alti = bmp.readAltitude(SEALEVELPRESSURE_HPA);
//   Serial.print("Approx. Altitude = ");
//   Serial.print(alti);
//   Serial.println(" m");
//   return alti;
// }