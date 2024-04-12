import React, { useState, useRef, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useGlobalContext } from "../../context/appContext";

const Altitude = () => {
  const chartRef = useRef();
  const { telemetry } = useGlobalContext();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Altitude",
        data: [],
        fill: false,
        borderColor: 'rgb(54, 162, 235)', // A different color for altitude
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    // Assuming telemetry is a string that needs to be parsed
    // and that you're interested in the latest telemetry data for updates
    if (telemetry) {
      const time = telemetry.split(',')[1]; // Assuming this is your time data
      const alt = telemetry.split(',')[3]; // Assuming this is your altitude data and converting to a number
      setChartData(prevData => ({
        labels: [...prevData.labels, time].slice(-20), // Keep only the last 20 entries
        datasets: prevData.datasets.map(dataset => ({
          ...dataset,
          data: [...dataset.data, alt].slice(-20), // Keep only the last 20 entries
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
    elements: {
      point: {
        radius: 0, // Hide points on the line
      },
    },
  };

  return (
    <div style={{ background: "#141414", width: "100%", height: "100%", padding: "20px", fontSize: "8px"}}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default Altitude;
