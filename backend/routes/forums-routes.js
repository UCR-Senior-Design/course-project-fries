const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const forumController = require("../controllers/forum-controller");


// GET forum by Creator
router.get(
    "/forumCreator/:username",
    [
        check('username')
            .not()
            .isEmpty()
    ],
    forumController.getForumByCreator
);

// GET forum by Headline
router.get(
    "/forumHeadline",
    forumController.getForumByHeadline
);

// GET forum by Topic
router.get(
    "/forumTopic/:topic",
    forumController.getForumByTopic
)

// GET forum list
router.get(
    "/forumList",
    forumController.getForumList
);

// GET forum by Id
router.get(
  "/:fid",
  [
    check('fid')
        .not()
        .isEmpty()
  ],
  forumController.getForumById
);

// Patch forum
router.patch(
    "/editForum/:fid",
    [
      check('fid')
        .not()
        .isEmpty()
    ],
    forumController.updateForum
);

// Delete forum
router.delete(
    "/deleteForum/:fid",
    [
      check('fid')
        .not()
        .isEmpty()
    ],
    forumController.deleteForum
);

// POST forum
router.post(
  "/",
  [
    check("user")
      .not()
      .isEmpty(), 
    check("headline")
      .not()
      .isEmpty(), 
    check("topic")
      .not()
      .isEmpty()
  ],
  forumController.createForum
);

module.exports = router;
