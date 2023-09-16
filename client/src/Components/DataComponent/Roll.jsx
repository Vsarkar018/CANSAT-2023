import React, { useState } from "react";
import { Radar } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";
const Roll = () => {
  const data = {
    labels: ["Roll", "Pitch", "Yaw"],
    datasets: [
      {
        label: "Data",
        borderColor: "blue",
        pointBorderColor: "#fff",
        pointHoverBackgroundColor: "#fff",
        pointHoverBorderColor: "rgba(179,181,198,1)",
        data: [65, 59, 80],
        fill: false,
        borderWidth: 1, // Adjust the line width
        pointRadius: 0,
      },
    ],
  };

  const options = {
    scale: {
      angleLines: {
        display: true,
      },
      ticks: {
        font: {
          size: 4,
        },
        suggestedMin: 0,
        suggestedMax: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      className="p-0 m-0 bg-black flex items-center "
    >
      <Radar data={data} options={options} />
    </div>
  );
};

export default Roll;
