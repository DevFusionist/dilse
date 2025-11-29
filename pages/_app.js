import '../styles/globals.css';
import Layout from '../components/Layout';
import { CartProvider } from '../context/CartContext';
import { AuthProvider } from '../context/AuthContext';
import Cart from '../components/Cart';
import Script from 'next/script';
import Head from 'next/head';
import { useEffect, useState } from 'react';

export default function App({ Component, pageProps }) {
  const [installPrompt, setInstallPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    // Register service worker for PWA
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker
          .register('/sw.js', { scope: '/' })
          .then((registration) => {
            console.log('Service Worker registered: ', registration);
            
            // Check for updates
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing;
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  // New service worker available
                  console.log('New service worker available');
                  if (confirm('A new version is available. Reload to update?')) {
                    window.location.reload();
                  }
                }
              });
            });
          })
          .catch((registrationError) => {
            console.log('Service Worker registration failed: ', registrationError);
          });
      });
    }

    // Handle install prompt
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setInstallPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      console.log('App is running in standalone mode');
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  // Function to install PWA
  const handleInstallClick = async () => {
    if (!installPrompt) return;

    installPrompt.prompt();
    const { outcome } = await installPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }
    
    setInstallPrompt(null);
    setIsInstallable(false);
  };

  return (
    <AuthProvider>
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        
        {/* PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* Apple Touch Icons */}
        <link rel="apple-touch-icon" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="96x96" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="128x128" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="192x192" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="384x384" href="/favicon/favicon.png" />
        <link rel="apple-touch-icon" sizes="512x512" href="/favicon/favicon.png" />
        
        {/* Favicon */}
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon/favicon.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon/favicon.png" />
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
    </AuthProvider>
  );
}
