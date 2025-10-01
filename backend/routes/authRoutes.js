import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @route   POST /api/auth/register-passenger
// Humne ismein se Twilio ka code hata diya hai
router.post('/register-passenger', async (req, res) => {
    const { name, mobileNumber } = req.body;

    if (!name || !mobileNumber) {
        return res.status(400).json({ message: 'Name and mobile number are required.' });
    }

    try {
        let user = await User.findOne({ mobileNumber });

        if (!user) {
            user = new User({ name, mobileNumber, role: 'Passenger' });
        } else {
            user.name = name;
        }

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes from now
        
        await user.save();

        // --- Back to the simple console.log for testing ---
        console.log(`OTP for ${mobileNumber} is: ${otp}`);
        
        res.status(200).json({ message: 'OTP sent successfully. Please check your console for now.' });

    } catch (error) {
        console.error("Error in passenger registration:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// The OTP verification route is unchanged
router.post('/verify-otp', async (req, res) => {
    const { mobileNumber, otp } = req.body;
    if (!mobileNumber || !otp) {
        return res.status(400).json({ message: 'Mobile number and OTP are required.' });
    }
    try {
        const user = await User.findOne({
            mobileNumber: mobileNumber,
            otp: otp,
            otpExpires: { $gt: Date.now() }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP. Please try again.' });
        }
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();
        const payload = { id: user.id, name: user.name, role: user.role };
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '30d' });
        res.status(200).json({
            message: 'Login successful!',
            token: token,
            user: { id: user.id, name: user.name }
        });
    } catch (error) {
        console.error("Error in OTP verification:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;