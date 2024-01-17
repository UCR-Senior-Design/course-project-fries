import React , { useState, useEffect } from "react";
import './ForumItem.css';

const ForumItem = (props) => {

    return (
        <li className='forum-item'>
            <div className='forum-item__content'>
                <div className="forum-item__info">
                    <h2 className='forum-item__creator'>{props.creator}</h2>
                    <h2 className='forum-item__headline'>{props.headline}</h2>
                    <h2 className='forum-item__topic'>{props.topic}</h2>
                    <h2 className='forum-item__initComment'>{props.initComment}</h2>
                </div>
            </div>
        </li>
    )
};

export default ForumItem;