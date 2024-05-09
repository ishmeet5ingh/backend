class ApiError extends Error {
    constructor(
        statusCode,
        message,
        errors=[],
        stack=""
    ){
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false
        this.errors = errors

        if(stack){
            this.stack = stack
            // get a proper stack trace ki yaha yaha in file me error hai
        }else{
            Error.captureStackTrace(this, this.constructor)
            // stack trace me uska instance pass kr diya abhi kis context me baat kr rahe ho
        }
    }
}

export {ApiError}