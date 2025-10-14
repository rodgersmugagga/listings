import { useSelector, useDispatch } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { updateUserAvatar } from "../redux/user/userSlice.js";

export default function Profile() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const fileRef = useRef(null);

  const [file, setFile] = useState(null);
  const [username, setUsername] = useState(currentUser?.user?.username || '');
  const [email, setEmail] = useState(currentUser?.user?.email || '');
  const [password, setPassword] = useState('');

  const [previewUrl, setPreviewUrl] = useState("");
  const [uploading, setUploading] = useState(false);

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
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/user/update/${currentUser.user.id}`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed");

      console.log("Profile updated:", data.user);
      if (file) dispatch(updateUserAvatar(data.user.avatar));
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Update error:", err);
      alert(err.message);
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
      </form>

      <div className="flex justify-between gap-4 max-w-lg mx-auto p-6">
        <span className="text-red-700 cursor-pointer">Delete Account</span>
        <span className="text-red-700 cursor-pointer">Sign Out</span>
      </div>
    </div>
  );
}
