import { Router } from "express";
import { loginUser, registerUser, verifyOTP } from "./user.controller.js";

const router = Router()

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/verify', verifyOTP);



export default router;