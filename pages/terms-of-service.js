import Head from 'next/head';
import Link from 'next/link';

export default function TermsOfService() {
  return (
    <>
      <Head>
        <title>Terms of Service - dilse</title>
        <meta
          name="description"
          content="Terms of Service for dilse - Read our terms and conditions for using our website and services."
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
              Terms of Service
            </h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">1. Acceptance of Terms</h2>
              <p>
                By accessing and using the dilse website ("Website"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">2. Use License</h2>
              <p>
                Permission is granted to temporarily access the materials on dilse's website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
              </p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Modify or copy the materials</li>
                <li>Use the materials for any commercial purpose or for any public display</li>
                <li>Attempt to reverse engineer any software contained on the website</li>
                <li>Remove any copyright or other proprietary notations from the materials</li>
                <li>Transfer the materials to another person or "mirror" the materials on any other server</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">3. Products and Services</h2>
              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">3.1 Product Descriptions</h3>
              <p>
                We strive to provide accurate descriptions and images of our products. However, we do not warrant that product descriptions or other content on this site is accurate, complete, reliable, current, or error-free.
              </p>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">3.2 Customization</h3>
              <p>
                For personalized and engraved products, you are responsible for providing accurate customization details (text, design preferences, etc.). We are not liable for errors resulting from incorrect information provided by you.
              </p>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">3.3 Pricing</h3>
              <p>
                All prices are listed in Indian Rupees (INR) and are subject to change without notice. We reserve the right to modify prices at any time. Prices displayed on the website are inclusive of applicable taxes unless otherwise stated.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">4. Orders and Payment</h2>
              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">4.1 Order Acceptance</h3>
              <p>
                Your order is an offer to purchase products from us. We reserve the right to accept or reject your order for any reason, including product availability, errors in pricing or product information, or fraud prevention.
              </p>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">4.2 Payment</h3>
              <p>
                Payment must be made at the time of order placement. We accept payments through our secure payment gateway (Razorpay). All payments are processed securely, and we do not store your complete payment card information.
              </p>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">4.3 Order Confirmation</h3>
              <p>
                Upon successful payment, you will receive an order confirmation email. This confirmation does not constitute acceptance of your order; it is merely an acknowledgment that we have received your order.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">5. Shipping and Delivery</h2>
              <p>
                We ship products across India. Delivery times are estimates and not guaranteed. We are not responsible for delays caused by shipping carriers or customs. Risk of loss and title for products pass to you upon delivery to the carrier.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">6. Returns and Refunds</h2>
              <p>
                Please refer to our <Link href="/refund-policy" className="text-brand-gold hover:underline">Refund Policy</Link> for detailed information about returns, exchanges, and refunds.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">7. Intellectual Property</h2>
              <p>
                All content on this website, including text, graphics, logos, images, and software, is the property of dilse or its content suppliers and is protected by Indian and international copyright laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">8. User Accounts</h2>
              <p>
                If you create an account on our website, you are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">9. Prohibited Uses</h2>
              <p>You may not use our website:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>In any way that violates any applicable law or regulation</li>
                <li>To transmit any malicious code or viruses</li>
                <li>To collect or track personal information of others</li>
                <li>To impersonate or attempt to impersonate the company or any employee</li>
                <li>In any way that infringes upon the rights of others</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">10. Limitation of Liability</h2>
              <p>
                To the fullest extent permitted by law, dilse shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses resulting from your use of the website or products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">11. Indemnification</h2>
              <p>
                You agree to defend, indemnify, and hold harmless dilse and its officers, directors, employees, and agents from and against any claims, liabilities, damages, losses, and expenses, including reasonable legal fees, arising out of or in any way connected with your use of the website or violation of these Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">12. Governing Law</h2>
              <p>
                These Terms shall be governed by and construed in accordance with the laws of India, without regard to its conflict of law provisions. Any disputes arising under or in connection with these Terms shall be subject to the exclusive jurisdiction of the courts in India.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">13. Changes to Terms</h2>
              <p>
                We reserve the right to modify these Terms at any time. We will notify users of any material changes by posting the new Terms on this page and updating the "Last updated" date. Your continued use of the website after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">14. Contact Information</h2>
              <p>
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="bg-brand-beige p-6 rounded-lg mt-4">
                <p className="font-semibold text-brand-navy">dilse</p>
                <p className="text-gray-700">Email: support@dilse.in</p>
                <p className="text-gray-700">Website: https://dilse.in</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

