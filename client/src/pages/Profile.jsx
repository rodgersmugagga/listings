import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import SafeHelmet from "../components/SafeHelmet.jsx"; // Safe Helmet wrapper for SEO
import { 
  deleteUserFailure, 
  deleteUserStart, 
  deleteUserSuccess, 
  SignOutUserStart,
  updateUserStart,
  updateUserSuccess,
  updateUserFailure
} from "../redux/user/userSlice.js";
//import { deleteUser } from "../../../api/controllers/user.controller.js";
import { Link } from "react-router-dom";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(currentUser?.user?.username || '');
  const [email, setEmail] = useState(currentUser?.user?.email || '');
  const [password, setPassword] = useState('');

  const [previewUrl, setPreviewUrl] = useState("");
  //const [uploading, setUploading] = useState(false);

  const [showListingError, setShowListingError] = useState(false);
  const [userListings, setUserListings] = useState([]);

  useEffect(() => {
    if (file) {
      const localPreview = URL.createObjectURL(file);
      setPreviewUrl(localPreview);
    }
  }, [file]);

  const [updateError, setUpdateError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const validateForm = () => {
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setUpdateError("Please enter a valid email address");
      return false;
    }
    if (password && password.length < 6) {
      setUpdateError("Password must be at least 6 characters long");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  setUpdateError("");
  setUpdateSuccess(false);

  if (!validateForm()) return;

  setIsLoading(true);
  dispatch(updateUserStart());

  try {
    const formData = new FormData();
    let tempImageUrl = null;

    if (username !== currentUser?.user?.username) formData.append("username", username);
    if (email !== currentUser?.user?.email) formData.append("email", email);
    if (password) formData.append("password", password);
    if (file) {
      formData.append("avatar", file);
      tempImageUrl = URL.createObjectURL(file);
      dispatch(updateUserSuccess({ ...currentUser.user, avatar: tempImageUrl }));
    }

    if ([...formData.entries()].length === 0) {
      setUpdateError("No changes to update");
      setIsLoading(false);
      return;
    }

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${currentUser.user._id}`, {
      method: "PATCH",
      headers: { Authorization: `Bearer ${currentUser.token}` },
      body: formData,
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Update failed");

    if (tempImageUrl) URL.revokeObjectURL(tempImageUrl);
    setFile(null);
    setPreviewUrl('');

    dispatch(updateUserSuccess(data.user));
    setUpdateSuccess(true);
    setPassword('');

    setTimeout(() => setUpdateSuccess(false), 3000);

  } catch (err) {
    console.error("Update error:", err);
    dispatch(updateUserFailure(err.message));
    setUpdateError(err.message || "Failed to update profile");
  } finally {
    setIsLoading(false);
  }
};


  const handleDeleteUser = async () => {
    const userId = currentUser?.user?._id;
      
  try {
    dispatch(deleteUserStart());

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/delete/${userId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${currentUser.token}`,
  },
});

    const data = await res.json();

    if (!res.ok || data.success === false) {
      dispatch(deleteUserFailure(data.message || "Failed to delete user"));
      console.error("Delete failed:", data.message);
      alert(data.message || "Failed to delete user");
      return;
    }

    console.log("Profile deleted successfully:", data.message);
    alert(data.message || "Profile deleted successfully!");
    dispatch(deleteUserSuccess(data));

  } catch (error) {
    console.error("Delete error:", error.message);
    dispatch(deleteUserFailure(error.message));
  }
};



const handleSignOut = () => {
  try {
    // Dispatch Redux action to reset user state
    dispatch(SignOutUserStart());

    // Remove JWT token from localStorage (or cookies if you use them)
    localStorage.removeItem("token");

    // Reset user state in Redux
    dispatch(deleteUserSuccess(null)); // or a dedicated signOutSuccess action

    // Notify user
    alert("Signed out successfully!");

    
  } catch (error) {
    console.error("Sign out error:", error.message);
    dispatch(deleteUserFailure(error.message));
  }
};


const handleShowListings = async () => {
    const userId = currentUser?.user?._id;
      
  try {
    setShowListingError(false);
    
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/listings/${userId}`, {
  method: "GET",
  headers: {
    Authorization: `Bearer ${currentUser.token}`,
  },
});

    const data = await res.json();

    if (!res.ok) {
      setShowListingError(true);
      console.error("Listing fetch failed:", data?.message || data);
      alert(data?.message || 'Failed to get listings!');
      return;
    }

    // API returns { listings: [...] }
    const listings = Array.isArray(data) ? data : data?.listings ?? [];
    setUserListings(listings);
    

  } catch (error) {

    setShowListingError(true);
    console.error("Listing Fetch error:", error.message);
    
  }
};



const handleListingDelete = async (listingId) => {
    
      
  try {
    

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/listing/delete/${listingId}`, {
  method: "DELETE",
  headers: {
    Authorization: `Bearer ${currentUser.token}`,
  },
});

    const data = await res.json();
    if (!res.ok) {
      console.error("Delete failed:", data?.message || data);
      alert(data?.message || 'Failed to delete listing!');
      return;
    }

    // Update local list (ensure array)
    setUserListings((prev) => Array.isArray(prev) ? prev.filter((listing) => listing._id !== listingId) : []);

    console.log("Listing deleted successfully:", data);
    alert((data && (data.message || data)) || 'Listing deleted successfully!');
    

  } catch (error) {
    console.error("Delete error:", error.message);
    
  }
};


  return (
    <>
  <SafeHelmet>
        <title>My Profile | Manage Listings - Rodvers</title>
        <meta
          name="description"
          content="Manage your Rodvers Listings profile. Edit your information, update listings, view your ads, and connect with buyers."
        />
        <meta
          name="keywords"
          content="my profile, manage listings, user profile, profile settings"
        />
        <meta name="robots" content="noindex, follow" />
        <link rel="canonical" href="https://listings-chvc.onrender.com/profile" />
  </SafeHelmet>

      <div>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
      
      {/* Success message */}
      {updateSuccess && (
        <div className="max-w-lg mx-auto mb-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">Profile updated successfully!</span>
          </div>
        </div>
      )}
      
      {/* Error message */}
      {updateError && (
        <div className="max-w-lg mx-auto mb-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{updateError}</span>
          </div>
        </div>
      )}

      <form className="max-w-lg mx-auto flex flex-col gap-4 p-6" onSubmit={handleSubmit}>

        <input
          onChange={(e) => setFile(e.target.files?.[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2"
          src={previewUrl || currentUser?.user?.avatar}
          alt={`${currentUser?.user?.username}'s profile`}
          onError={(e) => {
            e.target.onerror = null; // Prevent infinite loop
            e.target.src = "/favicon.svg";
          }}
        />
        

        <input type="text" placeholder="username" className="border p-3 rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="email" className="border p-3 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" className="border p-3 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button 
          type="submit" 
          disabled={isLoading}
          className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4 flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating...
            </>
          ) : 'Update'}
        </button>
        <Link className="bg-green-700  text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4" to={'/create-listing'}> Create Listing </Link>
      </form>

      <div className="flex justify-between gap-4 max-w-lg mx-auto p-6">
        <span onClick={handleDeleteUser} className="text-red-700 cursor-pointer">Delete Account</span>
        <span onClick={handleSignOut} className="text-red-700 cursor-pointer">Sign Out</span>
      </div>

        <button onClick={handleShowListings} className="text-green-700 w-full p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4">Show Listings</button>
        <p className="text-red-700 mt-5">{showListingError ? "Error showing Listings!" : ""}</p>

        {userListings && userListings.length > 0 && (
  <div className="flex flex-col gap-4">
    <h1 className="text-center mt-7 text-2xl font-semibold">Your Listings</h1>

    {userListings.map((listing) => (
      <div
        key={listing._id}
        className="border rounded-lg p-3 flex justify-between items-center gap-4"
      >
        <Link to={`/listing/${listing._id}`}>
          <img
            src={listing.imageUrls?.[0] || "/favicon.svg"}
            alt="Listing cover image"
            className="h-16 w-16 object-contain"
          />
        </Link>

        <Link
          className="text-slate-700 font-semibold flex-1 hover:underline truncate"
          to={`/listing/${listing._id}`}
        >
          <p>{listing.name}</p>
        </Link>

        <div className="flex flex-col items-center">
          <button onClick={()=>handleListingDelete(listing._id)} className="text-red-700 uppercase">Delete</button>
          <Link to={`/update-listing/${listing._id}`}>
            <button className="text-green-700 uppercase">Edit</button>
          </Link>
        </div>
      </div>
    ))}
  </div>
)}


    </div>
    </>
  );
}
