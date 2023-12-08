const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const http = require("http");
// const WebSocketServer = require("ws");
const ws = require("ws");
// All active connections
const clients = {};
// All active users
const users = {};
// Message history
const msg_history = [];

const send_msg = (JSON_msg, uid, recv_id) => {
  // TEST: Print all connected clients
  for (const [client_id, connection] of Object.entries(clients)) {
    console.log(`Connected client: ${client_id}`);
  }

  // Sender sends recipient message
  clients[recv_id].send(JSON.stringify(JSON_msg));
};

const start_server = () => {
  // Attach WebSocket Server instance to HTTP server instance
  const server = http.createServer();
  const wss = new ws.WebSocketServer({ server });
  const port = 8080;
  server.listen(port, () => {
    console.log(`WebSocket server is running on port ${port}`);
  });

  // Receive new client connection request & handle events
  wss.on("connection", function (connection) {
    console.log("Server received a new connection.");
    connection.send("Connected to WebSocket server!");

    // Event listener for messages
    connection.on("message", (message) => {
      JSON_msg = JSON.parse(message);
      // Store new connection if message type is "uid"
      if (JSON_msg.type == "uid") {
        console.log(`Client's uid: ${JSON_msg.content}`);
        clients[JSON.stringify(JSON_msg.content)] = connection;
      } else if (JSON_msg.type == "client_msg") {
        send_msg(JSON_msg.content, JSON_msg.uid, JSON_msg.recv_id);
      }

      // Handle messages
      // Echoes message back to client
      // var echo_statement =
      //   "Echo from server: " + JSON.stringify(JSON_msg.content);
      // connection.send(echo_statement);
    });
  });
};

exports.start_server = start_server;
