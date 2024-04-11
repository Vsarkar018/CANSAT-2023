import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";

const TemperatureAndPressureChart = ({temperatureData,pressureData}) => {
  const chartRef = useRef();
  const [chartInstance, setChartInstance] = useState(null);

  useEffect(() => {
    if (chartInstance) {
      chartInstance.destroy();
    }
    const ctx = chartRef.current.getContext("2d");

    const newChartInstance = new Chart(ctx, {
      type: "line",
      data: {
        labels: temperatureData.map((_, index) => `D ${index + 1}`),
        datasets: [
          {
            label: "Temperature",
            data: temperatureData,
            fill: false,
            borderColor: 'rgb(255, 99, 132)', 
            tension: 0.1,
          },
          {
            label: "Pressure",
            data: pressureData,
            fill: false,
            borderColor:'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: "#282828", 
            },
            ticks: {
              color: "#ffffff", 
            },
          },
          x: {
            grid: {
              color: "#282828", 
            },
            ticks: {
              color: "#ffffff", 
            },
          },
        },
        plugins: {
          legend: {
            labels: {
              color: "#FFFFFF", // White text for readability
            },
          },
        },
        elements: {
          line: {
            borderColor: "#320064", 
            borderWidth: 2,
          },
          point: {
            backgroundColor: "#230046", 
          },
        },
      },
    });
    setChartInstance(newChartInstance);
    return () => {
      newChartInstance && newChartInstance.destroy();
    };
  }, [temperatureData, pressureData]); // Include pressureData in the dependency array

  return (
    <div style={{ backgroundColor: "#141414", width: "100%", height: "100%", padding: "1rem" }}>
      <canvas ref={chartRef}></canvas>
      {/* <p style={{ color: "#ffffff", textAlign: "center", marginTop: "10px" }}>Temperature (°C) & Pressure</p> */}
    </div>
  );
};
export default TemperatureAndPressureChart;
