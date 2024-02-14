import React, { useState } from "react";
import Modal from "./common/Modal";

const CommentForm = (props) => {
  const [newComment_creator, setNewComment_creator] = useState(""); // Change later for login
  const [newComment_text, setNewComment_text] = useState("");

  const commentCreatorChangeHandler = (event) => {
    setNewComment_creator(event.target.value);
  };

  const commentTextChangeHandler = (event) => {
    setNewComment_text(event.target.value);
  };

  const closeCommentFormHandler = (event) => {
    props.onCancel();
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    props.onCancel();
    // Add if for if not editting?
    let fid;
    fid = props.fid;
    try {
      const response = await fetch("http://localhost:5001/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          creator: newComment_creator,
          forumId: fid,
          comment_text: newComment_text,
        }),
        
      });
      if (!response.ok) {
        throw new Error("Unable to create new forum");
      }
      console.log(response);

      props.onCreateComment();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <Modal>
        <h2>Add Comment</h2>
        <form onSubmit={formSubmitHandler}>
          <div>
            <label>Creator</label>
            <input
              type="text"
              value={newComment_creator}
              onChange={commentCreatorChangeHandler}
            />
          </div>
          <div>
            <label>Comment Text</label>
            <input
              type="text"
              value={newComment_text}
              onChange={commentTextChangeHandler}
            />
          </div>
          <div>
            <button onSubmit={formSubmitHandler}>Post</button>
            <button onClick={closeCommentFormHandler}>Cancel</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default CommentForm;