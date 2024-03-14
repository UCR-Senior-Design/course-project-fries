import React, { useEffect, useState } from "react";
import Modal from "./common/IndiForumModal";
import CommentItem from "./CommentItem";
import CommentForm from "./CommentForm";
import { useAuth } from "../../common/utils/auth";
import { ConfigProvider, Layout, Typography, Button, theme, Flex} from "antd";
import { CloseOutlined, PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import './IndiForum.css';
const { Header, Content } = Layout;
const { Text } = Typography;

const IndiForum = (props) => {
  const { userId } = useAuth();
  const [commentList, setCommentList] = useState([]);
  const [changeInIndiForum, setChangeInIndiForum] = useState(false);
  const [displayCommentForm, setDisplayCommentForum] = useState(false);
  const [likedForum, setLikedForum] = useState(false);
  const [dislikedForum, setDislikedForum] = useState(false);

  const handleUpdateIndiForumList = () => {
    setChangeInIndiForum(true);
  }

  const deleteIndiForumHandler = (indiForumIdP) => {
    props.onDelete(indiForumIdP);
    props.onCancel();
  };

  const displayCommentFormHandler = () => {
    setDisplayCommentForum(true);
  };

  const closeCommentFormHandler = () => {
    setDisplayCommentForum(false);
  };

  const handleDeleteComment = () => {
    setChangeInIndiForum(true);
  };

  const handleUpdateForum = () => {
    props.onUpdateForum();
  };

  const closeIndiForumhandler = async (event) => {
    if (likedForum || dislikedForum) {
      let forumData;
      if (dislikedForum) {
        forumData = {
          user: props.indiForumOwner,
          firstname: props.indiForumFirstName,
          headline: props.indiForumHeadline,
          initComment: props.indiForumInitComment,
          topic: props.indiForumTopic,
          rating: props.rating - 1,
          anon: props.anon,
          isDoctor: props.isDoctor,
        }
      } else if (likedForum) {
        forumData = {
          user: props.indiForumOwner,
          firstname: props.indiForumFirstName,
          headline: props.indiForumHeadline,
          initComment: props.indiForumInitComment,
          topic: props.indiForumTopic,
          rating: props.rating + 1,
          anon: props.anon,
          isDoctor: props.isDoctor,
        }
      }
      console.log("fid: ", props.indiForumIdP);
      console.log(forumData);
      try {
        const response = await fetch(`http://localhost:5001/api/forums/editForum/${props.indiForumIdP}`, {
        method: "PATCH",
        body: JSON.stringify(forumData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("unable to patch forum");
      }
      console.log(response);
    } catch (err) {
      console.error(err);
    }
    handleUpdateForum();
    }
    props.onCancel();
  }

  const handleDislikeButton = () => {
    if (dislikedForum) {
      setDislikedForum(false);
    } else {
      setDislikedForum(true);
    }
  };

  const handleLikeButton = () => {
    if (likedForum) {
      setLikedForum(false);
    } else {
      setLikedForum(true);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:5001/api/comments/forumID/${props.indiForumId}`)
      .then((response) => response.json())
      .then((responseJson) => {
        if (Array.isArray(responseJson.commentList)) {
          setCommentList(responseJson.commentList);
        } else {
          console.error("Invalid commentList data:", responseJson);
        }
      })
      .catch((error) => {
        console.error("Error fetching comment list:", error);
      });
      setChangeInIndiForum(false);
  }, [changeInIndiForum]);

  return (
    <div className="indiForumContainer">
      <Modal>
        <ConfigProvider
          theme={{
            components: {
              Layout: {
                headerHeight: 160,
                headerBg: "#ffffff",
                headerPadding: "0 0"
              }
            }
          }}
        >
          <Layout>
            <Header
              style={{
                position: 'sticky',
                top: 0,
                zIndex: 3,
                lineHeight: 1.2,
                width: "100%",
                padding: "10px"
              }}
            >

              <div className="indiForum__BaseContent">
                {props.anon === true ? 
                  <div className="forum-item__creator">anonymous</div>
                  : <h2 className="forum-item__creator">{props.indiForumFirstName}</h2>
                }
                <div className="indiForum__headline">
                  Headline: {props.indiForumHeadline}
                </div>
                <div className="indiForum__topic">Topic: {props.indiForumTopic}</div>
                <div className="indiForum__initComment">InitComment: {props.indiForumInitComment}</div>
                <div className="indiForumRating">Rating: {props.rating}</div>
                <div className="indiForumTime">Time Posted: {props.time}</div>
                <div>
                  {dislikedForum === false && (
                    <div>
                      <button
                        className="IndiForum__thumbsUp"
                        onClick={handleLikeButton}
                      >
                        Upvote
                      </button>
                    </div>
                  )}
                  {props.indiForumOwner === userId && (
                    <Button danger
                      size="small"
                      icon={<DeleteOutlined />}
                      onClick={() => deleteIndiForumHandler(props.indiForumIdP)}
                    />
                  )}
                </div>
              </div>
            </Header>
            <Layout>
              <Content>

                <div>
                  <ul className="indiForumCommentListContainer">
                    {commentList.map((comment) => (
                      <CommentItem
                        key={comment._id}
                        cid={comment._id}
                        creator={comment.firstname}
                        text={comment.comment_text}
                        time_stamp={comment.time_stamp}
                        rating={comment.rating}
                        onCancel={closeCommentFormHandler}
                        onCreateComment={handleUpdateIndiForumList}
                        onDeleteComment={handleDeleteComment}
                        onUpdateComment={handleUpdateForum}
                        commentOwner={comment.user}
                        commentAnon={comment.anon}
                        commentIsDoctor={comment.isDoctor}
                        commentForum={props.indiForumIdP}
                      />
                    ))}
                  </ul>
                  <Button 
                    shape="circle"
                    size="large"
                    icon={<PlusOutlined />}
                    className="newCommentButton"
                    onClick={displayCommentFormHandler}
                  />
                  {displayCommentForm === true && (
                    <div>
                      <CommentForm
                        onCancel={closeCommentFormHandler}
                        onCreateComment={handleUpdateIndiForumList}
                        fid={props.indiForumIdP}
                        indiForum={props.indiForum}
                      />
                    </div>
                  )}
                </div>

                <Button danger
                  shape="circle" 
                  size="large" 
                  icon={<CloseOutlined />} 
                  onClick={closeIndiForumhandler} 
                  className="closeButton"
                />
              </Content>
            </Layout>
          </Layout>
        </ConfigProvider>
      </Modal>
    </div>
  );
};

export default IndiForum;
