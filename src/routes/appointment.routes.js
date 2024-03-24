import { Router } from "express";
import {
  deleteAppointment,
  getAllAppointment,
  takeAppointment,
  updateAppointmentStatus,
} from "../controllers/appointment.controller.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.middleware.js";
const router = Router();

router.route("/take").post(isPatientAuthenticated, takeAppointment);
router.route("/getall").get(isAdminAuthenticated, getAllAppointment);
router.route("/update/:id").put(isAdminAuthenticated, updateAppointmentStatus);
router.route("/delete/:id").delete(isAdminAuthenticated, deleteAppointment);
export default router;
