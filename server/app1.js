const express = require("express");
const app = express();
const socketio = require("socket.io");
const fs = require("fs");
app.use(require("cors")());
const path = require("path");
const { SerialPort, DelimiterParser } = require("serialport");
const { XBeeAPI } = require("xbee-api");
const plotly = require('plotly')('your_plotly_username', 'your_plotly_api_key');

// Path to save telemetry CSV file
const csvFilePath = path.join(__dirname, "telemetry.csv");

// Telemetry parameters
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
  "accel_x",
  "accel_y",
  "accel_z",
  "gyro_x",
  "gyro_y",
  "gyro_z",
  "state",
];

// Serial port setup
const serialPort = new SerialPort({ path: "COM11", baudRate: 9600 });
const xbee = new XBeeAPI({ api_mode: 2 });
const parser = serialPort.pipe(new DelimiterParser({ delimiter: "~" }));

// Server setup
const port = process.env.PORT || 5000;
const server = app.listen(port, console.log(`Server listening to the port ${port}`));
const io = socketio(server, { cors: { origin: "*", methods: ["GET", "POST"] } });

serialPort.on("open", () => {
  console.log("Serial Port Open");
});

// Real-time plotting setup
const graphData = {
  x: [],
  y: [],
  type: 'scatter',
  mode: 'lines+markers'
};

const layout = {
  title: 'Orientation X Real-time Plot',
  xaxis: { title: 'Time' },
  yaxis: { title: 'Orientation X' }
};

const graphOptions = { layout: layout, filename: 'orientation-x-plot', fileopt: 'overwrite' };

parser.on("data", telemetry => {
  const frame = xbee.parseFrame(telemetry);
  let tele = frame.data.toString("utf8").trim();
  let teleArr = tele.split(",");
  const orientationX = parseFloat(teleArr[telemetryParameters.indexOf('gyro_x')]);

  // Emit orientation X data to the client for real-time plotting
  io.emit("orientationX", orientationX);

  // Plotting the real-time graph
  const time = new Date().getTime();
  graphData.x.push(time);
  graphData.y.push(orientationX);

  plotly.plot(graphData, graphOptions, function (err, msg) {
    if (err) return console.log(err);
    console.log(msg);
  });
});

