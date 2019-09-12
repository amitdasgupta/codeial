const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

const User=require('../model/users');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField : 'email',
    passReqToCallback: true
    },function(req,email,password,done){
        User.findOne({email:email},function(err,user){
            if(err)
            {
                req.flash('error',err);
                return done(error);
            }
            if(!user||user.password!=password){
                req.flash('error','Invalid Uername/Password');
                return done(null,false);
            }
            return done(null,user);
        })
    }
))

// serializing the user to decide which key is to be kept in the cookies
passport.serializeUser(function(user,done){
   done(null,user.id);
});

// deserailizing user from the key in the cookies
passport.deserializeUser(function(id,done){
     User.findById(id,function(err,user){
        if(err)
        {
            console.log('error in finding user ---->passport');
            return done(error);
        }
        return done(null,user);
     });
});

// check if the user is authenticated
passport.checkAuthentication=function(req,res,next){
    // if the user is signed in then pass the request to the next function(controller's action)
    if(req.isAuthenticated()){
        return next();
    }

    // if the user is not signed in
    return res.redirect('/users/sign-in');
}

passport.setAuthenticatedUser=function(req,res,next){
    if(req.isAuthenticated()){
        // req.user contains the current sign in user from the session cookies and we are just sending it to the
        // locals for the view
        res.locals.user=req.user;
    }
    return next();
}


module.exports=passport;

