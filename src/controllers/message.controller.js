import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { Message } from "../models/message.model.js";
const sendMessage = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;
  if (!firstName || !lastName || !email || !phone || !message) {
    throw new ApiError(400, "All fields are required");
  }
  await Message.create({ firstName, lastName, email, phone, message });
  res.status(200).json({
    succees: true,
    message: "Message sent succesfully",
  });
});
export { sendMessage };
