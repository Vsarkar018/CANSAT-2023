import React, { useState, useEffect } from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
const Acceleration = () => {
  // Simulate acceleration data generation
  const generateDemoData = (count) => {
    return Array.from({ length: count }, () => {
      return +(Math.random() * 10).toFixed(2); // Simulating acceleration data
    });
  };
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 20 }, (_, i) => `Sample ${i + 1}`),
    datasets: [
      {
        label: "Acceleration (m/s²)",
        data: Array.from({ length: 20 }, () => +(Math.random() * 10).toFixed(2)),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
    ],
  });

  // Define options for the chart
  const options = {
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Acceleration (m/s²)",
        },
      },
    },
    plugins: {
      legend: {
        display: true,
      },
    },
  };

  // Simulate live data updating (e.g., from a sensor)
  useEffect(() => {
    const interval = setInterval(() => {
      setChartData((prevData) => {
        const newData = [...prevData.datasets[0].data, +(Math.random() * 10).toFixed(2)].slice(-20);
        const newLabels = Array.from({ length: 20 }, (_, i) => `Sample ${i + 1 + prevData.datasets[0].data.length}`).slice(-20); 
        return {
          labels: newLabels,
          datasets: [{ ...prevData.datasets[0], data: newData }],
        };
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%", height: "100%" }} className="p-0 m-0 flex items-center flex-col">
      <Line data={chartData} options={options} />
      <p className="text-white font-thin text-lg">Acceleration</p>
    </div>
  );
};

export default Acceleration;
// const Acceleration = () => {
//   const generateDemoData = (count) => {
//     const data = [];
//     for (let i = 0; i < count; i++) {
//       const altitude = (Math.random() * 10).toFixed(2); // Random altitude data
//       const pressure = (Math.random() * 10).toFixed(2); // Random pressure data
//       data.push({ altitude, pressure });
//     }
//     return data;
//   };
//   let pressureFromTele = generateDemoData(20);
//   const [pressureData, setPressureData] = useState({
//     labels: pressureFromTele.map((tele) => tele.altitude),
//     datasets: [
//       {
//         labels: "Pressure",
//         data: pressureFromTele.map((tele) => tele.pressure),
//         fill: false,
//         borderWidth: 1, // Adjust the line width
//         pointRadius: 0,
//       },
//     ],
//   });
//   const options = {
//     scales: {
//       x: {
//         grid: {
//           color: "rgba(255, 255, 255, 0.3)", // Increase opacity for better visibility
//         },
//         ticks: {
//           font: {
//             size: 4, // Adjust the font size for x-axis labels
//           },
//           stepSize: 1,
//         },
//       },
//       y: {
//         grid: {
//           color: "rgba(255, 255, 255, 0.3)", // Increase opacity for better visibility
//         },
//         ticks: {
//           font: {
//             size: 4, // Adjust the font size for x-axis labels
//           },
//           stepSize: 1,
//         },
//       },
//     },
//     plugins: {
//       legend: {
//         display: false, // Hide the legend
//       },
//     },
//     // maintainAspectRatio: false,
//     // backgroundColor: "black",
//   };
//   return (
//     <div
//       style={{ width: "100%", height: "100%" }}
//       className="p-0 m-0  flex items-center flex-col"
//     >
//       <Line data={pressureData} options={options} />
//       <p className="text-white font-thin text-lg">Acceleration</p>
//     </div>
//   );
// };

// export default Acceleration;
