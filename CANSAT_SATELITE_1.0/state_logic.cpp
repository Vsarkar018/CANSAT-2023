#include "state_logic.h"
#include <Arduino.h>

void findState(float altitude )
{
  
  
}

// #include <EEPROM.h>
// #include <Servo.h>
// #include <SD.h>
// // Include other libraries needed for sensors, gyro control, etc.

// Define states for the CANSAT mission
enum CansatState {
  STATE_INIT,
  STATE_FSW_RECOVERY,
  STATE_READ_SENSORS,
  STATE_DEPLOY_PARACHUTE_1,
  STATE_GYRO_CONTROL,
  STATE_DEPLOY_PARACHUTE_2,
  STATE_LANDING_SEQUENCE,
  STATE_LANDED
};

CansatState currentState;
Servo parachuteServo;  // Assuming servo is used for parachute deployment
const int parachuteServoPin = 9; // Example servo pin
const int buzzerPin = 8;        // Buzzer pin

// void setup() {
//   Serial.begin(9600);
//   EEPROM.begin();
//   SD.begin(BUILTIN_SDCARD);

//   // Initialize servo
//   parachuteServo.attach(parachuteServoPin);

//   // Read the last known state from EEPROM or set to STATE_INIT
//   int savedState;
//   EEPROM.get(0, savedState);
//   if (savedState >= STATE_INIT && savedState <= STATE_LANDED) {
//     currentState = (CansatState)savedState;
//   } else {
//     currentState = STATE_INIT;
//   }

//   // Additional setup for sensors, SD card, etc.
// }

void loop() {
  switch (currentState) {
    case STATE_INIT:
      // Initial setup, check system health, etc.
      transitionState(STATE_FSW_RECOVERY);
      break;
    case STATE_FSW_RECOVERY:
      // FSW Recovery process
      transitionState(STATE_READ_SENSORS);
      break;
    case STATE_READ_SENSORS:
      // Read from sensors, save data, transmit telemetry
      // Check altitude and transition states accordingly
      if (altitudeReached(900)) {
        transitionState(STATE_DEPLOY_PARACHUTE_1);
      }
      break;
    case STATE_DEPLOY_PARACHUTE_1:
      // Deploy first parachute
      deployParachute();
      // Start video capture
      transitionState(STATE_GYRO_CONTROL);
      break;
    case STATE_GYRO_CONTROL:
      // Activate gyro control for stabilization
      if (altitudeReached(500)) {
        transitionState(STATE_DEPLOY_PARACHUTE_2);
      }
      break;
    case STATE_DEPLOY_PARACHUTE_2:
      // Deploy second parachute
      deployParachute();
      if (altitudeReached(20)) {
        transitionState(STATE_LANDING_SEQUENCE);
      }
      break;
    case STATE_LANDING_SEQUENCE:
      // Turn on beacon, prepare for landing
      digitalWrite(buzzerPin, HIGH); // Assuming buzzer for simplicity
      transitionState(STATE_LANDED);
      break;
    case STATE_LANDED:
      // CANSAT has landed, stop all operations or enter sleep mode
      digitalWrite(buzzerPin, LOW);
      // Perform any final operations before going to sleep or ending mission
      break;
  }

  // Delay to prevent too frequent processing
  delay(1000);
}

void transitionState(CansatState newState) {
  currentState = newState;
  EEPROM.put(0, (int)newState); // Save new state to EEPROM for recovery
}

bool altitudeReached(int targetAltitude) {
  // Implement altitude check logic here
  // return true if the current altitude >= targetAltitude
  return false; // Placeholder return value
}

void deployParachute() {
  // Implement parachute deployment logic here
  // For example, rotate servo to release parachute mechanism
}

// Add other functions as needed for sensor reading, gyro control, video capture, etc.
