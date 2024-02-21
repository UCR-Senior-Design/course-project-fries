import React, { useState } from "react";
import { Layout, Button } from "antd";
import cn from "classnames";
import styles from "./Compose.module.css";
import { CloseOutlined } from "@ant-design/icons";

const Compose = ({ onSentMessage, messages, uid, onExit }) => {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [enteredMessage, setEnteredMessage] = useState("");

  const entered_recipient_handler = (event) => {
    setRecipient(event.target.value);
  };
  const entered_title_handler = (event) => {
    setTitle(event.target.value);
  };
  const entered_message_handler = (event) => {
    setEnteredMessage(event.target.value);
  };
  // Submit message
  const msg_submit_handler = async (event) => {
    console.log(uid);
    event.preventDefault();
    // Save conversation to DB
    fetch("http://localhost:5001/api/messages/createconversation", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        sender: uid,
        recipient: recipient,
        title: title,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        // Pass conversation info to Messages.js
        onSentMessage(
          enteredMessage,
          data.created_conversation._id,
          recipient,
          title
        );
      })
      .catch((error) => console.error(error));

    setEnteredMessage("");
  };

  const exit = () => {
    onExit();
  };

  return (
    <div>
      <div className={styles.header}>
        <h3>New Message</h3>
        <CloseOutlined onClick={exit} />
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
          <form>
            <input
              type="text"
              placeholder="Enter Title"
              value={title}
              onChange={entered_title_handler}
            ></input>
          </form>
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
      </div>
    </div>
  );
};

export default Compose;
