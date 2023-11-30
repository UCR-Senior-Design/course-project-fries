const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const http = require("http");
// const WebSocketServer = require("ws");
const ws = require("ws");

const start_server = () => {
  // Attach WebSocket Server instance to HTTP server instance
  const server = http.createServer();
  const wss = new ws.WebSocketServer({ server });
  const port = 8080;
  server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
  });

  // New client connection request received
  wss.on("connection", function (connection) {
    console.log("Server received a new connection.");
    connection.send("Connected to WebSocket server!"); // TODO: doesnt do anything
    // Event listener for messages
    connection.on("message", (message) => {
      // Echoes message back to client
      // connection.send(`Message from server: ${message}`);
      connection.send(message.content);
      console.log("Server received message from client: %s", message);
    });
  });
};

exports.start_server = start_server;
