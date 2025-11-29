import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUser, FaShoppingBag, FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import SearchModal from './SearchModal';
import AuthModal from './AuthModal';
import { gsap } from 'gsap';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const { getCartItemCount, setIsCartOpen, cart } = useCart();
  const { user, logout, isAuthenticated } = useAuth();
  const cartIconRef = useRef(null);
  const cartBadgeRef = useRef(null);
  const prevCartCountRef = useRef(0);

  // Animate cart icon when items are added with popping effect
  useEffect(() => {
    const currentCount = getCartItemCount();
    if (currentCount > prevCartCountRef.current && cartIconRef.current && cartBadgeRef.current) {
      // Create a timeline for synchronized popping animations
      const tl = gsap.timeline();
      
      // Popping animation for cart icon - EXTREMELY dramatic scale, rotation, movement, and glow
      tl.to(cartIconRef.current, {
        scale: 3.5,
        rotation: 25,
        y: -20,
        filter: 'brightness(2.5) drop-shadow(0 0 25px rgba(212, 175, 55, 1))',
        duration: 0.35,
        ease: 'back.out(1.5)',
      })
      .to(cartIconRef.current, {
        scale: 2.8,
        rotation: -20,
        y: 8,
        filter: 'brightness(2) drop-shadow(0 0 20px rgba(212, 175, 55, 0.9))',
        duration: 0.25,
        ease: 'power2.out',
      })
      .to(cartIconRef.current, {
        scale: 1,
        rotation: 0,
        y: 0,
        filter: 'brightness(1) drop-shadow(0 0 0px rgba(0,0,0,0))',
        duration: 0.3,
        ease: 'elastic.out(1, 0.4)',
      });
      
      // Badge popping animation - EXTREMELY dramatic entrance with glow
      const badgeTl = gsap.timeline();
      badgeTl.fromTo(
        cartBadgeRef.current,
        {
          scale: 0,
          rotation: -360,
          opacity: 0,
        },
        {
          scale: 4,
          rotation: 0,
          opacity: 1,
          boxShadow: '0 0 30px rgba(212, 175, 55, 1), 0 0 60px rgba(212, 175, 55, 0.6)',
          duration: 0.4,
          ease: 'back.out(1.8)',
        }
      )
      .to(cartBadgeRef.current, {
        scale: 2.2,
        boxShadow: '0 0 25px rgba(212, 175, 55, 1)',
        duration: 0.25,
        ease: 'power2.out',
      })
      .to(cartBadgeRef.current, {
        scale: 1,
        boxShadow: '0 0 0px rgba(0,0,0,0)',
        duration: 0.3,
        ease: 'elastic.out(1, 0.4)',
      });
      
      // Additional EXTREMELY dramatic pulse effect for badge
      gsap.to(cartBadgeRef.current, {
        scale: 2.5,
        boxShadow: '0 0 35px rgba(212, 175, 55, 1), 0 0 70px rgba(212, 175, 55, 0.7)',
        duration: 0.25,
        delay: 0.9,
        yoyo: true,
        repeat: 3,
        ease: 'power2.inOut',
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
          {isAuthenticated ? (
            <div className="flex items-center space-x-2">
              <span className="text-white text-sm hidden sm:block">{user?.name}</span>
              <button
                onClick={logout}
                className="text-white hover:text-brand-gold transition duration-200 p-1"
                aria-label="Logout"
                title="Logout"
              >
                <FaSignOutAlt className="text-lg sm:text-xl" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setAuthModalOpen(true)}
              className="text-white hover:text-brand-gold transition duration-200 p-1"
              aria-label="Login"
              title="Login"
            >
              <FaUser className="text-lg sm:text-xl" />
            </button>
          )}
          <button
            onClick={() => setIsCartOpen(true)}
            className="text-white hover:text-brand-gold transition duration-200 relative p-1"
            aria-label="Open shopping cart"
            style={{ transformOrigin: 'center' }}
          >
            <div ref={cartIconRef} style={{ display: 'inline-block' }}>
              <FaShoppingBag className="text-lg sm:text-xl" />
            </div>
            <span 
              ref={cartBadgeRef}
              className="absolute top-[-6px] right-[-6px] sm:top-[-8px] sm:right-[-8px] text-[10px] sm:text-xs bg-brand-gold text-brand-navy rounded-full h-4 w-4 sm:h-5 sm:w-5 flex items-center justify-center font-bold z-10"
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
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} />
    </header>
  );
}

