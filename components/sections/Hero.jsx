import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Hero() {
  const heroImageRef = useRef(null);

  useEffect(() => {
    if (heroImageRef.current) {
      gsap.fromTo(
        heroImageRef.current,
        {
          scale: 1.05,
        },
        {
          scale: 1,
          scrollTrigger: {
            trigger: heroImageRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        }
      );
    }

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <section className="relative bg-brand-navy text-white py-16 md:py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between">
        {/* Text Content */}
        <div className="md:w-1/2 text-center md:text-left mb-10 md:mb-0 z-10 relative">
          <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-bold mb-4 leading-tight">
            Exquisite Personalized Gifts India: <br />
            <span className="text-brand-gold">Crafted Exclusively For Your Story.</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-xl mx-auto md:mx-0">
            Elevate the ordinary. Transform a gift into an heirloom with exquisite engraving and premium finish.
          </p>
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
            <Link
              href="/#featured"
              className="py-3 px-8 text-lg font-semibold bg-brand-gold text-brand-navy rounded-lg shadow-xl hover:bg-[#b58e46] transition-all duration-300"
            >
              Explore Our Signature Kits
            </Link>
            <Link
              href="/#category-women"
              className="py-3 px-8 text-lg font-semibold bg-brand-navy border border-brand-gold text-brand-gold rounded-lg shadow-xl hover:bg-brand-gold hover:text-brand-navy transition duration-300"
            >
              Shop Personalized Jewelry
            </Link>
          </div>
        </div>

        {/* Image (GSAP Parallax target) */}
        <div className="md:w-1/2 flex justify-center md:justify-end z-10 relative">
          <div ref={heroImageRef} className="rounded-xl shadow-2xl overflow-hidden border-4 border-brand-gold">
            <Image
              src="/images/IMG_20251128_085724.jpg"
              alt="Hand engraving a personalized leather wallet - Premium engraving craftsmanship"
              width={500}
              height={400}
              className="object-cover"
              priority
            />
          </div>
        </div>
      </div>

      {/* Subtle background pattern/texture for premium feel */}
      <div
        className="absolute inset-0 opacity-10 bg-repeat"
        style={{
          backgroundImage:
            "url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23c39c4e\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
        }}
      ></div>
    </section>
  );
}

