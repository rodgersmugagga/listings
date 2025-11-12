import mongoose from "mongoose";

const Schema = mongoose.Schema;

// Subcategories
const realEstateSubcategories = ["Apartment", "House", "Land", "Commercial"];
const vehicleSubcategories = ["Car", "Motorcycle", "Truck", "Bus"];
const electronicsSubcategories = ["Mobile Phone", "Laptop", "TV", "Camera"];

// Listing Schema
const listingSchema = new Schema(
  {
    // Basic info
    name: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    address: { type: String, required: true },

    // Pricing
    regularPrice: { type: Number, required: true },
    discountedPrice: { type: Number },
    offer: { type: Boolean, default: false },

    // Category & subcategory
    category: {
      type: String,
      required: true,
      enum: ["Real Estate", "Vehicles", "Electronics"],
    },
    subCategory: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          if (this.category === "Real Estate") return realEstateSubcategories.includes(v);
          if (this.category === "Vehicles") return vehicleSubcategories.includes(v);
          if (this.category === "Electronics") return electronicsSubcategories.includes(v);
          return false;
        },
        message: (props) => `${props.value} is not a valid subcategory for ${props.instance.category}`,
      },
    },

    // Flexible category-specific details
    details: {
      // Real Estate
      bedrooms: Number,
      bathrooms: Number,
      toilets: Number,
      floorArea: Number,
      landArea: Number,
      furnished: { type: String, enum: ["Unfurnished", "Semi-furnished", "Fully furnished"] },
      type: { type: String, enum: ["rent", "sale"] },
      availability: { type: String, enum: ["For Sale", "For Rent"] },
      parking: Number,
      amenities: [String],

      // Vehicles
      brand: String,
      model: String,
      year: Number,
      mileage: Number,
      engineSize: Number,
      fuelType: { type: String, enum: ["Petrol", "Diesel", "Electric", "Hybrid"] },
      transmission: { type: String, enum: ["Manual", "Automatic"] },
      color: String,
      seats: Number,
      features: [String],

      // Electronics
      storage: Number,
      ram: Number,
      screenSize: Number,
      batteryLife: Number,
      warranty: Number,
      accessories: [String],
      electronicFeatures: [String],
    },

    // Images
  imageUrls: { type: [String], required: true },
  // Cloudinary public IDs for images (useful for deletions/cleanup)
  imagePublicIds: { type: [String], default: [] },

    // Seller
    userRef: { type: Schema.Types.ObjectId, ref: "User", required: true },

    // Promotion metadata
    isFeatured: { type: Boolean, default: false },
    featuredUntil: { type: Date, default: null },
    boosted: { type: Boolean, default: false },
    boostedUntil: { type: Date, default: null },

    // Views
    views: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for search, filters, and promotions
listingSchema.index(
  { name: "text", address: "text", description: "text" },
  { weights: { name: 5, address: 4, description: 1 } }
);
listingSchema.index({ userRef: 1, createdAt: -1 });
// 'type' is nested inside `details` in the schema — index the nested path instead
listingSchema.index({ 'details.type': 1, offer: 1 });
listingSchema.index({ regularPrice: 1, discountedPrice: 1 });
listingSchema.index({ category: 1, subCategory: 1 });
listingSchema.index({ isFeatured: 1, featuredUntil: -1 });
listingSchema.index({ boosted: 1, boostedUntil: -1 });
listingSchema.index({ createdAt: -1 });

// Export model
const Listing = mongoose.model("Listing", listingSchema);

export default Listing;
