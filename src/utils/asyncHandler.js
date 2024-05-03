const asyncHandler = (requestHandler) => {
    (req, res, next)=> {
        Promise.resolve(requestHandler(req, res, next)).catch((err)=> next(err))
    }
}




export {asyncHandler}

// const asyncHandler1 = () => {}

// const asyncHandler2 = (func) => () => {}
// const asyncHandler4 = (func) => async () => {}
// // or
// const asyncHandler3 = (fn) => {
//     ()=>{

//     }
// }

/*
const asyncHandler = (fn) => async (req, res, next) => {
    try {
       await fn(req, res ,next)
    } catch (error) {
        res.status(err.code || 500).json({
            success: false,
            message: err.message
        })
    }
}
*/