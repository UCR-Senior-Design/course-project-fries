import React , { useState, useEffect } from "react";
import './ForumItem.css';
import IndiForum from "./IndiForum";

const ForumItem = (props) => {
    const [disiplayIndiForum, setDisplayIndiForum] = useState(false);
    const [chosenIndiForum, setChosenIndiForum] = useState("");

    const displayIndiForumHandler = (forumId) => {
        setDisplayIndiForum(true);
        setChosenIndiForum(forumId);
    };

    const closeIndiForumHandler = () => {
        setDisplayIndiForum(false);
    };

    const deleteForumHandler = (forumId) => {
        fetch(`http://localhost:5000/api/forums/deleteForum/${forumId}`, {
            method: 'DELETE',
        })
        .then((response) => {
            if (!response.ok) {
                console.log("error with deleteForumHandler")
            }
            console.log(response);
            props.onDeleteForum(forumId);
        })
    };

    return (
        <li className='forum-item'>
            <div className='forum-item__content'>
                <div className="forum-item__info">
                    <h2 className='forum-item__creator'>{props.creator}</h2>
                    <h2 className='forum-item__headline'>{props.headline}</h2>
                    <h2 className='forum-item__topic'>{props.topic}</h2>
                    <h2 className='forum-item__initComment'>{props.initComment}</h2>
                    <button
                        className="forum-item__button"
                        onClick={() => displayIndiForumHandler(props.fid)}
                    >
                        View Forum
                    </button>
                    {disiplayIndiForum === true && (
                        <div>
                            <IndiForum className="chosenIndiForum"
                                indiForumId={chosenIndiForum}
                                indiForumCreator={props.creator}
                                indiForumHeadline={props.headline}
                                indiForumTopic={props.topic}
                                indiForumInitComment={props.initComment}
                                onCancel={closeIndiForumHandler}
                            />
                        </div>
                    )}
                    <button
                        onClick={() => deleteForumHandler(props.fid)}
                    >
                        Delete Forum
                    </button>
                </div>
            </div>
        </li>
    )
};

export default ForumItem;