import Head from 'next/head';
import Link from 'next/link';

export default function RefundPolicy() {
  return (
    <>
      <Head>
        <title>Refund Policy - dilse</title>
        <meta
          name="description"
          content="Refund Policy for dilse - Learn about our return, exchange, and refund procedures."
        />
        <link rel="icon" href="/favicon/favicon.png" />
      </Head>

      <div className="min-h-screen bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <Link
              href="/"
              className="text-brand-gold hover:text-brand-navy transition duration-200 inline-flex items-center mb-6"
            >
              ← Back to Home
            </Link>
            <h1 className="text-4xl font-serif text-brand-navy mb-4 font-bold">
              Refund & Return Policy
            </h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">1. Overview</h2>
              <p>
                At dilse, we take pride in crafting personalized gifts with care and attention to detail. We want you to be completely satisfied with your purchase. This Refund & Return Policy outlines the terms and conditions for returns, exchanges, and refunds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">2. Return Eligibility</h2>
              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">2.1 Standard Products</h3>
              <p>
                Standard (non-personalized) products may be returned within 7 days of delivery, provided they are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Unused and in original condition</li>
                <li>In original packaging with all tags and labels attached</li>
                <li>Accompanied by the original invoice or proof of purchase</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">2.2 Personalized/Custom Products</h3>
              <p>
                Due to the personalized nature of our custom-engraved products, returns are generally not accepted unless:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>The product is defective or damaged upon delivery</li>
                <li>There is an error in personalization that is our fault (e.g., misspelling, wrong text)</li>
                <li>The product received does not match the order confirmation</li>
              </ul>
              <p className="mt-4">
                <strong>Note:</strong> If you provided incorrect personalization details (wrong spelling, wrong name, etc.), we cannot accept returns or provide refunds. Please review your order carefully before confirming.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">3. Return Process</h2>
              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">3.1 Initiating a Return</h3>
              <p>To initiate a return, please follow these steps:</p>
              <ol className="list-decimal pl-6 space-y-2">
                <li>Contact us within 7 days of delivery at <strong>support@dilse.in</strong> with your order number</li>
                <li>Provide clear photos of the product (if applicable) and reason for return</li>
                <li>Wait for our team to review and approve your return request</li>
                <li>Once approved, we will provide you with return shipping instructions</li>
              </ol>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">3.2 Return Shipping</h3>
              <p>
                For eligible returns due to defects or our errors, we will cover return shipping costs. For other returns, the customer is responsible for return shipping charges. We recommend using a trackable shipping method.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">4. Refund Processing</h2>
              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">4.1 Refund Eligibility</h3>
              <p>Refunds will be processed for:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Products returned within the eligible timeframe and in acceptable condition</li>
                <li>Defective or damaged products</li>
                <li>Orders cancelled before shipment</li>
                <li>Products that do not match the order description</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">4.2 Refund Timeline</h3>
              <p>
                Once we receive and inspect the returned product, we will process your refund within 5-7 business days. The refund will be issued to the original payment method used for the purchase.
              </p>
              <p className="mt-4">
                <strong>Note:</strong> It may take additional time for the refund to appear in your account, depending on your bank or payment provider (typically 5-10 business days).
              </p>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">4.3 Refund Amount</h3>
              <p>
                Refunds will include the product price paid. Shipping charges are non-refundable unless the return is due to our error or a defective product. For returns initiated by the customer (change of mind), original shipping charges will be deducted from the refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">5. Exchanges</h2>
              <p>
                We currently do not offer direct exchanges. If you wish to exchange a product, please return the original item following our return process and place a new order for the desired product.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">6. Non-Refundable Items</h2>
              <p>The following items are not eligible for return or refund:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Personalized products with correct personalization (as per your order)</li>
                <li>Products damaged due to misuse or normal wear and tear</li>
                <li>Products returned after 7 days of delivery</li>
                <li>Products without original packaging or tags</li>
                <li>Gift cards or promotional items (unless defective)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">7. Defective or Damaged Products</h2>
              <p>
                If you receive a defective or damaged product, please contact us immediately (within 48 hours of delivery) with photos of the defect or damage. We will arrange for a replacement or full refund, including return shipping costs.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">8. Cancellation Policy</h2>
              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">8.1 Before Shipment</h3>
              <p>
                Orders can be cancelled free of charge before they are shipped. Once an order is in production (especially personalized items), cancellation may not be possible. Please contact us immediately if you need to cancel an order.
              </p>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">8.2 After Shipment</h3>
              <p>
                Orders that have already been shipped cannot be cancelled. You may return the product following our return policy once it is delivered.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">9. Right to Refuse Returns</h2>
              <p>
                We reserve the right to refuse returns that do not meet our return policy criteria, including items that are:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Used, damaged, or not in original condition</li>
                <li>Returned without original packaging</li>
                <li>Returned after the eligible return period</li>
                <li>Personalized items with correct personalization</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">10. Contact Us</h2>
              <p>
                For any questions about returns, refunds, or exchanges, please contact our customer support team:
              </p>
              <div className="bg-brand-beige p-6 rounded-lg mt-4">
                <p className="font-semibold text-brand-navy">dilse Customer Support</p>
                <p className="text-gray-700">Email: support@dilse.in</p>
                <p className="text-gray-700">Website: https://dilse.in</p>
                <p className="text-gray-700 mt-2">
                  <strong>Response Time:</strong> We aim to respond to all inquiries within 24-48 hours.
                </p>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">11. Changes to This Policy</h2>
              <p>
                We reserve the right to modify this Refund & Return Policy at any time. Changes will be effective immediately upon posting on this page. We encourage you to review this policy periodically.
              </p>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

