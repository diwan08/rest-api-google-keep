const BaseError = require("./BaseEror");

// bad request
class Api400Error extends BaseError {
    constructor(massage, detail = []){
        super(400, massage, detail);
    }
}

// 
class Api401Error extends BaseError {
    constructor(massage, detail = []){
        super(401, massage, detail);
    }
}
class Api403Error extends BaseError {
    constructor(massage, detail = []){
        super(403, massage, detail);
    }
}
class Api404Error extends BaseError {
    constructor(massage, detail = []){
        super(404, massage, detail);
    }
}
class Api422Error extends BaseError {
    constructor(massage, detail = []){
        super(422, massage, detail);
    }
}

module.exports ={ Api400Error, Api401Error,Api403Error,Api404Error,Api422Error};