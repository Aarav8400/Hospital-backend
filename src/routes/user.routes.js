import { Router } from "express";
import {
  addNewAdmin,
  login,
  patientRegister,
} from "../controllers/user.controller.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/patient/register").post(patientRegister);
router.route("/login").post(login);
router.route("/admin/addnew").post(isAdminAuthenticated, addNewAdmin);

export default router;
