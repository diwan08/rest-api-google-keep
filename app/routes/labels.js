const routes = require("express").Router()
const update = require("../controllers/labels.controller")
const controller = require("../controllers/labels.controller")

// route GET
routes.get("/", controller.getAll)
// routes.get("/:id", controller.getDetail)

// route POST DATA
routes.post("/", controller.create)
// route update data
routes.put("/:id" ,controller.update)

routes.delete("/:id", controller.delete)

module.exports= routes;