const Post=require('../model/post');
const User=require('../model/users');

module.exports.home=async function(req,res){
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
    
    try{
        // code to populate user and comments of each post also comments user is also poulated here
        let post=await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: {
                path: 'user'
            },
            options: { sort: { 'created_at': -1 } } 
        });

        let user=await User.find({});
        
        return res.render('home',{
            title:'Codeial | Home',
            posts:post,
            all_users:user
        });
    }catch(err){
        console.log(err);
        return;
    }
    
};
