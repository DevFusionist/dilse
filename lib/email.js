import nodemailer from 'nodemailer';

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Verify transporter configuration
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter.verify((error, success) => {
    if (error) {
      console.error('Email transporter error:', error);
    } else {
      console.log('Email server is ready to send messages');
    }
  });
}

// Generate OTP
export function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP Email
export async function sendOTPEmail(email, otp) {
  try {
    const mailOptions = {
      from: `"dilse" <${process.env.SMTP_USER}>`,
      to: email,
      subject: 'Verify Your Email - dilse',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a5f; color: #c39c4e; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .otp-box { background: #fff; border: 2px solid #c39c4e; padding: 20px; text-align: center; margin: 20px 0; }
            .otp { font-size: 32px; font-weight: bold; color: #1e3a5f; letter-spacing: 5px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>dilse</h1>
            </div>
            <div class="content">
              <h2>Verify Your Email Address</h2>
              <p>Thank you for registering with dilse! Please use the OTP below to verify your email address:</p>
              <div class="otp-box">
                <div class="otp">${otp}</div>
              </div>
              <p>This OTP will expire in 10 minutes.</p>
              <p>If you didn't request this, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} dilse. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending OTP email:', error);
    return { success: false, error: error.message };
  }
}

// Send Order Confirmation Email
export async function sendOrderConfirmationEmail(order, payment) {
  try {
    const itemsList = order.items.map(item => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;" />
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd;">${item.name}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #ddd; text-align: right;">₹${(item.price * item.quantity).toLocaleString()}</td>
      </tr>
    `).join('');

    const totalAmount = order.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    const mailOptions = {
      from: `"dilse" <${process.env.SMTP_USER}>`,
      to: order.customerEmail,
      subject: `Order Confirmation - Order #${order.razorpayOrderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a5f; color: #c39c4e; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .success-badge { background: #4CAF50; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; background: white; }
            th { background: #1e3a5f; color: #c39c4e; padding: 10px; text-align: left; }
            .total-row { font-weight: bold; font-size: 18px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>dilse</h1>
            </div>
            <div class="content">
              <div class="success-badge">✓ Payment Successful</div>
              <h2>Order Confirmation</h2>
              <p>Dear ${order.customerName},</p>
              <p>Thank you for your order! We're excited to prepare your personalized gifts.</p>
              
              <h3>Order Details</h3>
              <p><strong>Order ID:</strong> ${order.razorpayOrderId}</p>
              <p><strong>Payment ID:</strong> ${payment.razorpayPaymentId}</p>
              <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleString('en-IN')}</p>
              
              <h3>Items Ordered</h3>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                  <tr class="total-row">
                    <td colspan="3" style="text-align: right; padding: 15px;">Total:</td>
                    <td style="text-align: right; padding: 15px;">₹${totalAmount.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
              
              <h3>Shipping Address</h3>
              <p>${order.shippingAddress}</p>
              
              <p>We'll send you another email once your order ships. If you have any questions, please contact us.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} dilse. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    return { success: false, error: error.message };
  }
}

// Send Payment Failed Email
export async function sendPaymentFailedEmail(order, reason) {
  try {
    const mailOptions = {
      from: `"dilse" <${process.env.SMTP_USER}>`,
      to: order.customerEmail,
      subject: `Payment Failed - Order #${order.razorpayOrderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #1e3a5f; color: #c39c4e; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .error-badge { background: #f44336; color: white; padding: 10px 20px; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>dilse</h1>
            </div>
            <div class="content">
              <div class="error-badge">✗ Payment Failed</div>
              <h2>Payment Unsuccessful</h2>
              <p>Dear ${order.customerName},</p>
              <p>We're sorry, but your payment for Order #${order.razorpayOrderId} could not be processed.</p>
              
              <p><strong>Reason:</strong> ${reason || 'Payment processing failed'}</p>
              
              <p>Please try again or contact our support team if you continue to experience issues.</p>
              <p>Your order has been saved and you can complete the payment from your cart.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} dilse. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending payment failed email:', error);
    return { success: false, error: error.message };
  }
}

export default transporter;

