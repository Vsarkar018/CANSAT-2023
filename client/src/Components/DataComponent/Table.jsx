import React, { useState, useEffect } from 'react';

// Simulated function that fetches or receives new telemetry data
// Replace this with your actual data fetching or subscription logic
const fetchTelemetryData = () => {
  // Simulate receiving a new telemetry data string
  return "2022ASI-043,22,1,1848.8,81001,22.9,1.13,0,0.0000,0.0000,0.0,0,8.55,-2.86,2.62,0.00,0.00,0.00,1";
};

const TelemetryDisplay = () => {
  const [telemetryData, setTelemetryData] = useState([]);

  useEffect(() => {
    const intervalId = setInterval(() => {
      const newTelemetryData = fetchTelemetryData();
      setTelemetryData(currentData => [...currentData.slice(-9), newTelemetryData]);
    }, 1000); // Fetch new telemetry data every 1 second

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div>
      <h3>Last 10 Telemetry Entries</h3>
      <ul>
        {telemetryData.map((data, index) => (
          <li key={index}>
            {data}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TelemetryDisplay;
