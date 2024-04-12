import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../../context/appContext';

// Simulated function that fetches or receives new telemetry data
// Replace this with your actual data fetching or subscription logic
const fetchTelemetryData = () => {
  return "2022ASI-043,22,1,1848.8,81001,22.9,1.13,0,0.0000,0.0000,0.0,0,8.55,-2.86,2.62,0.00,0.00,0.00,1";
};

const TelemetryDisplay = () => {
  const [telemetryData, setTelemetryData] = useState([]);
  const { telemetry } = useGlobalContext();

  useEffect(() => {
    const intervalId = setInterval(() => {
      const { telemetry } = useGlobalContext();
      const newTelemetryData = telemetry;
      setTelemetryData(currentData => [...currentData.slice(-9), newTelemetryData]);
    }, 1000); // Fetch new telemetry data every 1 second

    return () => clearInterval(intervalId);
  }, []);

  const telemetryDisplayStyle = {
    position: 'fixed',
    bottom: '20px',
    right: '20px',
    backgroundColor: 'rgba(0,0,0,0.5)',
    color: 'white',
    padding: '10px',
    borderRadius: '5px',
    maxWidth: '300px',
    maxHeight: '200px',
    overflowY: 'auto',
  };

  return (
    <div style={telemetryDisplayStyle}>
      <h3>TELEMETRY</h3>
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
