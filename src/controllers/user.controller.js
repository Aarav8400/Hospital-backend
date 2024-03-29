import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import { generateJwtToken } from "../utils/jwtToken.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";

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
  const accessToken = await generateJwtToken(user._id);
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

const addNewAdmin = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, password, gender, dob } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob
  ) {
    throw new ApiError(400, "All fileds are required");
  }
  const existedUser = await User.findOne({ email });
  if (existedUser) {
    throw new ApiError(
      400,
      `${existedUser.role} with this email already existed`
    );
  }
  const user = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    role: "Admin",
  });
  const createdUser = await User.findById(user._id).select("-password ");
  if (!createdUser) {
    throw new ApiError(409, "Something went wrong while registering the user");
  }
  return res
    .status(201)
    .json(
      new ApiResponse(200, createdUser, "New Admin registerd Successfully")
    );
});

const getAllDoctors = asyncHandler(async (req, res) => {
  const doctors = await User.find({ role: "Doctor" });
  return res.status(200).json({
    success: true,
    doctors,
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "user fetched successfully"));
});

const logoutAdmin = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now()),
  };
  return res
    .status(200)
    .clearCookie("adminToken", options)
    .json(new ApiResponse(200, {}, "Admin logged out SuccessFully"));
});
const logoutPatient = asyncHandler(async (req, res) => {
  const options = {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now()),
  };
  return res
    .status(200)
    .clearCookie("patientToken", options)
    .json(new ApiResponse(200, {}, "Patient logged out SuccessFully"));
});

const addNewDoctor = asyncHandler(async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    throw new ApiError(400, "Doctor avatar required");
  }
  const docAvatarLocalpath = req.files?.docAvatar[0]?.path;
  // console.log(docAvatar);
  // const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  // if (!allowedFormats.includes(docAvatar.mimetype)) {
  //   throw new ApiError(400, "file format not supported");
  // }
  console.log(docAvatarLocalpath);
  if (!docAvatarLocalpath) {
    throw new ApiError(400, "docAvatar file is required");
  }

  const {
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    doctorDepartment,
  } = req.body;
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !password ||
    !gender ||
    !dob ||
    !doctorDepartment
  ) {
    throw new ApiError(400, "please provide full details");
  }
  const isRegistered = await User.findOne({ email });
  if (isRegistered) {
    throw new ApiError(400, "User with this email already exist");
  }
  const avatar = await uploadOnCloudinary(docAvatarLocalpath);
  if (!avatar) {
    throw new ApiError(400, "error while uploading on cloudinary");
  }
  const doctor = await User.create({
    firstName,
    lastName,
    email,
    phone,
    password,
    gender,
    dob,
    doctorDepartment,
    role: "Doctor",
    docAvatar: avatar.url,
  });
  const createdUser = await User.findById(doctor._id).select("-password");
  if (!createdUser) {
    throw new ApiError(409, "Something went wrong while adding the new doctor");
  }
  return res
    .status(201)
    .json(new ApiResponse(200, createdUser, "Doctor added Successfully"));
});

export {
  patientRegister,
  login,
  addNewAdmin,
  getAllDoctors,
  getCurrentUser,
  logoutAdmin,
  logoutPatient,
  addNewDoctor,
};
