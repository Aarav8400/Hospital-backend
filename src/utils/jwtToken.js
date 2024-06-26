import { User } from "../models/user.model.js";
import { ApiError } from "./ApiError.js";

const generateJwtToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.GenerateAcessToken();
    return accessToken;
  } catch (error) {
    console.log(error);
    throw new ApiError(
      500,
      "something went wrong while generating access token"
    );
  }
};
export { generateJwtToken };
