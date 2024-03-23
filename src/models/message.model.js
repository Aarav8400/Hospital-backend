import mongoose, { Schema } from "mongoose";
import validator from "validator";
import Validator from "validator";
const messageSchema = new Schema(
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
      validate: [validator.isEmail, "Please provide a valid email"],
    },
    phone: {
      type: String,
      required: true,
      minLength: [11, "monile number must containe 11 digit"],
      maxLength: [11, "monile number must containe 11 digit"],
    },
    message: {
      type: String,
      required: true,
      minLength: [10, "messaeg number contain atleast 10 character"],
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
