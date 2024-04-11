const express = require("express");
const app = express();
const socketio = require("socket.io");
const fs = require("fs");
app.use(require("cors")());
const path = require("path");
const csvFilePath = path.join(__dirname, "telemetry.csv");
const csvHeader =
  "Team ID,Time stamping,Packet count,Altitude,Pressure,Temperature,Voltage,GNSS time,GNSS lat,GNSS lon,GNSS alti,GNSS sats,Accel,Gyro,state\n";
if (!fs.existsSync(csvFilePath))fs.writeFile(csvFilePath, csvHeader, ()=>{})
const telemetryObject = {};

const { SerialPort, DelimiterParser } = require("serialport");
const { XBeeAPI } = require("xbee-api");

const serialPort = new SerialPort({ path: "COM15", baudRate: 9600 });

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
  let tele = frame.data.toString("utf8").trim().replace(/[^\x20-\x7E]/g, "").replace(/}/g,'');
  fs.writeFile(csvFilePath, tele + '\n', { flag: 'a' }, () => {})
  // io.emit("telemetry", telemetryJSON);
  console.log(tele);
});
