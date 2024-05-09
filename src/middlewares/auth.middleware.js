// middleware
// verifies user is there or not.

import jwt from "jsonwebtoken";
import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

// access and refresh token given to user.
// on bases of these tokens verify user.
// if users have correct tokens then add object in req - req.user.

export const verifyJWT = asyncHandler(async(req, res, next)=> {
    try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "")
 
    if(!token){
        throw new ApiError(401, "Unauthorized request")
    }
 
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
 
    const user = await User.findById(decodedToken?._id).select("-password -refreshToken")
 
    if(!user){
        throw new ApiError(401, "invalid Access Token")
    }
 
    req.user = user;
    next()
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token")
    }
    
})