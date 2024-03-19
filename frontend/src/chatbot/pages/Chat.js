import React, {useState, useEffect} from "react";
import {Layout, Button, List, Avatar, Input} from "antd";
import axios from "axios";

import NavigationBar from "../../common/components/NavBar";
import {useHistory} from "react-router-dom";
import {useAuth} from "../../common/utils/auth";

const {Content, Footer} = Layout;

const ChatPage = () => {
  const history = useHistory();
  const {userId, isDoctor} = useAuth();

  if (isDoctor) {
    history.push('/upload');
  }

  const [messages, setMessages] = useState([]);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:5001/api/chat/query", {
        patientId: userId,
        userQuery: query,
      });

      console.log(response);

      setMessages((prevMessages) => [
        ...prevMessages,
        {type: "user", text: query},
        {type: "bot", text: response.data.result},
      ]);

      return response.data.result;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
      // setQuery("");
      setQuery("");
    }
  };

  return (
    <Layout
      className="layout"
      style={{
        height: "100vh",
        border: "none",
      }}
    >
      <NavigationBar />
      <Content>
        <div
          className="chat-window"
          style={{
            height: "80vh",
            padding: "0 75px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column-reverse",
          }}
        >
          <List
            dataSource={messages}
            renderItem={(item) => (
              <List.Item style={{ flexShrink: 0 }}> {/* To prevent shrinking of items */}
                <List.Item.Meta
                  avatar={
                    item.type === "user" ? (
                      <Avatar
                        style={{
                          backgroundColor: '#f56a00',
                        }}
                      >
                        You
                      </Avatar>
                    ) : (
                      <Avatar
                        style={{
                          backgroundColor: '#50de88',
                        }}
                      >
                        AI
                      </Avatar>
                    )
                  }
                  title={<span>{item.type === "user" ? "You" : "Chatbot"}</span>}
                  description={item.text}
                />
              </List.Item>
            )}
          />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Input.Search
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Chat with MedShare AI"
            enterButton={
              <Button type="primary" htmlType="submit" loading={loading} disabled={!query.trim()}>
                Send
              </Button>
            }
            onSearch={handleSubmit}
          />
        </div>
      </Footer>
    </Layout>
  );
};

export default ChatPage;
