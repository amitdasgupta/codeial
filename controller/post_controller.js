module.exports.posts=function(req,res){
    return res.end('<h1>My all posts</h1>');
}

module.exports.edit=function(req,res){
    return res.end('<h1>Edit post </h1>')
}