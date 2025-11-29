import { FaStar, FaLock, FaShippingFast } from 'react-icons/fa';

export default function TrustBar() {
  return (
    <section className="bg-brand-navy py-4 shadow-inner">
      <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-around text-center">
        <div className="flex items-center text-white p-2">
          <FaStar className="text-brand-gold mr-2 text-2xl" />
          <span className="text-sm md:text-base font-medium">Rated 4.9/5 Across 10k+ Reviews</span>
        </div>
        <div className="flex items-center text-white p-2">
          <FaLock className="text-brand-gold mr-2 text-2xl" />
          <span className="text-sm md:text-base font-medium">100% Secure Prepaid Delivery</span>
        </div>
        <div className="flex items-center text-white p-2">
          <FaShippingFast className="text-brand-gold mr-2 text-2xl" />
          <span className="text-sm md:text-base font-medium">Fast Pan-India Shipping</span>
        </div>
      </div>
    </section>
  );
}

