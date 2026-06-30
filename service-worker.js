const CACHE_NAME = 'pwa-cache-v1';
const urlsToCache = [
  '/Gsterz1000-1/',
  '/Gsterz1000-1/index.html',
  '/Gsterz1000-1/script.js',
  '/Gsterz1000-1/manifest.json',
  '/Gsterz1000-1/icon-192.jpg',
  '/Gsterz1000-1/icon-512.jpg'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => response || fetch(event.request))
  );
});