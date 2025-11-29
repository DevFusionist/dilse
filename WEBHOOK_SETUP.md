# Razorpay Webhook Setup Guide

## Overview
This application saves user orders and payment records to MongoDB and handles Razorpay webhook events.

## Database Collections

### Orders Collection
Stores order information:
- `userId`: Reference to user
- `razorpayOrderId`: Razorpay order ID
- `amount`: Order amount
- `currency`: Currency (INR)
- `status`: Order status (created, paid, failed, cancelled)
- `items`: Array of order items with details
- `shippingAddress`: Shipping address
- `customerName`, `customerEmail`, `customerPhone`: Customer details
- `createdAt`, `updatedAt`: Timestamps

### Payments Collection
Stores payment records:
- `orderId`: Reference to order
- `razorpayOrderId`: Razorpay order ID
- `razorpayPaymentId`: Razorpay payment ID
- `razorpaySignature`: Payment signature
- `amount`: Payment amount
- `currency`: Currency
- `status`: Payment status (success, failed)
- `method`: Payment method
- `verified`: Whether payment is verified
- `createdAt`: Timestamp

## Webhook Configuration

### 1. Get Webhook URL
Your webhook URL will be: `https://yourdomain.com/api/razorpay/webhook`

### 2. Configure in Razorpay Dashboard
1. Go to Razorpay Dashboard → Settings → Webhooks
2. Add new webhook
3. Enter your webhook URL
4. Select events to listen to (recommended minimum set):
   
   **Payment Events:**
   - `payment.authorized`
   - `payment.captured`
   - `payment.failed`
   - `payment.dispute.created`
   - `payment.dispute.won`
   - `payment.dispute.lost`
   - `payment.dispute.closed`
   - `payment.dispute.under_review`
   - `payment.dispute.action_required`
   
   **Order Events:**
   - `order.paid`
   - `order.notification.delivered`
   - `order.notification.failed`
   
   **Refund Events:**
   - `refund.created`
   - `refund.processed`
   - `refund.failed`
   - `refund.speed_changed`
   
   **Optional Events (if using these features):**
   - Invoice events: `invoice.paid`, `invoice.partially_paid`, `invoice.expired`
   - Payment Link events: `payment_link.paid`, `payment_link.partially_paid`, `payment_link.expired`, `payment_link.cancelled`
   - Settlement events: `settlement.processed`
   
5. Save and copy the webhook secret

### 3. Environment Variables
Add to your `.env.local`:
```
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret_from_razorpay_dashboard
```

If `RAZORPAY_WEBHOOK_SECRET` is not set, it will fall back to `RAZORPAY_KEY_SECRET`.

## Webhook Events Handled

### Payment Events
- **payment.authorized** - Payment authorized but not captured yet
- **payment.captured** - Payment successfully captured
- **payment.failed** - Payment failed
- **payment.dispute.created/won/lost/closed/under_review/action_required** - Payment dispute events
- **payment.downtime.started/updated/resolved** - Payment method downtime events

### Order Events
- **order.paid** - Order payment completed
- **order.notification.delivered/failed** - Order notification status

### Refund Events
- **refund.created** - Refund initiated
- **refund.processed** - Refund processed successfully
- **refund.failed** - Refund failed
- **refund.speed_changed** - Refund speed changed

### Invoice Events
- **invoice.paid** - Invoice paid
- **invoice.partially_paid** - Invoice partially paid
- **invoice.expired** - Invoice expired

### Payment Link Events
- **payment_link.paid** - Payment link paid
- **payment_link.partially_paid** - Payment link partially paid
- **payment_link.expired** - Payment link expired
- **payment_link.cancelled** - Payment link cancelled

### Settlement Events
- **settlement.processed** - Settlement processed

## Database Collections Created

The webhook handler automatically creates the following collections:
- **orders** - Order records
- **payments** - Payment records
- **disputes** - Payment dispute records
- **refunds** - Refund records
- **invoices** - Invoice records
- **payment_links** - Payment link records
- **settlements** - Settlement records
- **downtimes** - Payment downtime records

## Testing Webhooks Locally

For local development, use a tool like:
- ngrok: `ngrok http 3000`
- Then use the ngrok URL in Razorpay webhook settings

## Security

- Webhook signature verification is implemented
- Only verified webhooks are processed
- Invalid signatures are rejected

