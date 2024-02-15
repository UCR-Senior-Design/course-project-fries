const HttpError = require("../models/http-error");
const Message = require("../models/message");
const Conversation = require("../models/conversation");
const { validationResult } = require("express-validator");
const http = require("http");
const { start } = require("repl");
const { DateTime } = require("luxon");
const ws = require("ws");
const { json } = require("body-parser");
// All active connections
const clients = {};

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
    const combined_data = JSON.stringify({
      msg: JSON_msg,
      timestamp: DateTime.now().toISO(),
    });

    clients[recv_id].send(combined_data);
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

const create_conversation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, check your data.", 422);
  }
  const { sender, recipient, title } = req.body;
  console.log(req.body);
  const created_conversation = new Conversation({
    sender: sender,
    recipient: recipient,
    title: title,
  });
  try {
    await created_conversation.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Conversation failed, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ created_conversation });
};
const save_message = async (req, res, next) => {
  // const errors = validationResult(req);
  // if (!errors.isEmpty()) {
  //   throw new HttpError("Invalid inputs passed, check your data.", 422);
  // }
  // const () = req.body;
  // const message = new Message ({
  // });
};

// POST Patient
// const create_patient = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     throw new HttpError("Invalid inputs passed, check your data.", 422);
//   }

//   const { firstname, lastname, username, password, email, doctor_ids } =
//     req.body;
//   const created_patient = new Patient({
//     firstname,
//     lastname,
//     username,
//     password,
//     email,
//     doctor_ids,
//   });

//   try {
//     await created_patient.save(); // Mongoose method to store document in DB, create unique userid
//   } catch (err) {
//     const error = new HttpError("Creating User failed, please try again", 500);
//     return next(error);
//   }

//   res.status(201).json({ created_patient });
// };

exports.handle_client_activity = handle_client_activity;
exports.create_conversation = create_conversation;
exports.save_message = save_message;
