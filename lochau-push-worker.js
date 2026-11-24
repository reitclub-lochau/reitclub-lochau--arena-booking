const APP_URL = new URL(
  './reitclub_lochau_stallmanagement_v20_push.html',
  self.location.href
).href;

self.addEventListener('install', event => {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', event => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch {
    data = {};
  }

  event.waitUntil(
    self.registration.showNotification(
      data.title || 'Reitclub Lochau',
      {
        body: data.body || 'Neue Mitteilung',
        icon: './reitclub_lochau_app_icon.png',
        badge: './reitclub_lochau_app_icon.png',
        tag: data.tag || 'lochau-push',
        data: { url: APP_URL }
      }
    )
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  event.waitUntil((async () => {
    const windows = await self.clients.matchAll({
      type: 'window',
      includeUncontrolled: true
    });

    for (const client of windows) {
      if (client.url === APP_URL) {
        return client.focus();
      }
    }

    return self.clients.openWindow(APP_URL);
  })());
});
