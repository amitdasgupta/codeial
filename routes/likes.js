const express = require("express");
const router = express.Router();
const likeController = require("../controller/like_controller");

// like/toggle/?id=abcde&type=Post
router.get("/toggle", likeController.toogleLike);

module.exports = router;
