import React , { useState, useEffect } from "react";
import { useAuth } from "../../common/utils/auth";
import { Button } from "antd";
import { PlusSquareOutlined, DeleteOutlined } from '@ant-design/icons';
import "./IndiForum.css";

const CommentItem = (props) => {
    const { userId } = useAuth();
    const [timeSincePosted, setTimeSincePosted] = useState("");

    const calculateTimeSincePosted = () => {
        const currentTime = new Date();
        const postedTime = new Date(props.time_stamp);
        const timeDifference = currentTime - postedTime;

        if  (timeDifference < 60000) {
            setTimeSincePosted("Less than a minute ago");
        } else if (timeDifference < 3600000) {
            const minutes = Math.floor(timeDifference / 60000);
            setTimeSincePosted(`${minutes} minute${minutes > 1 ? "s" : ""} ago`);
        } else if (timeDifference < 86400000) {
            const hours = Math.floor(timeDifference / 3600000);
            setTimeSincePosted(`${hours} hour${hours > 1 ? "s" : ""} ago`);
        } else if (timeDifference < 604800000) {
            const days = Math.floor(timeDifference / 86400000);
            setTimeSincePosted(`${days} day${days > 1 ? "s" : ""} ago`);
        } else if (timeDifference <  2592000000) {
            const weeks = Math.floor(timeDifference / 604800000);
            setTimeSincePosted(`${weeks} week${weeks > 1 ? "s" : ""} ago`);
        } else if (timeDifference < 31536000000) {
            const months = Math.floor(timeDifference / 2592000000);
            setTimeSincePosted(`${months} month${months > 1 ? "s" : ""} ago`);
        } else {
            const years = Math.floor(timeDifference / 31536000000);
            setTimeSincePosted(`${years} year${years > 1 ? "s" : ""} ago`);
        }
    };

    useEffect(() => {
        calculateTimeSincePosted();
        const interval = setInterval(() => {
            calculateTimeSincePosted();
        }, 60000);
        return () => clearInterval(interval);
    }, []);

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
        <li className='commentInfo'>
            <div className='comment-item__content'>
                <div className="comment-item__info">
                    <div className='comment-item__text'>{props.text}</div>
                    {props.commentAnon === false ?
                        <div className="comment-item__creator">By {props.creator}</div>
                        : <div className="comment-item__creator">By anonymous</div>
                    }
                    <div className='comment-item__timeStamp'>{timeSincePosted}</div>
                    <div className="comment-item__rating">Rating {props.rating}</div>
                    <div>
                        <button
                            className="commentUpvoteButton"
                            onClick={() => upVoteHandler(props.cid)}
                        >
                            Helpful
                        </button>
                    </div>
                    
                    {props.commentOwner === userId && (
                    <Button danger
                        size="large"
                        icon={<DeleteOutlined/>}
                        className="commentForm_button"
                        onClick={() => deleteCommentHandler(props.cid)}
                    />
                    )}
                </div>
            </div>
        </li>
    )
};

export default CommentItem;