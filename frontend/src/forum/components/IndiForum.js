import React, { useEffect, useState } from "react";
import Modal from "./common/Modal";
import CommentItem from "./CommentItem";

const IndiForum = (props) => {
  const [commentList, setCommentList] = useState([]);

  const deleteIndiForumHandler = (indiForumIdP) => {
    props.onDelete(indiForumIdP);
    props.onCancel();
  };

  const closeIndiForumhandler = (event) => {
    props.onCancel();
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
  }, []);

  return (
    <div>
      <Modal>
        <div className="indiForum__BaseContent">
          <div className="indiForum__creator">
            Creator: {props.indiForumCreator}
          </div>
          <div className="indiForum__headline">
            Headline: {props.indiForumHeadline}
          </div>
          <div className="indiForum__topic">Topic: {props.indiForumTopic}</div>
          <div className="indiForum__initComment">
            InitComment: {props.indiForumInitComment}
          </div>
          <button
            onClick={() => deleteIndiForumHandler(props.indiForumIdP)}
          >Delete Forum</button>
        </div>

        <div>
          <ul className="indiForumCommentListContainer">
            {commentList.map((comment) => (
              <CommentItem
                key={comment._id}
                cid={comment._id}
                creator={comment.creator}
                text={comment.comment_text}
                time_stamp={comment.time_stamp}
              />
            ))}
          </ul>
        </div>

        <button onClick={closeIndiForumhandler}>Close</button>
      </Modal>
    </div>
  );
};

export default IndiForum;
