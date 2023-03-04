const multer = require("multer");
const path = require ("path");
const fs = require("fs")

const storage = multer.diskStorage({
    destination: (req, res, cb)=> {
        if (!fs.existsSync(path.join(__dirname, "../public/avatar"))) {
            fs.mkdirSync(path.join(__dirname, "../../public/avatar"));
        }
        cb(null, path.join(__dirname, "../public/avatar"));
    },
    filename: (req, res, cb)=>{
        cb(null, Date.now().toString().concat(".", file.mimetype.split("/")[1]))
    }
})


// config limit and filter by
const upload = multer({
    storage,
    limits:{
        fieldSize: "1mb"
    },
    fileFilter : (req, file, cb)=>{
        if (file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
            cb(null, true);
        } else {
            cb(" file is not supported", false);
        }
    }
})

module.exports= upload;