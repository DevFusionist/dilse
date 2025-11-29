"use client";
import { useEffect, useRef } from "react";
import ProductCard from "../ProductCard";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Main ProductGrid Component
export default function ProductGrid({ products = [], id, title, bgColor }) {
  const gridRef = useRef(null);
  const titleRef = useRef(null);

  useEffect(() => {
    if (!products || products.length === 0 || !gridRef.current) return;

    // Get all card elements within this specific grid
    const cards = gridRef.current.querySelectorAll('.product-card-wrapper');
    if (cards.length === 0) return;

    // Create context for cleanup
    const ctx = gsap.context(() => {
      // Set initial state for all cards
      gsap.set(cards, { opacity: 0, y: 80 });

      // Create individual ScrollTrigger for each card
      cards.forEach((card) => {
        gsap.to(card, {
          opacity: 1,
          y: 0,
          duration: 0.7,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            end: 'bottom 15%',
            toggleActions: 'play reverse play reverse',
          }
        });
      });

      // Title animation
      if (titleRef.current) {
        gsap.fromTo(titleRef.current,
          {
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: titleRef.current,
              start: 'top 85%',
              once: true,
            }
          }
        );
      }
    }, gridRef);

    return () => {
      ctx.revert();
    };
  }, [products]);

  return (
    <section 
      id={id}
      className={`py-16 ${bgColor || 'bg-white'}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 
          ref={titleRef}
          className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif text-[#5C4033] text-center mb-8 md:mb-12 font-bold px-2"
        >
          <span className="inline-block border-b-4 border-[#B8860B] pb-2">{title || 'Our Collection'}</span>
        </h2>
        
        <div
          ref={gridRef}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {products.map((product) => (
            <div
              key={product.id}
              className="product-card-wrapper"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
