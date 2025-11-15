import Listing from "../models/listing.model.js";
import { generateSeo } from '../utils/seo.js';

// Allowed categories and subcategories (must match the schema in listing.model.js)
const CATEGORY_MAP = {
  'Real Estate': ['Apartment', 'House', 'Land', 'Commercial'],
  'Vehicles': ['Car', 'Motorcycle', 'Truck', 'Bus'],
  'Electronics': ['Mobile Phone', 'Laptop', 'TV', 'Camera']
};

export const createListing = async (req, res, next) => {
  const uploadedImages = [];
  try {
    const payload = req.body || {};

    // Basic validation
    if ((!req.files || req.files.length < 1) && (!payload.imageUrls || payload.imageUrls.length < 1)) {
      return res.status(400).json({ message: 'At least one image is required.' });
    }

    if (req.files?.length > 6 || (payload.imageUrls && payload.imageUrls.length > 6)) {
      return res.status(400).json({ message: 'Maximum 6 images allowed' });
    }

    if (!payload.category || !CATEGORY_MAP[payload.category]) {
      return res.status(400).json({ message: 'Invalid or missing category.' });
    }

    if (!payload.subCategory || !CATEGORY_MAP[payload.category].includes(payload.subCategory)) {
      return res.status(400).json({ message: 'Invalid or missing subCategory for the selected category.' });
    }

    const incomingDetails = payload.details || {};
    if (payload.category === 'Real Estate') {
      if (typeof incomingDetails.bedrooms === 'undefined' || typeof incomingDetails.bathrooms === 'undefined') {
        return res.status(400).json({ message: 'Real Estate listings should include bedrooms and bathrooms in details.' });
      }
    }
    if (payload.category === 'Vehicles') {
      if (!incomingDetails.brand || !incomingDetails.model) {
        return res.status(400).json({ message: 'Vehicles should include brand and model in details.' });
      }
    }
    if (payload.category === 'Electronics') {
      if (!incomingDetails.brand) {
        return res.status(400).json({ message: 'Electronics should include brand in details.' });
      }
    }

    const userRef = req.user?.user?.id || req.user?.id || payload.userRef;
    if (!userRef) return res.status(401).json({ message: 'Missing user reference. Authenticate or include userRef.' });

    // Upload images if present
    let imageUrls = payload.imageUrls || [];
    let imagePublicIds = payload.imagePublicIds || [];

    if (req.files && req.files.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      const uploadPromises = req.files.map(async (file) => {
        const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
        const result = await cloudinary.uploader.upload(dataUri, {
          folder: 'listings_app_images',
          transformation: [{ width: 1200, height: 800, crop: 'limit' }],
        });
        return { url: result.secure_url || result.url, public_id: result.public_id };
      });

      const results = await Promise.all(uploadPromises);
      imageUrls = results.map(r => r.url);
      imagePublicIds = results.map(r => r.public_id);
      uploadedImages.push(...imagePublicIds);
    }

    const details = {
      ...incomingDetails,
      bedrooms: payload.bedrooms ?? incomingDetails.bedrooms,
      bathrooms: payload.bathrooms ?? incomingDetails.bathrooms,
      furnished: payload.furnished ?? incomingDetails.furnished,
      parking: payload.parking ?? incomingDetails.parking,
      type: payload.type ?? incomingDetails.type,
    };

    const seoData = payload.seo || generateSeo(payload.category, payload.subCategory, details, payload.address);

    const toCreate = {
      name: payload.name,
      description: payload.description,
      address: payload.address,
      regularPrice: payload.regularPrice,
      discountedPrice: payload.discountedPrice,
      offer: payload.offer || false,
      category: payload.category,
      subCategory: payload.subCategory,
      details,
      imageUrls,
      imagePublicIds,
      userRef,
      sellerEmail: req.user?.user?.email || payload.sellerEmail || undefined,
      isFeatured: payload.isFeatured || false,
      featuredUntil: payload.featuredUntil || null,
      boosted: payload.boosted || false,
      boostedUntil: payload.boostedUntil || null,
      seo: seoData,
      slug: seoData?.slug,
    };

    const listing = await Listing.create(toCreate);
    return res.status(201).json({ success: true, listing });

  } catch (error) {
    console.error('Create listing error:', error);

    // Cleanup uploaded images if error
    if (uploadedImages.length > 0) {
      try {
        const cloudinary = (await import('../utils/cloudinary.js')).default;
        await Promise.all(uploadedImages.map(pid => cloudinary.uploader.destroy(pid)));
      } catch (cleanupError) {
        console.error('Cleanup error:', cleanupError);
      }
    }

    next(error);
  }
};

// Upload images endpoint
export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: 'No images provided' });
    }

    const cloudinary = (await import('../utils/cloudinary.js')).default;
    const uploadedImages = [];

    for (const file of req.files) {
      const dataUri = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: 'listings_app_images',
        transformation: [{ width: 1200, height: 800, crop: 'limit' }],
      });
      uploadedImages.push({
        url: result.secure_url || result.url,
        public_id: result.public_id,
      });
    }

    // Normalize response to be friendly to multiple frontends
    const imageUrls = uploadedImages.map(i => i.url);
    const publicIds = uploadedImages.map(i => i.public_id);

    return res.status(200).json({ success: true, images: uploadedImages, imageUrls, publicIds });
  } catch (error) {
    console.error('Upload images error:', error);
    next(error);
  }
};

// Delete listing
export const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check authorization
    if (listing.userRef.toString() !== (req.user?.user?.id || req.user?.id)) {
      return res.status(403).json({ message: 'You can only delete your own listings' });
    }

    // Delete images from Cloudinary
    if (listing.imagePublicIds && listing.imagePublicIds.length > 0) {
      const cloudinary = (await import('../utils/cloudinary.js')).default;
      await Promise.all(
        listing.imagePublicIds.map(pid => cloudinary.uploader.destroy(pid).catch(() => {}))
      );
    }

    await Listing.findByIdAndDelete(req.params.id);
    return res.status(200).json({ success: true, message: 'Listing deleted' });
  } catch (error) {
    console.error('Delete listing error:', error);
    next(error);
  }
};

// Update listing
export const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check authorization
    if (listing.userRef.toString() !== (req.user?.user?.id || req.user?.id)) {
      return res.status(403).json({ message: 'You can only update your own listings' });
    }

    const payload = req.body || {};

    // Prepare update object
    const updateData = {
      name: payload.name || listing.name,
      description: payload.description || listing.description,
      address: payload.address || listing.address,
      regularPrice: payload.regularPrice || listing.regularPrice,
      discountedPrice: payload.discountedPrice || listing.discountedPrice,
      offer: payload.offer !== undefined ? payload.offer : listing.offer,
      isFeatured: payload.isFeatured !== undefined ? payload.isFeatured : listing.isFeatured,
      boosted: payload.boosted !== undefined ? payload.boosted : listing.boosted,
    };

    // Update SEO if category/address changes
    if (payload.category || payload.address) {
      const category = payload.category || listing.category;
      const subCategory = payload.subCategory || listing.subCategory;
      const details = payload.details || listing.details;
      const address = payload.address || listing.address;
      const seoData = generateSeo(category, subCategory, details, address);
      updateData.seo = seoData;
      updateData.slug = seoData?.slug;
    }

    const updated = await Listing.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.status(200).json({ success: true, listing: updated });
  } catch (error) {
    console.error('Update listing error:', error);
    next(error);
  }
};

// Get single listing
export const getListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).lean();

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    return res.status(200).json(listing);
  } catch (error) {
    console.error('Get listing error:', error);
    next(error);
  }
};

// Get listings with filters and pagination
export const getListings = async (req, res, next) => {
  try {
    const {
      category,
      subCategory,
      minPrice,
      maxPrice,
      search,
      limit = 10,
      sort = '-createdAt',
      skip = 0,
    } = req.query;

    const filter = {};

    if (category) filter.category = category;
    if (subCategory) filter.subCategory = subCategory;
    if (minPrice || maxPrice) {
      filter.regularPrice = {};
      if (minPrice) filter.regularPrice.$gte = Number(minPrice);
      if (maxPrice) filter.regularPrice.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const listings = await Listing.find(filter)
      .sort(sort)
      .skip(Number(skip))
      .limit(Number(limit))
      .lean();

    const total = await Listing.countDocuments(filter);

    return res.status(200).json({
      success: true,
      listings,
      total,
      limit: Number(limit),
      skip: Number(skip),
    });
  } catch (error) {
    console.error('Get listings error:', error);
    next(error);
  }
};

// Promote listing
export const promoteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if it's an authenticated request or webhook
    if (req.headers['x-promote-secret']) {
      // Webhook route - verify secret
      const secret = req.headers['x-promote-secret'];
      if (secret !== process.env.PROMOTE_WEBHOOK_SECRET) {
        return res.status(401).json({ message: 'Invalid webhook secret' });
      }
    } else if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    } else {
      // Verify ownership for auth route
      if (listing.userRef.toString() !== (req.user?.user?.id || req.user?.id)) {
        return res.status(403).json({ message: 'You can only promote your own listings' });
      }
    }

    const days = req.body?.days || 7;
    const featuredUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { isFeatured: true, featuredUntil },
      { new: true }
    );

    return res.status(200).json({ success: true, listing: updated });
  } catch (error) {
    console.error('Promote listing error:', error);
    next(error);
  }
};

// Boost listing (short-term visibility)
export const boostListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (!listing) {
      return res.status(404).json({ message: 'Listing not found' });
    }

    // Check if it's an authenticated request or webhook
    if (req.headers['x-promote-secret']) {
      // Webhook route - verify secret
      const secret = req.headers['x-promote-secret'];
      if (secret !== process.env.PROMOTE_WEBHOOK_SECRET) {
        return res.status(401).json({ message: 'Invalid webhook secret' });
      }
    } else if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    } else {
      // Verify ownership for auth route
      if (listing.userRef.toString() !== (req.user?.user?.id || req.user?.id)) {
        return res.status(403).json({ message: 'You can only boost your own listings' });
      }
    }

    const hours = req.body?.hours || 24; // Default 24 hours
    const boostedUntil = new Date(Date.now() + hours * 60 * 60 * 1000);

    const updated = await Listing.findByIdAndUpdate(
      req.params.id,
      { boosted: true, boostedUntil },
      { new: true }
    );

    return res.status(200).json({ success: true, listing: updated });
  } catch (error) {
    console.error('Boost listing error:', error);
    next(error);
  }
};
