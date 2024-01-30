import React, { useState } from "react";
import Modal from "./common/Modal";
import ForumContext from "./common/ForumContext";

const ForumForm = (props) => {
  const [newForum_creator, setNewForum_creator] = useState(""); // Change later for login
  const [newForum_headline, setNewForum_headline] = useState("");
  const [newForum_topic, setNewForum_topic] = useState("");
  const [newForum_initComment, setNewForum_initComment] = useState("");

  const creatorChangeHandler = (event) => {
    setNewForum_creator(event.target.value);
  };

  const headlineChangeHandler = (event) => {
    setNewForum_headline(event.target.value);
  };

  const topicChangeHandler = (event) => {
    setNewForum_topic(event.target.value);
  };

  const initCommentChangeHandler = (event) => {
    setNewForum_initComment(event.target.value);
  };

  const closeFormHandler = (event) => {
    props.onCancel();
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    props.onCancel();
    // Add if for if not editting?
    let forumData;
    try {
      forumData = {
        creator: newForum_creator,
        headline: newForum_headline,
        initComment: newForum_initComment,
        topic: newForum_topic,
      };
      console.log(`forumData: ${JSON.stringify(forumData)}`);
      try {
        const response = await fetch("http://localhost:5001/api/forums", {
          method: "POST",
          body: JSON.stringify(forumData),
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error("Unable to create new forum");
        }
        console.log(response);
        props.onCreateForum();
      } catch (err) {
        console.error(err);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Modal>
        <h2>Add Forum</h2>
        <form onSubmit={formSubmitHandler}>
          <div>
            <label>Creator</label>
            <input
              type="text"
              value={newForum_creator}
              onChange={creatorChangeHandler}
            />
          </div>
          <div>
            <label>Headline</label>
            <input
              type="text"
              value={newForum_headline}
              onChange={headlineChangeHandler}
            />
          </div>
          <div>
            <label>Topic</label>
            <input
              type="text"
              value={newForum_topic}
              onChange={topicChangeHandler}
            />
          </div>
          <div>
            <label>Initial Comment</label>
            <input
              type="text"
              value={newForum_initComment}
              onChange={initCommentChangeHandler}
            />
          </div>
          <div>
            <button onSubmit={formSubmitHandler}>Post</button>
            <button onClick={closeFormHandler}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ForumForm;
