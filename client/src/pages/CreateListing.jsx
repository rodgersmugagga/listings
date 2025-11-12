import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { Helmet } from 'react-helmet-async';
import FieldsContainer from '../components/FieldsContainer';
import { getFieldsForSubcategory } from '../utils/subcategoryFields';

export default function CreateListing() {

  // Initialize all form fields in one state object
  const [formData, setFormData] = useState({
    // General fields (always shown)
    name: "",
    description: "",
    address: "",
    regularPrice: 0,
    discountedPrice: 0,
    offer: false,
    category: 'Real Estate',
    subCategory: 'Apartment',
    imageUrls: [],
    imagePublicIds: [],
    // Flexible details object for category-specific fields
    details: {},
  });

  // Get the logged-in user from Redux
  const { currentUser } = useSelector(state => state.user);
  // Used for redirecting after creation
  const navigate = useNavigate();

  // States for error and loading indicators
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  // selectedFiles will be an array of objects: { file: File, preview: string }
  const [selectedFiles, setSelectedFiles] = useState([]);

  // Handles form field changes
  const handleChange = (e) => {
    const { id, value, type } = e.target;
    
    // If category or subcategory changes, clear the details object
    if (id === 'category' || id === 'subCategory') {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        details: {}, // Clear category-specific fields when switching categories
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [id]: type === 'number' ? Number(value) : value,
      }));
    }
  };

  const handleFieldChange = (fieldName, value) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [fieldName]: value,
      },
    }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // prevent page reload

    try {
      const token = currentUser?.token;

  // Validate image upload (defensive: imageUrls may be undefined)
  if (!formData.imageUrls || formData.imageUrls.length < 1) return setError("You must upload at least 1 image!");
      
      // Validate discounted price
      if (+formData.regularPrice < +formData.discountedPrice) {
        return setError("Discount price must be lower than regular price!");
      }

      setError(false);
      setLoading(true);

      // Build payload that strictly follows listing.model.js
      const apiBase = import.meta.env.VITE_API_URL || '';
      const payload = {
        name: formData.name,
        description: formData.description,
        address: formData.address,
        regularPrice: Number(formData.regularPrice) || 0,
        discountedPrice: Number(formData.discountedPrice) || 0,
        offer: !!formData.offer,
        category: formData.category,
        subCategory: formData.subCategory,
        imageUrls: formData.imageUrls || [],
        imagePublicIds: formData.imagePublicIds || [],
        details: { ...(formData.details || {}) },
      };

      const res = await fetch(`${apiBase}/api/listing/create`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`,
        },
        body: JSON.stringify({ ...payload, userRef: currentUser?.user?._id }),
      });

      const data = await res.json();
      setLoading(false);

      // If API returns error
      if (data.success === false) {
        setError(data.message);
        return;
      }

      // Navigate to the new listing page
      const newId = data.listing?._id || data._id || data.listing?.id || data.id;
      if (newId) navigate(`/listing/${newId}`);

    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    const files = Array.from(e.target.files || []);
    // map to objects with preview URLs
    const mapped = files.map((file) => ({ file, preview: URL.createObjectURL(file) }));
    // append to existing selected files (but limit client-side to 6 total)
    setSelectedFiles((prev) => {
      const combined = [...prev, ...mapped];
      return combined.slice(0, 6);
    });
  };

  // Remove a selected file by index and revoke the object URL
  const removeSelectedFile = (index) => {
    setSelectedFiles((prev) => {
      const item = prev[index];
      if (item && item.preview) URL.revokeObjectURL(item.preview);
      const next = prev.filter((_, i) => i !== index);
      return next;
    });
  };

  // cleanup object URLs on unmount
  useEffect(() => {
    return () => {
      selectedFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Upload selected files to backend (which uses Cloudinary via multer-storage-cloudinary)
  const handleUpload = async () => {
    if (!selectedFiles.length) return setError('No files selected');

    try {
      setUploading(true);
      setError(false);
      const token = currentUser?.token;
      const fd = new FormData();
      // selectedFiles contains objects with .file
      selectedFiles.slice(0, 6).forEach((item) => fd.append('images', item.file));

      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/listing/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token || ''}`,
        },
        body: fd,
      });

      const data = await res.json();
      if (!res.ok || data.success === false) {
        setError(data.message || 'Upload failed');
        setUploading(false);
        return;
      }

      // revoke previews after successful upload
      selectedFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));

    // Ensure imageUrls is always an array (defensive against unexpected API responses)
    setFormData((prev) => ({ ...prev, imageUrls: data.imageUrls || [], imagePublicIds: data.publicIds || [] }));
      setSelectedFiles([]);
      setUploading(false);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <main className='max-w-6xl mx-auto px-2 sm:px-3 md:px-4 p-3'>

      <Helmet>
        <title>Create a Listing in Uganda | Post Real Estate, Vehicles, Electronics - Rodvers</title>
        <meta
          name="description"
          content="Create and publish your listing in Uganda. Post real estate, vehicles, electronics and more. Upload images, set prices, and reach thousands of verified buyers on Rodvers Listings."
        />
        <meta
          name="keywords"
          content="create listing Uganda, post listing Uganda, sell in Uganda, rent in Uganda, classified ads Uganda, free listings"
        />
        <meta name="author" content="Rodvers Tech Ltd" />
        <link rel="canonical" href="https://listings-chvc.onrender.com/create-listing" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Create a Listing in Uganda | Post Your Ad - Rodvers" />
        <meta property="og:description" content="Post your listing on Rodvers Listings. Reach thousands of buyers across Uganda." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://listings-chvc.onrender.com/create-listing" />
        <meta property="og:site_name" content="Rodvers Listings" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="Create a Listing in Uganda - Rodvers" />
        <meta name="twitter:description" content="Post your ad for free on Rodvers Listings. Sell or rent quickly in Uganda." />
        
        {/* Additional SEO */}
        <meta name="robots" content="index, follow" />
        <meta name="geo.region" content="UG" />
        <meta name="geo.placename" content="Uganda" />

        {/* Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Create Listing",
            "applicationCategory": "UtilitiesApplication",
            "description": "Create and publish classified listings across Uganda",
            "url": "https://listings-chvc.onrender.com/create-listing",
            "provider": {
              "@type": "Organization",
              "name": "Rodvers Tech Ltd",
              "url": "https://listings-chvc.onrender.com"
            },
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "UGX",
              "description": "Free listing creation"
            }
          })}
        </script>
        
        {/* Schema for HowTo */}
        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            "name": "How to Create a Listing on Rodvers",
            "description": "Step-by-step guide to create and publish your listing",
            "step": [
              {
                "@type": "HowToStep",
                "name": "Fill Basic Information",
                "text": "Enter listing name, description, and address"
              },
              {
                "@type": "HowToStep",
                "name": "Select Category",
                "text": "Choose category and subcategory (Real Estate, Vehicles, Electronics)"
              },
              {
                "@type": "HowToStep",
                "name": "Set Pricing",
                "text": "Enter regular price and optional discount"
              },
              {
                "@type": "HowToStep",
                "name": "Upload Images",
                "text": "Upload up to 6 images with first as cover"
              },
              {
                "@type": "HowToStep",
                "name": "Publish",
                "text": "Review and publish your listing"
              }
            ]
          })}
        </script>

      </Helmet>

      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing in Uganda</h1>

      <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-4">
  {/* Left section: General fields */}
  <div className='flex flex-col gap-4 p-6 flex-1 border rounded-lg bg-gray-50 overflow-visible'>
          <input type="text" placeholder="Listing Name" className="border p-3 rounded-lg" id="name" maxLength="62" minLength="10" required onChange={handleChange} value={formData.name}/>
          <textarea placeholder="Description" className="border p-3 rounded-lg" id="description" maxLength="500" minLength="10" required onChange={handleChange} value={formData.description}/>
          <input type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required onChange={handleChange} value={formData.address}/>

          {/* Category and Subcategory selectors */}
          <div className='flex flex-col sm:flex-row gap-2 mt-3'>
            <div className='flex-1'>
              <label className='block text-sm font-medium mb-1'>Category</label>
              <select id="category" value={formData.category} onChange={handleChange} className='border p-2 rounded-lg w-full appearance-auto z-50'>
                <option>Real Estate</option>
                <option>Vehicles</option>
                <option>Electronics</option>
              </select>
            </div>
            <div className='flex-1'>
              <label className='block text-sm font-medium mb-1'>Subcategory</label>
              <select id="subCategory" value={formData.subCategory} onChange={handleChange} className='border p-2 rounded-lg w-full appearance-auto z-50'>
                {formData.category === 'Real Estate' && (
                  <>
                    <option>Apartment</option>
                    <option>House</option>
                    <option>Land</option>
                    <option>Commercial</option>
                  </>
                )}
                {formData.category === 'Vehicles' && (
                  <>
                    <option>Car</option>
                    <option>Motorcycle</option>
                    <option>Truck</option>
                    <option>Bus</option>
                  </>
                )}
                {formData.category === 'Electronics' && (
                  <>
                    <option>Mobile Phone</option>
                    <option>Laptop</option>
                    <option>TV</option>
                    <option>Camera</option>
                  </>
                )}
              </select>
            </div>
          </div>

          {/* Pricing fields */}
          <div className='mt-3 p-4 bg-white rounded-lg border border-gray-200'>
            <h3 className='text-lg font-semibold mb-4 text-gray-800'>Pricing</h3>
            
            {/* Regular Price */}
            <div className='flex gap-2 items-center flex-1 mb-4'>
              <input type="number" className="border border-gray-300 rounded-lg flex-1" id="regularPrice" min="0" required onChange={handleChange} value={formData.regularPrice} />
              <div className='flex flex-col items-start'>
                <p className='text-sm font-medium'>Regular Price</p>
                <span className='text-xs text-gray-500'>UGX</span>
              </div>
            </div>

            {/* Offer/Discount Section */}
            <div className='border-t pt-4'>
              <div className='flex gap-3 items-center mb-3'>
                <input type="checkbox" className="w-5 h-5 cursor-pointer" id="offer" onChange={handleChange} checked={formData.offer}/>
                <label htmlFor="offer" className='text-sm font-medium cursor-pointer'>Offer Discounted Price</label>
              </div>
              
              {formData.offer && (
                <div className='ml-8 mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg'>
                  <div className='flex gap-2 items-center flex-1'>
                    <input type="number" className="border border-gray-300 rounded-lg flex-1" id="discountedPrice" min="0" required onChange={handleChange} value={formData.discountedPrice} />
                    <div className='flex flex-col items-start'>
                      <p className='text-sm font-medium'>Discount Price</p>
                      <span className='text-xs text-gray-500'>UGX</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
        </div>

  {/* Right section: Images */}
  <div className='flex flex-col flex-1 gap-4 p-6 border rounded-lg bg-gray-50 overflow-visible'>
          <p className='font-semibold text-lg'>Images</p>
          <span className='font-normal text-gray-600 text-sm'>The first image will be the cover (max 6)</span>

          <div className='flex flex-col sm:flex-row gap-4'>
            <input onChange={handleFileChange} className='p-3 border border-gray-300 rounded-lg w-full' type="file" id="images" accept="image/*" multiple />
            <button type="button" onClick={handleUpload} disabled={uploading} className='text-green-700 border border-green-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 whitespace-nowrap'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {/* Selected file previews */}
          {selectedFiles.length > 0 && (
            <div className='flex gap-2 flex-wrap mt-2 items-center'>
              {selectedFiles.map((item, idx) => (
                <div key={item.preview} className='relative'>
                  <img
                    src={item.preview}
                    alt={`Preview ${idx + 1}`}
                    className='h-20 w-20 object-cover rounded-md'
                  />
                  <button
                    type='button'
                    onClick={() => removeSelectedFile(idx)}
                    className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center'
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Uploaded images preview */}
          {formData.imageUrls?.length > 0 && (
            <div className='flex gap-2 flex-wrap mt-2'>
              {formData.imageUrls.map((url, idx) => (
                <img key={url} src={url} alt={`Uploaded ${idx + 1}`} className='h-20 w-20 object-cover rounded-md' />
              ))}
            </div>
          )}
        </div>
      </form>

      {/* Category-specific detail fields using dynamic field renderer */}
      <form onSubmit={handleSubmit} className='mt-6'>
        {/* Render dynamic fields for selected subcategory */}
        <div className='border-t pt-6 mt-6'>
          <h2 className='text-2xl font-semibold mb-4'>{formData.subCategory} Details</h2>
          <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
            <FieldsContainer 
              fields={getFieldsForSubcategory(formData.category, formData.subCategory)}
              data={formData.details}
              onChange={handleFieldChange}
              category={formData.category}
              subCategory={formData.subCategory}
            />
          </div>
        </div>

        {/* LEGACY CODE REMOVED - Using FieldRenderer for dynamic field rendering */}

        {/* Submit section */}
        <div className='flex gap-4 mt-6'>
          <button type="submit" disabled={loading} className='text-white bg-slate-700 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 flex-1'>
            {loading ? "Creating..." : "Create Listing"}
          </button>
        </div>

        {error && <p className="text-center text-red-500 mt-4">{error}</p>}
      </form>
    </main>
  );
}
