import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const isAdminAuthenticated = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.adminToken;

    // console.log(token);
    if (!token) {
      throw new ApiError(401, "Admin Not Authenticated"); //unauthorized request
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.id).select("-password ");

    if (user.role !== "Admin") {
      throw new ApiError(401, `${user.role} not authorized for this resources`); //authorization ho gaya
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const isPatientAuthenticated = asyncHandler(async (req, _, next) => {
  try {
    const token = req.cookies?.patientToken;

    console.log(token);
    if (!token) {
      throw new ApiError(401, "patient Not Authenticated"); //unauthorized request
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = await User.findById(decodedToken?.id).select("-password ");

    if (user.role !== "Patient") {
      throw new ApiError(401, `${user.role} not authorized for this resources`); //authorization ho gaya
    }

    req.user = user;
    next();
  } catch (error) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});
