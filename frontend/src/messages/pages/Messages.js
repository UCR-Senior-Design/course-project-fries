import React, { useContext } from "react";
import styles from "./Messages.module.css";
import Compose from "../components/Compose";
import { Layout, Typography, Button, message } from "antd";
import useWebSocket from "react-use-websocket";
import { useState, useEffect } from "react";
import NavigationBar from "../../common/components/NavBar";
import { AuthContext } from "../../common/utils/auth";
import { EditOutlined, InboxOutlined, SendOutlined } from "@ant-design/icons";
const { Content, Sider, Footer } = Layout;
const { Text } = Typography;

const Messages = () => {
  const { isLoggedIn } = useContext(AuthContext);
  // For test - manually login/logout
  const { login } = useContext(AuthContext);
  login();
  //
  const [outgoingMessage, setOutgoingMessage] = useState("");
  const [recipient, setRecipient] = useState("");
  const [uid, setUid] = useState(""); // TODO: replace with what you get from login
  const [compose, setCompose] = useState(false);
  const [incomingMsg, setIncomingMsg] = useState("");
  const [messageHistory, setMessageHistory] = useState([]);

  useEffect(() => {
    // Connect to WS Server when Messages page is mounted
    fetch("http://localhost:5000/api/messages/").then((response) =>
      response.json()
    );
    // Disconnect client from WS Server when page is unloaded (refreshed)
    // const unload_handler = (event) => {
    //   console.log(`Client disconnected: ${uid}`);
    //   sendJsonMessage({
    //     type: "disconnect",
    //     uid: uid,
    //   });
    // };

    // window.addEventListener("beforeunload", unload_handler);

    // return () => {
    //   window.removeEventListener("beforeunload", unload_handler);
    //   // Disconnect client from WS Server when page is unmounted
    //   console.log(`Client disconnected: ${uid}`);
    //   sendJsonMessage({
    //     type: "disconnect",
    //     uid: uid,
    //   });
    // };
  }, []);

  // Connect to server
  const ws_URL = "ws://localhost:8080";
  const { sendJsonMessage, lastMessage } = useWebSocket(ws_URL, {
    onOpen: () => {
      console.log("WebSocket connection established.");
    },
  });

  // Listen for messages from the server
  useEffect(() => {
    if (lastMessage !== null && lastMessage.data) {
      console.log("lastMessage: ", lastMessage.data);
      setIncomingMsg(lastMessage.data);
      setMessageHistory((messageHistory) => [
        ...messageHistory,
        { text: lastMessage.data, sent: false },
      ]);
    }
  }, [lastMessage]);

  // Set uid into a variable
  const entered_uid_handler = (event) => {
    setUid(event.target.value);
  };
  // Submit uid to WS server
  const submit_uid_handler = (event) => {
    event.preventDefault();
    sendJsonMessage({
      type: "uid",
      content: uid, // TODO: make api to get DBuid
    });
  };

  let recip;
  const addRecipient = (data) => {
    recip = data;
    // console.log(data);
    // setRecipient(data);
    // console.log(recipient);
  };

  // Send messages to server
  const send_message = (data) => {
    setOutgoingMessage(data);

    sendJsonMessage({
      type: "client_msg",
      content: data,
      uid: uid,
      recv_id: recip,
    });

    setMessageHistory((messageHistory) => [
      ...messageHistory,
      { text: data, sent: true },
    ]);
    console.log(messageHistory);
  };

  // TEMP: Disable client from receiving messages
  const logout_handler = () => {
    console.log(`Client disconnected: ${uid}`);
    sendJsonMessage({
      type: "disconnect",
      uid: uid,
    });
  };

  // Compose new message
  const compose_handler = (event) => {
    setCompose(true);
  };

  if (!isLoggedIn) {
    return (
      <Layout className="layout" style={{ height: "100vh" }}>
        <NavigationBar isLoggedIn={isLoggedIn} />
        <Content
          style={{
            padding: "0 50px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>Please login first.</Text>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      <NavigationBar isLoggedIn={isLoggedIn} />
      <Content style={{ padding: "0 40px" }}>
        <h1>Messages Inbox</h1>
        {/* TO DO: Manually entered UID should replace with login info */}
        <div>
          <form onSubmit={submit_uid_handler}>
            <input
              type="text"
              placeholder="Enter UID"
              value={uid}
              onChange={entered_uid_handler}
            ></input>
            <button>Submit</button>
          </form>
          <button onClick={logout_handler}>Logout</button>
        </div>
        <div className={styles.main}>
          <ul className={styles.side_menu}>
            <Button
              size="large"
              style={{ margin: "4px" }}
              onClick={compose_handler}
            >
              <EditOutlined />
              Compose
            </Button>
            <li className={styles.side_menu_button}>
              <InboxOutlined style={{ paddingRight: "4px" }} />
              Inbox
            </li>
            <li className={styles.side_menu_button}>
              <SendOutlined style={{ paddingRight: "4px" }} />
              Sent
            </li>
          </ul>
          <div className={styles.inbox_body}>
            {compose === true && (
              <Compose
                onSentMessage={send_message}
                onSetRecipient={addRecipient}
                messages={messageHistory}
              ></Compose>
            )}
            {compose === false && <h1>hi</h1>}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Messages;
