import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

const generateAccessAndRefreshToken = async(userId) => {
    try {
        const user = await User.findById(userId)

        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken

        await user.save({
            validateBeforeSave: false
        })

        return {accessToken, refreshToken}
    } catch (error) {
        throw new ApiError(400, "failed to generate tokens")
    }
}

const registerUser = asyncHandler(async(req, res)=> {
    // users detail
    // check existing user
    // avatarLocalPath and coverImageLocalPath
    // check avatarLocalpath
    // upload it on the cloudinary
    // check avatar
    // create user mongodb
    // check user
    // remove password, refresh token
    // return response

    const {fullname, email, username, password} = req.body

    const existingUser = await User.findOne({
        $or: [{ username }, { email }]
    })

    if(existingUser){
        throw new ApiError(401, "User already exists")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    let coverImageLocalPath
    if(req.files && Array.isArray(req.files.coverImage) ){
        coverImageLocalPath = req.files.coverImage[0].path
    }
    if(!avatarLocalPath){
        throw new ApiError(409, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(409, "Avatar is required")
    }

    const user = await User.create({
        fullname,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        username: username.toLowerCase(),
        password,
    })

    const createdUser = await User.findById(user._id).select("-password -refreshToken")

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }
    return res
    .status(201)
    .json(
        new ApiResponse(200, createdUser, "User Registed")
    )

})

const loginUser = asyncHandler(async(req, res)=> {
    const {username, email, password} = req.body

    if(!(username || email)){
        throw new ApiError(401, "Username or email is required")
    }

    const user = await User.findOne({
        $or: [{username}, {email}]
    })

    if(!user){
        throw new ApiError(401, "User not exist")
    }

    const isPasswordValid = user.isPasswordCorrect(password)

    if(!isPasswordValid){
        throw new ApiError(400, "Password not matched")
    }

    const {accessToken, refreshToken} = await generateAccessAndRefreshToken(user._id)

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

export {
    registerUser,
    loginUser
}
