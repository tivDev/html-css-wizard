const CACHE_NAME = 'app-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js'
];
const API_URL = 'https://jsonplaceholder.typicode.com/users';

// Install - cache static files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate - clean old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});

// Fetch - serve static and cache API response
self.addEventListener('fetch', event => {
  const request = event.request;

  // Cache-first for static files
  if (STATIC_ASSETS.includes(new URL(request.url).pathname)) {
    event.respondWith(
      caches.match(request).then(res => res || fetch(request))
    );
    return;
  }

  // Network-first for API
  if (request.url === API_URL) {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(request, clone);
          });
          return response;
        })
        .catch(() => caches.match(request))
    );
    return;
  }
});
