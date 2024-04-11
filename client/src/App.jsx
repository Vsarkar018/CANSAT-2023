import { useState, useEffect } from "react";
import "./App.css";
import Row from "./Components/Row";
import Team from "./Components/Team";
import Overview from "./Components/DataComponent/Overview";
import Temperature from "./Components/DataComponent/Temperature";
import Speed from "./Components/DataComponent/Speed";
import Pressure from "./Components/DataComponent/Pressure";
import Acceleration from "./Components/DataComponent/Acceleration";
import Location from "./Components/DataComponent/Location";
import Roll from "./Components/DataComponent/Roll";
import Pitch from "./Components/DataComponent/Pitch";
import Table from "./Components/DataComponent/Table";
import Voltage from "./Components/DataComponent/Voltage";

function App() {
  const [temperatureData, setTemperatureData] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperatureData(currentData => {
        const newTemperature = Math.random() * 100;
        return [...currentData, newTemperature].slice(-10);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div class="dashboard-container">
      <div className="left-half">
        <div className="components-container">
          <div className="overview-container">
            <Row>
              <Team className="component" />
              <Overview className="component" />
              <Voltage className="component" />
            </Row> 
            <Row>
              <Pressure className="component" />
              <Temperature className="component" data={temperatureData} />
              <Acceleration className="component" />
            </Row> 
            <Row>
              <Speed className="component" />
              <Roll className="component" />
              <Pitch className="component" />
            </Row>
          </div>
        </div>
      </div>
      <div className="right-half">
        <div className="telemetry-container">
          <Table />
        </div>
        <div className="location-container">
          <Location/>
        </div>
      </div>
    </div>
    
  );
}

export default App;
