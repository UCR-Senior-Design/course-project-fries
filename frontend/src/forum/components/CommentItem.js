import React , { useState, useEffect } from "react";

const CommentItem = (props) => {

    return (
        <li className='comment-item'>
            <div className='comment-item__content'>
                <div className="comment-item__info">
                    <div>Comment</div>
                    <div className='comment-item__text'>{props.text}</div>
                    <div className='comment-item__timeStamp'>{props.time_stamp}</div>
                    <div className="comment-item__creator">By {props.creator}</div>
                    {
                    /*
                    Change once login is completed
                    User can only delete their own comments
                    */
                    }
                    <button>
                        Delete Comment
                    </button>
                </div>
            </div>
        </li>
    )
};

export default CommentItem;