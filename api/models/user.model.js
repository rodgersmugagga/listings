//import mongoose
import mongoose from "mongoose"; 

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar:{ type: String, default: "https://res.cloudinary.com/dnj7dtnvx/image/upload/v1760363461/samples/zoom.avif" },
}, { timestamps: true });

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;