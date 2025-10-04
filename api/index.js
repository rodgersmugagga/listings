import express, { json } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import cors from 'cors';   
import helm from 'helmet';  

// Load environment variables from .env file
dotenv.config();

mongoose.connect(process.env.MONGO).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
});

const app = express();
app.use(express.json());

app.listen(3000, () => {
    console.log('Server is running on port 3000');
} );


app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);



