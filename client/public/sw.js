// Service Worker for offline support and caching
// Installation: Register this in your main.jsx

const CACHE_VERSION = 'v1.0.0';
const CACHE_NAMES = {
  STATIC: `rodvers-static-${CACHE_VERSION}`,
  DYNAMIC: `rodvers-dynamic-${CACHE_VERSION}`,
  IMAGES: `rodvers-images-${CACHE_VERSION}`,
};

// Assets to cache on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install event: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAMES.STATIC).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        // Fallback if some assets fail
        return cache.addAll(['/']);
      });
    })
  );
  self.skipWaiting();
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete old cache versions
          if (!Object.values(CACHE_NAMES).includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Fetch event: implement caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Strategy 1: Network-first for API requests (with fallback to cache)
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          // Cache successful responses
          if (response.status === 200) {
            const cache = caches.open(CACHE_NAMES.DYNAMIC);
            cache.then((c) => c.put(request, response.clone()));
          }
          return response;
        })
        .catch(() => {
          // Fallback to cache on network failure
          return caches.match(request).then((cachedResponse) => {
            return cachedResponse || new Response('Offline: Data unavailable', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain',
              }),
            });
          });
        })
    );
    return;
  }

  // Strategy 2: Cache-first for images
  if (request.destination === 'image' || url.hostname === 'res.cloudinary.com') {
    event.respondWith(
      caches.open(CACHE_NAMES.IMAGES).then((cache) => {
        return cache.match(request).then((response) => {
          return (
            response ||
            fetch(request).then((fetchResponse) => {
              cache.put(request, fetchResponse.clone());
              return fetchResponse;
            })
          );
        });
      })
    );
    return;
  }

  // Strategy 3: Stale-while-revalidate for other requests
  event.respondWith(
    caches.open(CACHE_NAMES.STATIC).then((cache) => {
      return cache.match(request).then((response) => {
        const fetchPromise = fetch(request).then((fetchResponse) => {
          if (fetchResponse.status === 200) {
            cache.put(request, fetchResponse.clone());
          }
          return fetchResponse;
        });
        return response || fetchPromise;
      });
    })
  );
});

// Handle messages from clients
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
