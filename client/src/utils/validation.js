/**
 * Form Validation Utilities
 * Production-grade validation for all forms
 */

/**
 * Validate listing creation/update form
 * @param {Object} data - Form data
 * @returns {Array} Array of error messages
 */
export const validateListing = (data) => {
  const errors = [];

  // Required fields
  if (!data.name?.trim()) {
    errors.push('Listing name is required');
  } else if (data.name.trim().length < 5) {
    errors.push('Name must be at least 5 characters');
  } else if (data.name.trim().length > 100) {
    errors.push('Name must not exceed 100 characters');
  }

  if (!data.description?.trim()) {
    errors.push('Description is required');
  } else if (data.description.trim().length < 20) {
    errors.push('Description must be at least 20 characters');
  } else if (data.description.trim().length > 2000) {
    errors.push('Description must not exceed 2000 characters');
  }

  if (!data.address?.trim()) {
    errors.push('Address is required');
  } else if (data.address.trim().length < 5) {
    errors.push('Address must be at least 5 characters');
  }

  // Price validation
  const regPrice = parseFloat(data.regularPrice);
  if (isNaN(regPrice) || regPrice <= 0) {
    errors.push('Regular price must be a positive number');
  }

  if (data.offer) {
    const discPrice = parseFloat(data.discountedPrice);
    if (isNaN(discPrice) || discPrice <= 0) {
      errors.push('Discounted price must be a positive number');
    } else if (discPrice >= regPrice) {
      errors.push('Discounted price must be less than regular price');
    }
  }

  // Image validation
  if (!data.imageUrls || data.imageUrls.length === 0) {
    errors.push('At least 1 image is required');
  } else if (data.imageUrls.length > 6) {
    errors.push('Maximum 6 images allowed');
  }

  // Category validation
  if (!data.category) {
    errors.push('Category is required');
  } else {
    const validCategories = ['Real Estate', 'Vehicles', 'Electronics'];
    if (!validCategories.includes(data.category)) {
      errors.push('Invalid category selected');
    }
  }

  if (!data.subCategory) {
    errors.push('Subcategory is required');
  }

  // Category-specific validations
  if (data.category === 'Real Estate') {
    if (
      typeof data.details?.bedrooms === 'undefined' || 
      data.details.bedrooms < 0 ||
      data.details.bedrooms > 20
    ) {
      errors.push('Real Estate listings must include valid number of bedrooms (0-20)');
    }
    if (
      typeof data.details?.bathrooms === 'undefined' || 
      data.details.bathrooms < 0 ||
      data.details.bathrooms > 20
    ) {
      errors.push('Real Estate listings must include valid number of bathrooms (0-20)');
    }
  }

  if (data.category === 'Vehicles') {
    if (!data.details?.brand?.trim()) {
      errors.push('Vehicle brand is required');
    }
    if (!data.details?.model?.trim()) {
      errors.push('Vehicle model is required');
    }
    if (data.details?.year && (data.details.year < 1900 || data.details.year > new Date().getFullYear() + 1)) {
      errors.push('Vehicle year must be valid');
    }
  }

  if (data.category === 'Electronics') {
    if (!data.details?.brand?.trim()) {
      errors.push('Electronics brand is required');
    }
  }

  return errors;
};

/**
 * Validate sign up form
 * @param {string} username - Username
 * @param {string} email - Email address
 * @param {string} password - Password

 * @returns {Array} Array of error messages
 */
export const validateSignUp = (username, email, password) => {
  const errors = [];

  // Username validation
  if (!username?.trim()) {
    errors.push('Username is required');
  } else if (username.trim().length < 3) {
    errors.push('Username must be at least 3 characters');
  } else if (username.trim().length > 30) {
    errors.push('Username must not exceed 30 characters');
  } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
    errors.push('Username can only contain letters, numbers, underscores, and hyphens');
  }

  // Email validation
  if (!email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }

  // Password validation
  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters');
  } else if (password.length > 12) {
    errors.push('Password must not exceed 12 characters');
  } else if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (!/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (!/[0-9]/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (!/[!@#$%^&*_\-+=]/.test(password)) {
    errors.push('Password must contain at least one special character (!@#$%^&*_-+=)');
  }

  

  return errors;
};

/**
 * Validate sign in form
 * @param {string} email - Email address
 * @param {string} password - Password
 * @returns {Array} Array of error messages
 */
export const validateSignIn = (email, password) => {
  const errors = [];

  if (!email?.trim()) {
    errors.push('Email is required');
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    errors.push('Please enter a valid email address');
  }

  if (!password) {
    errors.push('Password is required');
  }

  return errors;
};

/**
 * Validate image files
 * @param {File[]} files - Array of file objects
 * @returns {Array} Array of error messages
 */
export const validateImages = (files) => {
  const errors = [];
  const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
  const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

  if (!files || files.length === 0) {
    errors.push('At least one image is required');
    return errors;
  }

  if (files.length > 6) {
    errors.push('Maximum 6 images allowed');
  }

  files.forEach((file, index) => {
    // Check file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      errors.push(`Image ${index + 1}: Only JPEG, PNG, WebP, and GIF are allowed`);
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      errors.push(`Image ${index + 1}: File size must be less than 5MB`);
    }
  });

  return errors;
};

/**
 * Validate profile update form
 * @param {Object} data - Form data (username, email, password)
 * @returns {Array} Array of error messages
 */
export const validateProfileUpdate = (data) => {
  const errors = [];

  // Username validation (if provided)
  if (data.username?.trim()) {
    if (data.username.trim().length < 3) {
      errors.push('Username must be at least 3 characters');
    } else if (data.username.trim().length > 30) {
      errors.push('Username must not exceed 30 characters');
    } else if (!/^[a-zA-Z0-9_-]+$/.test(data.username)) {
      errors.push('Username can only contain letters, numbers, underscores, and hyphens');
    }
  }

  // Email validation (if provided)
  if (data.email?.trim()) {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      errors.push('Please enter a valid email address');
    }
  }

  // Password validation (if provided)
  if (data.password) {
    if (data.password.length < 6) {
      errors.push('Password must be at least 8 characters');
    } else if (data.password.length > 128) {
      errors.push('Password must not exceed 128 characters');
    } else if (!/[A-Z]/.test(data.password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (!/[a-z]/.test(data.password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (!/[0-9]/.test(data.password)) {
      errors.push('Password must contain at least one number');
    }
  }

  return errors;
};

/**
 * Sanitize input to prevent XSS
 * @param {string} input - User input
 * @returns {string} Sanitized input
 */
export const sanitizeInput = (input) => {
  if (!input) return '';
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

/**
 * Trim and normalize input
 * @param {Object} data - Form data object
 * @returns {Object} Normalized data
 */
export const normalizeFormData = (data) => {
  const normalized = { ...data };

  Object.keys(normalized).forEach((key) => {
    if (typeof normalized[key] === 'string') {
      normalized[key] = normalized[key].trim();
    }
  });

  return normalized;
};
