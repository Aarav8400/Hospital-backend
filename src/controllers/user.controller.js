import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { generateAccessToken } from "../utils/jwtToken.js";

const patientRegister = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, gender, dob, role } =
    req.body;
  if (
    [firstName, lastName, email, phone, password, gender, dob, role].some(
      (field) => field?.trim() === ""
    )
  ) {
    throw new ApiError(400, "All fields are required");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(400, "user already registered");
  }
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    role,
  });
  const createdUser = await User.findById(user._id).select("-password ");
  if (!createdUser) {
    throw new ApiError(409, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "User registerd Successfully"));
});

const login = asyncHandler(async (req, res) => {
  const { email, password, role } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "please provide all details");
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "user does not exist");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(404, "Invalid user credentials ");
  }
  if (role !== user.role) {
    throw new ApiError(404, "User with this role not found ");
  }
  const accessToken = await generateAccessToken(user._id);
  const cookieName = user.role === "Admin" ? "adminToken" : "patientToken";
  const loggedInUser = await User.findById(user._id).select("-password ");
  const options = {
    httpOnly: true,
    secure: true,
  };
  return res
    .status(200)
    .cookie(cookieName, accessToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
        },
        "User Logged In Successfully"
      )
    );
});

export { patientRegister, login };
