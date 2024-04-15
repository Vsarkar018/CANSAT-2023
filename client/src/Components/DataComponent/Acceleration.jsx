import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { useGlobalContext } from "../../context/appContext";

const AccelerationChart = () => {
  const { telemetry } = useGlobalContext();
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "X Acceleration",
        data: [],
        fill: false,
        borderColor: '#E57373',
        tension: 0.1,
      },
      {
        label: "Y Acceleration",
        data: [],
        fill: false,
        borderColor: '#81C784',
        tension: 0.1,
      },
      {
        label: "Z Acceleration",
        data: [],
        fill: false,
        borderColor: '#BA68C8',
        tension: 0.1,
      },
    ],
  });

  useEffect(() => {
    if (telemetry) {
      const parts = telemetry.split(',');
      const accelX = parseFloat(parts[12]); // Adjust the index based on your telemetry data
      const accelY = parseFloat(parts[13]);
      const accelZ = parseFloat(parts[14]);
      const newLabel = chartData.labels.length + 1; // Increment label for new data point

      setChartData(prevData => ({
        labels: [...prevData.labels, `S ${newLabel}`].slice(-20), // Keep last 20 entries
        datasets: prevData.datasets.map((dataset, index) => {
          let data;
          if (index === 0) data = [...dataset.data, accelX];
          else if (index === 1) data = [...dataset.data, accelY];
          else data = [...dataset.data, accelZ];
          return { ...dataset, data: data.slice(-20) }; // Keep last 20 data points for each axis
        }),
      }));
    }
  }, [telemetry]); // Update chart data whenever new telemetry data is received

  const options = {
    scales: {
      y: {
        suggestedMin: 0, // Start Y-axis from zero
        grid: {
          color: "#282828",
        },
        ticks: {
          color: "#ffffff",
          font: {
            size: 10, // Adjust font size for Y-axis labels
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
            size: 10, // Adjust font size for X-axis labels
          },
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
          font: {
            size: 10, // Adjust font size for legend labels
          },
        },
      },
    },
  };

  return (
    <div style={{ background: "#141414", width: "100%", height: "260px", padding: "20px", borderRadius: '8px' }}>
      <Line data={chartData} options={options} />
    </div>
  );
};

export default AccelerationChart;
