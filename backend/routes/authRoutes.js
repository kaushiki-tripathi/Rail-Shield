import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import { validateRegisterPassenger } from '../middleware/validate.js';

const router = express.Router();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Simple in-memory rate limiter per email (for OTP requests)
// Note: this is suitable only for demonstration/local use. Use a distributed store (Redis)
// for production.
const otpRateLimit = new Map(); // email -> { count, firstRequestAt }
const OTP_LIMIT = 5; // max requests
const OTP_WINDOW_MS = 60 * 60 * 1000; // 1 hour
// Store last OTPs for dev testing only
const lastOtpMap = new Map(); // email -> otp

router.post('/register-passenger', validateRegisterPassenger, async (req, res) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: 'Name and email are required.' });
  }

  // Rate limiting check
  const key = email.toLowerCase();
  const entry = otpRateLimit.get(key) || { count: 0, firstRequestAt: Date.now() };
  const now = Date.now();
  if (now - entry.firstRequestAt > OTP_WINDOW_MS) {
    entry.count = 0;
    entry.firstRequestAt = now;
  }
  if (entry.count >= OTP_LIMIT) {
    return res.status(429).json({ message: 'Too many OTP requests. Please try again later.' });
  }
  entry.count += 1;
  otpRateLimit.set(key, entry);

  try {
    let user = await User.findOne({ email });

    if (!user) {
      user = new User({ name, email, role: 'Passenger' });
    } else {
      user.name = name;
    }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.otp = otp;
    user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 mins

  // Store last OTP for dev retrieval
  try { lastOtpMap.set(email.toLowerCase(), otp); } catch {}

    await user.save();

    // Send OTP email if email credentials are configured
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'RailShield OTP Verification',
        text: `Your OTP is ${otp}. It expires in 10 minutes.`,
      };

      try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'OTP sent successfully to your email.' });
      } catch (sendErr) {
        // If send fails (invalid creds, SMTP error), log OTP and return success for dev convenience
        console.error('Failed to send OTP email, falling back to dev logging:', sendErr);
        console.log(`DEV OTP for ${email}: ${otp}`);
        res.status(200).json({ message: 'OTP generated (dev mode, email send failed), check server logs.' });
      }
    } else {
      // In dev without email configured, log OTP so developer can use it
      console.log(`DEV OTP for ${email}: ${otp}`);
      res.status(200).json({ message: 'OTP generated (dev mode), check server logs.' });
    }
  } catch (error) {
    console.error('Error in passenger registration:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// The OTP verification route is unchanged
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required.' });
    }
    try {
        const user = await User.findOne({
            email:email,
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
        // Access token short-lived
        const accessToken = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '15m' });
        // Refresh token long-lived
        const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        user.refreshToken = refreshToken;
        await user.save();

        // Set refresh token as httpOnly cookie
        res.cookie('token', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
        });

        res.status(200).json({
            message: 'Login successful!',
            accessToken: accessToken,
            user: { id: user.id, name: user.name }
        });
    } catch (error) {
        console.error("Error in OTP verification:", error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Refresh token endpoint
router.post('/refresh-token', async (req, res) => {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(401).json({ message: 'No refresh token' });
    let payload;
    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }
    const user = await User.findById(payload.id);
    if (!user) return res.status(401).json({ message: 'Invalid refresh token' });

    // Detect token reuse: if token doesn't match stored refreshToken, clear stored token and force login
    if (user.refreshToken !== token) {
      user.refreshToken = undefined;
      await user.save();
      res.clearCookie('token');
      return res.status(401).json({ message: 'Refresh token reuse detected. Please login again.' });
    }

    // Rotate refresh token: issue new refresh token and replace stored one
    const newRefresh = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '30d' });
    user.refreshToken = newRefresh;
    await user.save();
    res.cookie('token', newRefresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 30 * 24 * 60 * 60 * 1000
    });

    const newAccess = jwt.sign({ id: user.id, name: user.name, role: user.role }, process.env.JWT_SECRET, { expiresIn: '15m' });
    res.json({ accessToken: newAccess });
  } catch (error) {
    console.error('Error in refresh-token:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout route: clears refresh token and cookie
router.post('/logout', async (req, res) => {
  try {
    const token = req.cookies && req.cookies.token;
    if (!token) return res.status(204).send();
    let payload;
    try { payload = jwt.verify(token, process.env.JWT_SECRET); } catch (err) { }
    if (payload) {
      const user = await User.findById(payload.id);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }
    res.clearCookie('token');
    res.status(200).json({ message: 'Logged out' });
  } catch (error) {
    console.error('Error in logout:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;

// Dev-only endpoint to retrieve last OTP for an email (dangerous in production)
// Usage: GET /api/auth/dev-otp?email=you@example.com
router.get('/dev-otp', (req, res) => {
  if (process.env.NODE_ENV === 'production') return res.status(404).send();
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'email query required' });
  const otp = lastOtpMap.get(String(email).toLowerCase()) || null;
  res.json({ email, otp });
});