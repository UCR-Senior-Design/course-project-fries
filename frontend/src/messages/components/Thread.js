import React, { useState, useEffect } from "react";
import cn from "classnames";
import styles from "./Compose.module.css";
import { CloseOutlined } from "@ant-design/icons";
import { Layout, Typography, Button, message } from "antd";
import useWebSocket from "react-use-websocket";
import { DateTime } from "luxon";
const { Footer } = Layout;
const { Text } = Typography;

const Thread = ({
  conversation_id,
  recipient,
  uid,
  title,
  otherUserName,
  onExit,
}) => {
  const [messageHistory, setMessageHistory] = useState([]);
  const [enteredMessage, setEnteredMessage] = useState("");

  const entered_message_handler = (event) => {
    event.preventDefault();
    setEnteredMessage(event.target.value);
  };

  useEffect(() => {
    // Load messages from DB by conversation id
    fetch(
      `http://localhost:5001/api/messages/listmessagehistory/${conversation_id}`
    )
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setMessageHistory(data.message_history);
      })
      .catch((error) => {
        console.error(error);
      });
    // Connect to WS Server when Messages page is mounted
    fetch("http://localhost:5001/api/messages/").then((response) =>
      response.json()
    );
    // Disconnect client from WS Server when page is unloaded (refreshed)
    const unload_handler = (event) => {
      console.log(`Client disconnected: ${uid}`);
      sendJsonMessage({
        type: "disconnect",
        uid: uid,
      });
    };

    window.addEventListener("beforeunload", unload_handler);

    return () => {
      window.removeEventListener("beforeunload", unload_handler);
      // Disconnect client from WS Server when page is unmounted
      console.log(`Client disconnected: ${uid}`);
      sendJsonMessage({
        type: "disconnect",
        uid: uid,
      });
    };
  }, []);

  // Connect user to WS server
  const ws_URL = "ws://localhost:8080";
  const { sendJsonMessage, lastMessage } = useWebSocket(ws_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
      sendJsonMessage({
        type: "uid",
        content: uid, // TODO: make api to get DBuid
      });
    },
  });

  // Listen for messages from the server
  useEffect(() => {
    if (lastMessage !== null && lastMessage.data) {
      console.log("lastMessage: ", lastMessage.data);
      const parsed_data = JSON.parse(lastMessage.data);
      // Display incoming message if message conversation id matches Thread conversation id
      if (parsed_data.cid === conversation_id) {
        setMessageHistory((messageHistory) => [
          ...messageHistory,
          {
            text: parsed_data.msg,
            sent: false,
            timestamp: parsed_data.timestamp,
          },
        ]);
      }
    }
  }, [lastMessage]);

  // Send messages to server
  const msg_submit_handler = async (event) => {
    event.preventDefault();
    // Send message to recipient in WS
    sendJsonMessage({
      type: "client_msg",
      content: enteredMessage,
      uid: uid,
      recv_id: recipient,
      cid: conversation_id,
    });

    const timestamp_ = DateTime.now().toISO();
    // Add message to frontend message thread
    setMessageHistory((messageHistory) => [
      ...messageHistory,
      { text: enteredMessage, sent: true, timestamp: timestamp_ },
    ]);
    // Post Message to DB
    fetch("http://localhost:5001/api/messages/savemessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        conversation_id: conversation_id,
        sender: uid,
        text: enteredMessage,
        timestamp: timestamp_,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
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
        <h2>{title}</h2>
        <h4>{otherUserName}</h4>
        <CloseOutlined onClick={exit} />
      </div>
      {/* <button onClick={logout_handler}>Logout</button> */}
      <div className={styles.main}>
        <div id="compose_message_history" className={styles.list}>
          {messageHistory.map(({ sender, text, sent, timestamp }) => (
            <div
              key={timestamp}
              className={cn(
                styles.shared,
                sent || sender === uid ? styles.sent : styles.received
              )}
            >
              <div className={styles.timestamp}>{timestamp}</div>
              <div>{text}</div>
            </div>
          ))}
        </div>

        <Footer
          style={{
            textAlign: "center",
            padding: "20px 50px",
            position: "sticky",
            bottom: 0,
            zIndex: 100,
          }}
        >
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
        </Footer>
      </div>
    </div>
  );
};

export default Thread;
