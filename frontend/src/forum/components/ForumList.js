import React from "react";
import ForumItem from "./ForumItem";
import './ForumList.css';

const ForumList = (props, onClick) => {
  if (props.items.length < 1) {
    return <h2>No forums posted yet... Why not add one</h2>
  }
  
  return (
    <ul className='forumList__container'>
      {props.items.map(forum => (
        <ForumItem
          key={forum._id}
          fid={forum._id}
          headline={forum.headline}
          topic={forum.topic}
          initComment={forum.initComment}
          onDeleteForum={props.onDeleteForum}
          anon={forum.anon}
          rating={forum.rating}
          onUpdateForum={props.onUpdateForum}
          firstname={forum.firstname}
          time={forum.time_stamp}
          forumOwner={forum.user}
        />
      ))}
    </ul>
  );
};

export default ForumList;