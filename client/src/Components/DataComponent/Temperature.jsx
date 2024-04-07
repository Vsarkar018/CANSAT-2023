import React, { useEffect, useRef } from "react";
import Chart from "chart.js/auto";

const TemperatureChart = ({ data }) => {
  const chartRef = useRef();

  useEffect(() => {
    const ctx = chartRef.current.getContext("2d");

    new Chart(ctx, {
      type: "line",
      data: {
        labels: data.map((_, index) => `Day ${index + 1}`),
        datasets: [
          {
            label: "Temperature",
            data: data,
            borderColor: "rgba(75, 192, 192, 1)",
            backgroundColor: "rgba(75, 192, 192, 0.2)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: "Temperature (°C)",
            },
          },
          x: {
            title: {
              display: true,
              text: "Day",
            },
          },
        },
      },
    });
  }, [data]);

  return <canvas ref={chartRef} />;
};

export default TemperatureChart;
