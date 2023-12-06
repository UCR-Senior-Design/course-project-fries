import React, { useEffect, useState } from "react";
import ForumList from "../components/ForumList";

const Forum = () => {
  const [forumList, setForumList] = useState([]); // Initialize as an empty array

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

  return <ForumList items={forumList} />;
};

export default Forum;