import React from "react";

const Overview = () => {
  return (
    <div style={{ backgroundColor: "#141414", color: "white", padding: "20px" }} className="flex flex-col items-center justify-around h-full p-4 bg-black text-white">
      {/* Start and Stop Buttons */}
      <div className="flex space-x-4">
        <button className="border-2 border-green-600 text-green-600 px-4 py-2 rounded-full flex items-center justify-center">
          <div className="bg-green-500 rounded-full w-3 h-3 mr-2"></div>
          Start
        </button>
        <button className="border-2 border-red-600 text-red-600 px-4 py-2 rounded-full flex items-center justify-center">
          <div className="bg-red-500 rounded-full w-3 h-3 mr-2"></div>
          Stop
        </button>
      </div>

      {/* Battery Level and XBee Port */}
      <div className="flex space-x-4 items-center mt-4">
        <div className="bg-gray-700 px-4 py-2 rounded">
          25% <span className="font-bold">Battery</span>
        </div>
        <div className="flex space-x-2">
          <select className="bg-gray-700 px-4 py-2 rounded">
            <option>COM1</option>
            {/* More options */}
          </select>
          <button className="bg-blue-600 px-4 py-2 rounded">
            Refresh
          </button>
        </div>
      </div>

      {/* Mission State Indicator */}
      <div className="mt-4">
        <div className="flex items-center">
          <div className="bg-yellow-500 rounded-full w-3 h-3 mr-2"></div>
          PRELAUNCH
        </div>
        {/* More status indicators */}
      </div>

      {/* Mission Time and Packet Count */}
      <div className="mt-4">
        <div>Mission Time: 0 seconds</div>
        <div>Packet Count: 0</div>
        {/* More info */}
      </div>

      {/* GNSS Time */}
      <div className="mt-4">
        GNSS Time: 00:00:00
        {/* More GNSS info */}
      </div>
    </div>
  );
};

export default Overview;