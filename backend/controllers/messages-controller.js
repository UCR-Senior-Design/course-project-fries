const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const http = require("http");
const { start } = require("repl");
// const WebSocketServer = require("ws");
const ws = require("ws");
// All active connections
const clients = {};
// All active users
const users = {};
// Message history
const msg_history = [];

// Attach WebSocket Server instance to HTTP server instance

const server = http.createServer();
const wss = new ws.WebSocketServer({ server });
const port = 8080;
server.listen(port, () => {
  console.log(`WebSocket server is running on port ${port}`);
});

const send_msg = (JSON_msg, uid, recv_id) => {
  // TEST: Print all connected clients
  for (const [client_id, connection] of Object.entries(clients)) {
    console.log(`Connected client: ${client_id}`);
  }
  // If recipient is not connectected, save messages to DB
  console.log(recv_id);
  if (!clients.hasOwnProperty(recv_id)) {
    console.log("recipient does not exist");
  }
  // Sender sends recipient message
  else {
    clients[recv_id].send(JSON.stringify(JSON_msg));
  }
};

const disconnect_client = (uid) => {
  delete clients[uid];
  console.log(`Disconnected client: ${uid}`);
  // TEST: Print all connected clients
  for (const [client_id, connection] of Object.entries(clients)) {
    console.log(`Connected client: ${client_id}`);
  }
};

const handle_client_activity = () => {
  // Receive new client connection request & handle events
  wss.on("connection", function (connection) {
    console.log("Server received a new connection.");
    // connection.send("Connected to WebSocket server!");

    // Event listener for messages
    connection.on("message", (message) => {
      JSON_msg = JSON.parse(message);
      // Store new connection if message type is "uid"
      if (JSON_msg.type == "uid") {
        console.log(`Client's uid: ${JSON_msg.content}`);
        clients[JSON.stringify(JSON_msg.content)] = connection;
      }
      // Send messages between clients if message type is "client_msg"
      else if (JSON_msg.type == "client_msg") {
        send_msg(
          JSON_msg.content,
          JSON_msg.uid,
          JSON.stringify(JSON_msg.recv_id)
        );
      } else if (JSON_msg.type == "disconnect") {
        disconnect_client(JSON.stringify(JSON_msg.uid));
      }
    });
  });
};

exports.handle_client_activity = handle_client_activity;
