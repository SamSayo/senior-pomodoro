const CACHE_NAME = 'pomodoro-v1';
const PRECACHE_URLS = [
    '/web-app-manifest-192x192.png',
    '/web-app-manifest-512x512.png',
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
    );
    self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) return cachedResponse;

      return fetch(event.request).then((networkResponse) => {
        // Кэшируем только GET-запросы
        if (event.request.method === 'GET') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => {
        // Оффлайн-фолбэк (можно создать offline.html)
        return caches.match('/');
      });
    })
  );
});

// Обработка push-уведомлений
self.addEventListener('push', (event) => {
  let data = {};
  if (event.data) {
    data = event.data.json();
  }

  const title = data.title || 'Pomodoro Timer';
  const options = {
    body: data.body || 'Время сессии закончилось!',
    icon: '/web-app-manifest-192x192.png', // укажите вашу иконку
    badge: '/web-app-manifest-192x192.png',
    vibrate: [200, 100, 200],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Клик по уведомлению — открываем приложение
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      if (clientList.length > 0) {
        return clientList[0].focus();
      }
      return clients.openWindow('/');
    })
  );
});