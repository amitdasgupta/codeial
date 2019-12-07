const Comment = require("../model/comment");
const Post = require("../model/post");
const commentEmailWorker = require("../workers/comment_email_worker");
const queue = require("../config/kue");

module.exports.create = async function(req, res) {
  try {
    let post = await Post.findById(req.body.post);
    let comment = await Comment.create({
      content: req.body.content,
      user: req.user._id,
      post: req.body.post
    });
    post.comments.push(comment);
    post.save();
    let commentUser = await Comment.findById(comment._id).populate(
      "user",
      "-password"
    );

    let job = queue.create("emails", commentUser).save(function(err) {
      if (err) {
        console.log("error in creating queue");
      }
      console.log("job enqueud", job.id);
    });
    if (req.xhr) {
      return res.status(200).json({
        data: commentUser,
        message: "Comment created"
      });
    }
    return res.redirect("back");
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};

module.exports.destroy = async function(req, res) {
  try {
    let comment = await Comment.findById(req.params.id).populate("post");
    if (comment.user == req.user.id || req.user.id == comment.post.user) {
      let postId = comment.post;
      comment.remove();
      //    find post and then pull out that comment id from comments
      let post = await Post.findByIdAndUpdate(postId, {
        $pull: { comments: req.params.id }
      });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            comment_id: req.params.id
          },
          message: "Comment deleted"
        });
      }
      return res.redirect("back");
    } else {
      req.flash("error", "You can not delete comment");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
