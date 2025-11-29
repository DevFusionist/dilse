import Link from 'next/link';
import { FaInstagram, FaFacebook, FaYoutube } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-brand-navy mt-12 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div>
            <h3 className="text-xl font-serif text-brand-gold mb-4">dilse</h3>
            <p className="text-sm text-gray-400">
              Dil se bana, dil tak pahunchne wala gift.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/#featured" className="hover:text-brand-gold transition duration-200">
                  Shop All
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-brand-gold transition duration-200">
                  Our Story
                </Link>
              </li>
              <li>
                <Link href="/#policy" className="hover:text-brand-gold transition duration-200">
                  Shipping & Policy
                </Link>
              </li>
              <li>
                <Link href="/#about" className="hover:text-brand-gold transition duration-200">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/refund-policy" className="hover:text-brand-gold transition duration-200">
                  Refund Policy
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-brand-gold transition duration-200">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-brand-gold transition duration-200">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Connect</h3>
            <div className="flex space-x-4">
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-white transition duration-200 text-xl">
                <FaInstagram />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-white transition duration-200 text-xl">
                <FaFacebook />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer" className="text-brand-gold hover:text-white transition duration-200 text-xl">
                <FaYoutube />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-brand-gold/20 text-center text-sm text-gray-400">
          &copy; {new Date().getFullYear()} dilse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

