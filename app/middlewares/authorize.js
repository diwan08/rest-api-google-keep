require("dotenv").config();
const jwt = require("jsonwebtoken");
const { message } = require("../validation/login.schema");
const { Api401Error } = require("./erors/ApiErors");

const {JWT_SECRET_KEY} =process.env;

module.exports = (req, res, next)=>{
   try {
    const token = req.headers["authorization"];

    if(typeof token =="undefined" || token == "") {
        throw new Api401Error("invalid token")
    }

    jwt.verify(token, JWT_SECRET_KEY,(err , passed) =>{
        if (err) {
            throw new Api401Error(err, message);
        }

        req.user = passed;
        next();
    });
   } catch (error) {
        next(error);
   }
}