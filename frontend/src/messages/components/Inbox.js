import React, { useState, useEffect } from "react";
// import { Layout, Button } from "antd";
import styles from "./Inbox.module.css";
// import { CloseOutlined } from "@ant-design/icons";

const Inbox = ({ uid, onSetConvoId }) => {
  //TODO: use uid from login
  const [convoList, setConvoList] = useState([]);

  // Fetch all Conversations where user is either sender or recipient
  useEffect(() => {
    // Fetch conversations when the Inbox mounts
    fetch(`http://localhost:5001/api/messages/listconversations/${uid}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setConvoList(data.conversation_list);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const select_conversation_handler = (_id, recipient, sender, title) => {
    // Render Thread by conversation id, pass info to Messages.js
    onSetConvoId(_id, recipient, sender, title);
  };

  console.log(convoList);
  return (
    <div>
      {convoList.map(({ _id, recipient, sender, title }) => (
        <ul
          key={_id}
          className={styles.conversation_item}
          onClick={() =>
            select_conversation_handler(_id, recipient, sender, title)
          }
        >
          <h4>{title}</h4>
          <h5>Sender: {sender}</h5>
          <ul>Recipient: {recipient}</ul>
          <ul>Conversation id: {_id}</ul>
        </ul>
      ))}
    </div>
  );
};

export default Inbox;
