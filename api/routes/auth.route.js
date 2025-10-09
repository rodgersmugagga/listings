import express from 'express';
import { signin, logout, signup, google } from '../controllers/auth.controller.js';

const router = express.Router();



router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);
router.post("/google", google); // Reuse signin controller for Google OAuth 

export default router;