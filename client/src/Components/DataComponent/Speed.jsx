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
          color: "rgba(255, 255, 255, 0.3)", // Increase opacity for better visibility
        },
        ticks: {
          font: {
            size: 4, // Adjust the font size for x-axis labels
          },
          stepSize: 1,
        },
      },
      y: {
        grid: {
          color: "rgba(255, 255, 255, 0.3)", // Increase opacity for better visibility
        },
        ticks: {
          font: {
            size: 4, // Adjust the font size for x-axis labels
          },
          stepSize: 1,
        },
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend
      },
    },
    // maintainAspectRatio: false,
    // backgroundColor: "black",
  };
  return (
    <div
      style={{ width: "100%", height: "100%" }}
      className="p-0 m-0  flex items-center flex-col"
    >
      <Line data={speedData} options={options} />
      <p className="text-white font-thin text-lg">Speed</p>
    </div>
  );
};

export default Speed;
