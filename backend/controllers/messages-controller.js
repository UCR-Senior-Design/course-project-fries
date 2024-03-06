const HttpError = require("../models/http-error");
const Message = require("../models/message");
const User = require("../models/Users");
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

// Receive new client connection request & handle events
wss.on("connection", function (socket) {
  console.log("Server received a new connection.");

  // Event listener for messages
  socket.on("message", (message) => {
    JSON_msg = JSON.parse(message);
    // Store new connection if message type is "uid"
    if (JSON_msg.type == "uid") {
      console.log(`Client's uid: ${JSON_msg.content}`);
      clients[JSON.stringify(JSON_msg.content)] = socket;
    }
    // Send messages between clients if message type is "client_msg"
    else if (JSON_msg.type == "client_msg") {
      send_msg(
        JSON_msg.content,
        JSON_msg.uid,
        JSON.stringify(JSON_msg.recv_id),
        JSON_msg.cid
      );
    } else if (JSON_msg.type == "disconnect") {
      disconnect_client(JSON.stringify(JSON_msg.uid));
    }
  });
});

const send_msg = (JSON_msg, uid, recv_id, cid) => {
  // TEST: Print all connected clients
  for (const [client_id, connection] of Object.entries(clients)) {
    console.log(`Connected client: ${client_id}`);
  }
  // If recipient is not connectected, do nothing
  console.log(recv_id);
  if (!clients.hasOwnProperty(recv_id)) {
    console.log("recipient does not exist");
  }
  // Else, Sender sends recipient message
  else {
    const combined_data = JSON.stringify({
      msg: JSON_msg,
      timestamp: DateTime.now().toISO(),
      cid: cid,
    });

    clients[recv_id].send(combined_data);
  }
};

const disconnect_client = (uid) => {
  const client_connection = clients[uid];
  if (client_connection) {
    clients[uid].close();
    delete clients[uid];
    console.log(`Disconnected client: ${uid}`);
    // TEST: Print all connected clients
    for (const [client_id, connection] of Object.entries(clients)) {
      console.log(`Connected client: ${client_id}`);
    }
  } else {
    console.log(`Client ${uid} not found or already closed.`);
  }
};

const create_conversation = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, check your data.", 422);
  }
  const { sender, recipient, title } = req.body;
  console.log("create_conversation fxn line 86:");
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed, check your data.", 422);
  }
  const { conversation_id, sender, text, timestamp } = req.body;
  console.log("save_message fxn line 111:");
  console.log(req.body);
  const created_message = new Message({
    conversation_id: conversation_id,
    sender: sender,
    text: text,
    timestamp: timestamp,
  });
  try {
    await created_message.save();
  } catch (err) {
    const error = new HttpError(
      "Creating Message failed, please try again",
      500
    );
    return next(error);
  }
  res.status(201).json({ created_message });
};

const list_conversations_by_uid = async (req, res, next) => {
  const uid = req.params.uid;
  let conversation_list;

  try {
    conversation_list = await Conversation.find({
      $or: [{ sender: uid }, { recipient: uid }],
    });
  } catch (err) {
    const error = new HttpError("Something went wrong with the request.", 500);
    return next(error);
  }

  if (!conversation_list) {
    const error = new HttpError(
      "Could not find conversation list by provided uid.",
      404
    );
    return next(error);
  }

  res.json({
    conversation_list: conversation_list.map((conversation) =>
      conversation.toObject({ getters: true })
    ),
  });
};

const list_message_history_by_cid = async (req, res, next) => {
  const cid = req.params.cid;
  let message_history;

  // Return message history in an array
  try {
    message_history = await Message.find({
      conversation_id: cid,
    });
  } catch (err) {
    const error = new HttpError("Something went wrong with the request.", 500);
    return next(error);
  }

  if (!message_history) {
    const error = new HttpError(
      "Could not find message history by provided cid.",
      404
    );
    return next(error);
  }

  res.json({
    message_history: message_history.map((message) =>
      message.toObject({ getters: true })
    ),
  });
};

const get_user_by_uid = async (req, res, next) => {
  const uid = req.params.uid;
  let user;

  try {
    user = await User.findById(uid);
  } catch (err) {
    const error = new HttpError("Something went wrong with the request.", 500);
    return next(error); // stop code execution if error is detected
  }

  if (!user) {
    const error = new HttpError("Could not find user by provided id.", 404);
    return next(error);
  }
  res.json({ user: user.toObject({ getters: true }) });
};

const list_users = async (req, res, next) => {
  const uid = req.params.uid;
  let user;
  let isDoctor;
  let users_list;

  // Check if user is either doctor or patient
  try {
    user = await User.findById(uid);
    isDoctor = user.isDoctor;
  } catch (err) {
    const error = new HttpError("Something went wrong with the request.", 500);
    return next(error);
  }

  // Return list of users in an array
  try {
    users_list = await User.find();
  } catch (err) {
    const error = new HttpError("Something went wrong with the request.", 500);
    return next(error);
  }

  if (!users_list) {
    const error = new HttpError(
      "Could not find any users to add to users list.",
      404
    );
    return next(error);
  }

  // If user who owns uid is a doctor, return all users
  if (isDoctor) {
    res.json({
      users_list: users_list
        .map((user) => {
          const { _id, firstname, lastname } = user.toObject({ getters: true });
          const fullname = firstname + " " + lastname;
          if (uid !== _id.toString()) {
            return { value: _id, label: fullname };
          }
          return null;
        })
        .filter((item) => item !== null),
    });
  }
  // If user who owns uid is a patient, return doctors only
  else {
    res.json({
      users_list: users_list
        .map((user) => {
          const { _id, firstname, lastname, isDoctor } = user.toObject({
            getters: true,
          });
          const fullname = firstname + " " + lastname;
          if (uid !== _id.toString() && isDoctor) {
            return { value: _id, label: fullname };
          }
          return null;
        })
        .filter((item) => item !== null),
    });
  }
};

exports.create_conversation = create_conversation;
exports.save_message = save_message;
exports.list_conversations_by_uid = list_conversations_by_uid;
exports.list_message_history_by_cid = list_message_history_by_cid;
exports.get_user_by_uid = get_user_by_uid;
exports.list_users = list_users;
