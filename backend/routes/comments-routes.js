const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const commentController = require("../controllers/comment-controller");


// GET comment list by Creator
router.get(
    "/commentCreator/:username",
    [
        check('username')
            .not()
            .isEmpty()
    ],
    commentController.getCommentListByCreator
);

// GET comment list by Forum ID
router.get(
    "/forumID/:fid",
    [
        check('fid')
            .not()
            .isEmpty()
    ],
    commentController.getCommentListByForumId
);

// GET comment by Id
router.get(
  "/commentID/:cid",
  [
    check('cid')
        .not()
        .isEmpty()
  ],
  commentController.getCommentById
);

// Patch comment
router.patch(
    "/editComment/:cid",
    [
      check('cid')
        .not()
        .isEmpty()
    ],
    commentController.updateComment
);

// Delete comment
router.delete(
    "/deleteComment/:cid",
    [
      check('cid')
        .not()
        .isEmpty()
    ],
    commentController.deleteComment
);

// POST comment
router.post(
  "/",
  [
    check("user")
      .not()
      .isEmpty(), 
    check("forumId")
      .not()
      .isEmpty(), 
    check("comment_text")
      .not()
      .isEmpty(),
  ],
  commentController.createComment
);

module.exports = router;

