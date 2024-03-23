import mongoose, { Schema } from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [3, "First Name must contain atleast 3 characters"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [3, "last Name must contain atleast 3 characters"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [11, "mobile number must containe 11 digit"],
      maxLength: [11, "mobile number must containe 11 digit"],
    },
    dob: {
      type: Date,
      required: true,
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female"],
    },
    password: {
      type: String,
      minLength: [8, "password must contain atleast 8 character"],
      required: true,
    },
    role: {
      type: String,
      required: true,
      enum: ["Admin", "Patient", "Doctor"],
    },
    doctorDepartment: {
      type: String,
    },
    docAvatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.GenerateAcessToken = function () {
  return jwt.sign(
    //sign ke andar payload denge
    {
      id: this._id, //payload me maine id de di payload me aur kuch v de sakte hai
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET, //secret key de do jwt ka
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY, //expire kab hoga
    }
  );
};

export const User = mongoose.model("User", userSchema);
