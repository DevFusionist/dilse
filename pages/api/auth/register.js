import clientPromise from '../../../lib/mongodb';
import bcrypt from 'bcryptjs';
import { generateOTP, sendOTPEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    return handleRegistration(req, res);
  } else if (req.method === 'PUT') {
    return handleOTPVerification(req, res);
  } else {
    return res.status(405).json({ error: 'Method not allowed' });
  }
}

async function handleRegistration(req, res) {
  try {
    const { name, email, password, phone } = req.body;

    // Validate input
    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters',
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        error: 'Phone must be 10 digits',
      });
    }

    const client = await clientPromise;
    const db = client.db('dilse');
    const usersCollection = db.collection('users');
    const otpsCollection = db.collection('otps');

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // Generate OTP
    const otp = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    // Store OTP with user data
    await otpsCollection.updateOne(
      { email },
      {
        $set: {
          email,
          name,
          password: await bcrypt.hash(password, 10),
          phone,
          otp,
          expiresAt,
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp);
    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        error: 'Failed to send OTP email. Please try again.',
      });
    }

    res.status(200).json({
      success: true,
      message: 'OTP sent to your email. Please verify to complete registration.',
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to process registration',
    });
  }
}

async function handleOTPVerification(req, res) {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required',
      });
    }

    const client = await clientPromise;
    const db = client.db('dilse');
    const usersCollection = db.collection('users');
    const otpsCollection = db.collection('otps');

    // Find OTP record
    const otpRecord = await otpsCollection.findOne({ email });
    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        error: 'OTP not found. Please request a new OTP.',
      });
    }

    // Check if OTP is expired
    if (new Date() > otpRecord.expiresAt) {
      await otpsCollection.deleteOne({ email });
      return res.status(400).json({
        success: false,
        error: 'OTP has expired. Please request a new OTP.',
      });
    }

    // Verify OTP
    if (otpRecord.otp !== otp) {
      return res.status(400).json({
        success: false,
        error: 'Invalid OTP. Please try again.',
      });
    }

    // Check if user already exists (race condition check)
    const existingUser = await usersCollection.findOne({ email });
    if (existingUser) {
      await otpsCollection.deleteOne({ email });
      return res.status(400).json({
        success: false,
        error: 'User with this email already exists',
      });
    }

    // Create user
    const newUser = {
      name: otpRecord.name,
      email: otpRecord.email,
      password: otpRecord.password,
      phone: otpRecord.phone,
      emailVerified: true,
      createdAt: new Date(),
    };

    const result = await usersCollection.insertOne(newUser);

    // Delete OTP record
    await otpsCollection.deleteOne({ email });

    // Return user without password
    const user = {
      id: result.insertedId.toString(),
      name: newUser.name,
      email: newUser.email,
      phone: newUser.phone,
    };

    // Set session cookie
    res.setHeader('Set-Cookie', `userId=${result.insertedId.toString()}; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`);

    res.status(200).json({
      success: true,
      user,
      message: 'Registration successful!',
    });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to verify OTP',
    });
  }
}
