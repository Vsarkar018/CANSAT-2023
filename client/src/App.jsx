import { useState, useEffect } from "react";
import "./App.css";
import Row from "./Components/Row";
import Overview from "./Components/DataComponent/Overview";
import Speed from "./Components/DataComponent/Speed";
import Altitude from "./Components/DataComponent/Altitude";
import TemperatureAndPressureChart from "./Components/DataComponent/TemperatureAndPressureChart";
import Location from "./Components/DataComponent/Location";
import Roll from "./Components/DataComponent/Roll";
import Table from "./Components/DataComponent/Table";

function App() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [pressureData, setPressureData] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      setTemperatureData(currentData => {
        const newTemperature = Math.random() * 100;
        return [...currentData, newTemperature].slice(-10);
      });
      setPressureData(currentData => {
        const newPressure = Math.random() * 1000;
        return [...currentData, newPressure].slice(-10);
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  return (
    <div class="dashboard-container">
      <div className="left-half">
        <div className="components-container">
          <div className="overview-container">
            <Row className="row"> 
              <Overview className="component" />
              <TemperatureAndPressureChart className="component" />
            </Row> 
            <Row className="row">
              <Speed className="component" />
              <Altitude className="component" />
            </Row> 
            <div
            style={{ width: "60%" }}
            className="border border-gray-400 p-1 h-full row">
              <Roll className="component" />
            </div>
          </div>
        </div>
      </div>
      <div className="right-half" style={{height:"63vh"}}>
      <Location/>
      </div>
      <div>
        <Table/>
        </div>
    </div>
    
  );
}

export default App;
