import jwt from "jsonwebtoken";
import { ApiError, asyncHandler } from "../utils/index.js";
import { User } from "../models/index.js"

export const auth = asyncHandler(async(req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
  
    if(!token){
      throw new ApiError(401, "Unauthorized Request");
    }
  
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
  
    const user = await User.findById(decodedToken._id).select("-password -refreshToken");
    
    if(!user){
      throw new ApiError(401, "Invalid Access Token");
    }
  
    req.user = user;
    next()
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid Access Token");
  }

})