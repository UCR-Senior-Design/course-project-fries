const express = require("express");
const { check } = require("express-validator");
const router = express.Router();
const HttpError = require("../models/http-error");
const commentController = require("../controllers/comment-controller");

// GET comments by forum_id
router.get("/", (req, res, next) => {
    console.log("GET request in places");
    res.json({ message: "Forum Route works!" });
});

router.get("/", (req, res, next) => {
    console.log("GET request in places");
    res.json({ message: "Forum Route works!" });
});
// get comments by account_id

module.exports = router;
