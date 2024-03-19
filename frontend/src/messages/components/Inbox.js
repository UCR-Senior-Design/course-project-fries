import React, { useState, useEffect } from "react";
import { Typography } from "antd";
import styles from "./Inbox.module.css";

const { Text } = Typography;

const Inbox = ({ uid, onSetConvoId }) => {
  const [convoList, setConvoList] = useState([]);
  const [renderedConvoList, setRenderedConvoList] = useState([]);
  const [noMsg, setNoMsg] = useState(false);

  // Fetch all Conversations where user is either sender or recipient
  useEffect(() => {
    const fetchData = async () => {
      // Fetch conversations when the Inbox mounts
      fetch(`http://localhost:5001/api/messages/listconversations/${uid}`)
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data && data.conversation_list.length === 0) {
            setNoMsg(true);
          }
          setConvoList(data.conversation_list);
        })
        .catch((error) => {
          console.error(error);
        });
    };

    fetchData();

    const intervalId = setInterval(fetchData, 10000);

    return () => clearInterval(intervalId);
  }, []);

  // Render Thread by conversation id, pass info to Messages.js
  const select_conversation_handler = (
    _id,
    recipient,
    sender,
    title,
    otherUserName
  ) => {
    onSetConvoId(_id, recipient, sender, title, otherUserName);
  };

  // Get name of other user in conversation
  const other_user_in_convo = async (recipient, sender) => {
    try {
      const userId = recipient !== uid ? recipient : sender;

      const response = await fetch(
        `http://localhost:5001/api/messages/getuser/${userId}`
      );

      const data = await response.json();
      const concatenatedName = data.user.firstname + " " + data.user.lastname;
      return concatenatedName;
    } catch (error) {
      console.error(error);
      return "Unknown User";
    }
  };

  useEffect(() => {
    const fetchAndRenderConvoList = async () => {
      // Order by last_timestamp
      const ordered_list = [...convoList].sort(
        (a, b) => new Date(b.last_timestamp) - new Date(a.last_timestamp)
      );

      // Get other_user_in_convo for each conversation in order
      const updatedList = await Promise.all(
        ordered_list.map(
          async ({ _id, recipient, sender, title, last_timestamp }) => {
            const otherUserName = await other_user_in_convo(recipient, sender);
            return {
              id: _id,
              title,
              otherUserName,
              sender,
              recipient,
              last_timestamp,
            };
          }
        )
      );

      // Convert the ordered data to React elements
      const renderedElements = updatedList.map((item) => (
        <ul
          key={item.id}
          className={styles.conversation_item}
          onClick={() =>
            select_conversation_handler(
              item.id,
              item.recipient,
              item.sender,
              item.title,
              item.otherUserName
            )
          }
        >
          <h3>{item.title}</h3>
          <Text>{item.otherUserName}</Text>
        </ul>
      ));

      setRenderedConvoList(renderedElements);
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
