import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useGlobalContext } from "../../context/appContext";

  const Speed = () => {
    const [labels, setLabels] = useState([]);
    const [speeds, setSpeeds] = useState([]);
    const { telemetry } = useGlobalContext();
  
    useEffect(() => {
      if (telemetry) {
        // Assuming the telemetry data string format and speed is at a specific index
        const parts = telemetry.split(',');
        const speed = parseFloat(parts[2]); // Example: speed is at index 2, adjust as per your data
        const newLabel = labels.length + 1; // Increment label for new data point
        
        setLabels((prevLabels) => [...prevLabels, newLabel].slice(-20)); // Keep only the last 20 entries
        setSpeeds((prevSpeeds) => [...prevSpeeds, speed].slice(-20)); // Keep only the last 20 speed data points
      }
    }, [telemetry]);

    const speedData = {
      labels, // Use the updated labels state
      datasets: [
        {
          label: "Speed",
          data: speeds, // Use the updated speeds state
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    };
    
    const options = {
      scales: {
        x: {
          grid: {
            color: "#282828", // Use a color from your palette
          },
          ticks: {
            color: "#ffffff", // Use a white color for better readability on a dark background
          },
        },
        y: {
          grid: {
            color: "#282828", // Use a color from your palette
          },
          ticks: {
            color: "#ffffff", // Use a white color for better readability on a dark background
          },
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#ffffff", // Use a white color for better readability on a dark background
          },
        },
      },
      elements: {
        point: {
          radius: 0, // Hide points on the line
        },
      },
    };
  
  return (
    <div style={{ background: "#141414", width: "100%", height: "100%", padding: "20px"}}>
      <Line data={speedData} options={options} />
    </div>
      
  );
};

export default Speed;
