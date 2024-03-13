import React, { useEffect, useState } from "react";
import { useGlobalContext } from "../../context/appContext";
const telemetryParameters = [
  "team_id",
  "time_stamping",
  "packet_count",
  "altitude",
  "pressure",
  "temperature",
  "voltage",
  "gnss_time",
  "gnss_lat",
  "gnss_lon",
  "gnss_alti",
  "gnss_sats",
  "accel",
  "gyro",
  "state",
];
const Table = () => {
  const text = "TELEMETRY";
  const { telemetry } = useGlobalContext();
  const [telemetryHistory, setTelemetryHistory] = useState([]);

  useEffect(() => {
    // Update telemetry history when new telemetry is received
    setTelemetryHistory(prevHistory => [
      ...prevHistory.slice(-5), // Keep the last 5 entries
      telemetry,
    ]);
  }, [telemetry]);

  return (
    <>
      <div
        className="flex flex-col text-white w-4 bg-blue-700"
        style={{ fontSize: "20px", width: "2%" }}>
        {[...text].map((char, index) => (
          <span key={index} style={{ rotate: "90" }}>
            {char}
          </span>
        ))}
      </div>
      <div
        style={{ fontSize: "15px", width: "100%", marginTop: "10 px" }}
        className="text-cyan-50 flex">
        <table
          border="1"
          cellSpacing="50"
          align="center"
          className="telemetry-table">
          <thead>
            <tr>
              {telemetryParameters.map((key, index) => {
                return <th key={index}>{key}</th>;
              })}
            </tr>
          </thead>
          <tbody>
            {telemetryHistory.map((entry, rowIndex) => (
              <tr key={rowIndex}>
                {telemetryParameters.map((param, colIndex) => (
                  <td key={colIndex}>{entry[param]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Table;
