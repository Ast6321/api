const multer = require("multer");
const path  = require("path");

const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,"uploads");
    },
    filename:(req,file,cb)=>{
        const uniquefilename = Date.now()+ path.extname(file.originalname);
        cb(null, uniquefilename);
    }
  
});

const fileFilter = (req,file,cb)=>{
    if(file.mimetype==="image/jpg"|| file.mimetype==="image/jpeg" || file.mimetype === "image/png"){
        cb(null,true);
    }
    else{
        cb(new Error("only jpg, png ,jpeg allowed"),false);
    }
};


const upload = multer({
    storage,
    fileFilter
});

module.exports = upload;
