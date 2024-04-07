#include "state_logic.h"
#include <Arduino.h>

// Define state enum
enum SatelliteState {
  BOOT,
  SYSTEM_TEST,
  READY_FOR_LAUNCH,
  ASCENT,
  APOGEE_REACHED,
  DESCENT,
  DESCENT_GYRO_INITIALIZE,
  DESCENT_PARACHUTE_1_OPEN,
  DESCENT_PARACHUTE_2_OPEN,
  DESCENT_BUZZER,
  IMPACT
};

// Define global variables to track state
SatelliteState currentState = BOOT;
bool gyroInitialized = false;
bool parachute1Opened = false;
bool parachute2Opened = false;

// Threshold altitude for parachute 2 opening
float parachute2Threshold = 580.0; // Adjust as needed
float prev_altitudee = 0;
float prev_accel = 0 ;
int impactFlag = 0;
int apogee = 253.0;
int apogee_flag = 1;
// Function to update state based on altitude
SatelliteState updateState(float altitudee,float acceleration) {
  float altitudee_diff = altitudee - prev_altitudee ;
  if (altitudee_diff > 0 ){
    currentState = ASCENT;
  }else if (altitudee_diff < 0 ){
    impactFlag = 1;
    currentState = DESCENT;
    
  }else if ((abs(altitudee_diff) >= 0 && abs(altitudee_diff) <= 0.5)){
    currentState = READY_FOR_LAUNCH;

    if (impactFlag == 1){
      currentState = IMPACT;
    }
  }
  float acceleration_diff = acceleration - prev_accel;
  if (altitudee >= apogee && abs(acceleration_diff) >= 0 && abs(acceleration_diff) < 0.5){
    currentState = APOGEE_REACHED;
  }

  prev_altitudee = altitudee;
  prev_accel = acceleration;
  return currentState;
}
const char* stateToString(SatelliteState state) {
  switch(state) {
    case BOOT: return "BOOT";
    case SYSTEM_TEST: return "SYSTEM TEST";
    case READY_FOR_LAUNCH: return "READY FOR LAUNCH";
    case ASCENT: return "ASCENT";
    case APOGEE_REACHED: return "APOGEE REACHED";
    case DESCENT: return "DESCENT";
    case DESCENT_GYRO_INITIALIZE: return "DESCENT - GYRO INITIALIZE";
    case DESCENT_PARACHUTE_1_OPEN: return "DESCENT - PARACHUTE 1 OPEN";
    case DESCENT_PARACHUTE_2_OPEN: return "DESCENT - PARACHUTE 2 OPEN";
    case DESCENT_BUZZER: return "DESCENT - BUZZER";
    case IMPACT: return "IMPACT";
    default: return "UNKNOWN";
  }
}

int stateToInteger(SatelliteState state) {
  switch(state) {
    case BOOT: return 0;
    case SYSTEM_TEST: return 1;
    case READY_FOR_LAUNCH: return 2;
    case ASCENT: return 3;
    case APOGEE_REACHED: return 4;
    case DESCENT: return 5 ;
    case DESCENT_GYRO_INITIALIZE: return 6;
    case DESCENT_PARACHUTE_1_OPEN: return 7;
    case DESCENT_PARACHUTE_2_OPEN: return 8;
    case DESCENT_BUZZER: return 9;
    case IMPACT: return 10;
    default: return 11;
  }
}

// const char* findState(float altitudee) {
//   currentState = updateState(altitudee);
//   return stateToString(currentState);
// }

int findState(float altitudee, float acceleration) {
  currentState = updateState(altitudee,acceleration);
  return stateToInteger(currentState);
}