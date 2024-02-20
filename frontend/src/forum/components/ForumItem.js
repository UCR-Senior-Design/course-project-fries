import React, { useState, useEffect } from "react";
import "./ForumItem.css";
import IndiForum from "./IndiForum";
import { useAuth } from "../../common/utils/auth";

const ForumItem = (props) => {
  const { userId, firstname } = useAuth();
  const [disiplayIndiForum, setDisplayIndiForum] = useState(false);
  const [chosenIndiForum, setChosenIndiForum] = useState("");
  const [formattedTime, setFormattedTime] = useState("");

  useEffect(() => {
    if (props.time) {
      const date = new Date(props.time);
      const options = {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      }
      const formattedTime = date.toLocaleDateString();
      const formattedDateTime = date.toLocaleString(undefined, options);
      setFormattedTime(formattedDateTime);
    }
  }, [props.time]);

  const displayIndiForumHandler = (forumId) => {
    setDisplayIndiForum(true);
    setChosenIndiForum(forumId);
  };

  const closeIndiForumHandler = () => {
    setDisplayIndiForum(false);
  };

  const deleteForumHandler = (forumId) => {
    fetch(`http://localhost:5001/api/forums/deleteForum/${forumId}`, {
      method: "DELETE",
    }).then((response) => {
      if (!response.ok) {
        console.log("error with deleteForumHandler");
      }
      console.log(response);
      props.onDeleteForum(forumId);
    });
  };

  return (
    <li className="forum-item">
      <div className="forum-item__content">
        <div className="forum-item__info">
          {props.anon === true ? 
              <div className="forum-item__creator">anonymous</div> 
            : 
            <div className="forum-item__creator">{props.firstname}</div>
          }
          <h2 className="forum-item__headline">{props.headline}</h2>
          <h2 className="forum-item__topic">{props.topic}</h2>
          <h2 className="forum-item__initComment">{props.initComment}</h2>
          <h2 className="forum-item__rating">{props.rating} likes</h2>
          <h2>Posted: {formattedTime}</h2>
          <button
            className="forum-item__button"
            onClick={() => displayIndiForumHandler(props.fid)}
          >
            View Forum
          </button>
          {disiplayIndiForum === true && (
            <div>
              <IndiForum
                className="chosenIndiForum"
                indiForumId={chosenIndiForum}
                indiForumIdP={props.fid}
                indiForumFirstName={props.firstName}
                indiForumHeadline={props.headline}
                indiForumTopic={props.topic}
                indiForumInitComment={props.initComment}
                indiForumThumbsUp={props.thumbsUp}
                indiForumThumbsDown={props.thumbsDown}
                onCancel={closeIndiForumHandler}
                onDelete={deleteForumHandler}
                onUpdateForum={props.onUpdateForum}
                indiForum={props.indiForum}
                rating={props.rating}
                anon={props.anon}
                time={formattedTime}
                indiForumOwner={props.forumOwner}
              />
            </div>
          )}
          {props.forumOwner === userId && (
          <button onClick={() => deleteForumHandler(props.fid)}>
            Delete Forum
          </button>
          )}
        </div>
      </div>
    </li>
  );
};

export default ForumItem;
