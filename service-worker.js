// Pre-cache essential files on install
const CACHE_NAME = 'servicepro-v1';
const urlsToCache = [
    '/',
    '/style.css',
    '/script.js',
    '/language-manager.js',
    '/en.json',
    '/ar.json',
    '/index.html',
    '/web.html',
    '/app-development.html',
    '/graphic-design.html',
    '/digital-marketing.html',
    '/business-startup.html',
    '/hotel.html'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
});
