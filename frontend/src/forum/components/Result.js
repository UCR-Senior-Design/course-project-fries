import React from 'react';


const keys = ['creator', 'headline', 'initComment', 'topic', 'thumbsUp', 'thumbsDown'];

const Result = (props) => (
 <div>
    {keys.map((key) => (
      <span>{key.charAt(3)}: {props[key]}</span>
    ))}
  </div>
);

export default Result;
