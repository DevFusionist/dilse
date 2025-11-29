"use client";

import React, { useRef, useEffect } from 'react'; // 💡 Added useEffect
import { gsap } from 'gsap';
import { useCart } from '../context/CartContext';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin'; 

// Ensure you register the plugin if you use the previous advanced code, even if not directly used in this version.
gsap.registerPlugin(MotionPathPlugin); 

// ProductCard Component with individual entrance animation
export default function ProductCard({ product }) {
  const cardRef = useRef(null);
  const buttonRef = useRef(null);
  const imageRef = useRef(null);
  const { addToCart } = useCart();

  // --- HOVER ANIMATION LOGIC ---
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    // Set perspective on the parent for 3D tilt effect
    gsap.set(card, { transformStyle: 'preserve-3d', perspective: 1000 });

    const handleMouseEnter = () => {
      // Animate the card on mouse enter
      gsap.to(card, {
        duration: 0.3,
        rotationY: -4, // Subtle tilt on the Y-axis
        rotationX: 3,  // Subtle tilt on the X-axis
        scale: 1.05,   // Slightly increase the size
        y: -5,         // Lift the card slightly
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)', // Deepen the shadow
        ease: 'power2.out',
      });
    };

    const handleMouseLeave = () => {
      // Animate the card back to its original state on mouse leave
      gsap.to(card, {
        duration: 0.5,
        rotationY: 0,
        rotationX: 0,
        scale: 1,
        y: 0,
        boxShadow: '0 10px 15px rgba(0,0,0,0.1)', // Return to initial shadow (or less)
        ease: 'elastic.out(1, 0.5)', // Use a bouncy ease for a more advanced feel
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup function to remove event listeners
    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);
  // ---------------------------------

  const animateToCart = (onComplete) => {
    if (!imageRef.current) return;

    // Get product image position (Start)
    const productImageRect = imageRef.current.getBoundingClientRect();
    const startX = productImageRect.left + productImageRect.width / 2;
    const startY = productImageRect.top + productImageRect.height / 6;

    // Find cart icon position (End)
    const cartIcon = document.querySelector('[aria-label="Open shopping cart"]');
    if (!cartIcon) return;
    const cartRect = cartIcon.getBoundingClientRect();
    const endX = cartRect.left + cartRect.width / 2;
    const endY = cartRect.top + cartRect.height / 10;

    // Get navbar height to ensure animation stays above it
    const header = document.querySelector('header');
    const headerHeight = header ? header.getBoundingClientRect().height : 80;
    
    // Calculate distance between start and end points
    const distance = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    // Dynamic height calculation: ensure animation goes high enough, especially when close to navbar
    // Minimum height of 250px above the navbar, or 30% of the distance, whichever is larger
    const minHeightAboveNavbar = 250;
    const dynamicHeight = Math.max(minHeightAboveNavbar, distance * 0.3);
    const topOfNavbar = headerHeight;
    const midY = Math.min(startY, endY) - dynamicHeight;
    
    // Ensure the animation path never goes below the navbar
    const safeMidY = Math.max(midY, topOfNavbar + 50);

    // Create Flying Product Element 
    const flyingProduct = document.createElement('div');
    const size = Math.min(productImageRect.width * 0.9, 100);
    flyingProduct.style.position = 'fixed';
    flyingProduct.style.left = `${startX}px`;
    flyingProduct.style.top = `${startY}px`;
    flyingProduct.style.width = `${size}px`;
    flyingProduct.style.height = `${size}px`;
    flyingProduct.style.zIndex = '99999'; // Higher than navbar's z-50
    flyingProduct.style.pointerEvents = 'none';
    flyingProduct.style.borderRadius = '12px';
    flyingProduct.style.overflow = 'hidden';
    flyingProduct.style.boxShadow = '0 15px 40px rgba(0,0,0,0.4)';
    flyingProduct.style.transform = 'translate(-50%, -50%)';
    flyingProduct.style.willChange = 'transform, opacity';
    
    // Clone the product image
    const img = document.createElement('img');
    img.src = product.image;
    img.alt = product.name;
    img.style.width = '100%';
    img.style.height = '100%';
    img.style.objectFit = 'cover';
    flyingProduct.appendChild(img);
    
    // Append to body
    document.body.appendChild(flyingProduct); 

    // Calculate control point for curved path 
    const midX = (startX + endX) / 2;
    const duration = 0.9;
    
    // Create timeline
    const tl = gsap.timeline({
        onComplete: () => {
            if (flyingProduct.parentNode) {
                document.body.removeChild(flyingProduct);
            }
            // Call the completion callback after animation finishes
            if (onComplete && typeof onComplete === 'function') {
                onComplete();
            }
        }
    });
    
    // Animate along custom quadratic path 
    tl.to(flyingProduct, {
      progress: 1, 
      duration: duration,
      ease: 'power1.in', 
      rotation: 720,
      onUpdate: function() {
        const progress = this.progress();
        // Quadratic bezier curve calculation
        const t = progress;
        const curveX = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * midX + t * t * endX;
        const curveY = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * safeMidY + t * t * endY;
        
        // Squash and Stretch
        const stretchAmount = Math.sin(progress * Math.PI) * 0.2; 
        const scaleX = 1 + stretchAmount;
        const scaleY = 1 - stretchAmount;
        
        const scale = 1 - (progress * 0.8);
        
        flyingProduct.style.left = `${curveX}px`;
        flyingProduct.style.top = `${curveY}px`;
        flyingProduct.style.transform = `translate(-50%, -50%) scaleX(${scaleX * scale}) scaleY(${scaleY * scale}) rotate(${this.targets()[0].rotation}deg)`;
      },
    }, 0); 
    
    // Cart Icon Feedback 
    tl.to(cartIcon, {
        scale: 1.3,
        duration: 0.15,
        ease: "back.out(2)",
    }, duration - 0.1) 
    .to(cartIcon, {
        scale: 1,
        duration: 0.3,
        ease: "back.out(1)",
    }, duration + 0.05); 

    // Final fade out and cleanup
    tl.to(flyingProduct, {
        opacity: 0,
        scale: 0,
        duration: 0.2,
    }, duration - 0.1); 
  };

  return (
    <div
      ref={cardRef}
      // Note: We keep the initial Tailwind classes for styling.
      // GSAP will override the hover-related styles on mouse events.
      className="bg-white rounded-xl shadow-md overflow-hidden transition-shadow duration-300"
    >
      <div className="h-64 bg-gray-100 flex items-center justify-center p-4">
        <img
          ref={imageRef}
          src={product.image}
          alt={product.name}
          width={300}
          height={300}
          className="object-cover rounded-lg w-full h-full transition duration-500 ease-in-out hover:scale-[1.09]"
        />
      </div>
      <div className="p-6 text-center">
        <h3 className="text-xl font-semibold text-[#5C4033] font-serif mb-2">
          {product.name}
        </h3>
        <p className="text-gray-600 mb-3 text-sm italic">{product.description}</p>
        <p className="text-2xl font-bold text-[#B8860B]">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
        <div className="mt-4">
          <button 
            ref={buttonRef}
            onClick={() => {
              // Button animation
              if (buttonRef.current) {
                gsap.to(buttonRef.current, {
                  scale: 0.9,
                  duration: 0.1,
                  yoyo: true,
                  repeat: 1,
                  ease: 'power2.inOut',
                });
              }
              
              // Animate product flying to cart first, then add to cart when animation completes
              animateToCart(() => {
                // Add to cart only after flying animation completes
                // This ensures the cart count updates after the animation
                addToCart(product);
              });
            }}
            className="inline-block py-2 px-6 text-sm font-semibold bg-[#B8860B] text-white rounded-full hover:bg-[#a3780a] transition duration-300 shadow-md"
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}