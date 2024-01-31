import React , { useState, useEffect } from "react";

const CommentItem = (props) => {
    const deleteCommentHandler = (commentId) => {
        fetch(`http://localhost:5001/api/comments/deleteComment/${commentId}`, {
            method: "DELETE",
        }).then((response) => {
            if (!response.ok) {
                console.log("error with deleteCommentHandler");
            }
            console.log(response);
            props.onDeleteComment(commentId)
        })
    }

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
                    <button
                        className="commentForm_button"
                        onClick={() => deleteCommentHandler(props.cid)}
                    >
                        Delete Comment
                    </button>
                    <button
                        className="commentForm_button"
                    >
                        Reply to {props.creator}
                    </button>
                </div>
            </div>
        </li>
    )
};

export default CommentItem;