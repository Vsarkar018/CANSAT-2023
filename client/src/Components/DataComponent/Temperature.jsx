import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const TemperatureChart = ({ data }) => {
  const chartRef = useRef();
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
  const ctx = chartRef.current.getContext("2d");

  const newChartInstance  = new Chart(ctx, {
    type: "line",
    data: {
      labels: data.map((_, index) => `Day ${index + 1}`),
      datasets: [
        {
          label: "Temperature",
          data: data,
          fill: false,
          borderColor: "#DF00FE", // Using the dark purple from the palette
          tension: 0.1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: "#282828" // Dark gridlines
          },
          title: {
            display: true,
            color: "#FFFFFF" // White text for readability
          },
          ticks: {
            color: "#FFFFFF" // White ticks for readability
          }
        },
        x: {
          grid: {
            color: "#282828" // Dark gridlines
          },
          title: {
            display: true,

            color: "#FFFFFF" // White text for readability
          },
          ticks: {
            color: "#FFFFFF" // White ticks for readability
          }
        },
      },
      plugins: {
        legend: {
          labels: {
            color: "#FFFFFF" // White text for readability
          }
        }
      }
    },
  });
  setChartInstance(newChartInstance);
    return () => {
      newChartInstance.destroy();
    };
  }, [data]);

  return (
    <div style={{ backgroundColor: "#141414", width: "100%", height: "100%", padding: "1rem" }}>
      <canvas ref={chartRef} />
      <p style={{ color: "#ffffff", textAlign: "center", marginTop: "10px" }}>Temperature (°C)</p>
    </div>
  );
};
export default TemperatureChart;
