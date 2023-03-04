const db= require("../../databases")
const crypto = require("crypto");
const labelsSchema = require("../validation/labels.schema")
const{
    Api422Error,
    Api403Error,
    Api404Error,
} = require("../middlewares/erors/ApiErors");
const { error } = require("console");
const upload = require("../helpers/multer");


module.exports = class LabelsController {
    static async getAll(req, res, next) {
        try {
            // get data query params for pagination, query params
            const { page = 1, limit = 25, order = "asc", search = ""}= req.query;

            const labels = await db("labels as l")
                .leftJoin("users AS u", "u.id", "l.user_id")
                .select("l.id","l.name","l.created_at","l.created_at")
                .limit(+limit)
                .offset(+limit * +page - +limit)
                .orderBy("l.created_at", order)
                .where("l.name", "like", `%${search}`)
                .orWhere("l.user_id", req.user.id)
            

            return res.json({
                success: true,
                message : "data succesfully retriveid",
                labels
            })
        } catch (error) {
            next(error)
        }
    }
    
    static async getDetail(req, res , next){
        try {
            // geat data from to db
            const { id }= req.user.id

            // querying data to db
            const label = await db("labels")
                .select("id", "user_id", "name", "created_at", "updated_at")
                .where({ id })
                .first()

                // check available user
                if (!label) {
                    throw new Api404Error(`User whit id ${id} not found`)

                }
                return res.json({
                    success: true,
                    message: "data successfull retrieved",
                    label
                })
        } catch (error) {
            next(error)
        }
    }
    static async create(req, res, next){
        try {
            const {error, value}= labelsSchema.validate(req.body);
            if (error) {
                throw new Api422Error("validation error",error.details)
            }
            const { name} = value;
            await db.transaction(async function(trx){

                // insert  data to db
                await db("labels")
                    .transacting(trx)
                    .insert({
                        user_id: req.user.id,
                        name 
                    })
                    .catch(trx.rollback)

                trx.commit
            })
            return res.status(201).json({
                success: true,
                mesagge: "data label successfully created"
            })

        } catch (error) {
            next(error)
        }
    }
    static async update(req, res, next){
        try {
            const {error, value} = labelsSchema.validate(req.body)
            if (error) {
                throw new Api422Error("validation error");
            }
            
            // get data from params
            const { id } = req.params

            const label = await db("labels").where({id}).first()
            if(!label){
                throw new Api404Error("label is not found")
            }  

            await db.transaction(async function(trx){
                await db("labels")
                    .where({ id })
                    .transacting(trx)
                    .update(value)
                    .catch(trx.rollback)

                trx.commit
            })

            return res.json({
                success: true,
                message: " label successfully updated"
            })

        } catch (error) {
            next(error)
        }
    }
    static async delete(req, res, next){
        try {
            const { id } = req.params;

            const label = await db("labels").where({id}).first()
            if (!label) {
                throw new Api404Error("label is not found")
            }

            await db("labels")
            .where({id})
            .del()

            return res.json({
                success: true,
                message: "label successfuly delete"
            })
        } catch (error) {
            next(error)
        }
    }
    static async 
}