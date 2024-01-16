import React, { useState } from "react";
import { Layout, Button } from "antd";
import styles from "./Compose.module.css";
import { CloseOutlined } from "@ant-design/icons";

const Compose = ({ onSetRecipient, onSentMessage, messages }) => {
  const [recipient, setRecipient] = useState("");
  const [enteredMessage, setEnteredMessage] = useState("");

  // Set recipient into a variable
  const entered_recipient_handler = (event) => {
    setRecipient(event.target.value);
  };
  // Set entered message into a variable
  const entered_message_handler = (event) => {
    setEnteredMessage(event.target.value);
  };
  // Submit message
  const msg_submit_handler = async (event) => {
    event.preventDefault();
    await onSetRecipient(recipient);
    onSentMessage(enteredMessage);
    setEnteredMessage("");
  };

  return (
    <div>
      <div className={styles.header}>
        <h3>New Message</h3>
        <CloseOutlined />
      </div>
      <div className={styles.main}>
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
        <div id="compose_message_history" className={styles.messages}>
          {messages.map((element, index) => (
            <div key={index}>{element}</div>
          ))}

          {/* <div id="message_history">
            {messages.map((element, index) => (
              <div key={index}>{element}</div>
            ))}
          </div> */}
        </div>
        <div style={{ textAlign: "center", padding: "20px 50px" }}>
          <form className={styles.input_msg_form} onSubmit={msg_submit_handler}>
            <input
              type="text"
              placeholder="Type your message here..."
              className={styles.input_msg}
              value={enteredMessage}
              onChange={entered_message_handler}
            />
            <Button type="primary" onClick={msg_submit_handler}>
              Send
            </Button>
          </form>
        </div>
        {/* <div>
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
        </div> */}
      </div>
    </div>
  );
};

export default Compose;
