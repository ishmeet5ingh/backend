// Controllers are components responsible for handling incoming requests from clients, processing the data as necessary, and producing an appropriate response. 

// they act as intermediaries between the routes defined in your applicaiton and the logic that needs to be executed to fulfill those routes.


import { ApiError } from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'

const registerUser = asyncHandler( async(req, res)=> {
    // get user details from frontend.
    // validation - not empty.
    // check if user already exists.
    // check for images, check for avatar.
    // upload them to cloudinary, avatar.
    // create user object - create entry in db
    // remove password and refresh token field from response.
    // check for user creation.
    // return res.
    const {fullname, email, username, password} = req.body // destructure.
    console.log("email: ", email)

    if(
        [fullname, email, username, password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "All fields are mendatory")
    }

    const existedUser = User.findOne({
        $or: [{ username }, { email }] 
    })// anyone

    if(existedUser){
        throw new ApiError(409, "user with email or username already exists")
    }

    const avatarLocalPath = req.files.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path
    // will get the path uploaded by multer.

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }
   
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

})

export {
    registerUser
}

// next step is to create routes.

/*
   -> we have created a method.
   -> there is one major work of node js.
        -> method should run when a URL hits
        -> for routes make a separete folder
*/
