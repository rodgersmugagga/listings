import express from 'express';
import { createListing, deleteListing, updateListing, getListing } from '../controllers/listing.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';

const router = express.Router();

router.post('/create', authMiddleware, createListing);
router.delete('/delete/:id', authMiddleware, deleteListing);
router.post('/update/:id', authMiddleware, updateListing);
router.get('/get/:id', getListing);

export default router;