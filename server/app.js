const express = require("express");
const app = express();
const socketio = require("socket.io");
const fs = require("fs");
app.use(require("cors")());
const path = require("path");
const csvFilePath = path.join(__dirname, "telemetry.csv");
const csvHeader =
  "Team ID,Time stamping,Packet count,Altitude,Pressure,Temperature,Voltage,GNSS time,GNSS lat,GNSS lon,GNSS alti,GNSS sats,Accel,Gyro,state\n";
// fs.writeFile(csvFilePath, csvHeader, function (err) {
//   if (err) {
//     console.error("Error writing to file:", err);
//   } else {
//     console.log("File written successfully.");
//   }
// });
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
const telemetryObject = {};

const { SerialPort, DelimiterParser } = require("serialport");
const { XBeeAPI } = require("xbee-api");

const serialPort = new SerialPort({ path: "COM3", baudRate: 9600 });

const xbee = new XBeeAPI({ api_mode: 2 });

const parser = serialPort.pipe(new DelimiterParser({ delimiter: "~" }));

const port = process.env.PORT || 5000;
const server = app.listen(
  port,
  console.log(`Server listening to the port ${port}`),
);

const io = socketio(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});

serialPort.on("open", () => {
  console.log("Serial Port Open");
});

parser.on("data", telemetry => {
  const frame = xbee.parseFrame(telemetry);
  let tele = frame.data.toString("utf8").trim();
  // fs.writeFile(csvFilePath, tele);
  tele = tele.split(",");


  telemetryParameters.forEach((key, index) => {
    telemetryObject[key] = tele[index];
  });
  const telemetryJSON = JSON.stringify(telemetryObject);
  io.emit("telemetry", telemetryJSON);
  // console.log(tele);
  console.log(telemetryJSON);
});
