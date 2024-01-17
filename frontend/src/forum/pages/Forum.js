import React, { useEffect, useState, useContext } from "react";
import ForumList from "../components/ForumList";
import ForumForm from "../components/ForumForm";
import ForumContext from "../components/common/ForumContext";
import './Forum.css';
import NavigationBar from "../../common/components/NavBar";
import { Layout, Typography, Button } from "antd";
import { AuthContext } from "../../common/utils/auth";
const { Content } = Layout;
const { Text } = Typography;


const Forum = () => {
  const { isLoggedIn } = useContext(AuthContext);
  const { login, logout } = useContext(AuthContext);
  login();

  const [forumList, setForumList] = useState([]); // Initialize as an empty array
  const [displayForumForm, setDisplayForumForm] = useState(false);

  const displayForumFormHandler = () => {
    setDisplayForumForm(true);
  };

  const closeForumFormHandler = () => {
    setDisplayForumForm(false);
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/forums/forumList')
      .then((response) => response.json())
      .then((responseJson) => {
        if (Array.isArray(responseJson.forumList)) {
          setForumList(responseJson.forumList);
        } else {
          console.error("Invalid forumList data:", responseJson);
        }
      })
      .catch((error) => {
        console.error("Error fetching forum list:", error);
      });
  }, []);

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
      <NavigationBar isLoggedIn={isLoggedIn}/>
      <Content style ={{padding: "0 40px"}}>
        <ForumList items={forumList} />
        <button 
          className="NewForumButton"
          onClick={displayForumFormHandler}
        >New Forum</button>
        {displayForumForm === true && (
          <div>
            <ForumForm 
              onCancel={closeForumFormHandler}
            />
          </div>
        )}
      </Content>
    </Layout>
  )
};

export default Forum;