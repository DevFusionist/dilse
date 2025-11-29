import crypto from 'crypto';
import clientPromise from '../../../lib/mongodb';
import { ObjectId } from 'mongodb';
import { sendOrderConfirmationEmail, sendPaymentFailedEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    // Validate required fields
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        error: 'Missing required payment details',
      });
    }

    // Generate the expected signature
    const body = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest('hex');

    // Verify the signature
    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      const client = await clientPromise;
      const db = client.db('dilse');
      const ordersCollection = db.collection('orders');
      const paymentsCollection = db.collection('payments');

      // Find the order by razorpay order ID
      const order = await ordersCollection.findOne({
        razorpayOrderId: razorpay_order_id,
      });

      if (!order) {
        return res.status(404).json({
          success: false,
          error: 'Order not found',
        });
      }

      // Save payment record
      const paymentData = {
        orderId: order._id,
        razorpayOrderId: razorpay_order_id,
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        amount: order.amount,
        currency: order.currency,
        status: 'success',
        verified: true,
        createdAt: new Date(),
      };

      const paymentResult = await paymentsCollection.insertOne(paymentData);

      // Update order status to paid
      await ordersCollection.updateOne(
        { _id: order._id },
        {
          $set: {
            status: 'paid',
            paymentId: paymentResult.insertedId,
            updatedAt: new Date(),
          },
        }
      );

      // Send order confirmation email
      try {
        await sendOrderConfirmationEmail(order, paymentData);
      } catch (emailError) {
        console.error('Error sending order confirmation email:', emailError);
        // Don't fail the request if email fails
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      // Save failed payment attempt
      const client = await clientPromise;
      const db = client.db('dilse');
      const ordersCollection = db.collection('orders');
      const paymentsCollection = db.collection('payments');

      const order = await ordersCollection.findOne({
        razorpayOrderId: razorpay_order_id,
      });

      if (order) {
        const paymentData = {
          orderId: order._id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
          razorpaySignature: razorpay_signature,
          amount: order.amount,
          currency: order.currency,
          status: 'failed',
          verified: false,
          failureReason: 'Signature verification failed',
          createdAt: new Date(),
        };

        await paymentsCollection.insertOne(paymentData);

        await ordersCollection.updateOne(
          { _id: order._id },
          {
            $set: {
              status: 'failed',
              updatedAt: new Date(),
            },
          }
        );

        // Send payment failed email
        try {
          await sendPaymentFailedEmail(order, 'Signature verification failed');
        } catch (emailError) {
          console.error('Error sending payment failed email:', emailError);
          // Don't fail the request if email fails
        }
      }

      res.status(400).json({
        success: false,
        error: 'Payment verification failed',
      });
    }
  } catch (error) {
    console.error('Error verifying payment:', error);
    res.status(500).json({
      success: false,
      error: 'Payment verification error',
    });
  }
}

