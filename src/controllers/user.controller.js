// Controllers are components responsible for handling incoming requests from clients, processing the data as necessary, and producing an appropriate response. 

// they act as intermediaries between the routes defined in your applicaiton and the logic that needs to be executed to fulfill those routes.


import {asyncHandler} from '../utils/asyncHandler.js'

const registerUser = asyncHandler( async(req, res)=> {
    res.status(200).json({
        message: "chai aur code"
    })
})

export {registerUser}

// next step is to create routes.

/*
   -> we have created a method.
   -> there is one major work of node js.
        -> method should run when a URL hits
        -> for routes make a separete folder
*/
