import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";

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

    const {fullname, email, password, username} = req.body
    console.log("email: ", email)

    if(
        [fullname, email, password, username].some((field)=> field === "")
    ){
        throw new ApiError(400, "All fields are required")
    }

    const existingUser = User.findOne({
        $or: [{ username }, { email }]
    })

    if(existingUser){
        throw new ApiError(409, "user is already registered")
    }

    const avatarLocalPath = req.files?.avatar[0]?.path
    const coverImageLocalPath = req.files?.coverImage[0]?.path

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required")
    }

    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)

    if(!avatar){
        throw new ApiError(400, "Avatar is required")
    }

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
    )

    if(!createdUser){
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

export {registerUser}