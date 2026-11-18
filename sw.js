/* 4000 Essential English Words — Service Worker */
const CACHE_NAME = 'eew-v18';
const CORE = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './data-book1.js',
  './data-book2.js',
  './data-book3.js',
  './data-book4.js',
  './data-book5.js',
  './data-book6.js',
  './manifest.webmanifest',
  './icon-72.png',
  './icon-96.png',
  './icon-128.png',
  './icon-144.png',
  './icon-192.png',
  './icon-384.png',
  './icon-512.png',
  './icon-maskable-512.png'
];
// Cache từng file riêng: thiếu 1 file (vd. icon chưa upload) không làm hỏng cả lần cài SW như addAll().
// File lõi bắt buộc phải có, còn icon chỉ là tùy chọn.
const REQUIRED = ['./', './index.html', './style.css', './app.js', './data-book2.js', './manifest.webmanifest'];
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(async c => {
      const results = await Promise.allSettled(CORE.map(url => c.add(url)));
      const failedRequired = CORE.filter((url, i) => results[i].status === 'rejected' && REQUIRED.includes(url));
      if (failedRequired.length) throw new Error('SW: thiếu file bắt buộc: ' + failedRequired.join(', '));
      results.forEach((r, i) => { if (r.status === 'rejected') console.warn('[SW] bỏ qua file không cache được:', CORE[i]); });
    }).then(() => self.skipWaiting())
  );
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);

  // Font: network-first, lưu lại để dùng offline (phải đặt trước rule googleapis/gstatic bên dưới)
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    e.respondWith(fetch(req).then(res => { const c = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(req, c)); return res; }).catch(() => caches.match(req)));
    return;
  }

  // Network-only: Firebase, Google APIs, dictionary audio, firebase-config (always fresh)
  if (
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('gstatic.com') ||
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('cloudflare.com') ||
    url.hostname.includes('dictionaryapi.dev') ||
    /\.mp3($|\?)/i.test(url.pathname + url.search) ||
    /firebase-config\.js$/i.test(url.pathname)
  ) {
    e.respondWith(fetch(req).catch(() => new Response('', { status: 503 })));
    return;
  }

  if (url.origin === self.location.origin) {
    // Network-first for app shell JS/CSS so updates apply quickly
    if (/\.(js|css)$/i.test(url.pathname)) {
      e.respondWith(
        fetch(req).then(res => {
          if (res && res.status === 200) {
            const c = res.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(req, c));
          }
          return res;
        }).catch(() => caches.match(req))
      );
      return;
    }
    e.respondWith(caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const c = res.clone(); caches.open(CACHE_NAME).then(cache => cache.put(req, c));
        }
        return res;
      }).catch(() => req.mode === 'navigate' ? caches.match('./index.html') : new Response('Offline', { status: 503 }));
    }));
  }
});
