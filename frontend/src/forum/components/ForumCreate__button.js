import React from "react";

const ForumCreate_button = (props) => {

    // const createForumHandler = () => {
    //     const newForumInfo = {
    //         creator: newForum__creator,
    //         headline: newForum__headline,
    //         topic: newForum__topic,
    //     };
    // };

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