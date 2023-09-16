import React from "react";

const generateData = (rows, cols) => {
  const data = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(`Row ${i + 1}, Col ${j + 1}`);
    }
    data.push(row);
  }
  return data;
};
const telemetryParameters = [
  "Team ID",
  "Time stamping",
  "Packet count",
  "Altitude",
  "Pressure",
  "Temperature",
  "Voltage",
  "GNSS time",
  "GNSS lat",
  "GNSS lon",
  "GNSS alti",
  "GNSS sats",
  "Accel",
  "Gyro",
  "state",
];
const Table = () => {
  const rows = 6;
  const cols = 10;
  const data = generateData(rows, cols);
  const text = "TELEMETRY";
  return (
    <>
      <div
        className="flex flex-col text-white w-4 bg-blue-700"
        style={{ fontSize: "12px" }}
      >
        {[...text].map((char, index) => (
          <span key={index} style={{ rotate: "90" }}>
            {char}
          </span>
        ))}
      </div>
      <div style={{ fontSize: "8px" }} className="text-cyan-50 flex">
        <table
          border="1"
          cellSpacing="50"
          align="center"
          className="telemetry-table"
        >
          <thead>
            <tr>
              {Array.from({ length: cols }, (_, index) => (
                <th key={index}>{telemetryParameters[index]}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>{cell}</td>
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
