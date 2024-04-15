const express = require("express");
const app = express();
const socketio = require("socket.io");
const fs = require("fs");
app.use(require("cors")());
app.use(express.json());
const path = require("path");
const readline = require('readline');

const csvFilePath = path.join(__dirname, "telemetry.csv");
const port = process.env.PORT || 5000;
const server = app.listen(
  port,
  console.log(`Server listening to the port ${port}`),
);
const io = socketio(server, {
  cors: { origin: "*", methods: ["GET", "POST"] },
});


io.on("connection", (socket) => {
  console.log('Client connected, sending data...');

  // Read the CSV file line by line and emit each line
  const rl = readline.createInterface({
    input: fs.createReadStream(csvFilePath),
    output: process.stdout,
    terminal: false
  });

  rl.on('line', (line) => {
    socket.emit("telemetry", line); // Emit each line as a telemetry update
  });

  rl.on('close', () => {
    console.log('Finished sending existing telemetry data.');
  });
});

