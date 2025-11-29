import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get userId from cookie
    const cookies = req.headers.cookie || '';
    const userIdMatch = cookies.match(/userId=([^;]+)/);
    
    if (!userIdMatch) {
      return res.status(200).json({
        success: false,
        user: null,
      });
    }

    const userId = userIdMatch[1];

    // Validate ObjectId format
    if (!ObjectId.isValid(userId)) {
      return res.status(200).json({
        success: false,
        user: null,
      });
    }

    const client = await clientPromise;
    const db = client.db('dilse');
    const usersCollection = db.collection('users');

    // Find user
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return res.status(200).json({
        success: false,
        user: null,
      });
    }

    // Return user without password
    const userData = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
    };

    res.status(200).json({
      success: true,
      user: userData,
    });
  } catch (error) {
    console.error('Auth check error:', error);
    // Clear invalid cookie if ObjectId is invalid
    if (error.message && error.message.includes('ObjectId')) {
      res.setHeader('Set-Cookie', 'userId=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0');
    }
    res.status(200).json({
      success: false,
      user: null,
    });
  }
}

