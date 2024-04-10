import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
// const Speed = () => {
//   const generateDemoData = (count) => {
//     const data = [];
//     for (let i = 0; i < count; i++) {
//       const altitude = (Math.random() * 10).toFixed(2); // Random altitude data
//       const pressure = (Math.random() * 10).toFixed(2); // Random pressure data
//       data.push({ altitude, pressure });
//     }
//     return data;
//   };
  // let pressureFromTele = generateDemoData(20);
  // const [pressureData, setPressureData] = useState({
  //   labels: pressureFromTele.map((tele) => tele.altitude),
  //   datasets: [
  //     {
  //       labels: "Pressure",
  //       data: pressureFromTele.map((tele) => tele.pressure),
  //       fill: false,
  //       borderWidth: 1, // Adjust the line width
  //       pointRadius: 0,
  //     },
  //   ],
  // });

  const Speed = () => {
    const [speedData, setSpeedData] = useState({
      labels: Array.from({ length: 20 }, (_, i) => i + 1), // Initial labels 1 to 20
      datasets: [
        {
          label: "Speed",
          data: Array.from({ length: 20 }, () => Math.random() * 10), // Initial random speed data
          fill: false,
          borderColor: 'rgb(255, 99, 132)',
          tension: 0.1,
        },
      ],
    });
  
    useEffect(() => {
      const interval = setInterval(() => {
        const newSpeed = Math.random() * 10; // Simulate new speed data
        const newSpeedData = {
          ...speedData,
          labels: speedData.labels.map((label, index) => index + 2), // Shift labels for new data
          datasets: [{
            ...speedData.datasets[0],
            data: [...speedData.datasets[0].data.slice(1), newSpeed], // Remove first data point and add new data
          }],
        };
        setSpeedData(newSpeedData);
      }, 1000);
  
      return () => clearInterval(interval); // Cleanup the interval on component unmount
    }, [speedData]);
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
    <div style={{ background: "#141414", width: "100%", height: "100%", padding: "20px"}}>
    {/* <div style={{ background: "#141414", padding: "1rem", borderRadius: "8px" }}> */}
      <Line data={speedData} options={options} />
      <p style={{ color: "#ffffff", textAlign: "center", marginTop: "10px" }}>Speed (m/s)</p>
    </div>
      
  );
};

export default Speed;
