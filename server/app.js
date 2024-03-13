const express = require("express");
const app = express();
const socketio = require("socket.io");
app.use(require("cors")());
const path = require("path");
const { log } = require("util");
const csvFilePath = path.join(__dirname, "telemetry.csv");
const csvHeader =
  "Team ID,Time stamping,Packet count,Altitude,Pressure,Temperature,Voltage,GNSS time,GNSS lat,GNSS lon,GNSS alti,GNSS sats,Accel,Gyro,state\n";
fs.writeFile(csvFilePath, csvHeader);
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
const telemetryObject = {};

// const { SerialPort, DelimiterParser } = require("serialport");
// const { XBeeAPI } = require("xbee-api");

// // const serialPort = new SerialPort({ path: "COM3", baudRate: 9600 });

// const xbee = new XBeeAPI({ api_mode: 2 });

// const parser = serialPort.pipe(new DelimiterParser({ delimiter: "~" }));

const port = process.env.PORT || 5000;
const server = app.listen(
  port,
  console.log(`Server listening to the port ${port}`),
);

const io = socketio(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

const simulateTelemetry = () => {
  const simulatedData = {
    temperature: Math.random() * 100,
    pressure: Math.random() * 1000,
    acceleration: Math.random() * 10,
  };

  // Emit simulated telemetry data to connected sockets
  io.emit("telemetry", simulatedData);
  console.log("Simulated Telemetry Sent:", simulatedData);
};

// Set up a loop to emit simulated telemetry data every second
setInterval(simulateTelemetry, 1000);

serialPort.on("open", () => {
  console.log("Serial Port Open");
});

parser.on("data", telemetry => {
  const frame = xbee.parseFrame(telemetry);
  const tele = frame.data.toString("utf8").trim();
  fs.writeFile(csvFilePath, tele);
  tele = tele.split(",");

  telemetryParameters.forEach((key, index) => {
    telemetryObject[key] = tele[index];
  });
  const telemetryJSON = JSON.stringify(telemetryObject);
  io.emit("telemetry", telemetryJSON);
  console.log(tele);
  console.log(telemetryJSON)
});
