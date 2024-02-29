import React , { useState, useEffect } from "react";
import { useAuth } from "../../common/utils/auth";
import "./IndiForum.css"

const CommentItem = (props) => {
    const { userId } = useAuth();

    const upVoteHandler = (cid) => {
        let commentData;
        commentData = {
            user: props.commentOwner,
            firstname: props.creator,
            forum: props.commentForum,
            comment_text: props.comment_text,
            rating: props.rating + 1,
            anon: props.commentAnon,
            isDoctor: props.isDoctor,
        }
        props.onUpdateComment();
    };

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
    };

    return (
        <li className='indiForum__BaseContent'>
            <div className='comment-item__content'>
                <div className="comment-item__info">
                    <div>Comment</div>
                    <div className='comment-item__text'>{props.text}</div>
                    {props.commentAnon === false ?
                        <div className="comment-item__creator">By {props.creator}</div>
                        : <div className="comment-item__creator">By anonymous</div>
                    }
                    <div className='comment-item__timeStamp'>{props.time_stamp}</div>
                    <div className="comment-item__rating">Rating {props.rating}</div>
                    {
                    /*
                    Change once login is completed
                    User can only delete their own comments
                    User can only upvote/downvote once per comment
                    */
                    }
                    <div>
                        <button
                            className="commentUpvoteButton"
                            onClick={() => upVoteHandler(props.cid)}
                        >
                            Helpful
                        </button>
                    </div>
                    
                    {props.commentOwner === userId && (
                    <button
                        className="commentForm_button"
                        onClick={() => deleteCommentHandler(props.cid)}
                    >
                        Delete Comment
                    </button>
                    )}
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