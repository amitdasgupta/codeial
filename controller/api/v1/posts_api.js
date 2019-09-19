const Post=require('../../../model/post');
const Comment=require('../../../model/comment');

module.exports.index=async function(req,res){
    // here password is excluded
    let post=await Post.find({})
        .sort('-createdAt')
        .populate('user','-password')
        .populate({
            path: 'comments',
            populate: {
                path: 'user',
                select: '-password'
            },
            options: { sort: { 'created_at': -1 } } 
    });

    return res.status(200).json({
        message: "List of posts",
        posts: post
    });
}

module.exports.destroy=async function(req,res){
    try{
      let post=await Post.findById(req.params.id);
      // .id converting the object id into string
          post.remove();
          await Comment.deleteMany({post: req.params.id});
          
          return res.json(200,{
              message: "Post and associated comment deleted successfully"
          })
    }
          catch(err){
          console.log(err);
          return res.json(500,{
              message: "Internal server error"
          });
        }
}