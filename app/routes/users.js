const routes = require("express").Router();
const multer = require("multer");

// const storage = multer.diskStorage({
//     destination: (req, file, cb)=> {
//         cb(null, './app/public/image');

//     },
//     filename: (req, file, cb) => {
//         const index = file.originalname.split(".").length;
//         cb(null ,Date.now() + '.' + file.originalname.split('.')[index - 1])
//     }
// })

// const upload = multer({ storage });


// controller
const controller = require("../controllers/users.controller");

// Route GET
routes.get("/", controller.getAll);
routes.get("/:id", controller.getDetail);//routes.get("/:info", controller.getDetail)

// Route POST
routes.post("/", controller.create);

// route UPDATE
routes.put("/:id",controller.updateData) ;
// route DELETE
routes.delete("/:id", controller.DeleteData)
// route IMAGE
// routes.put("/image/:id", upload.single('avatar'),controller.updateImagesUser);
// ROUTE PATCH
routes.patch("/avatar", controller.changeAvatar)

module.exports = routes; 