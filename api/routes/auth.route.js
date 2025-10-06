import express from 'express';
import { signin, logout, signup } from '../controllers/auth.controller.js';

const router = express.Router();



router.post("/signup", signup);
router.post("/signin", signin);
router.post("/logout", logout);

export default router;