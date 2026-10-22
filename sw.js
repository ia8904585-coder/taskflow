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
// 1. الاستماع لحدث الـ Push القادم من الخلفية حتى لو كان المتصفح مغلقاً
self.addEventListener('push', event => {
    let data = { title: "تذكير محاضرة", body: "لديك محاضرة قريبة" };
    
    // إذا كان هناك بيانات مرسلة مع الإشعار، نقوم بقراءتها
    if (event.data) {
        data = event.data.json();
    }

    const options = {
        body: data.body,
        icon: '/icon.png', // ضع مسار أيقونة تطبيقك هنا إن وجدت
        badge: '/icon.png'
    };

    // إظهار الإشعار حتى لو كانت الصفحة مغلقة
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// 2. التعامل مع النقر على الإشعار لفتح التطبيق مباشرة
self.addEventListener('notificationclick', event => {
    event.notification.close(); // إغلاق الإشعار عند الضغط عليه

    event.waitUntil(
        clients.openWindow('/') // فتح صفحة التطبيق الرئيسية عند الضغط على الإشعار
    );
});