import multer from "multer";                        
import { CloudinaryStorage } from "multer-storage-cloudinary"; 
import cloudinary from '../utils/cloudinary.js';  // Your preconfigured Cloudinary instance

// Configure Multer to store files directly on Cloudinary
const storage = new CloudinaryStorage({
  cloudinary,                                      
  params: {
    folder: "listings_app_avatars",               
    allowed_formats: ["jpg", "png", "jpeg", "webp"], 
    transformation: [{ width: 400, height: 400, crop: "limit" }], 
  },
});

// Create Multer instance with the Cloudinary storage
const upload = multer({ storage });

// Export the Multer instance to be used in routes
export default upload;
