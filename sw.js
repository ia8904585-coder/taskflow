const CACHE_NAME = 'my-site-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/cood.js'
  // أضف هنا أي ملفات أخرى تريد حفظها للعمل دون إنترنت
];

// تثبيت العامل الخدمي وحفظ الملفات في التخزين المؤقت
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

// جلب الملفات من التخزين المؤقت عند انقطاع الإنترنت
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});