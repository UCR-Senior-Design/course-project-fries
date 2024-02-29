import React, { useEffect, useState } from "react";
import { Layout, Button, Select, Input } from "antd";
import cn from "classnames";
import styles from "./Compose.module.css";
import { CloseOutlined } from "@ant-design/icons";
const { Footer } = Layout;

const Compose = ({ onSentMessage, uid, onExit }) => {
  const [recipient, setRecipient] = useState("");
  const [title, setTitle] = useState("");
  const [enteredMessage, setEnteredMessage] = useState("");
  const [options, setOptions] = useState([]);
  const [recipError, setRecipError] = useState("");
  const [titleError, setTitleError] = useState("");

  const entered_title_handler = (event) => {
    setTitle(event.target.value);
  };
  const entered_message_handler = (event) => {
    setEnteredMessage(event.target.value);
  };

  // Load list of recipients for Select component
  useEffect(() => {
    fetch(`http://localhost:5001/api/messages/listusers/${uid}`)
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setOptions(data.users_list);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const select_recipient_handler = (value) => {
    setRecipient(value);
  };

  // Submit message
  const msg_submit_handler = async (event) => {
    event.preventDefault();
    // Save conversation to DB
    if (recipient.length > 1 || title.length > 1) {
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
    }
    if (recipient === "") {
      setRecipError("error");
    }
    if (title === "") {
      setTitleError("error");
    }
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
          <Select
            showSearch
            style={{
              width: 500,
            }}
            placeholder="Select Recipient"
            variant="borderless"
            status={recipError}
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.label ?? "").includes(input)
            }
            filterSort={(optionA, optionB) =>
              (optionA?.label ?? "")
                .toLowerCase()
                .localeCompare((optionB?.label ?? "").toLowerCase())
            }
            onChange={select_recipient_handler}
            options={options}
          />
        </div>

        <div>
          <form>
            <Input
              type="text"
              placeholder="Enter Title"
              style={{
                width: 500,
              }}
              variant="borderless"
              status={titleError}
              value={title}
              onChange={entered_title_handler}
            ></Input>
          </form>
        </div>
        <Footer
          style={{
            textAlign: "center",
            padding: "20px 50px",
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

export default Compose;
