const db     = require("../../databases");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const createUserSchema = require("../validation/create.user.schema")
const { Api422Error, Api403Error, Api404Error, Api400Error } = require("../middlewares/erors/ApiErors");
const multer = require("multer");
const { equal } = require("joi");
const fs = require("fs") 
const path = require("path")
// multer
const upload = require("../helpers/multer")("user").single("avatar");

module.exports = class UsersController {
    static async getAll(req, res, next) {
        try {
            // get data query params for pagination, query params ? params /:id
            const { page = 1, limit = 25, search = "" } = req.query;

            const users = await db("users")
                .select("id", "username", "name", "created_at", "updated_at")
                .limit(+limit)
                .offset(+limit * +page - +limit)
                .where("username", "like", `%${search}%`);

            return res.json({
                success: true,
                message: "data successfully retrieved",
                users
            });
        } catch (error) {
            next(error)
        }
    }

    static async getDetail(req, res, next) {
        try {
            // get data from params
            const { id } = req.user;

            // querying data to db
            const user = await db("users")
                .select("id", "username", "name","avatar","role", "created_at", "updated_at")
                .where({ id })
                .first();

            // check available user
            if (!user) {
                throw new Api404Error(`User whit id ${id} not found`)

            }

            return res.json({
                success: true,
                message: "data successfully retrieved",
                user
            })
        } catch (error) {
            next(error)
        }
    }

    static async create(req, res, next) {
        try {
            const roleUser = req.user.role;
            // return console.log(roleUser);
            if (roleUser == "member") {
                throw new Api403Error("User doesn't have permission")
            } else {
                const {error, value} = createUserSchema.validate(req.body);
            if (error) {
                throw new Api422Error("validation eror",error.details )
            }
            
            const { username, password, name, role } = value;
            
            // insert data to db
            await db("users")
                .insert({
                    id: crypto.randomUUID(),
                    username,
                    password: bcrypt.hashSync(password, 10),
                    name,
                    role
                });

            return res.status(201).json({
                success: true,
                message: "data user successfully created"
            });
            }
            
        } catch (error) {
           next(error)
        }
    }
    // static async updateImagesUser(req, res, next){
    //     try { 
    //         const id = req.params.id;
    //         const data = await db("users")
    //             .where({id:id})
    //             .first

    //     if (!data) {
    //         throw new Api404Error(`User whit id ${id} not found`)
    //     }else {
    //         await db("users")
    //             .update({
    //                 avatar: req.file.path
    //             })
    //             .where({id : id})
    //             return res.status(200).json({
    //                 status:true,
    //                 mesagge: "success update image user"
    //             })
    //     }
    //     } catch (error) {
    //         next(error)
    //     }
    // }
    static async updateData(req, res, next){    
        try {
            const {id} = req.params;
            
            const {username,name,password,role} = req.body;
            const roleUser = req.user.role;

            if ( roleUser == "member") {
                throw new Api403Error("User doesn't have permision");
            }
            const user= await db("users")
            .update({
                username,
                name,
                password : bcrypt.hashSync(password, 10),
                role
            })
            .where({id})
            if (!user){
                throw new Api404Error(`User whit id ${id} not found`)
            }
            return res.json({
                succes:true,
                mesagge: " succes update user"
            })
            
        } catch (error) {
            next(error)
        }
        }
    static async DeleteData(req, res, next){
            try {
                const {id} = req.params;

                const roleUser = req.user.role;

                if ( roleUser == "member") {
                    throw new Api403Error("User doesn't have permision");
                }
                
                const data= await db("users")
                .del()
                .where({ id })
                if (!data){
                    throw new Api404Error(`User whit id ${id} not found`)
                }
                return res.json({
                    succes:true,
                    mesagge: " succes delete user" 
                })
                
            } catch (error) {
                next(error)
            }
            }
    static async changeAvatar(req, res, next){
        upload(req, res, async function(err){
            try {
                if (err instanceof multer.MulterError){
                    throw new Api400Error(err.message)
                }else if (err){
                    throw new Api400Error(err)
                }

                // retrive url or split path
                const pathAvatar = req.file.path.split("\\")
                const url = pathAvatar.splice( pathAvatar.length - 2).join("/");

                // return res.json(url)
                const user = await db("users").where({id: req.user.id}).first();
                if (user.avatar != null) {
                    fs.unlinkSync(path.join(__dirname, "../../public/".concat(user.avatar)))
                }

                await db("users")
                .where({id: req.user.id})
                .update({avatar: url})
                .catch(error =>{
                    throw new Api400Error(err.message);
                })
                return res.json({
                    success: true,
                    message: " avatar succesfully changed",
                    avatar: req.get("host").concat("/",url)
                })


            } catch (error) {
               next(error) 
            }
        })
    }
    
}