import React, {useContext} from 'react';
import {Layout, Button, List, Avatar, Typography} from 'antd';

import NavigationBar from '../../common/components/NavBar';
import {AuthContext} from "../../common/utils/auth";

const {Content, Footer} = Layout;
const {Text} = Typography;

const Chatbot = () => {
  const {isLoggedIn} = useContext(AuthContext);
  // For test
  // const {login} = useContext(AuthContext);
  // login();

  if (!isLoggedIn) {
    return (
      <Layout className="layout" style={{ height: "100vh" }}>
        <NavigationBar isLoggedIn={isLoggedIn} />
        <Content style={{ padding: '0 50px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Text>Please login first.</Text>
        </Content>
      </Layout>
    );
  }

  return (
    <Layout className="layout" style={{height: "100vh"}}>
      <NavigationBar isLoggedIn={isLoggedIn} />
      <Content style={{padding: '0 50px'}}>
        <div className="chat-window">
          <List
            dataSource={[] /* Chat messages here */}
            renderItem={item => (
              <List.Item>
                <List.Item.Meta
                  avatar={<Avatar src="chatbot-avatar-url"/>}
                  title={<span>Chatbot</span>}
                  description="This is a message from the chatbot."
                />
              </List.Item>
            )}
          />
        </div>
      </Content>
      <Footer style={{textAlign: 'center', padding: '20px 50px'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <input
            type="text"
            placeholder="Type your message here..."
            style={{
              flex: 1,
              padding: '10px',
              border: '1px solid #d9d9d9',
              borderRadius: '4px',
              marginRight: '10px',
            }}
          />
          <Button type="primary">
            Send
          </Button>
        </div>
      </Footer>
    </Layout>
  );
}

export default Chatbot;
