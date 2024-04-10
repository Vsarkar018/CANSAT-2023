import React from "react";

const Voltage = () => {
  return (
    <div style={{ background: "#141414", width: "100%", height: "100%", padding: "20px" }}>
      <Line data={pressureData} options={options} />
      <p style={{ color: "#ffffff", textAlign: "center", marginTop: "10px" }}>Voltage (V)</p>
    </div>
  );
  // return <div>Voltage</div>;
};

export default Voltage;
