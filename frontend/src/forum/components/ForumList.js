import React from "react";
import ForumItem from "./ForumItem";

const ForumList = (props) => {
  if (props.items.length < 1) {
    return <h2>No forums posted yet... Why not add one</h2>
  }

  return (
    <ul>
      {props.items.map(forum => (
        <ForumItem
          key={forum._id}
          creator={forum.creator}
          headline={forum.headline}
          topic={forum.topic}
        />
      ))}
    </ul>
  );
};

export default ForumList;