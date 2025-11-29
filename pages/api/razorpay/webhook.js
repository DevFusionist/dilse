import crypto from 'crypto';
import clientPromise from '../../../lib/mongodb';
import { sendOrderConfirmationEmail, sendPaymentFailedEmail } from '../../../lib/email';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const webhookSignature = req.headers['x-razorpay-signature'];
    
    if (!webhookSignature) {
      return res.status(400).json({ error: 'Missing webhook signature' });
    }

    // For Razorpay webhook signature verification, we need the raw body
    // But Next.js parses it, so we'll verify with the parsed body
    // In production, you might want to use bodyParser: false and get raw body
    const webhookBody = JSON.stringify(req.body);
    const event = req.body;

    // Verify webhook signature
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_WEBHOOK_SECRET || process.env.RAZORPAY_KEY_SECRET)
      .update(webhookBody)
      .digest('hex');

    if (webhookSignature !== expectedSignature) {
      console.error('Webhook signature verification failed');
      return res.status(400).json({ error: 'Invalid webhook signature' });
    }

    const client = await clientPromise;
    const db = client.db('dilse');
    const ordersCollection = db.collection('orders');
    const paymentsCollection = db.collection('payments');

    // Handle different webhook events
    switch (event.event) {
      // Payment Events
      case 'payment.authorized':
        await handlePaymentAuthorized(event, ordersCollection, paymentsCollection);
        break;

      case 'payment.captured':
        await handlePaymentCaptured(event, ordersCollection, paymentsCollection);
        break;

      case 'payment.failed':
        await handlePaymentFailed(event, ordersCollection, paymentsCollection);
        break;

      case 'payment.dispute.created':
      case 'payment.dispute.won':
      case 'payment.dispute.lost':
      case 'payment.dispute.closed':
      case 'payment.dispute.under_review':
      case 'payment.dispute.action_required':
        await handlePaymentDispute(event, ordersCollection, paymentsCollection);
        break;

      case 'payment.downtime.started':
      case 'payment.downtime.updated':
      case 'payment.downtime.resolved':
        await handlePaymentDowntime(event, ordersCollection, paymentsCollection);
        break;

      // Order Events
      case 'order.paid':
        await handleOrderPaid(event, ordersCollection, paymentsCollection);
        break;

      case 'order.notification.delivered':
      case 'order.notification.failed':
        await handleOrderNotification(event, ordersCollection, paymentsCollection);
        break;

      // Refund Events
      case 'refund.created':
      case 'refund.processed':
      case 'refund.failed':
      case 'refund.speed_changed':
        await handleRefund(event, ordersCollection, paymentsCollection);
        break;

      // Invoice Events
      case 'invoice.paid':
      case 'invoice.partially_paid':
      case 'invoice.expired':
        await handleInvoice(event, ordersCollection, paymentsCollection);
        break;

      // Payment Link Events
      case 'payment_link.paid':
      case 'payment_link.partially_paid':
      case 'payment_link.expired':
      case 'payment_link.cancelled':
        await handlePaymentLink(event, ordersCollection, paymentsCollection);
        break;

      // Settlement Events
      case 'settlement.processed':
        await handleSettlement(event, ordersCollection, paymentsCollection);
        break;

      default:
        console.log(`Unhandled webhook event: ${event.event}`);
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Webhook processing failed' });
  }
}

async function handlePaymentCaptured(event, ordersCollection, paymentsCollection) {
  const payment = event.payload.payment.entity;
  const orderId = payment.order_id;

  // Find order by razorpay order ID
  const order = await ordersCollection.findOne({
    razorpayOrderId: orderId,
  });

  if (order) {
    // Check if payment already exists
    const existingPayment = await paymentsCollection.findOne({
      razorpayPaymentId: payment.id,
    });

    if (!existingPayment) {
      // Create payment record
      await paymentsCollection.insertOne({
        orderId: order._id,
        razorpayOrderId: orderId,
        razorpayPaymentId: payment.id,
        amount: payment.amount / 100, // Convert from paise to rupees
        currency: payment.currency,
        status: 'success',
        method: payment.method,
        bank: payment.bank || null,
        wallet: payment.wallet || null,
        vpa: payment.vpa || null,
        contact: payment.contact || null,
        email: payment.email || null,
        fee: payment.fee ? payment.fee / 100 : 0,
        tax: payment.tax ? payment.tax / 100 : 0,
        verified: true,
        createdAt: new Date(payment.created_at * 1000),
        capturedAt: new Date(payment.captured_at * 1000),
      });
    }

    // Update order status
    await ordersCollection.updateOne(
      { _id: order._id },
      {
        $set: {
          status: 'paid',
          updatedAt: new Date(),
        },
      }
    );

    // Send order confirmation email
    try {
      const paymentData = existingPayment || {
        razorpayPaymentId: payment.id,
        razorpayOrderId: orderId,
      };
      await sendOrderConfirmationEmail(order, paymentData);
    } catch (emailError) {
      console.error('Error sending order confirmation email:', emailError);
    }
  }
}

async function handlePaymentFailed(event, ordersCollection, paymentsCollection) {
  const payment = event.payload.payment.entity;
  const orderId = payment.order_id;

  const order = await ordersCollection.findOne({
    razorpayOrderId: orderId,
  });

  if (order) {
    // Create failed payment record
    const existingPayment = await paymentsCollection.findOne({
      razorpayPaymentId: payment.id,
    });

    if (!existingPayment) {
      await paymentsCollection.insertOne({
        orderId: order._id,
        razorpayOrderId: orderId,
        razorpayPaymentId: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: 'failed',
        errorCode: payment.error_code || null,
        errorDescription: payment.error_description || null,
        errorReason: payment.error_reason || null,
        verified: false,
        createdAt: new Date(payment.created_at * 1000),
      });
    }

    // Update order status
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
      const failureReason = payment.error_description || payment.error_reason || 'Payment processing failed';
      await sendPaymentFailedEmail(order, failureReason);
    } catch (emailError) {
      console.error('Error sending payment failed email:', emailError);
    }
  }
}

async function handleOrderPaid(event, ordersCollection, paymentsCollection) {
  const order = event.payload.order.entity;
  
  const dbOrder = await ordersCollection.findOne({
    razorpayOrderId: order.id,
  });

  if (dbOrder) {
    await ordersCollection.updateOne(
      { _id: dbOrder._id },
      {
        $set: {
          status: 'paid',
          updatedAt: new Date(),
        },
      }
    );
  }
}

async function handlePaymentAuthorized(event, ordersCollection, paymentsCollection) {
  const payment = event.payload.payment.entity;
  const orderId = payment.order_id;

  const order = await ordersCollection.findOne({
    razorpayOrderId: orderId,
  });

  if (order) {
    const existingPayment = await paymentsCollection.findOne({
      razorpayPaymentId: payment.id,
    });

    if (!existingPayment) {
      await paymentsCollection.insertOne({
        orderId: order._id,
        razorpayOrderId: orderId,
        razorpayPaymentId: payment.id,
        amount: payment.amount / 100,
        currency: payment.currency,
        status: 'authorized',
        method: payment.method,
        bank: payment.bank || null,
        wallet: payment.wallet || null,
        vpa: payment.vpa || null,
        contact: payment.contact || null,
        email: payment.email || null,
        verified: false,
        createdAt: new Date(payment.created_at * 1000),
      });
    } else {
      await paymentsCollection.updateOne(
        { razorpayPaymentId: payment.id },
        {
          $set: {
            status: 'authorized',
            updatedAt: new Date(),
          },
        }
      );
    }

    await ordersCollection.updateOne(
      { _id: order._id },
      {
        $set: {
          status: 'authorized',
          updatedAt: new Date(),
        },
      }
    );
  }
}

async function handlePaymentDispute(event, ordersCollection, paymentsCollection) {
  const dispute = event.payload.dispute?.entity || event.payload.payment?.entity;
  const paymentId = dispute.payment_id || dispute.id;
  const disputeStatus = event.event.split('.')[2]; // Extract status from event name

  const payment = await paymentsCollection.findOne({
    razorpayPaymentId: paymentId,
  });

  if (payment) {
    // Create or update dispute record
    const disputesCollection = ordersCollection.db.collection('disputes');
    await disputesCollection.updateOne(
      { paymentId: payment._id },
      {
        $set: {
          paymentId: payment._id,
          razorpayPaymentId: paymentId,
          disputeId: dispute.id,
          status: disputeStatus,
          amount: dispute.amount ? dispute.amount / 100 : payment.amount,
          reason: dispute.reason || null,
          respondBy: dispute.respond_by ? new Date(dispute.respond_by * 1000) : null,
          event: event.event,
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(),
        },
      },
      { upsert: true }
    );

    // Update payment with dispute status
    await paymentsCollection.updateOne(
      { _id: payment._id },
      {
        $set: {
          disputeStatus: disputeStatus,
          updatedAt: new Date(),
        },
      }
    );
  }
}

async function handlePaymentDowntime(event, ordersCollection, paymentsCollection) {
  const downtime = event.payload.downtime?.entity;
  const downtimeType = event.event.split('.')[2]; // started, updated, resolved

  // Log downtime events (you might want to store these in a separate collection)
  console.log(`Payment downtime ${downtimeType}:`, downtime);
  
  // You can create a downtimes collection to track these events
  const downtimesCollection = ordersCollection.db.collection('downtimes');
  await downtimesCollection.insertOne({
    type: downtimeType,
    paymentMethod: downtime?.payment_method || null,
    startTime: downtime?.start ? new Date(downtime.start * 1000) : new Date(),
    endTime: downtime?.end ? new Date(downtime.end * 1000) : null,
    createdAt: new Date(),
  });
}

async function handleOrderNotification(event, ordersCollection, paymentsCollection) {
  const notification = event.payload.notification?.entity;
  const orderId = notification.order_id;
  const notificationStatus = event.event.split('.')[2]; // delivered, failed

  const order = await ordersCollection.findOne({
    razorpayOrderId: orderId,
  });

  if (order) {
    // Update order with notification status
    await ordersCollection.updateOne(
      { _id: order._id },
      {
        $set: {
          notificationStatus: notificationStatus,
          notificationUpdatedAt: new Date(),
          updatedAt: new Date(),
        },
      }
    );
  }
}

async function handleRefund(event, ordersCollection, paymentsCollection) {
  const refund = event.payload.refund?.entity;
  const paymentId = refund.payment_id;
  const refundStatus = event.event.split('.')[1]; // created, processed, failed, speed_changed

  const payment = await paymentsCollection.findOne({
    razorpayPaymentId: paymentId,
  });

  if (payment) {
    // Create or update refund record
    const refundsCollection = ordersCollection.db.collection('refunds');
    await refundsCollection.updateOne(
      { razorpayRefundId: refund.id },
      {
        $set: {
          paymentId: payment._id,
          orderId: payment.orderId,
          razorpayPaymentId: paymentId,
          razorpayRefundId: refund.id,
          amount: refund.amount / 100,
          currency: refund.currency,
          status: refundStatus,
          speed: refund.speed || 'normal',
          notes: refund.notes || {},
          createdAt: new Date(refund.created_at * 1000),
          updatedAt: new Date(),
        },
        $setOnInsert: {
          createdAt: new Date(refund.created_at * 1000),
        },
      },
      { upsert: true }
    );

    // Update payment with refund status
    await paymentsCollection.updateOne(
      { _id: payment._id },
      {
        $set: {
          refundStatus: refundStatus,
          refundAmount: refund.amount / 100,
          updatedAt: new Date(),
        },
      }
    );

    // If refund is processed, update order status
    if (refundStatus === 'processed') {
      const order = await ordersCollection.findOne({ _id: payment.orderId });
      if (order) {
        await ordersCollection.updateOne(
          { _id: order._id },
          {
            $set: {
              status: 'refunded',
              updatedAt: new Date(),
            },
          }
        );
      }
    }
  }
}

async function handleInvoice(event, ordersCollection, paymentsCollection) {
  const invoice = event.payload.invoice?.entity;
  const invoiceStatus = event.event.split('.')[1]; // paid, partially_paid, expired

  // Create invoices collection if needed
  const invoicesCollection = ordersCollection.db.collection('invoices');
  await invoicesCollection.updateOne(
    { razorpayInvoiceId: invoice.id },
    {
      $set: {
        razorpayInvoiceId: invoice.id,
        invoiceNumber: invoice.invoice_number || null,
        amount: invoice.amount / 100,
        amountPaid: invoice.amount_paid ? invoice.amount_paid / 100 : 0,
        currency: invoice.currency,
        status: invoiceStatus,
        customerName: invoice.customer_details?.name || null,
        customerEmail: invoice.customer_details?.email || null,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(invoice.created_at * 1000),
      },
    },
    { upsert: true }
  );
}

async function handlePaymentLink(event, ordersCollection, paymentsCollection) {
  const paymentLink = event.payload.payment_link?.entity;
  const linkStatus = event.event.split('.')[2]; // paid, partially_paid, expired, cancelled

  // Create payment links collection if needed
  const paymentLinksCollection = ordersCollection.db.collection('payment_links');
  await paymentLinksCollection.updateOne(
    { razorpayPaymentLinkId: paymentLink.id },
    {
      $set: {
        razorpayPaymentLinkId: paymentLink.id,
        amount: paymentLink.amount / 100,
        amountPaid: paymentLink.amount_paid ? paymentLink.amount_paid / 100 : 0,
        currency: paymentLink.currency,
        status: linkStatus,
        shortUrl: paymentLink.short_url || null,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(paymentLink.created_at * 1000),
      },
    },
    { upsert: true }
  );
}

async function handleSettlement(event, ordersCollection, paymentsCollection) {
  const settlement = event.payload.settlement?.entity;

  // Create settlements collection if needed
  const settlementsCollection = ordersCollection.db.collection('settlements');
  await settlementsCollection.updateOne(
    { razorpaySettlementId: settlement.id },
    {
      $set: {
        razorpaySettlementId: settlement.id,
        amount: settlement.amount / 100,
        currency: settlement.currency,
        status: 'processed',
        utr: settlement.utr || null,
        fees: settlement.fees ? settlement.fees / 100 : 0,
        tax: settlement.tax ? settlement.tax / 100 : 0,
        updatedAt: new Date(),
      },
      $setOnInsert: {
        createdAt: new Date(settlement.created_at * 1000),
      },
    },
    { upsert: true }
  );
}

