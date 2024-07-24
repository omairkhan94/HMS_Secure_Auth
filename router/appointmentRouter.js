import express from 'express';
import { deleteAppointment, getAllAppointments, postAppointment, updateAppointmentStatus } from '../controller/appointmentController.js';
import { isAdminAuthenticated, isPatientAuthenticated } from '../middlewares/auth.js';

const router  = express.Router();

//post an appointment
router.post("/post", isPatientAuthenticated, postAppointment);
//geting all appointment
router.get("/getall", isAdminAuthenticated, getAllAppointments);
//update a specific appointment iddd
router.put("/update/:id", isAdminAuthenticated, updateAppointmentStatus);
//delete a specific appointment
router.delete("/delete/:id", isAdminAuthenticated, deleteAppointment);





export  default router;
