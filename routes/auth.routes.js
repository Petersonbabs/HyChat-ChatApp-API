import express from "express";
import { deleteUser, login, logout, signUp, updateUser, verifyUser } from "../controllers/auth.controller.js";
import isAuthenticated from "../middleware/auth.middleware.js";
import { requestVerification } from "../services/sendEmail.nodemailer.js";

const router = express.Router()

router.route('/verify/:token').get(verifyUser)
router.route('/verify').post(requestVerification)
router.route('/signup').post(signUp)
router.route('/:id').patch(updateUser).delete( deleteUser)

router.route('/login').post(login) // login user router
router.route('/logout').post( logout) // logout user router
 // delter user account router


export default router