import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRouter from './routes/user.route.js';
import authRouter from './routes/auth.route.js';
import listingRouter from './routes/listing.route.js';
import Listing from './models/listing.model.js';
import User from './models/user.model.js';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';

dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);


//
app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});


// MongoDB connection
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000
}).then(() => {
  console.log('Connected to MongoDB');
  // Ensure indexes are synchronized on startup for predictable query performance.
  // syncIndexes will create any indexes defined on the schema that are missing, and
  // remove indexes that are no longer defined.
  Promise.all([
    Listing.syncIndexes(),
    User.syncIndexes()
  ]).then((res) => {
    console.log('Indexes synchronized:', res.map(r => Object.keys(r || {})));
  }).catch((err) => {
    console.error('Error syncing indexes:', err);
  });
}).catch((error) => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

//

const __dirname = path.resolve();

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
