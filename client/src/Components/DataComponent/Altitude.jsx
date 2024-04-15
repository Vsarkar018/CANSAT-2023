import React, { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useGlobalContext } from "../../context/appContext";

const Altitude = () => {
  const chartRef = useRef();
  const { telemetry } = useGlobalContext();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Altitude (m)",
        data: [],
        fill: false,
        borderColor: '#DA70D6', // A different color for altitude
        borderWidth: 2,
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    // Assuming telemetry is a string that needs to be parsed
    // and that you're interested in the latest telemetry data for updates
    if (telemetry) {
      const time = telemetry.split(',')[1]; // Assuming this is your time data
      const alt = parseFloat(telemetry.split(',')[3]); // Assuming this is your altitude data and converting to a number
      setChartData(prevData => ({
        labels: [...prevData.labels, time],
        datasets: prevData.datasets.map(dataset => ({
          ...dataset,
          data: [...dataset.data, alt],
        })),
      }));
    }
  }, [telemetry]);

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
        beginAtZero: true, // Start the scale from zero
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
    
  };

  return (
    <div style={{ background: "#141414", width: "100%", height: "220px", padding: "20px", fontSize: "8px", borderRadius: '8px'}}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Altitude;
