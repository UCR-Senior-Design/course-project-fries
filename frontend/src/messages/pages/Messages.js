import React from "react";
import useWebSocket from "react-use-websocket";
import { useState, useEffect } from "react";
//import styles from "./Messages.module.css";

const Messages = () => {
  const [enteredMessage, setEnteredMessage] = useState("");

  // Connect to server
  const ws_URL = "ws://localhost:8080";
  const { sendJsonMessage, lastJsonMessage } = useWebSocket(ws_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
  });

  // Listen for messages from the server
  useEffect(() => {
    console.log("lastJsonMessage: ", lastJsonMessage);
    if (lastJsonMessage) {
      console.log("received message from server: ", lastJsonMessage);
    }
  }, [lastJsonMessage]);

  // Set entered message into a variable
  const entered_message_handler = (event) => {
    setEnteredMessage(event.target.value);
  };

  // Send messages to server
  const send_message = () => {
    console.log("Send this message: " + enteredMessage);
    sendJsonMessage({
      type: "clientmessage",
      content: enteredMessage,
    });
  };

  // Submit Form
  const form_submit_handler = async (event) => {
    event.preventDefault();
    console.log("form_submit_handler() works!");
    send_message();
    setEnteredMessage("");
  };

  return (
    <div>
      <h1>Messages Page</h1>
      <link></link>
      <script defer src="app.js"></script>
      <div>
        <form onSubmit={form_submit_handler}>
          {" "}
          <input
            type="text"
            placeholder="Your Message"
            value={enteredMessage}
            onChange={entered_message_handler}
          ></input>
          <button>Send</button>
        </form>
        <ul></ul>
      </div>
    </div>
  );
};

export default Messages;
