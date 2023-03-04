const db= require("../../databases")
const crypto = require("crypto");
const CreateNotesSchema = require("../validation/notes.schema")
const multer = require("multer")
const{
    Api422Error,
    Api403Error,
    Api404Error,
    Api400Error
} = require("../middlewares/erors/ApiErors");
const  uploads = require("../helpers/multer")("note").array("images")


module.exports = class NotesController { 
    static async addNoteImages(req, res, next){
        uploads(req, res, async function(err){
            try {
                // checking error upload
                if (err instanceof multer.MulterError) {
                    throw new Api400Error(err)
                } else if (err){
                    throw new Api400Error(err.mesagge) 
                }
                // get note id from params
                const { id } = req.params

                // insert data note images
                await db('note_images')
                    .insert(req.files.map(d =>{
                        const pathImage = d.path.split("\\")
                        const url = pathImage.splice(pathImage.length - 2).join ("/")

                        return {
                            note_id: id,
                            image: url
                        }
                    }))
                    .catch (error =>{
                        throw new Api400Error(err.mesagge)
                    })

                    return res.status(201).json({
                        success: true,
                        message: "note images successfuly added"
                    })
            } catch (error) {
                next(error)
            }
        })
    }
    static async getAll(req, res, next) {
        try {
            // get data query params for pagination, query params ? params /:id
            const { page = 1, limit = 25,order = "asc" ,search = "" } = req.query;

            // const nt = await db.select("notes.id","notes.user_id", "username", "notes.title", "notes.context")
            //     .from("notes")
            //     .leftJoin("users","users.id", "notes.user.id")
            //     .limit(+limit)
            //     .offset(+limit * +page - +limit)
                

            const notes = await db("notes AS n")
                .leftJoin("users AS u","u.id", "n.user_id")
                .select("n.id","n.title", "n.context", "n.created_at", "n.updated_at")
                .limit(+limit)
                .offset(+limit * +page - +limit)
                .orderBy("n.created_at", order)
                .where("n.title", "like", `%${search}%`)
                .orWhere("n.user_id", req.user.id)

            return res.json({
                success: true,
                message: "data successfully retrieved",
                notes
            });
        } catch (error) {
            next(error)
        }
    }

    static async create(req, res, next) {
        try {
        //     const roleUser = req.user.role;
        //     // return console.log(roleUser);
        //     if (roleUser == "member") {
        //         throw new Api403Error("User doesn't have permission")
        //     } else {
                const {error, value} = CreateNotesSchema.validate(req.body);
            if (error) {
                throw new Api422Error("validation eror",error.details )
            }
            
            const {  title, context } = value;
            await db.transaction(async function(trx){
            
            // insert data to db
            await db("notes")
                .transacting(trx)
                .insert({
                    id: crypto.randomUUID(),
                    user_id: req.user.id,
                    title,
                    context
                })
                .catch(trx.rollback)
            trx.commit
            })
            return res.status(201).json({
                success: true,
                message: "data note successfully created"
            });            
        } catch (error) {
           next(error)
        }
    }
    static async update(req, res, next) {
        try {
          // checking validation from req body
          const { error, value } = CreateNotesSchema.validate(req.body);
          if (error) {
            throw new Api422Error("validation error");
          }
    
          // get data from params
          const { id } = req.params;
    
          // checking available note
          const note = await db("notes").where({ id }).first();
          if (!note) {
            throw new Api404Error("note is not found");
          }
    
          await db.transaction(async function(trx) {
            // update data note
            await db("notes")
              .where({ id })
              .transacting(trx)
              .update(value)
              .catch(trx.rollback);
    
            trx.commit;
          });
    
          return res.json({
            success: true,
            message: "note successfully updated"
          });
        } catch (error) {
          next(error);
        }
    }
    static async delete(req, res, next){
        try {
            // get data from params
         const { id } = req.params;
    
         // checking available note
         const note = await db("notes").where({ id }).first();
         if (!note) {
           throw new Api404Error("note is not found");
         }

        await db("notes")
        .where({id})
        .del()

        return res.json({
            success: true,
            message: "note successfully delete"
        })
            
        } catch (error) {
            next (error)
        }
    }
    static async noteLabel(req, res, next) {
        try {
            const {note_id , label_id} = req.body;
            // check available notes
            const checkNote = await db("notes").where({id: note_id }).first();
            if (!checkNote) {
                throw new Api404Error("Note is not found")
            }
            const checkLabels= await db("labels").whereIn("id", label_id)
            if(checkLabels.length != label_id.length ){
                throw new Api404Error("label is not found")
            }
            // check label on note
            const checkLabelOnNotes= await db("note_labels")
                .whereIn ("label_id", label_id)
                .andWhere("note_id", note_id)

            if (checkLabelOnNotes.length) {
                throw new Api400Error("labels already axists")
            }

            await db("note_labels")
                .insert(label_id.map(function(d){
                    return{
                        note_id,
                        label_id: d
                    }
                }))
                

            return res.status(201).json({
                success: true,
                message: "data note labels succesfulkly added"
            })
        } catch (error) {
            next(error)
        }
    }
    static async deleteNoteLabel(req, res, next){
        try {
            const {note_id,label_id} = req.body; 
            const check = await db("note_labels")
            .where({note_id, label_id})
            .first();
            if (!check) {
                throw new Api404Error("data not found")
            }
   
           await db("note_labels")
           .where({note_id,label_id})
           .del()
   
           return res.json({
               success: true,
               message: "note successfully delete"
           })
        
                
        }catch (error) {
            next(error)
        }
        
            
    }
    static async getAllNoteLabel(req, res, next){
        
    }
}
