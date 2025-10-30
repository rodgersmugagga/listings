import express from 'express';
import { createListing, deleteListing, updateListing } from '../controllers/listing.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createListing);
router.delete('/delete/:id', authMiddleware, deleteListing);
router.post('/update/:id', authMiddleware, updateListing);

export default router;