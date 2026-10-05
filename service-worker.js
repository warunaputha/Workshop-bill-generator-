const CACHE_NAME = "hrm-bill-generator-v2.57";

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


// =================================
// ANDROID SYSTEM NOTIFICATION
// =================================

self.addEventListener(
  "message",
  function(event) {

    if (
      event.data &&
      event.data.type === "BILL_SAVED"
    ) {

      const billNo =
        event.data.billNo || "";

      self.registration.showNotification(
        "HighResist MOTORS",
        {
          body:
            "Bill saved successfully\n" +
            "Bill No: " + billNo,

          icon:
            "./icons/icon-192.png",

          badge:
            "./icons/icon-192.png",

          tag:
            "bill-saved-" + billNo,

          vibrate:
            [200, 100, 200],

          data: {
            billNo: billNo
          }
        }
      );

    }

  }
);




// =================================
// SERVICE WORKER UPDATE
// =================================

self.addEventListener(
  "message",
  function(event) {

    if (
      event.data &&
      event.data.type === "SKIP_WAITING"
    ) {

      self.skipWaiting();

    }

  }
);
