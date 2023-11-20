const express = require('express');
const mqtt = require('mqtt');
const app = express();

const mqttHost = "13.51.201.221";
const protocol = "mqtt";
const port = "1883";
const topic = "count";

// MQTT Client Setup
const mqttClient = mqtt.connect(`${protocol}://${mqttHost}:${port}`);
let latestCounts = []; // Variable to store the latest counts from MQTT messages

mqttClient.on("connect", () => {
  console.log("MQTT Client connected");

  // Subscribe to the MQTT topic
  mqttClient.subscribe(topic, { qos: 0 });
});

mqttClient.on("message", (mqttTopic, message) => {
  console.log(`Received MQTT message on topic ${mqttTopic}: ${message.toString()}`);
  
  // Parse the received message and update the latestCounts variable
  latestCounts = JSON.parse(message.toString()).counts;
});

app.get("/", (req, res) => {
  // Send the latest counts as a response
  res.send({ "counts": latestCounts });
});

const server = app.listen(5001, () => {
  console.log("Server started on port 5001");
});

// Log any errors that occur during server startup
server.on('error', (err) => {
  console.error('Server error:', err.message);
});
