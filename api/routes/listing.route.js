import express from 'express';
import { createListing, deleteListing, updateListing, getListing, getListings, uploadImages, promoteListing, boostListing } from '../controllers/listing.controller.js';
import authMiddleware from '../middlewares/auth.middleware.js';
import upload from '../middlewares/multer.js';
import { validateObjectIdParam } from '../middlewares/validateObjectId.js';

const router = express.Router();

router.post('/create', authMiddleware, createListing);
router.post('/upload', authMiddleware, upload.array('images', 6), uploadImages);
router.delete('/delete/:id', authMiddleware, validateObjectIdParam('id'), deleteListing);
router.post('/update/:id', authMiddleware, validateObjectIdParam('id'), updateListing);
// Promote (owner) and webhook (server) variants
router.post('/promote/:id', authMiddleware, validateObjectIdParam('id'), promoteListing);
// webhook route — accepts server secret in headers (x-promote-secret) instead of JWT
router.post('/promote/webhook/:id', validateObjectIdParam('id'), promoteListing);

// Boost routes (short-term visibility)
router.post('/boost/:id', authMiddleware, validateObjectIdParam('id'), boostListing);
router.post('/boost/webhook/:id', validateObjectIdParam('id'), boostListing);
router.get('/get/:id', validateObjectIdParam('id'), getListing);
router.get('/get/', getListings);

export default router;