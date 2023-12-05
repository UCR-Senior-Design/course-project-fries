const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const forumController = require("../controllers/forum-controller");


// GET forum by Creator
router.get(
    "/forumCreator/:username",
    forumController.getForumByCreator
);

// GET forum by Headline
router.get(
    "/forumHeadline",
    forumController.getForumByHeadline
);

// GET forum by Topic
router.get(
    "/forumTopic",
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
  forumController.getForumById
);

// Patch forum
router.patch(
    "/editForum/:fid",
    forumController.updateForum
);

// Delete forum
router.delete(
    "/deleteForum/:fid",
    forumController.deleteForum
);

// POST forum
router.post(
  "/",
  [(check("creator").not().isEmpty(), check("headline").not().isEmpty(), check("topic").not().isEmpty())],
  forumController.createForum
);

module.exports = router;
