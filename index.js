const express=require('express');
const port=8000;
const app=express();

app.listen(port,function(err){
    if(err){
        console.log(`error ocuured: ${err}`);
        return;
    }
    console.log(`server running at port:${port}`);
})