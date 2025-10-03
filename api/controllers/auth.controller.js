import User from '../models/user.model.js'
import bcrypt from 'bcryptjs';

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