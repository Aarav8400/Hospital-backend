import { Router } from "express";
import { login, patientRegister } from "../controllers/user.controller.js";

const router = Router();

router.route("/patient/register").post(patientRegister);
router.route("/login").post(login);

export default router;
