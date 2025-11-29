import '../styles/globals.css';
import Layout from '../components/Layout';
import { CartProvider } from '../context/CartContext';
import Cart from '../components/Cart';
import Script from 'next/script';
import Head from 'next/head';
import { useEffect } from 'react';

export default function App({ Component, pageProps }) {
  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js')
          .then((registration) => {
            console.log('SW registered: ', registration);
          })
          .catch((registrationError) => {
            console.log('SW registration failed: ', registrationError);
          });
      });
    }
  }, []);

  return (
    <CartProvider>
      <Head>
        {/* PWA Meta Tags */}
        <meta name="application-name" content="dilse" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content="dilse" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#c39c4e" />
        <meta name="msapplication-TileColor" content="#c39c4e" />
        <meta name="msapplication-config" content="/browserconfig.xml" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/favicon/favicon.png" />
      </Head>
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
