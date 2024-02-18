import React, { useContext } from "react";
import styles from "./Messages.module.css";
import Compose from "../components/Compose";
import Thread from "../components/Thread";
import Inbox from "../components/Inbox";
import { Layout, Typography, Button } from "antd";
import { useState } from "react";
import NavigationBar from "../../common/components/NavBar";
import { AuthContext } from "../../common/utils/auth";
import { EditOutlined, InboxOutlined, SendOutlined } from "@ant-design/icons";
import { DateTime } from "luxon";
const { Content, Sider, Footer } = Layout;
const { Text } = Typography;

const Messages = () => {
  const { isLoggedIn } = useContext(AuthContext);
  // For test - manually login/logout
  const { login } = useContext(AuthContext);
  login();
  //
  const [uid, setUid] = useState(""); // TODO: replace with what you get from login
  const [compose, setCompose] = useState(false);
  const [inbox, setInbox] = useState(false);
  const [viewthread, setViewThread] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");

  // Set uid into a variable
  const entered_uid_handler = (event) => {
    setUid(event.target.value);
  };

  // Save conversation and first message, display Thread
  const send_message = (enteredMessage, conversation_id, recipient, title) => {
    const timestamp_ = DateTime.now().toISO();
    // Post first message to DB
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

    // Display Thread
    setConversationId(conversation_id);
    setRecipient(recipient);
    setTitle(title);
    setCompose(false);
    setViewThread(true);
  };

  // Compose new message
  const compose_handler = (event) => {
    setInbox(false);
    setViewThread(false);
    setCompose(true);
  };

  // Display Inbox
  const inbox_btn_handler = (event) => {
    setCompose(false);
    setViewThread(false);
    setInbox(true);
  };

  // Display Sent (All conversations where user sent the last message)
  const sent_btn_handler = (event) => {
    setCompose(false);
    setInbox(false);
  };

  // Display Thread selected from Inbox
  const select_convo_handler = (conversation_id, recipient, sender, title) => {
    console.log("here");
    console.log(conversation_id);
    console.log(recipient);
    console.log(sender);
    console.log(title);
    setConversationId(conversation_id);
    if (recipient !== uid) {
      setRecipient(recipient);
    } else {
      setRecipient(sender);
    }
    setTitle(title);
    setInbox(false);
    setViewThread(true);
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
          <form>
            <input
              type="text"
              placeholder="Enter UID"
              value={uid}
              onChange={entered_uid_handler}
            ></input>
          </form>
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
            <li className={styles.side_menu_button} onClick={inbox_btn_handler}>
              <InboxOutlined style={{ paddingRight: "4px" }} />
              Inbox
            </li>
            {/* <li className={styles.side_menu_button} onClick={sent_btn_handler}>
              <SendOutlined style={{ paddingRight: "4px" }} />
              Sent
            </li> */}
          </ul>
          <div className={styles.inbox_body}>
            {inbox === true && (
              <Inbox uid={uid} onSetConvoId={select_convo_handler}></Inbox>
            )}
            {compose === true && (
              <Compose
                onSentMessage={send_message}
                uid={uid} // TODO: replace with login uid -- temporarily passing in user id
              ></Compose>
            )}
            {viewthread === true && (
              <Thread
                conversation_id={conversationId}
                recipient={recipient}
                title={title}
                uid={uid} // TODO: replace with login uid -- temporarily passing in user id
              ></Thread>
            )}
          </div>
        </div>
      </Content>
    </Layout>
  );
};

export default Messages;
