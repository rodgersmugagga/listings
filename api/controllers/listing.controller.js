import Listing from "../models/listing.model.js";

export const createListing = async (req, res, next) => {
  try{
    const listing = await Listing.create(req.body);
    return res.status(201).json(listing);

  }catch(error){
    next(error);

  }
};


export const deleteListing = async (req, res, next) => {
  
  try {
    
    const userId = req.user.user.id;
    

    const listing = await Listing.findById(req.params.id);
    if(!listing){
      return res.status(404).json({ message: 'Listing not found!' });
    }

    if (userId.toString() !== listing.userRef.toString()) {
      return res.status(401).json({ message: 'You can only delete your own listing!' });
    }

    
    await Listing.findByIdAndDelete(req.params.id);

    res.status(200).json("Listing has been deleted!");

  } catch (error) {
    next(error);
    console.error(error);
    
  }

}


export const updateListing = async (req, res, next) => {
  
  try {
    
    const userId = req.user.user.id;
    

    const listing = await Listing.findById(req.params.id);
    if(!listing){
      return res.status(404).json({ message: 'Listing not found!' });
    }

    if (userId.toString() !== listing.userRef.toString()) {
      return res.status(401).json({ message: 'You can only update your own listing!' });
    }

    
    const updatedListing = await Listing.findByIdAndUpdate(req.params.id, req.body, { new: true });


    res.status(200).json({
      
      message: 'Listing updated successfully',
      updatedListing,
    });

  } catch (error) {
    next(error);
    console.error(error);
    
  }

}

export const getListing = async (req, res, next) => {
  
  try {
  
    const listing = await Listing.findById(req.params.id);
    if(!listing){
      return res.status(404).json({ message: 'Listing not found!' });
    }

    res.status(200).json(listing);

  } catch (error) {
    next(error);
    console.error(error);
    
  }

}


export const getListings = async (req, res, next) => {
  
  try {
  
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === 'false'){
      offer = { $in:[false, true] };
    }

    let furnished = req.query.furnished;

    if (furnished === undefined || furnished === 'false'){
      furnished = { $in:[false, true] };
    }

    let parking = req.query.parking;

    if (parking === undefined || parking === 'false'){
      parking = { $in:[false, true] };
    }


    let type = req.query.type;

    if (type === undefined || type === 'all'){
      type = { $in:['sale', 'rent'] };
    }


    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      name: {$regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    }).sort(
      {[sort]: order}
    ).limit(limit).skip(startIndex);

    res.status(200).json(listings);

  } catch (error) {
    next(error);
    console.error(error);
    
  }

}

// Upload images for a listing (uses multer + multer-storage-cloudinary)
export const uploadImages = async (req, res, next) => {
  const uploadedImages = [];
  
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    if (req.files.length > 6) {
      return res.status(400).json({ success: false, message: 'Maximum 6 images allowed' });
    }

    // Upload each file buffer to Cloudinary and collect secure URLs
    const uploadPromises = req.files.map(async (file) => {
      // Create data URI from buffer
      const mime = file.mimetype; // e.g. image/jpeg
      const b64 = file.buffer.toString('base64');
      const dataUri = `data:${mime};base64,${b64}`;
      const result = await (await import('../utils/cloudinary.js')).default.uploader.upload(dataUri, {
        folder: 'listings_app_images',
        transformation: [{ width: 1200, height: 800, crop: 'limit' }],
      });
      return result.secure_url || result.url;
    });

    const imageUrls = await Promise.all(uploadPromises);
    uploadedImages.push(...imageUrls);

    return res.status(200).json({ success: true, imageUrls });
  } catch (error) {
    console.error('Upload images error:', error);
    
    // If some images were uploaded before the error, attempt to clean them up
    if (uploadedImages.length > 0) {
      try {
        const cloudinary = (await import('../utils/cloudinary.js')).default;
        await Promise.all(
          uploadedImages.map(async (url) => {
            // Extract public_id from URL
            const publicId = url.split('/').slice(-1)[0].split('.')[0];
            await cloudinary.uploader.destroy(`listings_app_images/${publicId}`);
          })
        );
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }
    
    next(error);
  }
};