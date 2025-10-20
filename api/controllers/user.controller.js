import cloudinary from '../utils/cloudinary.js';
import User from '../models/user.model.js';
import bcryptjs from 'bcryptjs';  



// Update avatar controller
export const updateAvatar = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "No file uploaded" });

    const userId = req.user.user.id; // from auth middleware

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload_stream(
      {
        folder: "listings_app_avatars",
        width: 400,
        height: 400,
        crop: "limit",
      },
      async (error, uploadedImage) => {
        if (error) return res.status(500).json({ message: error.message });

        // Save Cloudinary URL in MongoDB
        const updatedUser = await User.findByIdAndUpdate(
          userId,
          { avatar: uploadedImage.secure_url },
          { new: true }
        ).select("-password");

        res.status(200).json({
          message: "Avatar updated successfully",
          user: updatedUser,
        });
      }
    );

    result.end(req.file.buffer); // pipe the file buffer
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

export const test = (req, res) => {
    res.json({ 
      message: "I am Rodgers Mugagga and i am the best software engineer in Africa",
    });
}; 


export const updateUser = async (req, res) => {
  try {
    const userId = req.user.user.id;
    const targetUserId = req.params.id;

    if (userId.toString() !== targetUserId.toString()) {
      return res.status(401).json({ message: 'You can only update your own profile!' });
    }

    const updateData = {
      username: req.body.username,
      email: req.body.email,
    };

    if (req.body.password) {
  const salt = await bcryptjs.genSalt(10);
  updateData.password = await bcryptjs.hash(req.body.password, salt);
}

    if (req.file && req.file.path) {
      updateData.avatar = req.file.path; // Cloudinary URL
    }

    const updatedUser = await User.findByIdAndUpdate(targetUserId, updateData, { new: true }).select('-password');

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user: updatedUser,
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};
