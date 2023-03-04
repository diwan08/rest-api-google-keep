const multer = require("multer");
const path = require ("path");
const fs = require("fs");
const { description } = require("../validation/create.user.schema");



module.exports= destination => {
    const storage = multer.diskStorage({
        destination: (req, file, cb)=> {
            if (!fs.existsSync(path.join(__dirname, "../../public/avatar"))) {
                fs.mkdirSync(path.join(__dirname, "../../public/avatar"));
            }
            if (!fs.existsSync(path.join(__dirname, "../../public/images"))) {
                fs.mkdirSync(path.join(__dirname, "../../public/images"));
            }
            if (destination == "user") {
                cb(null, path.join(__dirname, "../../public/avatar"))
            } else if (destination == "note"){
                cb(null, path.join(__dirname, "../../public/images"))    
            }
        },
        filename: (req, file, cb)=>{
            cb(null, Date.now().toString().concat(".", file.mimetype.split("/")[1]))
        }
    })
    
    
    // config limit and filter by
    const upload = multer({
        storage,
        limits:{
            fieldSize: "1MB"
        },
        fileFilter : (req, file, cb)=>{
            if (file.mimetype == "image/png" || file.mimetype == "image/jpeg"){
                cb(null, true);
            } else {
                cb(" file is not supported", false);
            }
        }
    })

    return upload ;
}