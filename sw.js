// U.C.C Institute Service Worker — Network-First (v37)
// Always loads the latest index.html & student.html from GitHub when online; falls back to cache only when offline.
const CACHE_NAME = 'ucc-pwa-v37';

self.addEventListener('install', event => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = req.url || '';
  if (url.includes('script.google.com') || url.includes('script.googleusercontent.com')) return;

  event.respondWith(
    fetch(req, { cache: 'no-store' })
      .then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(req, clone)).catch(() => {});
        }
        return res;
      })
      .catch(() => caches.match(req))
  );
});
