import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
const AppContext = React.createContext();

export const useGlobalContext = () => {
  return useContext(AppContext);
};

const AppProvider = ({ children }) => {

  const [data, setData] = useState({
    team_id: "2022ASI-043",
    time_stamping: 0,
    packet_count: 0,
    altitude: 0,
    pressure: 0,
    temperature: 0,
    voltage: 0,
    gnss_time: 0,
    gnss_lat: 0,
    gnss_lon: 0,
    gnss_alti: 0,
    gnss_sats: 0,
    accel_x: 0,
    accel_y: 0,
    accel_z: 0,
    gyro_x: 0,
    gyro_y: 0,
    gyro_z: 0,
    speed: 0,
    state: "",
  });


  const [telemetry, setTelemetry] = useState("0,0,0,0,0,0,0,0, 23.1076436,72.496275,0,0,0,0,0,0,0,0,0");
  // useEffect(() => {
  //   // Set up an interval to simulate telemetry updates every second
  //   const interval = setInterval(() => {
  //     // Generate random changes for latitude and longitude for demonstration
  //     const randomLatChange = (Math.random() - 0.5) * 0.001; // small random latitude change
  //     const randomLonChange = (Math.random() - 0.5) * 0.001; // small random longitude change
  //     const parts = telemetry.split(",");
  //     const newLat = parseFloat(parts[8]) + randomLatChange;
  //     const newLon = parseFloat(parts[9]) + randomLonChange;

  //     // Create a new telemetry string with updated values
  //     const newTelemetry = `0,0,0,0,0,0,0,0,${newLat.toFixed(4)},${newLon.toFixed(4)},0,0,0,0,0,0,0,0,0`;
  //     setTelemetry(newTelemetry);
  //   }, 500);

  //   // Clean up the interval when the component unmounts
  //   return () => clearInterval(interval);
  // }, [telemetry]);


  useEffect(() => {
    socket.on("telemetry", telemetryData => {
      setTelemetry(telemetryData);
    });
  });

  return (
    <AppContext.Provider
      value={{
        telemetry
      }}>
      {children}
    </AppContext.Provider>
  );
};

export { AppProvider };
