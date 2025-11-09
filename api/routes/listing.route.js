import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, uploadImages } from '../controllers/listing.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';
import { validateObjectIdParam } from '../middlewares/validateObjectId.js';

const router = express.Router();

router.post('/create', authMiddleware, createListing);
router.post('/upload', authMiddleware, upload.array('images', 6), uploadImages);
router.delete('/delete/:id', authMiddleware, validateObjectIdParam('id'), deleteListing);
router.post('/update/:id', authMiddleware, validateObjectIdParam('id'), updateListing);
router.get('/get/:id', validateObjectIdParam('id'), getListing);
router.get('/get/', getListings);

export default router;