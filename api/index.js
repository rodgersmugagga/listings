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

// Helmet Security Policy – Firebase & Google Sign-In compatible
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],

        scriptSrc: [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://apis.google.com",
          "https://www.gstatic.com",
        ],

        styleSrc: [
          "'self'",
          "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],

        imgSrc: [
          "'self'",
          "data:",
          "https://res.cloudinary.com",
          "https://lh3.googleusercontent.com", // Google avatars
        ],

        connectSrc: [
          "'self'",
          process.env.VITE_API_URL || "*",
          "https://*.firebaseio.com",
          "https://*.googleapis.com",
          "https://*.gstatic.com",
          "https://*.googleusercontent.com",
        ],

        fontSrc: [
          "'self'",
          "https:",
          "data:",
        ],

        frameSrc: [
          "'self'",
          "https://accounts.google.com",
          "https://*.firebaseapp.com",
        ],

        frameAncestors: ["'self'", "https://accounts.google.com"],

        objectSrc: ["'none'"],
        upgradeInsecureRequests: [],
      },
    },
  })
);

app.use(cors());
app.use(express.json());

// Routes
app.use("/api/user", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/listing", listingRouter);

// __dirname replacement for ESM
const __dirname = path.resolve();

// Serve static files from client
app.use(express.static(path.join(__dirname, '/client/dist')));

// React routing
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) return next();
  res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

// MongoDB Connection
mongoose.connect(process.env.MONGO, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 5000,
})
.then(() => {
  console.log('Connected to MongoDB');

  Promise.all([Listing.syncIndexes(), User.syncIndexes()])
    .then(res => console.log('Indexes synchronized:', res.map(r => Object.keys(r || {}))))
    .catch(err => console.error('Error syncing indexes:', err));
})
.catch(error => {
  console.error('Error connecting to MongoDB:', error);
  process.exit(1);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));
