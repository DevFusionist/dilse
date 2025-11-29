import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function PolicySection() {
  return (
    <section id="policy" className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-serif text-brand-navy text-center mb-8 font-bold">
          <span className="border-b-4 border-brand-gold pb-1">Our Assurance: Order & Payment Policy</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Prepaid Block */}
          <div className="p-6 rounded-xl bg-brand-navy/5 border-2 border-brand-navy/10">
            <h3 className="text-2xl font-serif text-brand-navy mb-3 flex items-center">
              <FaCheckCircle className="text-brand-gold mr-3" />
              Prepaid Orders (Recommended)
            </h3>
            <p className="text-gray-700">
              <strong>Priority Processing & 100% Assurance.</strong> All Prepaid orders (Card, UPI, Net Banking)
              receive faster dispatch and are guaranteed a free replacement if the product is damaged or defective
              upon arrival.
            </p>
          </div>

          {/* COD Block */}
          <div className="p-6 rounded-xl bg-brand-burgundy/5 border-2 border-brand-burgundy/50">
            <h3 className="text-2xl font-serif text-brand-burgundy mb-3 flex items-center">
              <FaExclamationTriangle className="mr-3" />
              COD Orders (Deposit Required)
            </h3>
            <p className="text-gray-700">
              Due to the permanent nature of customization (engraving), all <strong>Cash on Delivery (COD)</strong>{' '}
              orders require a small, <strong>non-refundable deposit (₹200 minimum)</strong> to secure the order before
              production begins.
            </p>
            <p className="mt-2 text-sm text-brand-burgundy font-semibold">
              *Orders without a confirmed deposit will be cancelled after 24 hours.*
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

