const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const Forum = require("../models/forum");

// Create forum
const createForum = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { creator, headline, topic } = req.body;

  const createdForum = new Forum({
    creator,
    headline,
    topic,
  });

  try {
    await createdForum.save();
  }catch (err) {
    const error = new HttpError(
      'Creating Forum failed.',
      500
    );
    return next(error);
  }

  //await createdForum.save();

  res.status(201).json({ forum: createForum });
};

// Get forum by ID
const getForumByCreator = async (req, res, next) => {
  const forumID = req.params.uuid;

  let forum;
  try {
    const forum = await Forum.findByID(forumID);
  } catch (err) {
    const error = new HttpError( 
      'Something went wrong, could not find a forum.', 
      500
    ); // Something wrong with get request
    return next(error);
  };

  if (!forum) {
    const error = new HttpError(
      'Could not find a forum with the given creator id',
      404
    ); // No forums with the given id
    return next(error);  
  }

  //res.json({ forum: forum.toObject( { getters: true }) });
};

// Get forums by topic


// Get forums by headline


// Get forums by poster

exports.createForum = createForum;