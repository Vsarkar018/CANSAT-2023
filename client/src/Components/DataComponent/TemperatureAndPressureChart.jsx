import React, { useEffect, useRef, useState } from "react";
import Chart from "chart.js/auto";
import { useGlobalContext } from "../../context/appContext";

const TemperatureAndPressureChart = () => {
  const chartRef = useRef();
  const [chartInstance, setChartInstance] = useState(null);
  const { telemetry } = useGlobalContext();
  const [temperatureData, setTemperatureData] = useState([]);
  const [pressureData, setPressureData] = useState([]);
  const [timeData, setTimeData] = useState([]);

  useEffect(() => {
    // Parse the telemetry data and update state
    const temp = telemetry.split(',')[5];
    const pressure = telemetry.split(',')[4];
    const time = telemetry.split(',')[1];
    setTemperatureData(currentData => [...currentData.slice(-6), temp]);
    setPressureData(currentData => [...currentData.slice(-6), pressure]);
    setTimeData(currentData => [...currentData.slice(-9), time]);
  }, [telemetry]);

  useEffect(() => {
    // This effect initializes the chart or updates its data
    const updateChartData = () => {
      if (chartInstance) {
        // Update the chart data
        chartInstance.data.labels = [...timeData];
        chartInstance.data.datasets[0].data = [...temperatureData];
        chartInstance.data.datasets[1].data = [...pressureData];
        chartInstance.update();
      } else {
        const ctx = chartRef.current.getContext("2d");
        const newChartInstance = new Chart(ctx, {
          type: "line",
          data: {
            labels: timeData,
            datasets: [
              {
                label: "Temperature (c)",
                data: temperatureData,
                fill: false,
                borderColor: 'rgb(255, 99, 132)',
                tension: 0.1,
                yAxisID: 'yTemperature',
              },
              {
                label: "Pressure",
                data: pressureData,
                fill: false,
                borderColor: 'rgb(75, 192, 192)',
                tension: 0.1,
                yAxisID: 'yPressure',
              },
            ],
          },
          options: {
            scales: {
              yTemperature: {
                type: 'linear',
                display: true,
                position: 'right',
                min: 0, // Start from zero
                // Customize further as needed
              },
              yPressure: {
                type: 'linear',
                display: true,
                position: 'left',
                min: 0, // Start from zero
                // Customize further as needed
              },
              x: {
                min: 0, // Start from zero
                max: telemetry ? undefined : 10, // Adjust maximum based on telemetry length
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
                  color: "#FFFFFF",
                },
              },
            },
            elements: {
              line: {
                borderWidth: 2,
              },
              point: {
                backgroundColor: "#230046",
              },
            },
          },
        });
        setChartInstance(newChartInstance);
      }
    };

    requestAnimationFrame(updateChartData);
  }, [temperatureData, pressureData, timeData, telemetry]); // Dependencies
  
  return (
    <div style={{ backgroundColor: "#141414", width: "100%", height: "230px", padding: "1rem", borderRadius: '8px' }}>
      <canvas ref={chartRef}></canvas>
    </div>
  );
};

export default TemperatureAndPressureChart;
