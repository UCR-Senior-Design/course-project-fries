import React, { useEffect, useState } from "react";
import ForumList from "../components/ForumList";
import ForumForm from "../components/ForumForm";
import ForumContext from "../components/common/ForumContext";
import "./Forum.css";
import NavigationBar from "../../common/components/NavBar";
import { Layout, Typography, Button } from "antd";
import { useAuth } from "../../common/utils/auth";
import { useHistory } from "react-router-dom";
const { Content } = Layout;
const { Text } = Typography;

const Forum = () => {
  const history = useHistory();
  const { isLoggedIn, userId, firstname, lastname, isDoctor } = useAuth(); // use userId here

  useEffect(() => {
    if (!isLoggedIn) {
      history.push("/login");
    }
  }, [isLoggedIn, history]);

  console.log("UserId", userId);
  console.log("firstName:",firstname);
  console.log("lastName:", lastname);
  console.log("isDoctor:", isDoctor);
  const [forumList, setForumList] = useState([]); // Initialize as an empty array
  const [displayForumForm, setDisplayForumForm] = useState(false);
  const [changeInForums, setChangeInForums] = useState(false);

  const displayForumFormHandler = () => {
    setDisplayForumForm(true);
  };

  const closeForumFormHandler = () => {
    setDisplayForumForm(false);
  };

  const handleDeleteForum = (deletedForumId) => {
    setChangeInForums(true);
  };

  const handleUpdateForumList = () => {
    setChangeInForums(true);
  };

  useEffect(() => {
    fetch("http://localhost:5001/api/forums/forumList")
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
    setChangeInForums(false);
  }, [changeInForums]);

  if (!isLoggedIn) {
    return (
      <Layout className="layout" style={{ height: "100vh" }}>
        <NavigationBar />
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
      {/* <NavigationBar isLoggedIn={isLoggedIn} /> */}
      <Content style={{ padding: "0 40px" }}>
        <ForumList
          items={forumList}
          onDeleteForum={handleDeleteForum}
          onUpdateForum={handleUpdateForumList}
          userId={userId}
        />
        <button className="NewForumButton" onClick={displayForumFormHandler}>
          New Forum
        </button>
        {displayForumForm === true && (
          <div>
            <ForumForm
              onCancel={closeForumFormHandler}
              onCreateForum={handleUpdateForumList}
              onUpdateForum={handleUpdateForumList}
              userId={userId}
              firstname={firstname}
              lastname={lastname}
              isDoctor={isDoctor}
            />
          </div>
        )}
      </Content>
    </Layout>
  );
};

export default Forum;
