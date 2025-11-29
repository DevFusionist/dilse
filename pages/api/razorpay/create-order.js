import Razorpay from 'razorpay';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Check if user is authenticated
    const cookies = req.headers.cookie || '';
    const userIdMatch = cookies.match(/userId=([^;]+)/);
    
    if (!userIdMatch) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please login to proceed with payment.',
      });
    }

    const userId = userIdMatch[1];
    const client = await clientPromise;
    const db = client.db('dilse');
    const usersCollection = db.collection('users');

    // Verify user exists
    const user = await usersCollection.findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Authentication required. Please login to proceed with payment.',
      });
    }

    const { amount, receipt, notes, items } = req.body;

    // Validate amount
    if (!amount || amount <= 0) {
      return res.status(400).json({ error: 'Invalid amount' });
    }

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'Items are required' });
    }

    // Create order options - Only INR currency supported (India only)
    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency: 'INR', // Hardcoded to INR for India-only operations
      receipt: receipt || `receipt_${Date.now()}`,
      notes: notes || {},
    };

    // Create the order in Razorpay
    const razorpayOrder = await razorpay.orders.create(options);

    // Save order to database
    const ordersCollection = db.collection('orders');
    const orderData = {
      userId: new ObjectId(userId),
      razorpayOrderId: razorpayOrder.id,
      amount: amount,
      currency: 'INR',
      status: 'created', // created, paid, failed, cancelled
      items: items, // Array of cart items
      shippingAddress: notes?.shippingAddress || '',
      customerName: notes?.customerName || user.name,
      customerEmail: notes?.customerEmail || user.email,
      customerPhone: notes?.customerPhone || user.phone,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const orderResult = await ordersCollection.insertOne(orderData);

    res.status(200).json({
      success: true,
      order: razorpayOrder,
      orderId: orderResult.insertedId.toString(),
    });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create order',
    });
  }
}

