const Like = require("../model/like");
const Post = require("../model/post");
const Comment = require("../model/comment");

module.exports.toogleLike = async function(req, res) {
  try {
    let likeable;
    let deleted = false;
    if (req.query.type == "Post") {
      likeable = await Post.findById(req.query.id).populate("likes");
    } else {
      likeable = await Comment.findById(req.query.id).populate("likes");
    }

    let existingLike = await Like.findOne({
      likeable: req.query.id,
      onModel: req.query.type,
      user: req.user._id
    });
    // if a like already exists then delete it
    if (existingLike) {
      likeable.likes.pull(existingLike._id);
      likeable.save();
      existingLike.remove();
      deleted = true;
    } else {
      let newLike = await Like.create({
        user: req.user._id,
        likeable: req.query.id,
        onModel: req.query.type
      });
      likeable.likes.push(newLike._id);
      likeable.save();
    }
    return res.json(200, {
      message: "Request successfull",
      data: {
        deleted
      }
    });
  } catch (error) {
    console.log(error);
    return res.json(500, {
      message: "Internal server Error"
    });
  }
};
