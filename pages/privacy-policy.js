import Head from 'next/head';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <>
      <Head>
        <title>Privacy Policy - dilse</title>
        <meta
          name="description"
          content="Privacy Policy for dilse - Learn how we collect, use, and protect your personal information."
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
              Privacy Policy
            </h1>
            <p className="text-gray-600">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">1. Introduction</h2>
              <p>
                Welcome to dilse ("we," "our," or "us"). We are committed to protecting your privacy and ensuring the security of your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and make purchases from us.
              </p>
              <p>
                By using our website, you consent to the collection and use of information in accordance with this policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">2. Information We Collect</h2>
              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">2.1 Personal Information</h3>
              <p>We may collect the following personal information:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Name and contact information (email address, phone number, postal address)</li>
                <li>Payment information (credit card details, billing address) - processed securely through our payment gateway</li>
                <li>Order history and preferences</li>
                <li>Personalization details for custom products (engraving text, design preferences)</li>
              </ul>

              <h3 className="text-xl font-semibold text-brand-navy mt-6 mb-3">2.2 Automatically Collected Information</h3>
              <p>When you visit our website, we automatically collect:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>IP address and browser type</li>
                <li>Device information and operating system</li>
                <li>Pages visited and time spent on our site</li>
                <li>Referring website addresses</li>
                <li>Cookies and similar tracking technologies</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">3. How We Use Your Information</h2>
              <p>We use the collected information for the following purposes:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>To process and fulfill your orders</li>
                <li>To communicate with you about your orders, products, and services</li>
                <li>To personalize your shopping experience</li>
                <li>To improve our website and services</li>
                <li>To send you marketing communications (with your consent)</li>
                <li>To detect and prevent fraud</li>
                <li>To comply with legal obligations</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">4. Information Sharing and Disclosure</h2>
              <p>We do not sell your personal information. We may share your information only in the following circumstances:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li><strong>Service Providers:</strong> With trusted third-party service providers who assist in operating our website, processing payments, and delivering products (e.g., payment gateways, shipping companies)</li>
                <li><strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li><strong>Business Transfers:</strong> In connection with any merger, sale, or acquisition of our business</li>
                <li><strong>With Your Consent:</strong> When you have given us explicit permission to share your information</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">5. Data Security</h2>
              <p>
                We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, and we cannot guarantee absolute security.
              </p>
              <p>
                All payment transactions are processed through secure, encrypted connections via our payment gateway partners (Razorpay).
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">6. Cookies and Tracking Technologies</h2>
              <p>
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze website traffic, and understand user preferences. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">7. Your Rights</h2>
              <p>Under applicable data protection laws, you have the right to:</p>
              <ul className="list-disc pl-6 space-y-2">
                <li>Access and receive a copy of your personal data</li>
                <li>Rectify inaccurate or incomplete information</li>
                <li>Request deletion of your personal data</li>
                <li>Object to processing of your personal data</li>
                <li>Request restriction of processing</li>
                <li>Data portability</li>
                <li>Withdraw consent at any time</li>
              </ul>
              <p className="mt-4">
                To exercise these rights, please contact us at the information provided below.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">8. Data Retention</h2>
              <p>
                We retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required or permitted by law.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">9. Children's Privacy</h2>
              <p>
                Our website is not intended for children under the age of 18. We do not knowingly collect personal information from children. If you believe we have collected information from a child, please contact us immediately.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">10. Changes to This Privacy Policy</h2>
              <p>
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy Policy periodically.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-serif text-brand-navy mt-8 mb-4">11. Contact Us</h2>
              <p>
                If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact us:
              </p>
              <div className="bg-brand-beige p-6 rounded-lg mt-4">
                <p className="font-semibold text-brand-navy">dilse</p>
                <p className="text-gray-700">Email: privacy@dilse.in</p>
                <p className="text-gray-700">Website: https://dilse.in</p>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}

