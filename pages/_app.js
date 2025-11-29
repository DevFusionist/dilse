import '../styles/globals.css';
import Layout from '../components/Layout';
import { CartProvider } from '../context/CartContext';
import Cart from '../components/Cart';
import Script from 'next/script';

export default function App({ Component, pageProps }) {
  return (
    <CartProvider>
      {/* Razorpay Checkout Script */}
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      <Layout>
        <Component {...pageProps} />
        <Cart />
      </Layout>
    </CartProvider>
  );
}
