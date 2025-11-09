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
  try {
    // multer will put uploaded files on req.files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }

    // Each file object from multer-storage-cloudinary typically contains `path` which is the secure URL
    const imageUrls = req.files.map((f) => f.path || f.secure_url || f.url).filter(Boolean);

    return res.status(200).json({ success: true, imageUrls });
  } catch (error) {
    next(error);
  }
};