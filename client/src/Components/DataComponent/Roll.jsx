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
        label: "X",
        borderColor: "rgba(255, 99, 132, 1)",
        data: gyroscopicData.map((dataPoint) => dataPoint.x),
        fill: false,
      },
      {
        label: "Y",
        borderColor: "rgba(54, 162, 235, 1)",
        data: gyroscopicData.map((dataPoint) => dataPoint.y),
        fill: false,
      },
      {
        label: "Z",
        borderColor: "rgba(75, 192, 192, 1)",
        data: gyroscopicData.map((dataPoint) => dataPoint.z),
        fill: false,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "linear",
        position: "bottom",
        beginAtZero: true,
      },
      y: {
        min: -360,
        max: 360,
        ticks: {
          stepSize: 90,
        },
      },
    },
  };

  return (
    <div>
      <Line data={data} options={options} />
    </div>
  );
};

export default Roll;
