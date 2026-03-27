const CACHE_NAME = 'generator-kodow-v2.1-cache';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Pobieramy też bibliotekę JsBarcode do cache, aby aplikacja działała offline
  'https://cdn.jsdelivr.net/npm/jsbarcode@3.11.5/dist/JsBarcode.all.min.js'
];

// Instalacja Service Workera i dodanie plików do pamięci podręcznej
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(ASSETS_TO_CACHE);
      })
  );
});

// Obsługa zapytań sieciowych - zwracanie danych z cache, jeśli jesteśmy offline
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response; // Zwraca z cache
        }
        return fetch(event.request); // Pobiera z sieci
      })
  );
});

// Aktualizacja Service Workera i usuwanie starych cache
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});