import React, { useState } from "react";
import Modal from "./common/Modal";
import ForumContext from "./common/ForumContext";
import {
  Switch,
  Button,
  Form,
  Input,
 } from 'antd';
 const { TextArea } = Input;

const ForumForm = (props) => {
  const [newForum_creator, setNewForum_creator] = useState(""); // Change later for login
  const [newForum_headline, setNewForum_headline] = useState("");
  const [newForum_topic, setNewForum_topic] = useState("");
  const [newForum_initComment, setNewForum_initComment] = useState("");
  const [newForum_anon, setNewForum_anon] = useState(false);

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

  const changeAnonHandler = (checked) => {
    setNewForum_anon((prevAnon) => !prevAnon);
  };

  const formSubmitHandler = async (event) => {
    event.preventDefault();
    props.onCancel();
    // Add if for if not editting?
    let forumData;
    console.log("newForum_anon", newForum_anon);
    try {
      forumData = {
        user: props.userId,
        firstname: props.firstname,
        headline: newForum_headline,
        initComment: newForum_initComment,
        topic: newForum_topic,
        anon: newForum_anon
      };
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
    console.log(`forumData: ${JSON.stringify(forumData)}`);
  };

  return (
    <>
      <Modal className="ForumFormModal">
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
          <h2>Create a new forum</h2>
          <Form.Item label="Creator">
            <Input
              type="text"
              value={newForum_creator}
              onChange={creatorChangeHandler}
            />
          </Form.Item>
          <Form.Item label="Headline">
            <Input
              type="text"
              value={newForum_headline}
              onChange={headlineChangeHandler}
            />
          </Form.Item>
          <Form.Item label="Topic">
            <Input
              type="text"
              value={newForum_topic}
              onChange={topicChangeHandler}
            />
          </Form.Item>
          <Form.Item label="Initial Comment">
            <TextArea 
              rows={4}
              type="text"
              value={newForum_initComment}
              onChange={initCommentChangeHandler}
            />
          </Form.Item>
          <Form.Item label="anonymous" valuePropName="checked">
            <Switch onChange={changeAnonHandler}/>
          </Form.Item>
          <Form.Item>
            <Button onClick={formSubmitHandler}>Submit</Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={closeFormHandler}>Cancel</Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ForumForm;
