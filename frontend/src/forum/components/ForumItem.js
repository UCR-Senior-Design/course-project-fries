import React , { useState, useEffect } from "react";
import './ForumItem.css';

const ForumItem = props => {

    return (
        <li className='forum-item'>
            <div className='forum-item__content'>
                <div className="forum-item__info">
                    <h2 className='forum-item__creator'>Creator: {props.creator}</h2>
                    <h2 className='forum-item__headline'>Headline: {props.headline}</h2>
                    <h2 className='forum-item__topic'>Topic: {props.topic}</h2>
                    <h2 className='forum-item__initComment'>Init Comment: {props.initComment}</h2>
                </div>
            </div>
        </li>
    )
};

export default ForumItem;