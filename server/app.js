const express = require("express");
const app = express();
const socketio = require("socket.io");
const fs = require("fs");
app.use(require("cors")());
app.use(express.json());
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

function sendXBeeFrame(telemetryFlag) {
  const destination64 = "0013A20041F4525E"; // Replace XXXXXXXX with the actual 64-bit address of the destination XBee module
  const frameToSend = {
    type: 0x10, // ZigBee Transmit Request frame type
    id: 0x01, // Frame ID
    destination64: destination64, // 64-bit address of the destination XBee module
    data: telemetryFlag // Data to be sent
  };

  serialPort.write(xbee.buildFrame(frameToSend), (err) => {
    if (err) {
      console.error("Error sending frame:", err);
    } else {
      console.log("Frame sent successfully!");
    }
  });
}

app.post("/telemetry", (req, res) => {
  console.log(req.body);
  sendXBeeFrame(req.body.telemetryFlag);
  res.send("Frame sent");
});