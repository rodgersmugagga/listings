import { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

export default function CreateListing() {

  // Initialize all form fields in one state object
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    regularPrice: "150000",
    discountedPrice: "0",
    bathrooms: "1",
    bedrooms: "1",
    furnished: false,
    parking: false,
    type: "rent",
    offer: false,
    imageUrls: [],
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
    const { id, value, checked } = e.target;

    // Handle rent/sale type selection
    if (id === 'sale' || id === 'rent') {
      setFormData({
        ...formData,
        type: id,
      });
    }

    // Handle checkboxes (parking, furnished, offer)
    else if (id === 'parking' || id === 'furnished' || id === 'offer') {
      setFormData({
        ...formData,
        [id]: checked, // corrected from .check to .checked
      });
    }

    // Handle other text/number/textarea inputs
    else {
      setFormData({
        ...formData,
        [id]: value, // corrected from .check to .value
      });
    }
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
      const res = await fetch(`/api/listing/create`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token || ''}`, 
        },
        body: JSON.stringify({
          ...formData,
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
      navigate(`/listing/${data._id}`); // fixed template literal quotes

    } catch (error) {
      setError(error.message);
      setLoading(false); // corrected from loading(false)
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

      // revoke previews after successful upload
      selectedFiles.forEach((f) => f.preview && URL.revokeObjectURL(f.preview));

      setFormData((prev) => ({ ...prev, imageUrls: data.imageUrls }));
      setSelectedFiles([]);
      setUploading(false);
    } catch (err) {
      setError(err.message);
      setUploading(false);
    }
  };

  return (
    <main className='max-w-4xl mx-auto p-3'>
      <h1 className='text-3xl font-semibold text-center my-7'>Create a Listing</h1>

      {/* fixed: changed onClick → onSubmit */}
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        {/* Left section */}
        <div className='flex flex-col gap-4 p-6 flex-1'>
          <input type="text" placeholder="name" className="border p-3 rounded-lg" id="name" maxLength="62" minLength="10" required onChange={handleChange} value={formData.name}/>
          <textarea placeholder="Description" className="border p-3 rounded-lg" id="description" maxLength="500" minLength="10" required onChange={handleChange} value={formData.description}/>
          <input type="text" placeholder="Address" className="border p-3 rounded-lg" id="address" required onChange={handleChange} value={formData.address}/>

          {/* Checkboxes for options */}
          <div className='flex gap-6 flex-wrap'>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="sale" onChange={handleChange} checked={formData.type === "sale"}/>
              <span>Sell</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="rent" onChange={handleChange} checked={formData.type === "rent"}/>
              <span>Rent</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="parking" onChange={handleChange} checked={formData.parking}/>
              <span>Parking</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="furnished" onChange={handleChange} checked={formData.furnished}/>
              <span>Furnished</span>
            </div>
            <div className='flex gap-2'>
              <input type="checkbox" className="w-5" id="offer" onChange={handleChange} checked={formData.offer}/>
              <span>Offer</span>
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
            <div className='flex gap-2 items-center'>
              <input type="number" className="border border-gray-300 rounded-lg" id="regularPrice" min="150000" max="3000000" required onChange={handleChange} value={formData.regularPrice} />
              <div className='flex flex-col items-center'>
                <p>Regular Price</p>
                <span className='text-xs'>Ugx / month</span>
              </div>
            </div>

            {/* Discounted price shown only if offer checked */}
            {formData.offer && (
              <div className='flex gap-2 items-center'>
                <input type="number" className="border border-gray-300 rounded-lg" id="discountedPrice" min="0" max="100000" required onChange={handleChange} value={formData.discountedPrice} />
                <div className='flex flex-col items-center'>
                  <p>Discounted Price</p>
                  <span className='text-xs'>Ugx / month</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right section */}
        <div className='flex flex-col flex-1 gap-4'>
          <p className='font-semibold'>Images:</p>
          <span className='font-normal text-gray-600 ml-2'>The first image will be the cover (max 6)</span>

          <div className='flex gap-4'>
            <input onChange={handleFileChange} className='p-3 border border-gray-300 rounded-lg w-full' type="file" id="images" accept="image/*" multiple />
            <button type="button" onClick={handleUpload} disabled={uploading} className='text-green-700 border border-green-700 p-3 rounded-lg uppercase hover:shadow-lg disabled:opacity-80 mt-4'>
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>

          {/* Selected file previews with delete buttons (before upload) */}
          {selectedFiles.length > 0 && (
            <div className='flex gap-2 flex-wrap mt-2 items-center'>
              {selectedFiles.map((item, idx) => (
                <div key={item.preview} className='relative'>
                  <img src={item.preview} alt={`preview-${idx}`} className='h-20 w-20 object-cover rounded-md' />
                  <button
                    type='button'
                    onClick={() => removeSelectedFile(idx)}
                    className='absolute -top-2 -right-2 bg-red-600 text-white rounded-full h-6 w-6 flex items-center justify-center'
                    aria-label={`Remove selected image ${idx + 1}`}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          )}

          {formData.imageUrls?.length > 0 && (
            <div className='flex gap-2 flex-wrap mt-2'>
              {formData.imageUrls.map((url) => (
                <img key={url} src={url} alt="preview" className='h-20 w-20 object-cover rounded-md' />
              ))}
            </div>
          )}

          {/* Main submit button */}
          <button type="submit" disabled={loading} className='text-white bg-slate-700 p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4'>
            {loading ? "Creating..." : "Create Listing"}
          </button>

          {/* Error display */}
          {error && <p className="text-center text-red-500 mb-4">{error}</p>}
        </div>
      </form>
    </main>
  );
}
