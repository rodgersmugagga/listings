import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
//import router from './routes/user.route.js';


dotenv.config();

mongoose.connect(process.env.MONGO, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((error) => {
    console.error('Error connecting to MongoDB:', error);
});

const app = express();

app.listen(3000, () => {
    console.log('Server is running on port 3000');
} );


app.use("/api/users", userRouter);
