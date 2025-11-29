import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaBars, FaTimes } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import SearchModal from './SearchModal';
import { gsap } from 'gsap';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { getCartItemCount, setIsCartOpen, cart } = useCart();
  const cartIconRef = useRef(null);
  const cartBadgeRef = useRef(null);
  const prevCartCountRef = useRef(0);

  // Animate cart icon when items are added
  useEffect(() => {
    const currentCount = getCartItemCount();
    if (currentCount > prevCartCountRef.current && cartIconRef.current && cartBadgeRef.current) {
      // Bounce animation for cart icon
      gsap.to(cartIconRef.current, {
        scale: 1.3,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
      
      // Pulse animation for badge
      gsap.to(cartBadgeRef.current, {
        scale: 1.5,
        duration: 0.2,
        yoyo: true,
        repeat: 1,
        ease: 'power2.out',
      });
    }
    prevCartCountRef.current = currentCount;
  }, [cart, getCartItemCount]);

  return (
    <header className="bg-brand-navy shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-8 py-3 sm:py-4 flex justify-between items-center">
        {/* Logo/Brand Name */}
        <Link href="/" className="text-xl sm:text-2xl md:text-3xl font-serif font-bold text-brand-gold tracking-widest">
          dilse<span className="text-lg sm:text-xl md:text-2xl ml-1">⚜️</span>
        </Link>

        {/* Navigation (Hidden on small screens) */}
        <nav className="hidden md:flex space-x-8">
          <Link href="/#featured" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium">
            Shop All
          </Link>
          <Link href="/#category-men" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium">
            Gifts for Men
          </Link>
          <Link href="/#category-women" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium">
            Gifts for Her
          </Link>
          <Link href="/#about" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium">
            Our Story
          </Link>
          <Link href="/#policy" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium">
            Policy
          </Link>
        </nav>

        {/* Icons */}
        <div className="flex items-center space-x-2 sm:space-x-3 md:space-x-4">
          <button
            onClick={() => setSearchOpen(true)}
            className="text-white hover:text-brand-gold transition duration-200 p-1"
            aria-label="Search"
          >
            <FaSearch className="text-lg sm:text-xl" />
          </button>
          <button className="text-white hover:text-brand-gold transition duration-200 p-1" aria-label="User account">
            <FaUser className="text-lg sm:text-xl" />
          </button>
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-white hover:text-brand-gold transition duration-200 relative p-1"
            aria-label="Open shopping cart"
          >
            <FaShoppingBag ref={cartIconRef} className="text-lg sm:text-xl" />
            <span 
              ref={cartBadgeRef}
              className="absolute top-[-6px] right-[-6px] sm:top-[-8px] sm:right-[-8px] text-[10px] sm:text-xs bg-brand-gold text-brand-navy rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold"
            >
              {getCartItemCount()}
            </span>
          </button>
          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-white hover:text-brand-gold p-1"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <FaTimes className="text-lg sm:text-xl" /> : <FaBars className="text-lg sm:text-xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-navy border-t border-brand-gold/20">
          <nav className="flex flex-col space-y-4 px-4 py-6">
            <Link href="/#featured" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Shop All
            </Link>
            <Link href="/#category-men" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Gifts for Men
            </Link>
            <Link href="/#category-women" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Gifts for Her
            </Link>
            <Link href="/#about" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Our Story
            </Link>
            <Link href="/#policy" className="text-white hover:text-brand-gold transition duration-200 uppercase text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
              Policy
            </Link>
          </nav>
        </div>
      )}
      <SearchModal isOpen={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}

