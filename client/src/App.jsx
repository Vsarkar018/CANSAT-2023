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
import Acceleration from "./Components/DataComponent/Acceleration";

function App() {
  const [temperatureData, setTemperatureData] = useState([]);
  const [pressureData, setPressureData] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTemperatureData(currentData => [...currentData, Math.random() * 100].slice(-10));
      setPressureData(currentData => [...currentData, Math.random() * 1000].slice(-10));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container bg-dark text-light" style={{ fontFamily: 'Arial, sans-serif', minHeight: '100vh' }}>
      <div className="left-half flex flex-col">
        <div className="components-container flex-grow">
          <div className="overview-container">
            <Row className="row mb-4">
              <Overview className="component flex-grow" />
              <TemperatureAndPressureChart className="component flex-grow" />
            </Row>
            <Row className="row mb-4">
              <Speed className="component flex-grow" />
              <Altitude className="component flex-grow" />
            </Row>
            <Row className="row mb-4">
            <Roll className="component flex-grow" />
              <Acceleration className="component flex-grow" />
            </Row>
          </div>
        </div>
      </div>
      <div className="right-half">
        <div className="right-half-map" style={{height:"50vh"}}>
          <Location />
        </div>
        <div className="right-half-telemetry" style={{height:"50vh"}}>
          <Table />
        </div>
      </div>
    </div>
  );
}

export default App;
