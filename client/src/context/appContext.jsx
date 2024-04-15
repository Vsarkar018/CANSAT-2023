import React, { useContext, useEffect, useState } from "react";
import io from "socket.io-client";
const socket = io("http://localhost:5000");
const AppContext = React.createContext();
import Papa from 'papaparse'
import { LogarithmicScale } from "chart.js";
export const useGlobalContext = () => {
  return useContext(AppContext);
};

const AppProvider = ({ children }) => {
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

export { AppProvider };
