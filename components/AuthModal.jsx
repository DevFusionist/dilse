import { useState } from 'react';
import { FaTimes, FaUser, FaLock, FaEnvelope, FaPhone } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import { gsap } from 'gsap';

export default function AuthModal({ isOpen, onClose }) {
  const [isLogin, setIsLogin] = useState(false);
  console.log(isLogin);
  const [showOTP, setShowOTP] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, verifyOTP } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (showOTP) {
        // Verify OTP
        const result = await verifyOTP(email, otp);
        if (result.success) {
          onClose();
          resetForm();
          setIsLogin(true);
        } else {
          setError(result.error || 'Invalid OTP');
        }
      } else if (isLogin) {
        // Login
        const result = await login(email, password);
        if (result.success) {
          onClose();
          resetForm();
          setIsLogin(true);
        } else {
          setError(result.error || 'An error occurred');
        }
      } else {
        // Register - send OTP
        if (!name || !phone) {
          setError('All fields are required');
          setLoading(false);
          return;
        }
        const result = await register(name, email, password, phone);
        if (result.success) {
          setShowOTP(true);
          setError('');
        } else {
          setError(result.error || 'An error occurred');
        }
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setOtp('');
    setShowOTP(false);
    setIsLogin(true);
  };

  const switchMode = () => {
    // Clear all form state
    setShowOTP(false);
    setError('');
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setOtp('');
    // Toggle login/signup mode
    setIsLogin(prev => !prev);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md p-6 sm:p-8 z-10">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <FaTimes className="text-xl" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-serif font-bold text-brand-navy mb-2">
            {showOTP ? 'Verify Email' : isLogin ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-gray-600 text-sm">
            {showOTP
              ? 'Enter the OTP sent to your email'
              : isLogin
              ? 'Sign in to continue shopping'
              : 'Sign up to start shopping'}
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {showOTP ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter OTP
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none text-center text-2xl tracking-widest"
                  placeholder="000000"
                  maxLength={6}
                  required
                  autoFocus
                />
              </div>
              <p className="text-xs text-gray-500 mt-2">
                OTP sent to {email}
              </p>
            </div>
          ) : (
            <>
          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                  placeholder="Enter your name"
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <div className="relative">
              <FaEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {!isLogin && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                  placeholder="10-digit phone number"
                  maxLength={10}
                  required={!isLogin}
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-gold focus:border-transparent outline-none"
                placeholder="Enter your password"
                required
                minLength={6}
              />
            </div>
          </div>
          </>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 px-6 bg-brand-gold text-brand-navy font-semibold rounded-lg transition duration-300 shadow-md hover:shadow-lg ${
              loading
                ? 'opacity-70 cursor-not-allowed'
                : 'hover:bg-[#b58e46]'
            }`}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {showOTP ? 'Verifying...' : isLogin ? 'Signing in...' : 'Sending OTP...'}
              </span>
            ) : (
              showOTP ? 'Verify OTP' : isLogin ? 'Sign In' : 'Send OTP'
            )}
          </button>
        </form>

        {/* Switch Mode / Back to Registration */}
        {!showOTP && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isLogin ? "Don't have an account? " : 'Already have an account? '}
              <button
                onClick={switchMode}
                className="text-brand-gold hover:text-brand-navy font-semibold transition-colors"
              >
                {isLogin ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        )}
        {showOTP && (
          <div className="mt-4 text-center">
            <button
              onClick={() => {
                setShowOTP(false);
                setOtp('');
                setError('');
              }}
              className="text-sm text-brand-gold hover:text-brand-navy font-semibold transition-colors"
            >
              ← Back to registration
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

