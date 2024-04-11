import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('http://localhost:5000'); // Replace with your server's address

const TelemetryDisplay = () => {
  const [telemetryData, setTelemetryData] = useState('');

  useEffect(() => {
    // Listen for telemetry data from the server
    socket.on('telemetry', (data) => {
      const parsedData = JSON.parse(data);
      // Convert the telemetry object into a string for display
      const formattedData = Object.entries(parsedData).map(([key, value]) => `${key}: ${value}`).join('\n');
      setTelemetryData(formattedData);
    });

    // Clean up on component unmount
    return () => {
      socket.off('telemetry');
    };
  }, []);

  return (
    <div style={{ whiteSpace: 'pre-wrap', backgroundColor: '#141414', color: 'white', padding: '10px' }}>
      {telemetryData}
    </div>
  );
};

export default TelemetryDisplay;
