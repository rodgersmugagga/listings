import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();  

//user signup controller
export const signup = async(req, res) => {
  
    try {
      //get user input
      const {username, email, password} = req.body;

      //check if user already exists
      let user = await User.findOne({ email });
      if(user) {
        return res.status(400).json({ message: 'User already exists' });
      }

      //hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      //create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword
      });

      //save a user to the database
      await newUser.save(); 

      //return a success response
      res.status(201).json("User successfully created!");

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }

};

//user signin controller
export const signin = async(req, res) => {
    try {
      //get user input
      const { email, password } = req.body;

      //check if user exists
      let user = await User.findOne({ email });
      if(!user) {
        return res.status(400).json({ message: "User not found!" });
      }

      //compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(400).json({ message: 'Invalid password!' });
      }

      //generate a JWT token
      const token = jwt.sign(
        { user: { id: user.id } },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      //return a success response with the token
      res.json({ 
        message: "Login successful", 
        token: token
       });
      

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//user logout controller
export const logout = (req, res) => {
    // Invalidate the token on the client side by removing it from storage
    res.json({ message: 'User logged out successfully' });
};


// Google Authentication Controller
export const google = async (req, res, next) => {
  try {
    // Extract user data from the request body (sent from frontend Google login)
    const { email, username, photo } = req.body;

    // Check if the user already exists
    let user = await User.findOne({ email });

    if (user) {
      // Existing user: generate JWT and return it
      const token = jwt.sign(
        { id: user._id, isAdmin: user.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "1h" } // token validity
      ); 

      const { password, ...userData } = user._doc;

      res.status(200).json({ token, user: userData });
    } else {
      // Generate a random password (not used, but required by schema)
      const randomPassword = Math.random().toString(36).slice(-8);

      // Hash the random password for security
      const hashedPassword = await bcrypt.hash(randomPassword, 10);

      // Create a new user with Google data
      const newUser = new User({
        username : req.body.name.split(" ").toLowerCase() + Math.random().toString(36).slice(-4),
        email,
        password: hashedPassword,
        avatar: req.body.photo,
      });

      // Save to DB
      await newUser.save();

      // Generate a JWT for the new user
      const token = jwt.sign(
        { id: newUser._id, isAdmin: newUser.isAdmin },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      const { password, ...userData } = newUser._doc;

      res.status(201).json({ token, user: userData });
    }
  } catch (error) {
    next(error);
  }
};