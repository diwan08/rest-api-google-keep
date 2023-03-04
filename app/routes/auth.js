const routes = require ("express").Router();

// controller
const controller = require("../controllers/auth.conttroller");
// route login
routes.post("/login", controller.login);

module.exports = routes;