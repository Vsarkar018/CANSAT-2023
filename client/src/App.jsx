import { useState, useEffect } from "react";
import "./App.css";
import Row from "./Components/Row";
import Team from "./Components/Team";
import Overview from "./Components/DataComponent/Overview";
import Temperature from "./Components/DataComponent/Temperature";
import Speed from "./Components/DataComponent/Speed";
import Pressure from "./Components/DataComponent/Pressure";
import Acceleration from "./Components/DataComponent/Acceleration";
// import Location from "./Components/DataComponent/Location";
import Roll from "./Components/DataComponent/Roll";
import Pitch from "./Components/DataComponent/Pitch";
import Table from "./Components/DataComponent/Table";
 
function App(){
  return (
    <div
      className="flex justify-center flex-col gap bg-black"
      style={{ height: "100vh" }}>
      <div style={{ height: "65%" }} className="flex flex-col gap-1">
        <Row>
          <Overview />
          <Temperature />
          <Pressure />
          <Team />
        </Row>
        <Row>
          <Acceleration />
          <Speed />
          <Roll />
          <Pitch />
        </Row>
      </div>
      <div style={{ height: "35%" }} className="flex">
        <div style={{ width: "60%", height: "100%" }} className="flex">
          <Table />
        </div>
        {/* <div style={{ width: "40%" }}>{<Location />}</div> */}
      </div>
    </div>
  );
}

export default App;
