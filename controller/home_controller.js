const Post=require('../model/post');

module.exports.home=function(req,res){
    // console.log(req.cookies);
    // res.cookie('user_id',25);

    // code to show post on homepage************
    // Post.find({},function(err,post){
    //     if(err)
    //     console.log(`error in getting posts:${err}`);
    //     return res.render('home',{
    //         title:'Codeial | Home',
    //         posts:post
    //     });
    // })
    
    // code to populate user attribute with user data from database
    Post.find({}).populate('user').exec(function(err,post){
        if(err)
        console.log(`error in getting posts:${err}`);
        return res.render('home',{
            title:'Codeial | Home',
            posts:post
        });
    });
    
};
