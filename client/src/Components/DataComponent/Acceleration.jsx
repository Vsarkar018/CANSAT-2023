import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
const Acceleration = () => {
  const generateDemoData = (count) => {
    const data = [];
    for (let i = 0; i < count; i++) {
      const altitude = (Math.random() * 10).toFixed(2); // Random altitude data
      const pressure = (Math.random() * 10).toFixed(2); // Random pressure data
      data.push({ altitude, pressure });
    }
    return data;
  };
  let pressureFromTele = generateDemoData(20);
  const [pressureData, setPressureData] = useState({
    labels: pressureFromTele.map((tele) => tele.altitude),
    datasets: [
      {
        labels: "Pressure",
        data: pressureFromTele.map((tele) => tele.pressure),
        fill: false,
        borderWidth: 1, // Adjust the line width
        pointRadius: 0,
      },
    ],
  });
  const options = {
    scales: {
      x: {
        grid: {
          color: "rgba(255, 255, 255, 0.3)", // Increase opacity for better visibility
        },
        ticks: {
          font: {
            size: 4, // Adjust the font size for x-axis labels
          },
          stepSize: 1,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.3)", // Increase opacity for better visibility
        },
        ticks: {
          font: {
            size: 4, // Adjust the font size for x-axis labels
          },
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
    // maintainAspectRatio: false,
    // backgroundColor: "black",
  };
  return (
    <div
      style={{ width: "100%", height: "100%" }}
      className="p-0 m-0  flex items-center flex-col"
    >
      <Line data={pressureData} options={options} />
      <p className="text-white font-thin text-lg">Acceleration</p>
    </div>
  );
};

export default Acceleration;
