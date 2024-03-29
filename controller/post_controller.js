const Post = require("../model/post");
const Comment = require("../model/comment");
const Like = require("../model/like");

module.exports.create = async function(req, res) {
  try {
    let post = await Post.create({
      content: req.body.content,
      user: req.user._id
    });
    let userPost = await Post.findById(post._id).populate("user", "-password");
    if (req.xhr) {
      return res.status(200).json({
        data: {
          post: userPost
        },
        message: "Post created!"
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
    let post = await Post.findById(req.params.id);
    // .id converting the object id into string
    if (post.user == req.user.id) {
      //CHANGE::delete the associated likes for the post and all its comments likes too
      await Like.deleteMany({ likeable: post, onModel: "Post" });
      await Like.deleteMany({ _id: { $in: post.comments } });

      post.remove();
      await Comment.deleteMany({ post: req.params.id });
      if (req.xhr) {
        return res.status(200).json({
          data: {
            post_id: req.params.id
          },
          message: "Post deleted"
        });
      }

      return res.redirect("back");
    } else {
      req.flash("error", "You can not delete this post!");
      return res.redirect("back");
    }
  } catch (err) {
    req.flash("error", err);
    return res.redirect("back");
  }
};
