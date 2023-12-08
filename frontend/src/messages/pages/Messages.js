import React from "react";
import useWebSocket from "react-use-websocket";
import { useState, useEffect } from "react";
//import styles from "./Messages.module.css";

const Messages = () => {
  const [enteredMessage, setEnteredMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  // const [users, setUsers] = useState([]); // Connected users (just 2 ppl?)
  // const [messages, setMesages] = useState([]); // On-screen message history

  // User's id
  var temp_uid = Math.random();

  // Connect to server
  const ws_URL = "ws://localhost:8080";
  const { sendJsonMessage, lastMessage } = useWebSocket(ws_URL, {
    // const { sendJsonMessage, lastJsonMessage } = useWebSocket(ws_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
      sendJsonMessage({
        type: "uid",
        content: temp_uid, // TODO: make api to get DBuid
      });
    },
  });

  // Listen for messages from the server
  useEffect(() => {
    if (lastMessage !== null && lastMessage.data) {
      console.log("lastMessage: ", lastMessage);
    }
  }, [lastMessage]);

  // Set recipient into a variable
  const entered_recipient_handler = (event) => {
    setRecipient(event.target.value);
  };

  // Set entered message into a variable
  const entered_message_handler = (event) => {
    setEnteredMessage(event.target.value);
  };

  // Send messages to server
  const send_message = () => {
    console.log("Send this message: " + enteredMessage);
    sendJsonMessage({
      type: "client_msg",
      content: enteredMessage,
      uid: temp_uid,
      recv_id: recipient,
    });
  };

  // Submit Form
  const msg_submit_handler = async (event) => {
    event.preventDefault(); // Submit without reloading the page
    send_message();
    setEnteredMessage("");
  };

  return (
    <div>
      <h1>Messages Page</h1>
      <link></link>
      <script defer src="app.js"></script>
      <div>
        <form>
          <input
            type="text"
            placeholder="Enter Recipient"
            value={recipient}
            onChange={entered_recipient_handler}
          ></input>
        </form>
      </div>
      <div>
        <form onSubmit={msg_submit_handler}>
          {" "}
          <input
            type="text"
            placeholder="Your Message"
            value={enteredMessage}
            onChange={entered_message_handler}
          ></input>
          <button>Send</button>
        </form>
      </div>
    </div>
  );
};

export default Messages;
