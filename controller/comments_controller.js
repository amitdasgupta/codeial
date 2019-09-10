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

module.exports.destroy=function(req,res){
    Comment.findById(req.params.id).populate('post').exec(function(err,comment){
        console.log('**********',comment.post.user,'**********');
        if(comment.user==req.user.id||req.user.id==comment.post.user){
           let postId=comment.post;
           comment.remove();
        //    find post and then pull out that comment id from comments
           Post.findByIdAndUpdate(postId,{ $pull: {comments: req.params.id}},function(err,post){
           return res.redirect('back');
           });
        }
        else{
            return res.redirect('back');
        }
    });
}