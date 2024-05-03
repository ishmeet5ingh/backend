class ApiError extends Error {
    constructor(
        statusCode,
        message = "Someting went wrong",
        errors = [],
        stack = ""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor)
            // stack trace ke andar humne uska instance pass krdiya ki aap kis context me baat kr rahe ho.
        }
    }

}

export {ApiError}