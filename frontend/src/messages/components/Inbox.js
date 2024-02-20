import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import styles from "./Inbox.module.css";
const { Text } = Typography;
// import { CloseOutlined } from "@ant-design/icons";

const Inbox = ({ uid, onSetConvoId }) => {
  //TODO: use uid from login
  const [convoList, setConvoList] = useState([]);
  const [noMsg, setNoMsg] = useState(false);

  // Fetch all Conversations where user is either sender or recipient
  useEffect(() => {
    // Fetch conversations when the Inbox mounts
    fetch(`http://localhost:5001/api/messages/listconversations/${uid}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        if (data.conversation_list.length === 0) {
          setNoMsg(true);
        }
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

  // console.log(convoList);
  return (
    <div>
      {noMsg ? (
        <h1 style={{ marginLeft: "20px" }}>No Messages</h1>
      ) : (
        convoList.map(({ _id, recipient, sender, title }) => (
          <ul
            key={_id}
            className={styles.conversation_item}
            onClick={() =>
              select_conversation_handler(_id, recipient, sender, title)
            }
          >
            <h3>{title}</h3>
            <div>
              <Text>From: {sender}</Text>
            </div>
            <div>
              <Text>To: {recipient}</Text>
            </div>
            {/* <ul>Conversation id: {_id}</ul> */}
          </ul>
        ))
      )}
    </div>
  );
};

export default Inbox;
