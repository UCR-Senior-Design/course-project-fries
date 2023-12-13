import React , { useState, useEffect } from "react";
import './ForumItem.css';

const ForumItem = props => {
    const [initCommentText, setInitCommentText] = useState("");
    useEffect(() => {
        console.log("Fetching init comment for:", props.fid);
        fetch(`http://localhost:5000/api/comments/initComment/${props.fid}`)
            .then((response) => response.json())
            .then((responseJson) => {
                if(!responseJson.ok){
                    setInitCommentText("No comments yet\n");
                } else{
                    setInitCommentText(responseJson.comment_text);
                } 
            });
    }, [props.fid]);

    return (
        <li className='forum-item'>
            <div className='forum-item__content'>
                <div className="forum-item__info">
                    <h2 className='forum-item__creator'>Creator: {props.creator}</h2>
                    <h2 className='forum-item__headline'>Headline: {props.headline}</h2>
                    <h2 className='forum-item__topic'>Topic: {props.topic}</h2>
                </div>
                <p className='forum_item__initComment'>
                    initial Comment: {initCommentText}
                </p>
            </div>
        </li>
    )
};

export default ForumItem;