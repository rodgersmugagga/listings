/**
 * Define which fields are required/optional for each subcategory
 * This ensures each subcategory has its own specific field set
 */
export const SUBCATEGORY_FIELDS = {
  'Real Estate': {
    Apartment: {
      fields: ['bedrooms', 'bathrooms', 'toilets', 'furnished', 'type', 'floorArea', 'parking', 'amenities'],
      required: ['bedrooms', 'bathrooms', 'furnished', 'type'],
      description: 'Apartment with rooms, bathrooms, and amenities'
    },
    House: {
      fields: ['bedrooms', 'bathrooms', 'toilets', 'furnished', 'type', 'floorArea', 'landArea', 'parking', 'amenities'],
      required: ['bedrooms', 'bathrooms', 'furnished', 'type'],
      description: 'House with land area and parking'
    },
    Land: {
      fields: ['landArea', 'type'],
      required: ['landArea', 'type'],
      description: 'Land for sale or rent'
    },
    Commercial: {
      fields: ['floorArea', 'type', 'parking', 'amenities'],
      required: ['floorArea', 'type'],
      description: 'Commercial space with utilities'
    }
  },

  'Vehicles': {
    Car: {
      fields: ['brand', 'model', 'year', 'mileage', 'engineSize', 'fuelType', 'transmission', 'color', 'seats', 'features'],
      required: ['brand', 'model', 'fuelType', 'transmission'],
      description: 'Car details'
    },
    Motorcycle: {
      fields: ['brand', 'model', 'year', 'mileage', 'engineSize', 'fuelType', 'color', 'features'],
      required: ['brand', 'model', 'fuelType'],
      description: 'Motorcycle details'
    },
    Truck: {
      fields: ['brand', 'model', 'year', 'mileage', 'engineSize', 'fuelType', 'transmission', 'color', 'features'],
      required: ['brand', 'model', 'fuelType', 'transmission'],
      description: 'Truck details'
    },
    Bus: {
      fields: ['brand', 'model', 'year', 'mileage', 'engineSize', 'fuelType', 'transmission', 'seats', 'features'],
      required: ['brand', 'model', 'fuelType', 'transmission', 'seats'],
      description: 'Bus details'
    }
  },

  'Electronics': {
    'Mobile Phone': {
      fields: ['brand', 'condition', 'storage', 'ram', 'screenSize', 'batteryLife', 'warranty', 'accessories', 'electronicFeatures'],
      required: ['brand', 'condition'],
      description: 'Mobile phone specs'
    },
    Laptop: {
      fields: ['brand', 'condition', 'storage', 'ram', 'screenSize', 'batteryLife', 'warranty', 'accessories', 'electronicFeatures'],
      required: ['brand', 'condition', 'ram', 'storage'],
      description: 'Laptop specs'
    },
    TV: {
      fields: ['brand', 'condition', 'screenSize', 'warranty', 'accessories', 'electronicFeatures'],
      required: ['brand', 'condition', 'screenSize'],
      description: 'TV specs'
    },
    Camera: {
      fields: ['brand', 'condition', 'warranty', 'accessories', 'electronicFeatures'],
      required: ['brand', 'condition'],
      description: 'Camera details'
    }
  }
};

/**
 * Get field configuration for a specific subcategory
 */
export const getSubcategoryConfig = (category, subCategory) => {
  return SUBCATEGORY_FIELDS[category]?.[subCategory] || { fields: [], required: [] };
};

/**
 * Get all fields for rendering in a subcategory
 */
export const getFieldsForSubcategory = (category, subCategory) => {
  const config = getSubcategoryConfig(category, subCategory);
  return config.fields || [];
};

/**
 * Check if a field is required for a subcategory
 */
export const isFieldRequired = (category, subCategory, fieldName) => {
  const config = getSubcategoryConfig(category, subCategory);
  return config.required?.includes(fieldName) || false;
};

/**
 * Field metadata for rendering (label, type, options, etc.)
 * Now category-aware for better examples
 */
export const FIELD_METADATA = {
  // --- Real Estate ---
  bedrooms: { label: 'Bedrooms', type: 'number', min: 0, max: 20 },
  bathrooms: { label: 'Bathrooms', type: 'number', min: 0, max: 20 },
  toilets: { label: 'Toilets', type: 'number', min: 0, max: 10 },
  floorArea: { label: 'Floor Area (m²)', type: 'number', min: 0 },
  landArea: { label: 'Land Area (m²)', type: 'number', min: 0 },
  furnished: {
    label: 'Furnished',
    type: 'select',
    options: [
      { value: 'Unfurnished', label: 'Unfurnished' },
      { value: 'Semi-furnished', label: 'Semi-furnished' },
      { value: 'Fully furnished', label: 'Fully furnished' }
    ]
  },
  type: {
    label: 'Type',
    type: 'radio',
    options: [
      { value: 'rent', label: 'For Rent' },
      { value: 'sale', label: 'For Sale' }
    ]
  },
  parking: { label: 'Parking Spots', type: 'number', min: 0, max: 50 },
  amenities: { label: 'Amenities (comma-separated)', type: 'text', placeholder: 'e.g., Pool, Gym, Security' },

  // --- Vehicle-specific ---
  brand_vehicle: { label: 'Brand', type: 'text', placeholder: 'e.g., Toyota' },
  model_vehicle: { label: 'Model', type: 'text', placeholder: 'e.g., Corolla' },

  // --- Electronics-specific ---
  brand_electronic: { label: 'Brand', type: 'text', placeholder: 'e.g., Samsung' },
  model_electronic: { label: 'Model', type: 'text', placeholder: 'e.g., Galaxy S22' },

  // --- Shared Vehicle Fields ---
  year: { label: 'Year', type: 'number', min: 1900 },
  mileage: { label: 'Mileage (km)', type: 'number', min: 0 },
  engineSize: { label: 'Engine Size (cc)', type: 'number', min: 0 },
  fuelType: {
    label: 'Fuel Type',
    type: 'select',
    options: [
      { value: 'Petrol', label: 'Petrol' },
      { value: 'Diesel', label: 'Diesel' },
      { value: 'Electric', label: 'Electric' },
      { value: 'Hybrid', label: 'Hybrid' }
    ]
  },
  transmission: {
    label: 'Transmission',
    type: 'select',
    options: [
      { value: 'Manual', label: 'Manual' },
      { value: 'Automatic', label: 'Automatic' }
    ]
  },
  color: { label: 'Color', type: 'text', placeholder: 'e.g., Silver' },
  seats: { label: 'Seats', type: 'number', min: 1, max: 100 },
  features: { label: 'Features (comma-separated)', type: 'text', placeholder: 'e.g., Air conditioning, Power steering' },

  // --- Electronics fields ---
  condition: {
    label: 'Condition',
    type: 'select',
    options: [
      { value: 'New', label: 'New' },
      { value: 'Used', label: 'Used' },
      { value: 'Refurbished', label: 'Refurbished' }
    ]
  },
  storage: { label: 'Storage (GB)', type: 'number', min: 0 },
  ram: { label: 'RAM (GB)', type: 'number', min: 0 },
  screenSize: { label: 'Screen Size (inches)', type: 'number', min: 0, step: 0.1 },
  batteryLife: { label: 'Battery Life (hours)', type: 'number', min: 0 },
  warranty: { label: 'Warranty (months)', type: 'number', min: 0 },
  accessories: { label: 'Accessories Included', type: 'text', placeholder: 'e.g., Charger, Case' },
  electronicFeatures: { label: 'Features (comma-separated)', type: 'text', placeholder: 'e.g., Face ID, Fast charging' }
};
