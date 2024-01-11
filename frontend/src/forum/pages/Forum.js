import React, { useEffect, useState } from "react";
import ForumList from "../components/ForumList";
import ForumForm from "../components/ForumForm";
import ForumContext from "../components/common/ForumContext";

const Forum = () => {
  const [forumList, setForumList] = useState([]); // Initialize as an empty array
  const [displayForumForm, setDisplayForumForm] = useState(false);

  const displayForumFormHandler = () => {
    setDisplayForumForm(true);
  };

  const closeForumFormHandler = () => {
    setDisplayForumForm(false);
  };

  useEffect(() => {
    fetch('http://localhost:5000/api/forums/forumList')
      .then((response) => response.json())
      .then((responseJson) => {
        if (Array.isArray(responseJson.forumList)) {
          setForumList(responseJson.forumList);
        } else {
          console.error("Invalid forumList data:", responseJson);
        }
      })
      .catch((error) => {
        console.error("Error fetching forum list:", error);
      });
  }, []);

  return <div>
    <ForumList items={forumList} />
    <button 
      onClick={displayForumFormHandler}
    >New Forum</button>
    {displayForumForm === true && (
      <div>
        <ForumForm 
          onCancel={closeForumFormHandler}
        />
      </div>
    )}
  </div>
};

export default Forum;