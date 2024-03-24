import { Router } from "express";
import {
  addNewAdmin,
  getAllDoctors,
  getCurrentUser,
  login,
  logoutAdmin,
  logoutPatient,
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
router.route("/doctors").get(getAllDoctors);
router.route("/admin/me").get(isAdminAuthenticated, getCurrentUser);
router.route("/patient/me").get(isPatientAuthenticated, getCurrentUser);
router.route("/admin/logout").get(isAdminAuthenticated, logoutAdmin);
router.route("/patient/logout").get(isPatientAuthenticated, logoutPatient);

export default router;
