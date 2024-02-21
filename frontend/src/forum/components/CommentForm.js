import React, { useState } from "react";
import Modal from "./common/CommentCreateModal";
import { useAuth } from "../../common/utils/auth";
import {
  Switch,
  Button,
  Form,
  Input,
} from 'antd';
const { TextArea } = Input;

const CommentForm = (props) => {
  const { userId, firstname, isDoctor } = useAuth();
  const [newComment_text, setNewComment_text] = useState("");

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
    let commentData;
    try {
      commentData = {
        user: userId,
        forumId: fid,
        comment_text: newComment_text,
        firstname: firstname,
        isDoctor: isDoctor,
        anon: false,
      }
      const response = await fetch("http://localhost:5001/api/comments", {
        method: "POST",
        body: JSON.stringify(commentData),
        headers: {
          "Content-Type": "application/json",
        },
      });
      
      if (!response.ok) {
        throw new Error("Unable to create new comment");
      }
      console.log(response);

      props.onCreateComment();

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <>
      <Modal>
        <Form
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span:14,
          }}
          layout="horizontal"
          style={{
            maxWidth:600,
          }}
        >
          <h2>Add Comment</h2>
          <Form.Item>
            <label>comment_text:</label>
            <TextArea
            rows={4}
              type="text"
              value={newComment_text}
              onChange={commentTextChangeHandler}
            />
          </Form.Item>
          <Form.Item>
            <Button onClick={formSubmitHandler}>Post</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={closeCommentFormHandler}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default CommentForm;