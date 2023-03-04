require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const compression = require("compression");
const path = require("path")

//initialize express
const app = express();
//registering midleware
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(compression({ level: 1 }));
app.use(express.static(path.join(__dirname,"./public")))
app.use(morgan("dev"));
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "PUT","PATCH", "DELETE"],
    })
);
//registering routes
app.use(require("./app/routes"));   
// registring eror handler
app.use(require("./app/middlewares/erorHandle"));
//running server
app.listen(process.env.PORT, () => console.log("Server running on port 3000"));