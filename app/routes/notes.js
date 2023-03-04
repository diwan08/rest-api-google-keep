const routes = require("express").Router();
const multer = require("multer")


const { update } = require("../controllers/notes.controller");
const controller = require("../controllers/notes.controller")
routes.get("/" ,controller.getAll)

routes.post("/", controller.create)
routes.post("/:id/images", controller.addNoteImages)
routes.post("/labels", controller.noteLabel)

routes.put("/:id", controller.update)
routes.delete("/:id", controller.delete)
routes.delete("/", controller.deleteNoteLabel)


// routes.put("/avatar", controller.changeImage) 


module.exports= routes;