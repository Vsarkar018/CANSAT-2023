import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
import { useGlobalContext } from "../../context/appContext";

const OrientationChart = () => {
  const { telemetry } = useGlobalContext();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "X Orientation",
        data: [],
        fill: false,
        borderColor: '#FF6384', // Red for X
        tension: 0.1,
      },
      {
        label: "Y Orientation",
        data: [],
        fill: false,
        borderColor: '#36A2EB', // Blue for Y
        tension: 0.1,
      },
      {
        label: "Z Orientation",
        data: [],
        fill: false,
        borderColor: '#FFCE56', // Yellow for Z
        tension: 0.1,
      },
    ],
  });


  useEffect(() => {
    if (telemetry) {
      // Assuming the telemetry data format and that gyro_x, gyro_y, and gyro_z are available
      const parts = telemetry.split(',');
      const gyroX = parseFloat(parts[11]); // Adjust the index based on your telemetry data
      const gyroY = parseFloat(parts[12]);
      const gyroZ = parseFloat(parts[13]);
      const newLabel = chartData.labels.length + 1; // Increment label for new data point

      setChartData(prevData => ({
        labels: [...prevData.labels, `S ${newLabel}`].slice(-20), // Keep last 20 entries
        datasets: prevData.datasets.map((dataset, index) => {
          let data;
          if (index === 0) data = [...dataset.data, gyroX];
          else if (index === 1) data = [...dataset.data, gyroY];
          else data = [...dataset.data, gyroZ];
          return { ...dataset, data: data.slice(-20) }; // Keep last 20 data points for each axis
        }),
      }));
    }
  }, [telemetry]); // Update chart data whenever new telemetry data is received

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
  };

  return (
    <div style={{ background: "#141414", width: "100%", height: "100%", padding: "20px" }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default OrientationChart;