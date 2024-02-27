import React, { useState } from "react";
import Modal from "./common/ForumCreateModal";
import { useAuth } from "../../common/utils/auth";
import {
  Switch,
  Button,
  Form,
  Input,
 } from 'antd';
 const { TextArea } = Input;

const ForumForm = (props) => {
  const { userId, firstname, isDoctor } = useAuth(); // use userId here
  const [newForum_headline, setNewForum_headline] = useState("");
  const [newForum_topic, setNewForum_topic] = useState("");
  const [newForum_initComment, setNewForum_initComment] = useState("");
  const [newForum_anon, setNewForum_anon] = useState(false);

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
    try {
      forumData = {
        user: userId,
        firstname: firstname,
        headline: newForum_headline,
        initComment: newForum_initComment,
        topic: newForum_topic,
        anon: newForum_anon,
        isDoctor: isDoctor,
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
          <Form.Item>
            <label>Headline</label>
            <Input
              type="text"
              value={newForum_headline}
              onChange={headlineChangeHandler}
            />
          </Form.Item>
          <Form.Item>
            <label>Topic</label>
            <Input
              type="text"
              value={newForum_topic}
              onChange={topicChangeHandler}
            />
          </Form.Item>
          <Form.Item>
            <label>Initial Comment</label>
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
