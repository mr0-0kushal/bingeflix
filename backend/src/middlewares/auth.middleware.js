import jwt from 'jsonwebtoken'
import { asyncHandler } from '../utils/asyncHandler.js'
import { User } from '../models/user.model.js'
import { ApiError } from '../utils/ApiError.js'
import { client } from '../db/redis.db.js'
import { ApiResponse } from '../utils/ApiResponse.js'

export const verifyJWT = asyncHandler(async (req, __, next) => {
    try {
        // console.log(req.headers)
        const authHeader = req.headers.authorization;
        // console.log(authHeader)
        const token = req.cookies.accessToken || authHeader?.replace('Bearer ', '');
        if (!token) {
            throw new ApiError(401, 'Unauthorized: You are not logged in');
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        if (!decodedToken) {
            throw new ApiError(401, 'Unauthorized: Invalid token');
        }
        const user = await User.findById(decodedToken._id).select('-password -refreshToken');
        req.user = user
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || 'Unauthorized: Invalid token or user not found');
    }
});

export const verifyOTP = asyncHandler(async (req, res, next) => {
    const { otp , email, username } = req.body
    if (!otp) {
        throw new ApiError(400, {}, "Missing!. OTP required")
    }
    const user = await User.findOne({
        $or: [{ username }, { email }]
    })
    try {
        const storedOTP = await client.get(`otp:${user.email}`)
        // console.log(storedOTP)
        if(!(parseInt(storedOTP,10) === parseInt(otp,10))){
            return res.status(400)
            .json(new ApiResponse(400, {
                message: "OTP incorrect"
            }, "Invalid OTP"))
        }
        req.user = user
        // res.status(200).json(new ApiResponse(200,{},"OTP verified"))
        next();
        // return res.status(200).json(new ApiResponse(200, {} , "OTP Verified"))
    } catch (error) {
        throw new ApiError(500, {}, error || "Error while fetching OTP")
    }
});