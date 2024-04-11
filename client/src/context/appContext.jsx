import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
const AppContext = React.createContext();

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
    state: "",
  });

  // useEffect(() => {
  //   const generateRandomData = () => {
  //     setData(prevData => ({
  //       ...prevData,
  //       time_stamping: Date.now(),
  //       packet_count: prevData.packet_count + 1,
  //       altitude:( Math.random() * 100).toFixed(6),
  //       pressure: (Math.random() * 1000).toFixed(6),
  //       temperature: (Math.random() * 50).toFixed(6),
  //       voltage:( Math.random() * 5).toFixed(6),
  //       gnss_time: Date.now(),
  //       gnss_lat:( Math.random() * 90).toFixed(6),
  //       gnss_lon: (Math.random() * 180).toFixed(6),
  //       gnss_alti: (Math.random() * 100).toFixed(6),
  //       gnss_sats: (Math.floor(Math.random() * 20)).toFixed(6),
  //       accel: (Math.random() * 10).toFixed(6),
  //       gyro: (Math.random() * 5).toFixed(6),
  //       state: "OK",
  //     }));
  //   };

  //   const intervalId = setInterval(generateRandomData, 1000);

  //   return () => clearInterval(intervalId);
  // }, []);



  const [telemetry, setTelemetry] = useState("");
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

export const useGlobalContext = () => {
  return useContext(AppContext);
};

export { AppProvider };
