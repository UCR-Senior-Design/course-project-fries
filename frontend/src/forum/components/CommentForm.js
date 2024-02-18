import React, { useState } from "react";
import Modal from "./common/Modal";
import {
  Switch,
  Button,
  Form,
  Input,
} from 'antd';
const { TextArea } = Input;

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
          <Form.Item label={"Creator"}>
            <Input
              type="text"
              value={newComment_creator}
              onChange={commentCreatorChangeHandler}
            />
          </Form.Item>
          <Form.Item label={"Comment Text"}>
            <TextArea
            rows={4}
              type="text"
              value={newComment_text}
              onChange={commentTextChangeHandler}
            />
          </Form.Item>
          <Form.Item>
            <Button onSubmit={formSubmitHandler}>Post</Button>
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