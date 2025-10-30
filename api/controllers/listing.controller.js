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