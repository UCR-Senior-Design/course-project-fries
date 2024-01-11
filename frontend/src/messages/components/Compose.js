import React, { useState } from "react";
import styles from "./Compose.module.css";
import { CloseOutlined } from "@ant-design/icons";

const Compose = ({ onSetRecipient, onSentMessage }) => {
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
    </div>
  );
};

export default Compose;
