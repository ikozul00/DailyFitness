

exports.getPicture = function (req,res){
    console.log(req.files);
    let picture=req.files.image;
    picture.mv("./public/images/"+picture.name);

}