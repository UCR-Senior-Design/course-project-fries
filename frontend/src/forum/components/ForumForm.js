import React, { useEffect, useContext, useState } from "react";

const ForumCreate_form = (props) => {
    const [newForum_creator, setNewForum_creator] = useState("");
    const [newForum_headline, setNewForum_headline] = useState("");
    const [newForum_topic, setNewForum_topic] = useState("");

    useEffect(() => {
      if (props.creator != undefined && props.headline != undefined && props.topic != undefined) {
        setNewForum_creator(props.creator);
        setNewForum__headline(props.headline);
        setNewForum_topic(props.topic);

        fetch('http://localhost:5000/api/forums', {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify();
        });
      }
    });

    const createForumHandler = () => {
        const newForumInfo = {
            creator: newForum__creator,
            headline: newForum__headline,
            topic: newForum__topic,
        };
    };

  return (
      <button
          onClick={(e) => {
              e.preventDefault();

          }}
      >
      New Forum
      </button>
  );
};

export default ForumCreate_form;