//import mongoose
import mongoose from "mongoose"; 

// Define the User schema
const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar:{ type: String, default: "https://res.cloudinary.com/dnj7dtnvx/image/upload/v1763294361/vecteezy_user-avatar-ui-button_13907861_j7b38y.jpg" },
}, { timestamps: true });

// Create and export the User model
const User = mongoose.model('User', userSchema);

export default User;