import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from './models/User.js'; // Make sure this path is correct

// Load .env variables (like MONGO_URI)
dotenv.config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

const createAdmin = async () => {
  // Connect to the database
  await connectDB();

  try {
    // Check if an admin user already exists
    const adminExists = await User.findOne({ role: 'Admin' });
    
    if (adminExists) {
      console.log('Admin user already exists.');
      mongoose.connection.close();
      return;
    }

    // --- DEFINE YOUR ADMIN'S LOGIN DETAILS HERE ---
    const adminEmail = 'admin@railshield.com';
    const adminPassword = 'admin_password123'; // Choose a secure password

    // Create the new admin user
    const adminUser = new User({
      name: 'Admin Authority',
      email: adminEmail,
      password: adminPassword, // This will be hashed automatically by your pre-save hook
      role: 'Admin',
      isVerified: true // Admins don't need OTP
    });

    await adminUser.save();
    
    console.log('Admin user created successfully!');
    console.log(`Email: ${adminEmail}`);
    console.log(`Password: ${adminPassword}`);

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    // Disconnect from the database
    mongoose.connection.close();
    console.log('MongoDB connection closed.');
  }
};

// Run the function
createAdmin();