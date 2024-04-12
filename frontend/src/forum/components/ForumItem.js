import React, { useState, useEffect } from "react";
import "./ForumItem.css";
import IndiForum from "./IndiForum";
import { useAuth } from "../../common/utils/auth";
import { Button } from "antd";
import { PlusSquareOutlined, DeleteOutlined } from '@ant-design/icons';

const ForumItem = (props) => {
  const { userId } = useAuth();
  const [displayIndiForum, setDisplayIndiForum] = useState(false);
  const [chosenIndiForum, setChosenIndiForum] = useState("");
  const [formattedTime, setFormattedTime] = useState("");
  const [timeSincePosted, setTimeSincePosted] = useState("");

  const calculateTimeSincePosted = () => {
      const currentTime = new Date();
      const postedTime = new Date(props.time);
      const timeDifference = currentTime - postedTime;

      if  (timeDifference < 60000) {
          setTimeSincePosted("Less than a minute ago");
      } else if (timeDifference < 3600000) {
          const minutes = Math.floor(timeDifference / 60000);
          setTimeSincePosted(`${minutes} minute${minutes > 1 ? "s" : ""} ago`);
      } else if (timeDifference < 86400000) {
          const hours = Math.floor(timeDifference / 3600000);
          setTimeSincePosted(`${hours} hour${hours > 1 ? "s" : ""} ago`);
      } else if (timeDifference < 604800000) {
          const days = Math.floor(timeDifference / 86400000);
          setTimeSincePosted(`${days} day${days > 1 ? "s" : ""} ago`);
      } else if (timeDifference <  2592000000) {
          const weeks = Math.floor(timeDifference / 604800000);
          setTimeSincePosted(`${weeks} week${weeks > 1 ? "s" : ""} ago`);
      } else if (timeDifference < 31536000000) {
          const months = Math.floor(timeDifference / 2592000000);
          setTimeSincePosted(`${months} month${months > 1 ? "s" : ""} ago`);
      } else {
          const years = Math.floor(timeDifference / 31536000000);
          setTimeSincePosted(`${years} year${years > 1 ? "s" : ""} ago`);
      }
  };

  useEffect(() => {
      calculateTimeSincePosted();
      const interval = setInterval(() => {
          calculateTimeSincePosted();
      }, 60000);
      return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (props.time) {
      const date = new Date(props.time);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      };
      const formattedTime = date.toLocaleDateString();
      const formattedDateTime = date.toLocaleString(undefined, options);
      setFormattedTime(formattedDateTime);
    }
  }, [props.time]);

  const displayIndiForumHandler = (forumId) => {
    setDisplayIndiForum(true);
    setChosenIndiForum(forumId);
    props.buttonToggle();
  };

  const closeIndiForumHandler = () => {
    setDisplayIndiForum(false);
    props.buttonToggle();
  };

  const deleteForumHandler = (forumId) => {
    fetch(`http://localhost:5001/api/forums/deleteForum/${forumId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        console.log("error with deleteForumHandler");
      }
      props.onDeleteForum(forumId);
    });
  };

  return (
    <li className="forum-item">
      <div className="forum-item__content">
        <div className="forum-item__info">
          {props.anon === true ? (
            <div className="forum-item__creator">anonymous</div>
          ) : (
            <div className="forum-item__creator">{props.firstname}</div>
          )}
          <h2 className="forum-item__headline">{props.headline}</h2>
          <h2 className="forum-item__topic">{props.topic}</h2>
          <h2 className="forum-item__initComment">{props.initComment}</h2>
          <h2 className="forum-item__rating">{props.rating} likes</h2>
          <h2>Posted: {timeSincePosted}</h2>
          
          {displayIndiForum === true && (
            <div>
              <IndiForum
                style={{
                  zIndex: "3"
                }}
                className="chosenIndiForum"
                indiForumId={chosenIndiForum}
                indiForumIdP={props.fid}
                indiForumFirstName={props.firstname}
                indiForumHeadline={props.headline}
                indiForumTopic={props.topic}
                indiForumInitComment={props.initComment}
                onCancel={closeIndiForumHandler}
                onDelete={deleteForumHandler}
                onUpdateForum={props.onUpdateForum}
                indiForum={props.indiForum}
                rating={props.rating}
                anon={props.anon}
                time={formattedTime}
                indiForumOwner={props.forumOwner}
                isDoctor={props.isDoctor}
              />
            </div>
          )}
          { props.inIndiForum === false && (
            <Button ghost
              type="primary"
              size="large"
              icon={<PlusSquareOutlined />}
              onClick={() => displayIndiForumHandler(props.fid)}
            />
          )}
          {props.inIndiForum === false && props.forumOwner === userId && (
            <Button danger
              style={{
                zIndex: "0"
              }}
              size="large"
              onClick={() => deleteForumHandler(props.fid)}
              icon={<DeleteOutlined />}
            />
          )}
        </div>
      </div>
    </li>
  );
};

export default ForumItem;
