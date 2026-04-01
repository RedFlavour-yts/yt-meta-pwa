const CACHE = 'yt-meta-v3';
const ASSETS = [
  '/yt-meta-pwa/index.html',
  '/yt-meta-pwa/manifest.json',
  '/yt-meta-pwa/icon-192.png',
  '/yt-meta-pwa/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  if(e.request.method !== 'GET') return;
  if(e.request.url.includes('api.anthropic.com')) return;
  e.respondWith(
    caches.match(e.request).then(cached =>
      cached || fetch(e.request).catch(() => caches.match('/yt-meta-pwa/index.html'))
    )
  );
});
