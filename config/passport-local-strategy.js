const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;

const User=require('../model/users');

// authentication using passport
passport.use(new LocalStrategy({
    usernameField : 'email'
    },function(email,password,done){
        User.findOne({email:email},function(err,user){
            if(err)
            {
                console.log('error in finding user ---->passport');
                return done(error);
            }
            if(!user||user.password!=password){
                console.log('Invalid Uername/Password');
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

module.exports=passport;

