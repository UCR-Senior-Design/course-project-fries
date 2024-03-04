import React, { useEffect, useState } from "react";
import ForumList from "../components/ForumList";
import ForumForm from "../components/ForumForm";
import "./Forum.css";
import NavigationBar from "../../common/components/NavBar";
import { Layout, Button, theme, Flex} from "antd";
import { PlusOutlined } from '@ant-design/icons'
const { Header, Content, Footer, Sider } = Layout;

const Forum = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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

  // if (!isLoggedIn) {
  //   return (
  //     <Layout className="layout" style={{ height: "100vh" }}>
  //       <NavigationBar />
  //       <Content
  //         style={{
  //           padding: "0 50px",
  //           display: "flex",
  //           justifyContent: "center",
  //           alignItems: "center",
  //         }}
  //       >
  //         <Text>Please login first.</Text>
  //       </Content>
  //     </Layout>
  //   );
  // }

  return (
    <Flex>
      <Layout style={{ minHeight: "100vh" }}>
        <Header
          style={{
            position: 'sticky',
            top: 0,
            zIndex: 1,
            padding: 0,
            background: colorBgContainer
          }}
        >
          <NavigationBar/>
        </Header>
        <Layout style={{ marginLeft: 55 }}>

          <Content>
            <ForumList
              items={forumList}
              onDeleteForum={handleDeleteForum}
              onUpdateForum={handleUpdateForumList}
            />
            <Button
              type="primary"
              shape="circle"
              size="large"
              style={{
                position:"fixed",
                left: "20px",
                bottom: "20px",
              }}
              vertical
              icon={<PlusOutlined />} onClick={displayForumFormHandler}
            />
            {displayForumForm === true && (
              <div>
                <ForumForm
                  onCancel={closeForumFormHandler}
                  onCreateForum={handleUpdateForumList}
                  onUpdateForum={handleUpdateForumList}
                />
              </div>
            )}
          </Content>
        </Layout>
      </Layout>
    </Flex>
  );
};

export default Forum;
