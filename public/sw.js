const CACHE_NAME = 'dilse-v2';
const RUNTIME_CACHE = 'dilse-runtime-v2';
const STATIC_CACHE = 'dilse-static-v2';

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/favicon/favicon.png',
  '/manifest.json',
];

// Install event - cache static resources
self.addEventListener('install', (event) => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('[Service Worker] Caching static assets');
        return cache.addAll(STATIC_ASSETS).catch((err) => {
          console.error('[Service Worker] Cache addAll error:', err);
        });
      })
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== STATIC_CACHE && cacheName !== RUNTIME_CACHE && cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // Take control of all pages immediately
  return self.clients.claim();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  // Skip API routes and external resources
  if (event.request.url.includes('/api/') || 
      event.request.url.includes('razorpay.com') ||
      event.request.url.includes('checkout.razorpay.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // Return cached version if available
        if (cachedResponse) {
          return cachedResponse;
        }

        // Fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache the response
            caches.open(RUNTIME_CACHE)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          })
          .catch(() => {
            // If both fail, return offline fallback for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('/');
            }
            // For other requests, return a basic response
            return new Response('Offline', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
      })
  );
});

// Handle push notifications (for future use)
self.addEventListener('push', (event) => {
  console.log('[Service Worker] Push notification received');
  // Handle push notification
  if (event.data) {
    const data = event.data.json();
    const title = data.title || 'dilse';
    const options = {
      body: data.body || 'You have a new notification',
      icon: '/favicon/favicon.png',
      badge: '/favicon/favicon.png',
      tag: data.tag || 'default',
    };

    event.waitUntil(
      self.registration.showNotification(title, options)
    );
  }
});

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  console.log('[Service Worker] Notification clicked');
  event.notification.close();

  event.waitUntil(
    clients.openWindow('/')
  );
});

