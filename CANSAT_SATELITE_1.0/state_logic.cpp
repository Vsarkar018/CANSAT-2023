#include "state_logic.h"
#include <Arduino.h>

// Define state enum
enum SatelliteState {
  READY_FOR_LAUNCH,
  ASCENT,
  APOGEE_REACHED,
  DESCENT,
  IMPACT
};

// Define global variables to track state
SatelliteState currentState = READY_FOR_LAUNCH ;
float prev_acceleration = 0;
int impactFlag = 0;
const float parachute2Threshold = 580.0;
const float apogeeAltitude = 238.3;
float prev_altitudee = 0;
float prev_acce = 0;
// Function to update state based on altitude and acceleration
SatelliteState updateState(float altitudee, float acceleration) {
  float altitude_diff = altitudee - prev_altitudee;
  float acc_dif = acceleration - prev_acce;

  if (prev_altitudee == 0){
    altitude_diff = 0;
  }
  if (prev_acce == 0){
    acc_dif = 0;
  }
  if(altitude_diff > 0.5){
    currentState = ASCENT;
  }
  if (altitude_diff < -0.5){
    currentState =  DESCENT;
  }
  if (abs(acc_dif) >= 0 && abs(acc_dif) <= 0.4 && abs(altitude_diff) >=0  && abs(altitude_diff) < 0.5 && altitudee > apogeeAltitude ){
    currentState = APOGEE_REACHED;
    impactFlag = 1;
  }
  if(abs(acc_dif) >= 0 && abs(acc_dif) <= 0.4 && abs(altitude_diff) >=0  && abs(altitude_diff) < 0.5 && altitudee < 10 &&  impactFlag){
    currentState = IMPACT;
  }
   
  prev_acce = acceleration;
  prev_altitudee = altitudee;
  return currentState;
}

// Function to convert state enum to string
const char* stateToString(SatelliteState state) {
  switch(state) {
    case READY_FOR_LAUNCH: return "READY FOR LAUNCH";
    case ASCENT: return "ASCENT";
    case APOGEE_REACHED: return "APOGEE REACHED";
    case DESCENT: return "DESCENT";
    case IMPACT: return "IMPACT";
    default: return "UNKNOWN";
  }
}

// Function to convert state enum to integer
int stateToInteger(SatelliteState state) {
  return static_cast<int>(state);
}

// Function to find and return current state based on altitude and acceleration
int findState(float altitudee,  float acceleration)  {
  currentState = updateState(altitudee,acceleration);
  return stateToInteger(currentState);
}
