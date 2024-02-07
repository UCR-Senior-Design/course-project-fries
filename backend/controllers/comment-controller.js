const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const { v4: uuidv4 } = require("uuid");
const Comment = require("../models/comment");


// Create comment
const createComment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { creator, forum_id, comment_text, time_stamp } = req.body;

  const createdComment = new Comment({
    creator,
    forum_id,
    comment_text,
    time_stamp,
  });

  try {
    await createdComment.save();
  }catch (err) {
    const error = new HttpError(
      'Creating Comment failed.',
      500
    );
    return next(error);
  }

  res.status(201).json({ comment: createdComment });
};

// GET list of comments by Creator
const getCommentListByCreator = async (req, res, next) => {
  let commentList;
  try {
    commentList = await Comment.find({creator: req.params.username});
  } catch (err) {
    const error = new HttpError(
      'Could not find any comments',
      500
    );
    return next(error);
  }
  res.json({ commentList: commentList.map(comment => comment.toObject({ getters: true })) });
};

// GET list of comments by forum
const getCommentListByForumId = async (req, res, next) => {
  let commentList;
  try {
    commentList = await Comment.find({forum_id: req.params.fid});
  } catch (err) {
    const error = new HttpError(
      'Could not find any comments',
      500
    );
    return next(error);
  }
  res.json({ commentList: commentList.map(comment => comment.toObject({ getters: true })) });
};

// Get comment by ID
const getCommentById = async (req, res, next) => {
  const commentID = req.params.cid;

  let comment;
  try {
    comment = await Comment.findById(commentID);
  } catch (err) {
    const error = new HttpError( 
      'ID - Something went wrong, could not find a comment.', 
      500
    ); // Something wrong with get request
    return next(error);
  }

  if (!comment) {
    const error = new HttpError(
      'Could not find a comment with the given comment id',
      404
    ); // No comments with the given id
    return next(error);  
  }

  res.json({ comment: comment.toObject( { getters: true }) });
};

// Patch Comment
const updateComment = async (req, res, next) => {
  const errors = validationResult(req);
  
  if(!errors.isEmpty()) {
    throw new HttpError(
      'Invalid inputs passed',
      422
    );
  }
  // TODO make edits update the time stamp as well
  const { comment_text, up_votes, down_votes } = req.body;
  const commentId = req.params.cid;

  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update comment',
      500
    );
    return next(error);
  }

  comment.comment_text = comment_text;
  comment.up_votes = up_votes;
  comment.down_votes = down_votes;

  try {
    await comment.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not update the comment',
      500
    );
    return next(error);
  }

  res.status(200).json({ comment: comment.toObject({ getters: true })});
};

// Delete comment
const deleteComment = async (req, res, next) => {
  const commentId = req.params.cid;
  
  let comment;
  try {
    comment = await Comment.findById(commentId);
  } catch (err) {
    const error = new HttpError(
      'Delete - Something went wrong, could not find a comment',
      500
    );
    return next(error);
  }

  try {
    await comment.deleteOne();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not delete comment',
      500
    );
    return next(error);
  }

  res.status(200).json({ message: 'Deleted comment' });
};

const getInitComment = async (req, res, next) => {
  let response;
  try {
    response = await Comment.findOne().sort({ time_stamp: 1});

    if (!response) {
      return next(new HttpError(
        'Could not find a comment', 
        404
      ));
    }
  } catch (err) {
    const error = new HttpError(
      'Could not find any comments',
      500
    );
    return next(error)
  }
  res.status(200).json(response);
};

exports.createComment = createComment;
exports.getInitComment = getInitComment;
exports.getCommentById = getCommentById;
exports.getCommentListByForumId = getCommentListByForumId;
exports.getCommentListByCreator = getCommentListByCreator;
exports.updateComment = updateComment;
exports.deleteComment = deleteComment;