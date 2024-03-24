import { Router } from "express";
import { sendMessage } from "../controllers/message.controller.js";
import { isAdminAuthenticated } from "../middlewares/auth.middleware.js";
import { getAllMessages } from "../controllers/message.controller.js";

const router = Router();

router.route("/send").post(sendMessage);
router.route("/getall").get(isAdminAuthenticated, getAllMessages);

export default router;
