/// Add the codes below to ngsw-worker.js around line 1850
// (function () {
//  'use strict';
  console.log('[sw-custom] executing');
  this.scope.addEventListener('notificationclick', (event) => {
    console.log('[sw-custom] Notification click event: ', event);
    event.notification.close();
    if (clients.openWindow && event.notification.data.url) {
      if (event.action === 'appstart') {
        event.waitUntil(clients.openWindow(event.notification.data.url));
      }
    }
  });
// }); 