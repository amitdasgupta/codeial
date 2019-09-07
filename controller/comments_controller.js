const Comment=require('../model/comment');
const Post=require('../model/post');

module.exports.create=function(req,res){

    Post.findById(req.body.post,function(err,post){
       if(post){
            Comment.create({
                content: req.body.content,
                user: req.user._id,
                post: req.body.post 
            },function(err,comment){
                if(err){
                    console.log(`error in creating comment:${err}`);
                    return;
                }
                // it will automatically extract id and push it
                post.comments.push(comment);
                post.save();

                res.redirect('/');
            });
       }
    });

}