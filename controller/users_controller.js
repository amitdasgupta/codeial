const User=require('../model/users');


module.exports.profile=function(req,res){
    if(req.cookies.user_id){
      User.findById(req.cookies.user_id,function(err,user){


        // if user cookie id is found
        if(user){
            return res.render('user_profile',{
                title:'Profile',
                user:user
            });
        }
        else{
            return res.redirect('/users/sign-in');   
        }
      });
    }
      else
      {
          return res.redirect('/users/sign-in');
      }
    
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
    // steps to authenticate
    // find the user
    if(User.findOne({email: req.body.email},function(err,user){
        if(err){console.log('error in log in user'); return}

        // handle user found
        if(user){
        // handle password which dont match
        if(user.password!=req.body.password){
            return res.redirect('back');
        }

        // handle session cretion
        res.cookie('user_id',user.id);
        return res.redirect('/users/profile');
        }
        else{
        // handle user not found
        return res.redirect('back');
        }
    }));    
}

// sign out
module.exports.signOut=function(req,res){
    res.cookie('user_id',0);
    return res.redirect('/users/sign-in');
}