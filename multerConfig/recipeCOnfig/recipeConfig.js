const multer = require("multer");

// storage config
const storage = multer.diskStorage({
    destination:(req,file,callback)=>{
        callback(null,"./recipeImages")
    },
    filename:(req,file,callback)=>{
        const filename = `image-${Date.now()}.${file.originalname}`
        callback(null,filename)
    }
});


// filter
const filefilter = (req,file,callback)=>{
    console.log("filele",file)
    if(file.mimetype === "image/png" ||file.mimetype === "image/jpg" || file.mimetype === "image/jpeg"){
        callback(null,true)
    }else{
        callback(null,false)
        return callback(new Error("Only png jpg and Jpeg formatted allowed"))
    }
}

const recipeUpload = multer({
    storage:storage,
    fileFilter:filefilter
});

module.exports = recipeUpload;