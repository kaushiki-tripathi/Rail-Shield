import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js';
import cookieParser from 'cookie-parser';
import errorHandler from './middleware/errorHandler.js';
dotenv.config();


const app = express();
const PORT = process.env.PORT || 5000;

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

app.use(express.json());
app.use(cookieParser());
// Allow credentialed requests from the frontend origin
app.use(cors({ origin: FRONTEND_URL, credentials: true }));

const connectDB = async () => {
  try {
    if (process.env.MONGO_URI) {
      await mongoose.connect(process.env.MONGO_URI);
      console.log('MongoDB Connected successfully.');
    }
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    if (process.env.NODE_ENV === 'test') {
      // do not exit in test
      return;
    }
    process.exit(1);
  }
};

// Connect DB only when not in test environment to avoid test interference
if (process.env.NODE_ENV !== 'test') {
  connectDB();
}

app.get('/', (req, res) => {
  res.send('Welcome to the RailShield API! The server is running.');
});

// Register auth routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

// Error handler (last middleware)
app.use(errorHandler);

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server is running successfully on http://localhost:${PORT}`);
  });
}

export default app;



