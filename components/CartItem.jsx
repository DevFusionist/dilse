import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { FaPlus, FaMinus, FaTrash } from 'react-icons/fa';
import { gsap } from 'gsap';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const itemRef = useRef(null);
  const quantityRef = useRef(null);
  const [prevQuantity, setPrevQuantity] = useState(item.quantity);

  // Animate quantity change
  useEffect(() => {
    if (quantityRef.current && item.quantity !== prevQuantity) {
      // Determine if quantity increased or decreased
      const isIncrease = item.quantity > prevQuantity;
      
      // Animate quantity number
      gsap.fromTo(
        quantityRef.current,
        {
          scale: isIncrease ? 0.8 : 1.2,
          color: isIncrease ? '#B8860B' : '#dc2626',
        },
        {
          scale: 1,
          color: '#000000',
          duration: 0.4,
          ease: 'back.out(1.7)',
        }
      );
      
      // Pulse animation for the whole item
      if (itemRef.current) {
        gsap.to(itemRef.current, {
          scale: 1.02,
          duration: 0.2,
          yoyo: true,
          repeat: 1,
          ease: 'power2.inOut',
        });
      }
      
      setPrevQuantity(item.quantity);
    }
  }, [item.quantity, prevQuantity]);

  const handleDecrease = () => {
    if (item.quantity > 1) {
      onUpdateQuantity(item.id, item.quantity - 1);
    } else {
      // Animate removal when quantity reaches 0
      handleRemove();
    }
  };

  const handleIncrease = () => {
    onUpdateQuantity(item.id, item.quantity + 1);
  };

  const handleRemove = () => {
    if (itemRef.current) {
      gsap.to(itemRef.current, {
        x: '100%',
        opacity: 0,
        scale: 0.8,
        height: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
        duration: 0.4,
        ease: 'power2.in',
        onComplete: () => {
          onRemove(item.id);
        },
      });
    } else {
      // Fallback if ref is not available
      onRemove(item.id);
    }
  };

  return (
    <div
      ref={itemRef}
      className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-brand-gold transition-colors duration-200"
    >
      <div className="relative w-20 h-20 flex-shrink-0">
        <Image
          src={item.image}
          alt={item.name}
          fill
          className="object-cover rounded"
          sizes="80px"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-brand-navy mb-1">{item.name}</h3>
        <p className="text-sm text-gray-600 mb-2">₹{item.price.toLocaleString()}</p>
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrease}
            className="p-1 text-brand-navy hover:text-brand-gold transition-colors duration-200 relative group"
            aria-label="Decrease quantity"
          >
            <FaMinus className="text-xs" />
            <span className="absolute inset-0 scale-150 opacity-0 group-active:opacity-100 group-active:scale-100 transition-all duration-200">
              <FaMinus className="text-xs" />
            </span>
          </button>
          <span
            ref={quantityRef}
            className="px-3 py-1 border border-gray-300 rounded min-w-[3rem] text-center font-semibold"
          >
            {item.quantity}
          </span>
          <button
            onClick={handleIncrease}
            className="p-1 text-brand-navy hover:text-brand-gold transition-colors duration-200 relative group"
            aria-label="Increase quantity"
          >
            <FaPlus className="text-xs" />
            <span className="absolute inset-0 scale-150 opacity-0 group-active:opacity-100 group-active:scale-100 transition-all duration-200">
              <FaPlus className="text-xs" />
            </span>
          </button>
          <button
            onClick={handleRemove}
            className="ml-auto p-1 text-red-500 hover:text-red-700 transition-colors duration-200 relative group"
            aria-label="Remove item"
          >
            <FaTrash className="text-sm" />
            <span className="absolute inset-0 scale-150 opacity-0 group-active:opacity-100 group-active:scale-100 transition-all duration-200">
              <FaTrash className="text-sm" />
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

