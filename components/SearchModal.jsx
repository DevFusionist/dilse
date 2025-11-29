import { useState, useEffect, useRef } from 'react';
import { FaTimes, FaSearch } from 'react-icons/fa';
import { searchProducts } from '../data/products';
import Image from 'next/image';
import { useCart } from '../context/CartContext';
import Link from 'next/link';

export default function SearchModal({ isOpen, onClose }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const inputRef = useRef(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim()) {
      const searchResults = searchProducts(searchQuery);
      setResults(searchResults);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={onClose}
      ></div>

      {/* Search Modal */}
      <div className="fixed top-20 left-1/2 transform -translate-x-1/2 w-full max-w-2xl bg-white rounded-lg shadow-2xl z-50 max-h-[80vh] overflow-hidden flex flex-col">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <FaSearch className="text-gray-400 text-xl" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 outline-none text-lg"
            />
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-brand-navy"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto p-4">
          {searchQuery.trim() === '' ? (
            <p className="text-center text-gray-500 py-8">Start typing to search...</p>
          ) : results.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No products found</p>
          ) : (
            <div className="space-y-4">
              {results.map((product) => (
                <Link
                  key={product.id}
                  href={`/#${product.category === 'men' ? 'category-men' : 'category-women'}`}
                  onClick={onClose}
                  className="flex gap-4 p-4 border border-gray-200 rounded-lg hover:border-brand-gold transition duration-200"
                >
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover rounded"
                      sizes="96px"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-brand-navy mb-1">{product.name}</h3>
                    <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                    <p className="text-lg font-bold text-brand-gold">₹{product.price.toLocaleString()}</p>
                  </div>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      addToCart(product);
                    }}
                    className="px-4 py-2 bg-brand-gold text-brand-navy rounded-lg hover:bg-[#b58e46] transition duration-200 text-sm font-semibold"
                  >
                    Add to Cart
                  </button>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}

