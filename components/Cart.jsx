import { useCart } from '../context/CartContext';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import CartItem from './CartItem';

export default function Cart() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    isCartOpen,
    setIsCartOpen,
    clearCart,
  } = useCart();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showCheckoutForm, setShowCheckoutForm] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
  });

  const cartRef = useRef(null);
  const overlayRef = useRef(null);
  const hamburgerRef = useRef(null);
  const totalRef = useRef(null);

  // Slide animation for cart
  useEffect(() => {
    if (!cartRef.current || !overlayRef.current) return;

    if (isCartOpen) {
      // Open animation
      gsap.set([cartRef.current, overlayRef.current], { display: 'block' });
      gsap.fromTo(
        overlayRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.3, ease: 'power2.out' }
      );
      gsap.fromTo(
        cartRef.current,
        { x: '100%' },
        { x: 0, duration: 0.4, ease: 'power3.out' }
      );
    } else {
      // Close animation
      gsap.to(cartRef.current, {
        x: '100%',
        duration: 0.3,
        ease: 'power2.in',
        onComplete: () => {
          gsap.set([cartRef.current, overlayRef.current], { display: 'none' });
        },
      });
      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.2,
        ease: 'power2.in',
      });
      // Reset checkout form when closing cart
      setShowCheckoutForm(false);
    }
  }, [isCartOpen]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    const { name, email, phone, address, city, pincode } = customerInfo;
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim() || !city.trim() || !pincode.trim()) {
      alert('Please fill in all the required fields');
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('Please enter a valid email address');
      return false;
    }
    if (!/^\d{10}$/.test(phone)) {
      alert('Please enter a valid 10-digit phone number');
      return false;
    }
    if (!/^\d{6}$/.test(pincode)) {
      alert('Please enter a valid 6-digit pincode');
      return false;
    }
    return true;
  };

  const initiateRazorpayPayment = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    try {
      // Create order on server
      const orderResponse = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: getCartTotal(),
          currency: 'INR',
          receipt: `order_${Date.now()}`,
          notes: {
            customerName: customerInfo.name,
            customerEmail: customerInfo.email,
            customerPhone: customerInfo.phone,
            shippingAddress: `${customerInfo.address}, ${customerInfo.city} - ${customerInfo.pincode}`,
            items: cart.map((item) => `${item.name} x${item.quantity}`).join(', '),
          },
        }),
      });

      const orderData = await orderResponse.json();

      if (!orderData.success) {
        throw new Error(orderData.error || 'Failed to create order');
      }

      // Initialize Razorpay checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: orderData.order.amount,
        currency: orderData.order.currency,
        name: 'DilSe',
        description: 'Purchase from DilSe',
        order_id: orderData.order.id,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          address: `${customerInfo.address}, ${customerInfo.city} - ${customerInfo.pincode}`,
        },
        theme: {
          color: '#1e3a5f',
        },
        handler: async function (response) {
          // Verify payment on server
          try {
            const verifyResponse = await fetch('/api/razorpay/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json();

            if (verifyData.success) {
              // Payment successful
              alert(
                `🎉 Payment Successful!\n\nOrder ID: ${response.razorpay_order_id}\nPayment ID: ${response.razorpay_payment_id}\n\nThank you for shopping with DilSe!\nYou will receive a confirmation email shortly.`
              );
              clearCart();
              setIsCartOpen(false);
              setShowCheckoutForm(false);
              setCustomerInfo({
                name: '',
                email: '',
                phone: '',
                address: '',
                city: '',
                pincode: '',
              });
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification error. Please contact support.');
          }
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on('payment.failed', function (response) {
        alert(`Payment Failed!\n\nReason: ${response.error.description}\n\nPlease try again.`);
        setIsProcessing(false);
      });
      razorpay.open();
    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setShowCheckoutForm(true);
  };

  const handleRemoveItem = (itemId) => {
    // The animation is handled in CartItem component
    // This function is called after animation completes
    removeFromCart(itemId);
  };

  // Animate total price when it changes
  useEffect(() => {
    if (totalRef.current && cart.length > 0) {
      gsap.fromTo(
        totalRef.current,
        { scale: 1.2, color: '#B8860B' },
        {
          scale: 1,
          color: '#1e3a5f',
          duration: 0.4,
          ease: 'back.out(1.7)',
        }
      );
    }
  }, [cart, getCartTotal]);

  if (!isCartOpen) {
    return null;
  }

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black bg-opacity-50 z-50"
        onClick={() => setIsCartOpen(false)}
        style={{ display: 'none' }}
      ></div>

      {/* Cart Sidebar */}
      <div
        ref={cartRef}
        className="fixed right-0 top-0 h-full w-full md:w-[450px] bg-white shadow-2xl z-50 overflow-hidden flex flex-col"
        style={{ display: 'none', transform: 'translateX(100%)' }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="bg-brand-navy text-white p-6 flex justify-between items-center">
            <h2 className="text-2xl font-serif font-bold">
              {showCheckoutForm ? 'Checkout' : 'Shopping Cart'}
            </h2>
            {/* Animated Hamburger Menu Button */}
            <button
              ref={hamburgerRef}
              onClick={() => setIsCartOpen(false)}
              className="relative w-8 h-8 flex items-center justify-center group cursor-pointer z-10"
              aria-label="Close cart"
            >
              <div className="relative w-6 h-5 flex flex-col justify-between">
                <span className="block w-full h-0.5 bg-white transition-all duration-300 ease-in-out origin-center group-hover:translate-y-2 group-hover:rotate-45"></span>
                <span className="block w-full h-0.5 bg-white transition-all duration-300 ease-in-out opacity-100 group-hover:opacity-0"></span>
                <span className="block w-full h-0.5 bg-white transition-all duration-300 ease-in-out origin-center group-hover:-translate-y-2 group-hover:-rotate-45"></span>
              </div>
            </button>
          </div>

          {/* Cart Items or Checkout Form */}
          <div className="flex-1 overflow-y-auto p-4">
            {!showCheckoutForm ? (
              // Cart Items View
              cart.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500 text-lg mb-4">Your cart is empty</p>
                  <Link
                    href="/#featured"
                    onClick={() => setIsCartOpen(false)}
                    className="text-brand-gold hover:underline"
                  >
                    Continue Shopping
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <CartItem
                      key={item.id}
                      item={item}
                      onUpdateQuantity={updateQuantity}
                      onRemove={handleRemoveItem}
                    />
                  ))}
                </div>
              )
            ) : (
              // Checkout Form View
              <div className="space-y-4">
                <button
                  onClick={() => setShowCheckoutForm(false)}
                  className="flex items-center text-brand-navy hover:text-brand-gold transition-colors mb-4"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to Cart
                </button>

                <div className="bg-gray-50 rounded-lg p-4 mb-4">
                  <h3 className="font-semibold text-brand-navy mb-2">Order Summary</h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    {cart.map((item) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.name} × {item.quantity}</span>
                        <span>₹{(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                    <div className="border-t pt-2 mt-2 font-semibold text-brand-navy flex justify-between">
                      <span>Total</span>
                      <span>₹{getCartTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <h3 className="font-semibold text-brand-navy">Shipping Details</h3>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={customerInfo.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    value={customerInfo.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={customerInfo.phone}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition"
                    placeholder="10-digit mobile number"
                    maxLength={10}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shipping Address *</label>
                  <textarea
                    name="address"
                    value={customerInfo.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition resize-none"
                    placeholder="House/Flat No., Street, Landmark"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition"
                      placeholder="City"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Pincode *</label>
                    <input
                      type="text"
                      name="pincode"
                      value={customerInfo.pincode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none transition"
                      placeholder="6-digit pincode"
                      maxLength={6}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t border-gray-200 p-6 bg-gray-50">
              {!showCheckoutForm ? (
                <>
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-lg font-semibold text-brand-navy">Total:</span>
                    <span ref={totalRef} className="text-2xl font-bold text-brand-navy">
                      ₹{getCartTotal().toLocaleString()}
                    </span>
                  </div>
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3 px-6 bg-brand-gold text-brand-navy font-semibold rounded-lg hover:bg-[#b58e46] transition duration-300 shadow-md hover:shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                  <button
                    onClick={() => setIsCartOpen(false)}
                    className="w-full mt-2 py-2 px-6 border border-brand-navy text-brand-navy font-semibold rounded-lg hover:bg-brand-navy hover:text-white transition duration-300"
                  >
                    Continue Shopping
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={initiateRazorpayPayment}
                    disabled={isProcessing}
                    className={`w-full py-3 px-6 bg-brand-gold text-brand-navy font-semibold rounded-lg transition duration-300 shadow-md hover:shadow-lg flex items-center justify-center ${
                      isProcessing ? 'opacity-70 cursor-not-allowed' : 'hover:bg-[#b58e46]'
                    }`}
                  >
                    {isProcessing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-brand-navy" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                        Pay ₹{getCartTotal().toLocaleString()}
                      </>
                    )}
                  </button>
                  <div className="mt-3 flex items-center justify-center text-xs text-gray-500">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    Secured by Razorpay
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
