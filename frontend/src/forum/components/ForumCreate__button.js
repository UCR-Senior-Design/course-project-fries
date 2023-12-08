import React, { useEffect, useContext } from "react";
import './ForumCreate_button.css';

const ForumCreate_button = (props) => {

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

export default ForumCreate_button;