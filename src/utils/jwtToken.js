import { User } from "../models/user.model.js";
const generateJwtToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.GenerateAcessToken();
    return accessToken;
  } catch (error) {
    throw new ApiError(
      500,
      "something went wrong while generating access token"
    );
  }
};
export { generateJwtToken };
