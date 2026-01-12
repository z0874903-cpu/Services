// Basic service worker for caching
const CACHE_NAME = 'servicepro-v1';
const urlsToCache = [
    '/',
    '/style.css',
    '/script.js',
    '/language-manager.js',
    '/en.json',
    '/ar.json'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});
