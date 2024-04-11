// src/GyroscopicChart.js

import React from "react";
import { Line } from "react-chartjs-2";
const gyroscopicData = [
  { x: 0, y: 10, z: -20 },
  { x: 1, y: 20, z: -15 },
  // ... more data points
];
const Roll = () => {
  const data = {
    labels: Array.from({ length: gyroscopicData.length }, (_, i) => i + 1),
    datasets: [
      {
        label: "X Axis",
        borderColor: "#320064", // Purple color from your palette
        backgroundColor: "rgba(50, 0, 100, 0.5)", // Slightly transparent
        data: gyroscopicData.map((dataPoint) => dataPoint.x),
        fill: false,
      },
      {
        label: "Y Axis",
        borderColor: "#230046", // Darker purple
        backgroundColor: "rgba(35, 0, 70, 0.5)",
        data: gyroscopicData.map((dataPoint) => dataPoint.y),
        fill: false,
      },
      {
        label: "Z Axis",
        borderColor: "#141414", // Almost black
        backgroundColor: "rgba(20, 20, 20, 0.5)",
        data: gyroscopicData.map((dataPoint) => dataPoint.z),
        fill: false,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          color: "#282828" // Mid-gray for grid lines
        },
        title: {
          display: true,
          color: '#FFFFFF'
        },
        ticks: {
          color: '#FFFFFF' // White text color
        }
      },
      y: {
        min: -180,
        max: 180,
        grid: {
          color: "#282828" // Mid-gray for grid lines
        },
        title: {
          display: true,
          color: '#FFFFFF'
        },
        ticks: {
          stepSize: 90,
          color: '#FFFFFF' // White text color
        }
      },
    },
    plugins: {
      legend: {
        labels: {
          color: '#FFFFFF' // White text color for legends
        }
      }
    }
  };

  return (
    <div style={{ background: "#141414", position: "relative", height: "100%", width: "100%", paddingLeft: "10px", padding: "20px" }}>
      <Line data={data} options={options} />
    </div>
  );
};

export default Roll;
