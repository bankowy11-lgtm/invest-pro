/* =====================================================
   InvestPro — Service Worker
   Strategia: Cache Shell + Network-first dla API
   ===================================================== */

const CACHE_NAME    = 'investpro-v2';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  'https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&family=Inter:wght@300;400;500;600&display=swap',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.js',
];

/* ---- INSTALL: pre-cache shell ---- */
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(STATIC_ASSETS).catch(err => {
        console.warn('[SW] Nie udało się cache-ować:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

/* ---- ACTIVATE: usuń stare cache ---- */
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys
        .filter(k => k !== CACHE_NAME)
        .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ---- FETCH: strategia hybrydowa ---- */
self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);

  // 1. Finnhub API + WebSocket — zawsze sieć (bez cache)
  if (url.hostname.includes('finnhub') || url.hostname.includes('corsproxy')) {
    return; // przepuść, nie przechwytuj
  }

  // 2. Fonty Google — cache-first
  if (url.hostname.includes('fonts.g') || url.hostname.includes('fonts.googleapis')) {
    e.respondWith(
      caches.match(e.request).then(cached => {
        if (cached) return cached;
        return fetch(e.request).then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
          return res;
        });
      })
    );
    return;
  }

  // 3. CDN (Chart.js itp.) — cache-first
  if (url.hostname.includes('cdnjs') || url.hostname.includes('cdn.')) {
    e.respondWith(
      caches.match(e.request).then(cached => cached || fetch(e.request))
    );
    return;
  }

  // 4. Pliki lokalne (shell) — cache-first z fallback network
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        if (res && res.status === 200 && res.type === 'basic') {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(c => c.put(e.request, clone));
        }
        return res;
      }).catch(() => caches.match('./index.html')); // offline fallback
    })
  );
});

/* ---- PUSH NOTIFICATIONS (przygotowane na przyszłość) ---- */
self.addEventListener('push', e => {
  if (!e.data) return;
  const data = e.data.json();
  self.registration.showNotification(data.title || 'InvestPro Alert', {
    body:    data.body  || 'Sprawdź swój portfel',
    icon:    './icon-192.png',
    badge:   './icon-192.png',
    vibrate: [200, 100, 200],
    data:    { url: data.url || './' },
  });
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow(e.notification.data.url || './'));
});
