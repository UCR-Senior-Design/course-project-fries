const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const Forum = require("../models/forum");
const Comment = require("../models/comment");

// Create forum
const createForum = async (req, res, next) => {

  const { creator, headline, topic, initComment, anon } = req.body;

  const createdForum = new Forum({
    creator,
    headline,
    topic,
    initComment,
    anon
  });

  try {
    await createdForum.save();
  } catch (err) {
    const error = new HttpError("Creating Forum failed.", 500);
    return next(error);
  }

  res.status(201).json({ forum: createForum });
};

// GET list of forums
const getForumList = async (req, res, next) => {
  let forumList;
  try {
    forumList = await Forum.find({});
  } catch (err) {
    const error = new HttpError("Could not find any forums", 500);
    return next(error);
  }

  res.json({
    forumList: forumList.map((forum) => forum.toObject({ getters: true })),
  });
};

// Get forum by ID
const getForumById = async (req, res, next) => {
  const forumID = req.params.fid;

  let forum;
  try {
    forum = await Forum.findById(forumID);
  } catch (err) {
    const error = new HttpError(
      "ID - Something went wrong, could not find a forum.",
      500
    ); // Something wrong with get request
    return next(error);
  }

  if (!forum) {
    const error = new HttpError(
      "Could not find a forum with the given creator id",
      404
    ); // No forums with the given id
    return next(error);
  }

  res.json({ forum: forum.toObject({ getters: true }) });
};

// Get forums by Creator
const getForumByCreator = async (req, res, next) => {
  const forumCreator = req.params.username;

  let forum;
  try {
    forum = await Forum.findOne({ creator: forumCreator });
  } catch (err) {
    const error = new HttpError(
      "Creator - Something went wrong, could not find a forum.",
      500
    ); // Something wrong with get request
    return next(error);
  }

  if (!forum) {
    const error = new HttpError(
      "Could not find a forum with the given username",
      404
    ); // No forums with the given id
    return next(error);
  }

  res.json({ forum: forum.toObject({ getters: true }) });
};

// Get forums by headline
const getForumByHeadline = async (req, res, next) => {
  const reqheadline = req.body.headline;

  let forum;
  try {
    forum = await Forum.findOne({ headline: reqheadline });
  } catch (err) {
    const error = new HttpError(
      "Headline - Something went wrong, could not find a forum.",
      500
    ); // Something wrong with get request
    return next(error);
  }

  if (!forum) {
    const error = new HttpError(
      "Could not find a forum with the given headline",
      404
    ); // No forums with the given id
    return next(error);
  }

  res.json({ forum: forum.toObject({ getters: true }) });
};

// Get forums by Topic
const getForumByTopic = async (req, res, next) => {
  const reqTopic = req.body.topic;

  let forum;
  try {
    forum = await Forum.findOne({ topic: reqTopic });
  } catch (err) {
    const error = new HttpError(
      "Topic - Something went wrong, could not find a forum.",
      500
    ); // Something wrong with get request
    return next(error);
  }

  if (!forum) {
    const error = new HttpError(
      "Could not find a forum with the given topic",
      404
    ); // No forums with the given id
    return next(error);
  }

  res.json({ forum: forum.toObject({ getters: true }) });
};

// Patch Forum
const updateForum = async (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    throw new HttpError("Invalid inputs passed", 422);
  }

  const { headline, topic, initComment, rating, anon } = req.body;
  const forumId = req.params.fid;

  let forum;
  try {
    forum = await Forum.findById(forumId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update forum",
      500
    );
    return next(error);
  }

  forum.headline = headline;
  forum.topic =  topic;
  forum.initComment = initComment;
  forum.rating = rating;
  forum.anon = anon;

  try {
    await forum.save();
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not update the forum",
      500
    );
    return next(error);
  }

  res.status(200).json({ forum: forum.toObject({ getters: true }) });
};

// Delete forum
const deleteForum = async (req, res, next) => {
  const forumId = req.params.fid;

  try {
    await Comment.deleteMany({ forum: forumId });
    const forum = await Forum.findById(forumId);
    if (!forum) {
      throw new HttpError("forum not found", 404);
    }
    await forum.deleteOne();
    res.status(200).json({ message: "Deleted forum and associated comments" });
  } catch (err) {
    const error = new HttpError(
      "Error with deleting comments",
      500
    );
    return next(error);
  }
};

exports.createForum = createForum;
exports.getForumById = getForumById;
exports.getForumByCreator = getForumByCreator;
exports.getForumByHeadline = getForumByHeadline;
exports.getForumByTopic = getForumByTopic;
exports.updateForum = updateForum;
exports.deleteForum = deleteForum;
exports.getForumList = getForumList;
