import React, { useState } from "react";
import teamLogo from "../../assets/team-logo.png";

const Overview = () => {
  const [missionStarted, setMissionStarted] = useState(false); 
  const missionState = "PRELAUNCH";
  return (
    <div style={{ backgroundColor: "#141414", color: "white", fontSize: "14.5px"}} className="flex justify-around h-full p-2 text-white">
      <div className="flex flex-col justify-around items-start">
      <div className="flex items-center mb-4">
          <img src={teamLogo} alt="Team Logo" className="w-20 h-20" />
          <div 
            style={{
              fontWeight: 'bold',
              color: 'black',
              textShadow: '2px 2px 4px white'
            }}
            className="text-2xl ml-4">DEBRIS</div>
          </div>

        <div>
          <div>Mission Time: 0 seconds</div>
          <div>Packet Count: 0</div>
          <div>GNSS Time: 00:00:00</div>
        </div>
      </div>

      {/* Right Side: Start/Stop Button, Battery, XBee Port */}
      <div className="flex flex-col justify-around items-end">
        <div className="flex space-x-4">
          {missionStarted ? (
            <button
              className="border-2 border-red-600 text-red-600 px-4 py-2 rounded-full flex items-center justify-center"
              onClick={() => setMissionStarted(false)}
            >
              <div className="bg-red-500 rounded-full w-3 h-3 mr-2"></div>
              Telemetry OFF
            </button>
          ) : (
            <button
              className="border-2 border-green-600 text-green-600 px-4 py-2 rounded-full flex items-center justify-center"
              onClick={() => setMissionStarted(true)}
            >
              <div className="bg-green-500 rounded-full w-3 h-3 mr-2"></div>
              Telemetry ON
            </button>
          )}
        </div>
        <div>
          <button
            className="border-2 border-yellow-600 text-yellow-600 px-4 py-2 rounded-full flex items-center justify-center"
            style={{ backgroundColor: missionStarted ? "rgba(245, 158, 11, 0.2)" : "transparent" }} // Light yellow background if mission started
          >
            <div className="bg-yellow-500 rounded-full w-3 h-3 mr-2"></div>
            {missionState}
          </button>
        </div>

        <div className="flex space-x-4 items-center">
          <div className="bg-gray-600 px-4 py-2 rounded">
            <span className="font-bold">25% Battery</span>
          </div>
          <div className="flex space-x-2">
            <select className="bg-gray-600 px-4 py-2 rounded">
              <option>COM1</option>
              {/* More options */}
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;