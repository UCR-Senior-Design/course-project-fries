import React from "react";
import './ForumItem.css';

const ForumItem = props => {
    return (
        <li className='forum-item'>
            <div className='forum-item__content'>
                <div className="forum-item__info">
                    <h2 classname='forum-item__creator'>{props.creator}</h2>
                    <h2 classname='forum-item__headline'>{props.headline}</h2>
                    <h2 classname='forum-item__topic'>{props.topic}</h2>
                </div>
            </div>
        </li>
    )
};

export default ForumItem;