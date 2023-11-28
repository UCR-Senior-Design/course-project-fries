const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const Comment = require("../models/comment");


// Get comments by user
exports.getCommentsByUser = async (req, res) => {
    const { user } = req.params; 
    try {
      const comments = await Comment.find({ user: user });
      res.status(200).json(comments);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Server error" });
    }
};
  
// Get comments by forum
exports.getCommentsByForumID = async (req, res) => {
  const { forum_id } = req.params; 
  try {
    const comments = await Comment.find({ forum_id: forum_id }); // MAKE CHANGE TO COMMENT MODEL TO ADD FORUM ID
    res.status(200).json(forums);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};
  
// Get comments by time stamp?
  

// Post new comment


// Edit existing comment

