import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import reportRoutes from './routes/reportRoutes.js';
import authRoutes from './routes/authRoutes.js';
dotenv.config();

console.log("--- Checking Twilio Environment Variables ---");
console.log("Account SID from .env:", process.env.TWILIO_ACCOUNT_SID);
console.log("Auth Token from .env:", process.env.TWILIO_AUTH_TOKEN ? "Loaded Successfully" : "MISSING or Wrong Name");
console.log("-----------------------------------------");

const app = express();
const PORT = process.env.PORT || 5000;


app.use(express.json());
app.use(cors());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected successfully.');
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    process.exit(1);
  }
};
connectDB();

app.get('/', (req, res) => {
  res.send('Welcome to the RailShield API! The server is running.');
});

// --- NEW: Tell the app to use our report routes ---
// Any request to '/api/reports' will be handled by our reportRoutes

// Register auth routes
app.use('/api/auth', authRoutes);
app.use('/api/reports', reportRoutes);

app.listen(PORT, () => {
  console.log(`Server is running successfully on http://localhost:${PORT}`);
});



