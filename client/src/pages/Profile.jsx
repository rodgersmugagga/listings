import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { deleteUserFailure, deleteUserStart, deleteUserSuccess, SignOutUserStart, updateUserAvatar } from "../redux/user/userSlice.js";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("username", username);
    formData.append("email", email);
    if (password) formData.append("password", password);
    if (file) formData.append("avatar", file);

    try {
      const userId = currentUser?.user?._id;
      const token = currentUser?.token;

      if (!userId || !token) return alert("User not loaded yet");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${userId}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
          
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");
      //dispatch(updateUserSuccess(data))

      console.log("Profile updated:", data.user);
      if (file) dispatch(updateUserAvatar(data.user.avatar));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.message);
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

    if (!res.ok || data.success === false) {
      setShowListingError(true);
      
      console.error("Listing fetch failed:", data.message);
      alert(data.message || "Failed get listings!");
      return;
    }

    setUserListings(data);
    

  } catch (error) {

    setShowListingError(true);
    console.error("Listing Fetch error:", error.message);
    
  }
};



  return (
    <div>
      <h1 className="text-3xl font-semibold text-center my-7">Profile</h1>
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
          src={previewUrl || currentUser?.user?.avatar || "https://avatars.githubusercontent.com/u/219873324?s=400&u=101a5f849e9b243737aee4b3b950c700272efb4b&v=4"}
          alt="profile"
        />
        

        <input type="text" placeholder="username" className="border p-3 rounded-lg" value={username} onChange={(e) => setUsername(e.target.value)} />
        <input type="email" placeholder="email" className="border p-3 rounded-lg" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="password" className="border p-3 rounded-lg" value={password} onChange={(e) => setPassword(e.target.value)} />

        <button type="submit" className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80 mt-4">Update</button>
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
            src={listing.imageUrls?.[0] || "/placeholder.jpg"}
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
          <button className="text-red-700 uppercase">Delete</button>
          <button className="text-green-700 uppercase">Edit</button>
        </div>
      </div>
    ))}
  </div>
)}


    </div>
  );
}
