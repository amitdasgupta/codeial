const express=require('express');
const port=8000;
const app=express();
const expressLayouts=require('express-ejs-layouts');


// to link assets folder
app.use(express.static('./assets'));

// this is putted here so that routes can know layout they are going to use
app.use(expressLayouts);
// this is done to move all styles and script at the top(extract style and script from sub pages into layout)
app.set('layout extractStyles',true);
app.set('layout extractScripts',true);



// use express router
app.use('/',require('./routes'));

app.set('view engine','ejs');
app.set('views','./view');

app.listen(port,function(err){
    if(err){
        console.log(`error ocuured: ${err}`);
        return;
    }
    console.log(`server running at port:${port}`);
})