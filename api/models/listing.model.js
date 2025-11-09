//import mongoose
import mongoose from "mongoose"; 

// Define the Listing schema
const listingSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    address: { type: String, required: true },
    regularPrice: { type: Number, required: true },
    discountedPrice: { type: Number, required: true },
    bathrooms: { type: Number, required: true },
    bedrooms: { type: Number, required: true },
    furnished: { type: Boolean, required: true },
    parking: { type: Boolean, required: true },
    type: { type: String, required: true },
    offer: { type: Boolean, required: true },
    imageUrls: { type: Array, required: true },
    userRef: { type: String, required: true },

  }, { timestamps: true });

// Indexes to improve query performance for common operations:
// - text index on searchable fields (name, address, description) for full-text search
// - compound index for fetching a user's listings (userRef + createdAt)
// - indexes on type/offer for fast filtering, and on price fields for sorting
listingSchema.index({ name: 'text', address: 'text', description: 'text' }, { weights: { name: 5, address: 4, description: 1 } });
listingSchema.index({ userRef: 1, createdAt: -1 });
listingSchema.index({ type: 1, offer: 1 });
listingSchema.index({ regularPrice: 1 });
listingSchema.index({ discountedPrice: 1 });

// Create and export the Listing model
const Listing = mongoose.model('Listing', listingSchema);

export default Listing;