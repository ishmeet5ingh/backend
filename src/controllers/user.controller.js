// Controllers are components responsible for handling incoming requests from clients, processing the data as necessary, and producing an appropriate response. 

// they act as intermediaries between the routes defined in your applicaiton and the logic that needs to be executed to fulfill those routes.


import { ApiError } from '../utils/ApiError.js'
import {asyncHandler} from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import { uploadOnCloudinary } from '../utils/cloudinary.js'
import { ApiResponse } from '../utils/ApiResponse.js'
import jwt from 'jsonwebtoken'

const generateAccessAndRereshTokens = async(userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })
        // validateBeforeSave is neccessary for the unneccessary kickins of other fields.

        return {accessToken, refreshToken}

    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating refresh and access token")
    }
}

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
   
    const {fullname, email, username,  password} = req.body


    if(
        [fullname, email, username, password].some((field)=> field?.trim() === "")
    ){
        throw new ApiError(400, "all the fields are required")
    }

    // existing user
    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })


    if(existingUser){
        throw new ApiError(409, "User with email is already exist")
    }


    const avatarLocalPath = req.files?.avatar[0]?.path
    // const coverImageLocalPath = req.files?.coverImage[0]?.path

    let coverImageLocalPath;

    // to check we have coverImage array or not.
    if(req.files && Array.isArray(req.files.coverImage) ){
        coverImageLocalPath = req.files.coverImage[0].path
    }

    // will get the path uploaded by multer.

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar file is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar file is required")
    }
   
    // creating USER on mongodb 
    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // mongodb adds a _id with each entry.

    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
        // write whatever is not required.
        // remove password and refreshtoken
    )

        
        if(!createdUser){
            throw new ApiError(500, "Something went wrong while registering the user")
        }
        
        return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})


const loginUser = asyncHandler(async(req, res)=> {
    // user details, req.body.
    // email, username, password.
    // find the user.
    // password check.
    // access and refresh token.
    // send cookie
    // return response

    const {username, email, password} = req.body

    if(!(username ||  email)){
        throw new ApiError(400, "username or email is required")
    }

    const user = await User.findOne({
    // This line queries the MongoDB database to find a single document that matches the specified criteria 
    
        $or: [{ username }, { email }]
    }) // user find

    if(!user){
        throw new ApiError(404, "User does not exist")
    }

    // -------> keep in mind don't use capital User which is object of mongodb mongoose.

    // -------> created function uses 'user' not capital one.
    
    // check password
    const isPasswordValid = await user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(401, "invalid user credentials")
    }

    const {accessToken, refreshToken} = await generateAccessAndRereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password, -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
        // by defualt cookies can be modified by anyone (fronend, backend)
        // by providing options only be modified by server.
    }
    // send it to cookies, design options

    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
        new ApiResponse(
            200,
            {
                user: loggedInUser, accessToken, refreshToken
                // case - user saving AT and RT by themself.  
            },
            "User logged in Successfully"
        )
    )
})

const logoutUser = asyncHandler(async(req, res)=> {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )
    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User Logged Out"))
})

const refreshAccessToken = asyncHandler(async(req, res)=> {
    const incomingRefreshToken = req.cookie.refreshToken || req.body.refreshToke

    if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request")
    }

   try {
     const decodedToken = jwt.verify(
         incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET
     )
 
     const user = await User.findById(decodedToken?._id)
 
     if(!user){
         throw new ApiError(401, "Invalid Refresh Token")
     }
 
     if(incomingRefreshToken !== user?.refreshToken){
         throw new ApiError(401, "Refresh token is expired or used")
     }
 
     const options = {
         httpOnly: true,
         secure: true
     }
 
     const {accessToken, newRefreshToken} = await generateAccessAndRereshTokens(user._id)
 
     return res
     .status(200)
     .cookie("accessToken", accessToken, options)
     .cookie("refreshToken", newRefreshToken, options)
     .json(
         new ApiResponse(
             200,
             {
                 accessToken, newRefreshToken, 
             },
             "Access token refreshed"
         )
     )
   } catch (error) {
        throw new ApiError(401, error?.message || "Invalid refresh token")
   }




})

export {
    registerUser,
    loginUser,
    logoutUser,
    refreshAccessToken
}

// next step is to create routes.

/*
   -> we have created a method.
   -> there is one major work of node js.
        -> method should run when a URL hits
        -> for routes make a separete folder
*/
