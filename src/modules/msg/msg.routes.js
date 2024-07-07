import { Router } from "express";
import authMiddleware from './../../middleware/authMiddleware.js';
import { createMessage, deleteMessage, getAllMessages, getUserProfile } from "./msg.controller.js";
const router = Router()

router.get('/profile', authMiddleware(), getUserProfile);
router.post('/message', authMiddleware(), createMessage);
router.get('/messages', authMiddleware(), getAllMessages);

router.delete('/:id', authMiddleware(), deleteMessage);



export default router;