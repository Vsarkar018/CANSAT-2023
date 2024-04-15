import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { useGlobalContext } from '../../context/appContext';

const telemetryFields = [
  "Team ID", "Time stamping", "Packet count", "Altitude", "Pressure", 
  "Temperature", "Voltage", "GNSS time", "GNSS lat", "GNSS lon", 
  "GNSS alti", "GNSS sats", "Accel X", "Accel Y", "Accel Z", 
  "Gyro X", "Gyro Y", "Gyro Z", "Speed", "State"
];
const socket = io("http://localhost:5000");

const TelemetryDisplay = () => {
  const [telemetryLines, setTelemetryLines] = useState([]);

  useEffect(() => {
    socket.on('telemetry', (telemetryData) => {
      const newLines = telemetryData.split('\n').filter(line => line);
      setTelemetryLines(prevLines => [...prevLines, ...newLines].slice(-10));
    });

    return () => socket.off('telemetry');
  }, []);

  return (
    <div style={{
      padding: '8px',
      maxWidth: '800px',
      height: '330px',
      margin: '0',
      color: '#E0E0E0', // Light grey for text to improve readability
      fontSize: '12px',
      backgroundColor: '#191A1C', // Dark background color
      borderRadius: '8px', // Rounded corners for modern look
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)' // Subtle shadow for depth
    }}>
      <div style={{
        fontWeight: 'bold',
        marginBottom: '5px',
        borderBottom: '1px solid #333', // Separator with a subtle line
        paddingBottom: '5px'
      }}>
        TELEMETRY DATA
      </div>
      <div style={{
        fontSize: '9.5px',
        maxHeight: '400px',
        overflowY: 'auto',
        background: '#1F2226', // Slightly lighter dark for contrast against container
        padding: '8px',
        borderRadius: '4px', // Rounded corners inside scrollable
        border: '1px solid #333' // Subtle border for definition
      }}>
        {telemetryLines.map((line, index) => (
          <p key={index} style={{ margin: '2px' }}>{line}</p>
        ))}
      </div>
    </div>
  );
};

export default TelemetryDisplay;
