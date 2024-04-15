import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useGlobalContext } from "../../context/appContext";

const Speed = () => {
  const { telemetry } = useGlobalContext();
  const [chartData, setChartData] = useState({
    labels: [], // Time labels for X-axis
    datasets: [
      {
        label: "Speed (m/s)",
        data: [], // Speed data for Y-axis
        borderColor: 'rgb(54, 162, 235)', // A different color for speed
        tension: 0.1, // Smoothens the line
        fill: false,
      },
    ],
  });

  useEffect(() => {
    if (telemetry) {
      const parts = telemetry.split(',');
      const time = parts[1]; // Assuming the second item is the time
      const speed = parseFloat(parts[18]); // Assuming the 19th item is speed

      setChartData(prevData => ({
        labels: [...prevData.labels, time],
        datasets: prevData.datasets.map(dataset => ({
          ...dataset,
          data: [...dataset.data, speed],
        })),
      }));
    }
  }, [telemetry]); // Effect runs whenever telemetry changes

  const options = {
    scales: {
      x: {
        grid: {
          color: "#282828", // Styling grid lines
        },
        ticks: {
          color: "#ffffff", // Styling tick labels
        },
      },
      y: {
        beginAtZero: true, // Ensuring Y-axis starts at zero
        grid: {
          color: "#282828", // Styling grid lines
        },
        ticks: {
          color: "#ffffff", // Styling tick labels
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff", // Styling legend labels
        },
      },
    },
  };

  return (
    <div style={{ background: "#141414", width: "100%", height: "220px", padding: "20px", borderRadius: '8px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Speed;
