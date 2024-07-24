import express from 'express';
import { addNewAdmin, getAllDoctors, getUserDetails, login, adminLogout, patientRegister, patientLogout, addNewDoctor } from '../controller/userController.js';
import {isAdminAuthenticated, isPatientAuthenticated} from '../middlewares/auth.js';

const router = express.Router();


router.post("/patient/register", patientRegister);
router.post("/login", login);
router.post("/admin/newadmin", isAdminAuthenticated, addNewAdmin);
router.get("/doctors", getAllDoctors);
router.get("/admin/me", isAdminAuthenticated, getUserDetails);
router.get("/patient/me", isPatientAuthenticated, getUserDetails);
router.get("/admin/logout", isAdminAuthenticated, adminLogout );
router.get("/patient/logout", isPatientAuthenticated, patientLogout);
router.post("/doctor/addnewdoc", isAdminAuthenticated, addNewDoctor)
 
export default router;