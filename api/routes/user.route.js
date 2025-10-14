import express from 'express'; 
import { test, updateUser, updateAvatar } from '../controllers/user.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

import upload from "../middlewares/multer.js";// Cloudinary upload

const router = express.Router();

router.get('/test', test);

// Update profile with optional avatar
router.patch('/update/:id', authMiddleware, upload.single('avatar'), updateUser);

// Update avatar only
router.patch("/avatar", authMiddleware, upload.single("avatar"), updateAvatar);

export default router;
