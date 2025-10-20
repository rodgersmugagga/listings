import express from 'express';
import { createListing } from '../controllers/listing.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createListing);

export default router;