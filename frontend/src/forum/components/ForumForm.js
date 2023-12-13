import React, { useState } from "react";
import Modal from "./common/Modal";
import ForumContext from "./common/ForumContext";

const ForumForm = (props) => {
    //const [newForum_creator, setNewForum_creator] = useState("");
    const [newForum_headline, setNewForum_headline] = useState("");
    const [newForum_topic, setNewForum_topic] = useState("");

    const headlineChangeHandler = (event) => {
      setNewForum_headline(event.target.value);
    }

    const topicChangeHandler = (event) => {
      setNewForum_topic(event.target.value);
    }

    const closeFormHandler = (event) => {
      props.onCancel();
    }

    const formSubmitHandler = async (event) => {
      event.preventDefault();
      props.onCancel();
      
      // Add if for if not editting?
      try {
        const forumData = {
          creator: "Shrek",
          headline: newForum_headline,
          topic: newForum_topic,
        };
        console.log(forumData);
        try {
          const response = await fetch('http://localhost:5000/api/forums', {
            method: 'Post',
            body: JSON.stringify(forumData),
          });
          if (!response.ok) {
            throw new Error("Unable to create new forum");
          }
          console.log(response);

          let newForum_ID;
          const newForum = await fetch('http://localhost:5000/api/forums/forumHeadline', {
            method: 'Get',
            body: {
              headline: {newForum_headline}
            }
          });

          newForum_ID = newForum._id
          let commentData = {
            creator: "Shrek",
            forum_id: {newForum_ID},
            comment_text: "This a test"
          };
          
          try {
            response = await fetch('http://localhost:5000/api/comments', {
              method: 'Post',
              body: JSON.stringify(commentData),
            });  
          } catch (err) {
            console.error(err);
          }

        } catch (err) {
          console.error(err);
        }

      } catch (err) {
        console.error(err);
      }
    }

  return <div>
    <Modal>
      <h2>Add Forum</h2>
      <form onSubmit={formSubmitHandler}> 
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
          <button
            onClick={closeFormHandler}
          >Close</button>
        </div>
      </form>
    </Modal>
  </div>
      
};

export default ForumForm;