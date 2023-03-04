const routes = require("express").Router();

// midleware
const authorize = require("../middlewares/authorize")

routes.use("/v1/auth", require("./auth"));
routes.use("/v1/users",authorize, require("./users"));
routes.use("/v1/notes",authorize, require("./notes"));
routes.use("/v1/labels",authorize, require("./labels"));

module.exports = routes;