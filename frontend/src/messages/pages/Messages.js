import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import styles from "./Messages.module.css";
import Compose from "../components/Compose";
import Thread from "../components/Thread";
import Inbox from "../components/Inbox";
import { Layout, Typography, Button } from "antd";
import { useAuth } from "../../common/utils/auth";
import { EditOutlined, InboxOutlined } from "@ant-design/icons";
import { DateTime } from "luxon";
const { Content, Sider, Footer } = Layout;
const { Text } = Typography;

const Messages = () => {
  const history = useHistory();
  const { isLoggedIn, userId } = useAuth(); // use userId here

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [isLoggedIn, history]);

  console.log(userId);

  const [uid, setUid] = useState(userId);
  const [compose, setCompose] = useState(false);
  const [inbox, setInbox] = useState(true);
  const [viewthread, setViewThread] = useState(false);
  const [conversationId, setConversationId] = useState("");
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [otherUserName, setOtherUserName] = useState("");

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

  // Display Thread selected from Inbox
  const select_convo_handler = (
    conversation_id,
    recipient,
    sender,
    title,
    otherUserName
  ) => {
    setConversationId(conversation_id);
    if (recipient !== uid) {
      setRecipient(recipient);
    } else {
      setRecipient(sender);
    }
    setTitle(title);
    setOtherUserName(otherUserName);
    setInbox(false);
    setViewThread(true);
  };

  return (
    <Layout className="layout" style={{ height: "100vh" }}>
      {/* <NavigationBar /> */}
      <Content style={{ padding: "0 40px" }}>
        <h1>Messages Inbox</h1>
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
          </ul>
          <div className={styles.inbox_body}>
            {inbox === true && (
              <Inbox uid={uid} onSetConvoId={select_convo_handler}></Inbox>
            )}
            {compose === true && (
              <Compose
                onSentMessage={send_message}
                uid={uid} // TODO: replace with login uid -- temporarily passing in user id
                onExit={inbox_btn_handler}
              ></Compose>
            )}
            {viewthread === true && (
              <Thread
                conversation_id={conversationId}
                recipient={recipient}
                title={title}
                otherUserName={otherUserName}
                onExit={inbox_btn_handler}
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
