const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true
    },
    // include the user who commented
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    // include the post on which comment made
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post"
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Like"
      }
    ]
  },
  {
    timestamps: true
  }
);

const Comment = mongoose.model("Comment", commentSchema);
module.exports = Comment;
