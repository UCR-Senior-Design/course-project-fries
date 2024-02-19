import React , { useState, useEffect } from "react";

const CommentItem = (props) => {
    const [commentsVotedOnList, setCommentsList] = useState([]);

    const upVoteHandler = (cid) => {
        if (commentsVotedOnList.includes([cid, true]) || commentsVotedOnList.includes([cid, false])) {
            alert("Already voted on this comment");
            return;
        }
        setCommentsList(prevList => [...prevList, [cid, true]]);
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
        <li className='comment-item'>
            <div className='comment-item__content'>
                <div className="comment-item__info">
                    <div>Comment</div>
                    <div className='comment-item__text'>{props.text}</div>
                    <div className='comment-item__timeStamp'>{props.time_stamp}</div>
                    <div className="comment-item__creator">By {props.creator}</div>
                    <div className="comment-item__rating">Rating {props.rating}</div>
                    {
                    /*
                    Change once login is completed
                    User can only delete their own comments
                    User can only upvote/downvote once per comment
                    */
                    }
                    {!commentsVotedOnList.includes([props.cid, true]) && (
                        <div>
                            <button
                                className="commentUpvoteButton"
                                onClick={() => upVoteHandler(props.cid)}
                            >
                                Helpful
                            </button>
                        </div>
                    )}
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