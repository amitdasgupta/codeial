const express=require('express');
const cookieParser= require('cookie-parser');
const port=8000;
const app=express();
const expressLayouts=require('express-ejs-layouts');
const db=require('./config/mongoose');
//used for session cookie
const session=require('express-session');
const passport=require('passport');
const passportLocal=require('./config/passport-local-strategy');

// this is used to serve post request
app.use(express.urlencoded());

app.use(cookieParser());

// to link assets folder
app.use(express.static('./assets'));

// this is putted here so that routes can know layout they are going to use
app.use(expressLayouts);
// this is done to move all styles and script at the top(extract style and script from sub pages into layout)
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);


app.set('view engine','ejs');
app.set('views','./view');

// this code is part of passportjs and express-sessio
app.use(session({
    name:'codeial',
    //TODO : change secret key before deployment in production mode
    secret:'blahsomething',
    saveUninitialized:false,
    resave:false,
    cookie:{
        maxAge:(1000*60*100)
    }
}));

app.use(passport.initialize());
app.use(passport.session());

// use express router
app.use('/',require('./routes'));

app.listen(port,function(err){
    if(err){
        console.log(`error ocuured: ${err}`);
        return;
    }
    console.log(`server running at port:${port}`);
})