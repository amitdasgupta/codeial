module.exports.add=function(req,res){
    return res.end('<h1>Add friends here</h1>');
}

module.exports.delete=function(req,res){
    return res.end('<h1>Delete Friends from here</h1>')
}

module.exports.friends=function(req,res){
    return res.end('<h1>My cool friends<h1>');
}