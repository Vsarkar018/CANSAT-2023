import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const OrientationChart = () => {
  // Function to simulate orientation data for X, Y, Z axes
  const generateDemoData = (count) => {
    return Array.from({ length: count }, () => ({
      x: +(Math.random() * 180 - 90).toFixed(2), // Simulating degrees from -90 to 90
      y: +(Math.random() * 180 - 90).toFixed(2),
      z: +(Math.random() * 180 - 90).toFixed(2),
    }));
  };

  const demoData = generateDemoData(20);

  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 20 }, (_, i) => `S ${i + 1}`),
    datasets: [
      {
        label: "X Orientation",
        data: demoData.map(data => data.x),
        fill: false,
        borderColor: '#FF6384', // Red for X
        tension: 0.1,
        borderWidth: 1, // Decreased line width
      },
      {
        label: "Y Orientation",
        data: demoData.map(data => data.y),
        fill: false,
        borderColor: '#36A2EB', // Blue for Y
        tension: 0.1,
        borderWidth: 1, // Decreased line width
      },
      {
        label: "Z Orientation",
        data: demoData.map(data => data.z),
        fill: false,
        borderColor: '#FFCE56', // Yellow for Z
        tension: 0.1,
        borderWidth: 1, // Decreased line width
      },
    ],
  });

  const options = {
    scales: {
      y: {
        suggestedMin: -90,
        suggestedMax: 90,
        grid: {
          color: "#282828",
        },
        ticks: {
          color: "#ffffff",
          font: {
            size: 10, // Decreased font size for Y-axis labels
          },
        },
      },
      x: {
        grid: {
          color: "#282828",
        },
        ticks: {
          color: "#ffffff",
          font: {
            size: 10, // Decreased font size for X-axis labels
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: {
            size: 12, // Decreased font size for legend labels
          },
        },
      },
    },
    // maintainAspectRatio: false, // This will allow the chart to use maximum container space  
  };

  return (
    <div style={{ background: "#141414", width: "100%", height: "100%", padding: "20px" }}>
      <Line data={chartData} options={options} />
      {/* <p style={{ color: "#ffffff", textAlign: "center", marginTop: "10px", fontSize: "12px" }}>Orientation (Degrees)</p> */}
    </div>
  );
};

export default OrientationChart;
