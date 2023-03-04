module.exports = (err, req, res, next) =>{
    console.log(err);
    return res.status(err.statusCode).json({
        succes: false,
        massage : err.message,
        detail: err.detail
    });
}