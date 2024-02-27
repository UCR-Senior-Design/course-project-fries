import React , { useState, useEffect } from "react";
import { useAuth } from "../../common/utils/auth";
import "./IndiForum.css"

const CommentItem = (props) => {
    const { userId } = useAuth();
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