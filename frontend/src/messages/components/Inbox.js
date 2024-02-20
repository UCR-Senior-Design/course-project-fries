import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import styles from "./Inbox.module.css";
const { Text } = Typography;
// import { CloseOutlined } from "@ant-design/icons";

const Inbox = ({ uid, onSetConvoId }) => {
  //TODO: use uid from login
  const [convoList, setConvoList] = useState([]);
  const [renderedConvoList, setRenderedConvoList] = useState([]);
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

  const other_user_in_convo = async (recipient, sender) => {
    try {
      // Display name of other user in conversation
      const userId = recipient !== uid ? recipient : sender;

      const response = await fetch(
        `http://localhost:5001/api/messages/getuser/${userId}`
      );
      const data = await response.json();

      console.log(data);

      const concatenatedName = data.user.firstname + " " + data.user.lastname;

      return concatenatedName;
    } catch (error) {
      console.error(error);
      return "Unknown User";
    }
  };

  useEffect(() => {
    const fetchAndRenderConvoList = async () => {
      const updatedList = await Promise.all(
        convoList.map(async ({ _id, recipient, sender, title }) => {
          const otherUserName = await other_user_in_convo(recipient, sender);
          return (
            <ul
              key={_id}
              className={styles.conversation_item}
              onClick={() =>
                select_conversation_handler(_id, recipient, sender, title)
              }
            >
              <h3>{title}</h3>
              <Text>{otherUserName}</Text>
            </ul>
          );
        })
      );
      setRenderedConvoList(updatedList);
    };

    if (convoList.length > 0) {
      fetchAndRenderConvoList();
    }
  }, [convoList]);

  return (
    <div>
      {noMsg ? (
        <h1 style={{ marginLeft: "20px" }}>No Messages</h1>
      ) : (
        <>{renderedConvoList}</>
      )}
    </div>
  );
};

export default Inbox;
