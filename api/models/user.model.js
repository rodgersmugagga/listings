//import mongoose
import mongoose from "mongoose"; 

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar:{ type: String, default: "https://avatars.githubusercontent.com/u/219873324?s=400&u=101a5f849e9b243737aee4b3b950c700272efb4b&v=4" },
}, { timestamps: true });

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;