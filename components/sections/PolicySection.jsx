import { FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';

export default function PolicySection() {
  return (
    <section id="policy" className="bg-white py-12 md:py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-serif text-brand-navy text-center mb-6 md:mb-8 font-bold px-2">
          <span className="inline-block border-b-4 border-brand-gold pb-1">Our Assurance: Order & Payment Policy</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          {/* Prepaid Block */}
          <div className="p-4 sm:p-6 rounded-xl bg-brand-navy/5 border-2 border-brand-navy/10">
            <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-brand-navy mb-3 flex items-start sm:items-center">
              <FaCheckCircle className="text-brand-gold mr-3 flex-shrink-0 mt-1 sm:mt-0" />
              <span>Prepaid Orders <span className="text-sm sm:text-base">(Recommended)</span></span>
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              <strong className="block mb-1 sm:inline">Priority Processing & 100% Assurance.</strong> All Prepaid orders (Card, UPI, Net Banking)
              receive faster dispatch and are guaranteed a free replacement if the product is damaged or defective
              upon arrival.
            </p>
          </div>

          {/* COD Block */}
          <div className="p-4 sm:p-6 rounded-xl bg-brand-burgundy/5 border-2 border-brand-burgundy/50">
            <h3 className="text-lg sm:text-xl md:text-2xl font-serif text-brand-burgundy mb-3 flex items-start sm:items-center">
              <FaExclamationTriangle className="mr-3 flex-shrink-0 mt-1 sm:mt-0" />
              <span>COD Orders <span className="text-sm sm:text-base">(Deposit Required)</span></span>
            </h3>
            <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
              Due to the permanent nature of customization (engraving), all <strong>Cash on Delivery (COD)</strong>{' '}
              orders require a small, <strong>non-refundable deposit (₹200 minimum)</strong> to secure the order before
              production begins.
            </p>
            <p className="mt-2 text-xs sm:text-sm text-brand-burgundy font-semibold">
              *Orders without a confirmed deposit will be cancelled after 24 hours.*
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

