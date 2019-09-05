const Post=require('../model/post');

module.exports.home=function(req,res){
    // console.log(req.cookies);
    // res.cookie('user_id',25);
    Post.find({},function(err,post){
        if(err)
        console.log(`error in getting posts:${err}`);
        return res.render('home',{
            title:'Codeial | Home',
            posts:post
        });
    })
};
