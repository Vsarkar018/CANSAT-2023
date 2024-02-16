const express = require("express");
const app = express();
const socketio = require("socket.io");
app.use(require("cors")());
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
  const tele = frame.data.toString("utf8").trim();
  io.emit("telemetry", tele);
  console.log(tele);
});
