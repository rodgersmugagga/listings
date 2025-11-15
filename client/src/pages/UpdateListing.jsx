import { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'
import FieldsContainer from '../components/FieldsContainer';
import { getFieldsForSubcategory } from '../utils/subcategoryFields';

export default function UpdateListing() {

  // Initialize all form fields in one state object
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: 150000,
    discountedPrice: 0,
    bathrooms: 1,
    bedrooms: 1,
    // match backend enum
    furnished: 'Unfurnished',
    // parking as number of spaces
    parking: 0,
    type: "rent",
    offer: false,
    imageUrls: [],
    imagePublicIds: [],
    category: 'Real Estate',
    subCategory: 'Apartment',
    details: {},
  });

  // Get the logged-in user from Redux
  const { currentUser } = useSelector(state => state.user);
  // Used for redirecting after creation
  const navigate = useNavigate();

  //
  const params = useParams();

  // States for error and loading indicators
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);

  useEffect(()=> {

    const fetchListing = async () => {
   
    const listingId = params.listingId;
    console.log(listingId);
      
      try {
        
        
        const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/get/${listingId}`);

        const data = await res.json();

        if (!res.ok || data.success === false) {
          console.error("Listing fetch failed:", data.message);
          return;
        }

        // Map nested details into top-level form fields for editing compatibility
        const listing = data;
        const details = listing.details || {};
        const merged = {
          // prefer listing top-level values but bring commonly edited detail fields up
          ...listing,
          bedrooms: Number(details.bedrooms ?? listing.bedrooms ?? 1),
          bathrooms: Number(details.bathrooms ?? listing.bathrooms ?? 1),
          furnished: details.furnished ?? listing.furnished ?? 'Unfurnished',
          parking: Number(details.parking ?? listing.parking ?? 0),
          type: details.type ?? listing.type ?? 'rent',
          category: listing.category ?? 'Real Estate',
          subCategory: listing.subCategory ?? 'Apartment',
          details: details,
          imageUrls: listing.imageUrls || listing.images || [],
          imagePublicIds: listing.imagePublicIds || [],
        };

        setFormData(merged);
        

      } catch (error) {

        
        console.error("Listing Fetch error:", error.message);
        
      }
    };

    fetchListing();

  }, [params.listingId]);

  // Handles form field changes (coerce numeric fields and support select for furnished)
  const handleChange = (e) => {
    const { id, value, checked } = e.target;

    // If category or subcategory changes, clear the details object
    if (id === 'category' || id === 'subCategory') {
      setFormData((prev) => ({
        ...prev,
        [id]: value,
        details: {}, // Clear category-specific fields when switching categories
      }));
      return;
    }

    // Handle type radio (rent/sale)
    if (id === 'type') {
      setFormData((prev) => ({ ...prev, type: value }));
      return;
    }

    // Handle offer checkbox
    if (id === 'offer') {
      setFormData((prev) => ({ ...prev, offer: checked }));
      return;
    }

    // Numeric fields: coerce to Number
    if (id === 'parking' || id === 'bedrooms' || id === 'bathrooms' || id === 'regularPrice' || id === 'discountedPrice') {
      const asNumber = value === '' ? '' : Number(value);
      setFormData((prev) => ({ ...prev, [id]: asNumber }));
      return;
    }

    // Default: set top-level string fields
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  // Handle changes in dynamic subcategory detail fields
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


      //Validate image upload
      //if (formData.imageUrls.length < 1) return setError("You must upload at least 1 image!");
      
      // Validate discounted price
      if (+formData.regularPrice < +formData.discountedPrice) {
        return setError("Discount price must be lower than regular price!");
      }

      setError(false);
      setLoading(true); // corrected from loading(true)

      // Prepare request body including user reference
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

      if (formData.category === 'Real Estate') {
        payload.details = {
          ...payload.details,
          bedrooms: Number(formData.bedrooms) || 0,
          bathrooms: Number(formData.bathrooms) || 0,
          furnished: formData.furnished || 'Unfurnished',
          parking: Number(formData.parking) || 0,
          type: formData.type || 'rent',
        };
      }

      const res = await fetch(`/api/listing/update/${params.listingId}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`, 
        },
        body: JSON.stringify({
          ...payload,
          userRef: currentUser?.user?._id,
        }),
      });

      const data = await res.json();
      setLoading(false);

      // If API returns error
      if (data.success === false) {
        setError(data.message);
        return;
      }

      // Navigate to the new listing page
      const listingId = params.listingId;
      navigate(`/listing/${data._id || listingId}`);

    } catch (error) {
      setError(error.message);
      setLoading(false); // corrected from loading(false)
    }
  };

  // Handle file selection
  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files || []));
  };

  // Upload selected files to backend (which uses Cloudinary via multer-storage-cloudinary)
  const handleUpload = async () => {
    if (!selectedFiles.length) return setError('No files selected');

    try {
      setUploading(true);
      setError(false);
      const token = currentUser?.token;
      const fd = new FormData();
      selectedFiles.slice(0, 6).forEach((file) => fd.append('images', file));

      const res = await fetch('/api/listing/upload', {
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

        // Normalize response
        const imageUrlsFromResp = data.imageUrls || (Array.isArray(data.images) ? data.images.map(i => i.url) : []);
        const publicIdsFromResp = data.publicIds || (Array.isArray(data.images) ? data.images.map(i => i.public_id || i.publicId) : []);

        setFormData((prev) => ({ ...prev, imageUrls: [...(prev.imageUrls || []), ...imageUrlsFromResp], imagePublicIds: [...(prev.imagePublicIds || []), ...publicIdsFromResp] }));
      setUploading(false);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
      <main className='max-w-4xl mx-auto px-2 sm:px-3 md:px-4 p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>

      {/* fixed: changed onClick → onSubmit */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
  {/* Left section */}
  <div className='flex flex-col gap-4 p-6 flex-1 overflow-visible'>
          <input type="text" placeholder="name" className="border p-3 rounded-lg" id="name" maxLength="62" minLength="10" required onChange={handleChange} value={formData.name}/>
          <textarea placeholder="Description" className="border p-3 rounded-lg" id="description" maxLength="500" minLength="10" required onChange={handleChange} value={formData.description}/>
          <input type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required onChange={handleChange} value={formData.address}/>

          {/* Checkboxes for options */}
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2 items-center'>
              <input type="radio" name="type" id="type" value="sale" onChange={handleChange} checked={formData.type === "sale"} />
              <span>Sell</span>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="radio" name="type" id="type" value="rent" onChange={handleChange} checked={formData.type === "rent"} />
              <span>Rent</span>
            </div>

            <div className='flex gap-2 items-center'>
              <label className='text-sm'>Parking spots</label>
              <input type="number" className="border border-gray-300 rounded-lg w-20" id="parking" min="0" max="20" onChange={handleChange} value={formData.parking} />
            </div>

            <div className='flex gap-2 items-center'>
              <label className='text-sm'>Furnished</label>
              <select id="furnished" value={formData.furnished} onChange={handleChange} className='border rounded p-2 appearance-auto z-50'>
                <option value="Unfurnished">Unfurnished</option>
                <option value="Semi-furnished">Semi-furnished</option>
                <option value="Fully furnished">Fully furnished</option>
              </select>
            </div>
          </div>

          {/* Numeric fields */}
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2 items-center'>
              <input type="number" className="border border-gray-300 rounded-lg" id="bedrooms" min="1" max="10" required onChange={handleChange} value={formData.bedrooms} />
              <p>Beds</p>
            </div>
            <div className='flex gap-2 items-center'>
              <input type="number" className="border border-gray-300 rounded-lg" id="bathrooms" min="1" max="10" required onChange={handleChange} value={formData.bathrooms}/>
              <p>Baths</p>
            </div>
          </div>

          {/* Pricing section - improved layout */}
          <div className='mt-3 p-4 bg-white rounded-lg border border-gray-200'>
            <h3 className='text-lg font-semibold mb-4 text-gray-800'>Pricing</h3>
            
            {/* Regular Price */}
            <div className='flex gap-2 items-center mb-4'>
              <input type="number" className="border border-gray-300 rounded-lg" id="regularPrice" min="150000" max="3000000" required onChange={handleChange} value={formData.regularPrice} />
              <div className='flex flex-col items-start'>
                <p className='text-sm font-medium'>Regular Price</p>
                <span className='text-xs text-gray-500'>UGX / month</span>
              </div>
            </div>

            {/* Offer/Discount Section */}
            <div className='border-t pt-4'>
              <div className='flex gap-3 items-center mb-3'>
                <input type="checkbox" className="w-5 h-5 cursor-pointer" id="offer" checked={formData.offer} onChange={handleChange} />
                <label htmlFor="offer" className='text-sm font-medium cursor-pointer'>Offer Discounted Price</label>
              </div>
              
              {/* Discounted price shown only if offer checked */}
                {formData.offer && (
                <div className='ml-8 mt-3 p-3 bg-brand-50 border border-brand-200 rounded-lg'>
                  <div className='flex gap-2 items-center'>
                    <input type="number" className="border border-gray-300 rounded-lg" id="discountedPrice" min="0" max="100000" required onChange={handleChange} value={formData.discountedPrice} />
                    <div className='flex flex-col items-start'>
                      <p className='text-sm font-medium'>Discount Price</p>
                      <span className='text-xs text-gray-500'>UGX / month</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Dynamic subcategory-specific fields */}
          {formData.category && formData.subCategory && (
            <div className='border-t pt-6 mt-6'>
              <h3 className='text-lg font-semibold mb-4'>Additional {formData.subCategory} Details</h3>
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
          )}
        </div>

  {/* Right section */}
  <div className='flex flex-col flex-1 gap-4 overflow-visible'>
          <p className='font-semibold'>Images:</p>
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>

          <div className='flex gap-4'>
            <input onChange={handleFileChange} className='p-3 border border-gray-300 rounded-lg w-full' type="file" id="images" accept="image/*" multiple />
            <button type="button" onClick={handleUpload} disabled={uploading} className='text-brand-600 border border-brand-600 p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 mt-4'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {formData.imageUrls?.length > 0 && (
            <div className='flex gap-2 flex-wrap mt-2'>
              {formData.imageUrls.map((url) => (
                <img key={url} src={url} alt="preview" className='h-20 w-20 object-cover rounded-md' />
              ))}
            </div>
          )}

          {/* Main submit button */}
          <button type="submit" disabled={loading} className='text-white bg-slate-700 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4'>
            {loading ? "Updating..." : "Update Listing"}
          </button>

          {/* Error display */}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        </div>
      </form>
    </main>
  );
}
