import React, { useContext, useEffect, useState } from "react";
import teamLogo from "../../assets/team-logo.png";
import { useGlobalContext } from '../../context/appContext'; // Ensure the path is correct

const Overview = () => {
  const { telemetry } = useGlobalContext();
  const [missionStarted, setMissionStarted] = useState(false); 
  const [missionState, setMissionState] = useState(0);
  const [batteryPercentage, setBatteryPercentage] = useState(0);
  const [missionData, setMissionData] = useState({
    team_id: "",
    time_stamping: "",
    packet_count: "",
    gnss_time: "",
    gnss_lat: "",
    gnss_lon: "",
    voltage: "",
  });

  const stateMap = {
    "0": { 
        label: "BOOT MODE", 
        color: "bg-gray-600", 
        borderColor: "border-gray-600", 
        textColor: "text-gray-600", 
        background: "#F9FAFB" 
    },
    "1": { 
        label: "TESTING DONE", 
        color: "bg-blue-600", 
        borderColor: "border-blue-600", 
        textColor: "text-blue-600", 
        background: "#DBEAFE" 
    },
    "2": { 
        label: "READY FOR LAUNCH", 
        color: "bg-green-600", 
        borderColor: "border-green-600", 
        textColor: "text-green-600", 
        background: "#DCFCE7" 
    },
    "3": { 
        label: "ASCENT", 
        color: "bg-orange-600", 
        borderColor: "border-orange-600", 
        textColor: "text-orange-600", 
        background: "#FFEDD5" 
    },
    "4": { 
        label: "APOGEE REACHED", 
        color: "bg-red-600", 
        borderColor: "border-red-600", 
        textColor: "text-red-600", 
        background: "#FEE2E2" 
    },
    "5": { 
        label: "DESCENT", 
        color: "bg-purple-600", 
        borderColor: "border-purple-600", 
        textColor: "text-purple-600", 
        background: "#EDE9FE" 
    },
    "6": { 
        label: "BUZZER ACT", 
        color: "bg-yellow-600", 
        borderColor: "border-yellow-600", 
        textColor: "text-yellow-600", 
        background: "#FEF3C7" 
    },
    "7": { 
        label: "TOUCHDOWN", 
        color: "bg-teal-600", 
        borderColor: "border-teal-600", 
        textColor: "text-teal-600", 
        background: "#CCFBF1" 
    },
    "15": { 
        label: "P1 EJECTED", 
        color: "bg-pink-600", 
        borderColor: "border-pink-600", 
        textColor: "text-pink-600", 
        background: "#FCE7F3" 
    },
    "16": { 
        label: "GYRO INIT", 
        color: "bg-indigo-600", 
        borderColor: "border-indigo-600", 
        textColor: "text-indigo-600", 
        background: "#E0E7FF" 
    },
    "17": { 
        label: "P2 EJECTED", 
        color: "bg-lime-600", 
        borderColor: "border-lime-600", 
        textColor: "text-lime-600", 
        background: "#ECFCCB" 
    }
};


  useEffect(() => {
    if (telemetry) {
      const data = parseTelemetry(telemetry);
      setMissionData(data);
      const parts = telemetry.split(',');
      const voltage = parseFloat(parts[6]);
      const batteryLevel = (voltage / 8.2) * 100;
      setBatteryPercentage(batteryLevel.toFixed(0));
      const stateCode = parts[parts.length - 1]; 
      const currentState = stateMap[stateCode] || stateMap["0"];
      setMissionState(currentState);
    }
  }, [telemetry]);

  const isSpecialState = ["15", "16", "17"].includes(telemetry.split(',').pop());


  function parseTelemetry(data) {
    const fields = data.split(',');
    return {
      team_id: fields[0],
      time_stamping: fields[1],
      packet_count: fields[2],
      gnss_time: fields[7]
    };
  }

  const toggleTelemetry = async () => {
    const telemetryFlag = missionStarted ? "0" : "1"; // Toggle the telemetry flag based on the current state
    const response = await fetch('/telemetry', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ telemetryFlag:1 }),
    });
    
    if (response.ok) {
      setMissionStarted(!missionStarted); // Only toggle the state if the request was successful
      console.log(await response.text());
    } else {
      console.error('Failed to toggle telemetry.');
    }
  };
  const actuateParachute2 = async () => {
    const response = await fetch('/p2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ p2:9 })
    });

    if (response.ok) {
      console.log("Parachute 2 actuation command sent.");
    } else {
      console.error("Failed to send actuation command.");
    }
  };

  return (
    <div style={{ backgroundColor: "#141414", padding: "20px", color: "white", fontSize: "13px", height: "230px", borderRadius: '8px' }} className="flex justify-around h-full p-2 text-white">
      <div className="flex flex-col justify-around items-start">
        <div className="flex items-center mb-4">
          <img src={teamLogo} alt="Team Logo" className="w-20 h-20" />
          <div 
            style={{
              fontWeight: 'bold',
              color: 'black',
              textShadow: '2px 2px 3px white'
            }}
            className="text-2xl ml-4">DEBRIS</div>
        </div>
        <div>
          <div>Mission Time: {missionData.time_stamping} sec</div>
          <div>Packet Count: {missionData.packet_count}</div>
          <div>GNSS Time: {missionData.gnss_time}</div>
          <div>Team ID: 043 </div>
          <div>Voltage: {missionData.voltage} V</div>
        </div>
      </div>

      <div className="flex flex-col justify-around items-end" style={{gap: "5px"}}>
        <button
          className={`border-2 px-4 py-2 rounded-full flex items-center justify-center ${missionStarted ? 'border-red-600 text-red-600' : 'border-green-600 text-green-600'}`}
          onClick={toggleTelemetry}
        >
          <div className={`rounded-full w-3 h-3 mr-2 ${missionStarted ? 'bg-red-500' : 'bg-green-500'}`}></div>
          {missionStarted ? 'Telemetry OFF' : 'Telemetry ON'}
        </button>
        
        <div>
        <button className={`border-2 ${missionState.borderColor} ${missionState.textColor} px-4 py-2 rounded-full flex items-center justify-center`}
          style={{
            backgroundColor: missionStarted ? missionState.background : "transparent",
            color: missionState.textColor // Assuming you set textColor in your state management
          }}
        >
          <div className={`rounded-full w-3 h-3 mr-2 ${missionState.color}`}></div>
          {missionState.label}
        </button>
        </div>
        <div>
        <button
          className="border-2 border-cyan-500 bg-transparent text-cyan-500 px-4 py-2 rounded-full shadow-lg mb-2"
          onClick={actuateParachute2}
        >
          Actuate P2
        </button>
        </div>
        <div className="flex flex-col justify-around items-end">
        {isSpecialState && ["15", "16", "17"].map(code => (
          <button key={code} className="bg-gray-800 px-4 py-2 rounded-full shadow-lg mb-2">
            {stateMap[code]} | DESCENT
          </button>
        ))}
      </div>
      <div className="flex space-x-4 items-center">
          <div className="bg-gray-700 px-4 py-2 rounded">
            <span className="font-bold">{batteryPercentage}%</span>
          </div>
          <div className="flex space-x-2">
            <select className="bg-gray-700 px-4 py-2 rounded">
              <option>COM1</option>
              <option>COM2</option>
              <option>COM3</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;