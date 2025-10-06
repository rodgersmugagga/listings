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

//user login controller
export const login = async(req, res) => {
    try {
      //get user input
      const { email, password } = req.body;

      //check if user exists
      let user = await User.findOne({ email });
      if(!user) {
        return res.status(400).json({ message: "Invalid Credentials" });
      }

      //compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if(!isMatch) {
        return res.status(400).json({ message: 'Invalid Credentials' });
      }

      //generate a JWT token
      const token = jwt.sign(
        { user: { id: user.id } },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );

      //return a success response with the token
      res.json({ token });
      

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};

//user logout controller
export const logout = (req, res) => {
    // Invalidate the token on the client side by removing it from storage
    res.json({ message: 'User logged out successfully' });
};


//export the controllers
//export default { signup, login, logout }; 