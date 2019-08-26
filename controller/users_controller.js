const User=require('../model/users');

module.exports.profile=function(req,res){
    return res.render('user_profile',{
        title:'Profile'
    });
}

// to render sign in page
module.exports.signin=function(req,res){
    return res.render('user_sign_in',{
           title:'Codeial | Sign In'
    });
}

// to render sign up page
module.exports.signup=function(req,res){
    return res.render('user_sign_up',{
           title:'Codeial | Sign Up'
    });
}

// get the sign up data
module.exports.create=function(req,res){
    if(req.body.password!=req.body.confirm_password){
        return res.redirect('back');
    }
    if(User.findOne({email: req.body.email},function(err,user){
        if(err){console.log('error in finding user in signing up'); return}

        if(!user)
        {
            User.create(req.body,function(err,user){
                if(err){console.log('error in creating user'); return}
                return res.redirect('/users/sign-in');
            });
        }
        else
        return res.redirect('back');
    }));
    
}

// sign in and create the seesion for the user
module.exports.createSession=function(req,res){
    //todo :create session
    return res.redirect('/');
}