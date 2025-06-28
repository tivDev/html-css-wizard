const CACHE_NAME = 'offline-cache-v1';
const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/styles.css',
  '/app.js',
  '/db.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key !== CACHE_NAME) return caches.delete(key);
      }))
    )
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  
  // Network-first for API
  if (url.hostname === 'jsonplaceholder.typicode.com') {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          return res;
        })
        .catch(() => caches.match(event.request))
    );
  } else {
    // Cache-first for local files
    event.respondWith(
      caches.match(event.request).then(res => res || fetch(event.request))
    );
  }
});
