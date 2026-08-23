const CACHE_NAME = "hrm-bill-generator-v2-3";

const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.json",

  // App Icons
  "./icons/icon-192.png",
  "./icons/icon-512.png"
];


/* =====================================================
   INSTALL
===================================================== */

self.addEventListener("install", event => {

  event.waitUntil(

    caches.open(CACHE_NAME)
      .then(cache => {

        return cache.addAll(APP_FILES);

      })

  );

  self.skipWaiting();

});


/* =====================================================
   ACTIVATE
===================================================== */

self.addEventListener("activate", event => {

  event.waitUntil(

    caches.keys()
      .then(cacheNames => {

        return Promise.all(

          cacheNames
            .filter(name => {

              return (
                name.startsWith("hrm-bill-generator-") &&
                name !== CACHE_NAME
              );

            })

            .map(name => {

              return caches.delete(name);

            })

        );

      })

  );

  self.clients.claim();

});


/* =====================================================
   FETCH
===================================================== */

self.addEventListener("fetch", event => {

  event.respondWith(

    caches.match(event.request)
      .then(cachedResponse => {

        if (cachedResponse) {

          return cachedResponse;

        }


        return fetch(event.request)
          .then(networkResponse => {

            return networkResponse;

          })
          .catch(() => {

            return caches.match(
              "./index.html"
            );

          });

      })

  );

});