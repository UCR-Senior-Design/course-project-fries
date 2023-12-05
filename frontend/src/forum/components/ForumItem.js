import React from "react";
import './ForumItem.css';

const ForumItem = props => {
    return (
        <li className='forum-item'>
            <div className='forum-item__content'>
                <div className="forum-item__info">
                    <h2>{props.creator}</h2>
                    <h2>{props.headline}</h2>
                    <h2>{props.topic}</h2>
                </div>
            </div>
        </li>
    )
};

export default ForumItem;