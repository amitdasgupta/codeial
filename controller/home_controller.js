const Post = require("../model/post");
const User = require("../model/users");

module.exports.home = async function(req, res) {
  try {
    // code to populate user and comments of each post also comments user is also poulated here
    //CHANGE::populate the likes of each post and comment
    let post = await Post.find({})
      .sort("-createdAt")
      .populate("user", "-password")
      .populate({
        path: "comments",
        populate: {
          path: "user",
          select: "-password"
        }
      })
      .populate("likes")
      .populate({
        path: "comments",
        populate: {
          path: "likes"
        }
      });

    let user = await User.find({});

    return res.render("home", {
      title: "Codeial | Home",
      posts: post,
      all_users: user
    });
  } catch (err) {
    console.log(err);
    return;
  }
};
