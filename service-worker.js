const CACHE_NAME = "hrm-bill-generator-v2.593";


const APP_FILES = [

  // ===== MAIN APP =====

  "./index.html",
  "./manifest.json",

  // ===== APP ICONS =====

  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",

  // ===== CSS FILES =====

  "./css/base.css",
  "./css/layout.css",
  "./css/company.css",
  "./css/bill-form.css",
  "./css/table.css",
  "./css/payment.css",
  "./css/bill-history.css",
  "./css/modal.css",
  "./css/components.css",
  "./css/responsive.css",

  
  // ===== JAVASCRIPT FILES =====

  "./js/company.js",
  "./js/calculations.js",
  "./js/particulars.js",
  "./js/draft.js",
  "./js/pwa.js",

  
  
  // ===== BACKGROUND IMAGES =====

  "./assets/images/header-bg.jpg",
  "./assets/images/automotive-workshop.webp",
  "./assets/images/automotive-electrical.webp"


];



/* =====================================================
   INSTALL
===================================================== */

/* =====================================================
   INSTALL — ERROR DIAGNOSTIC
===================================================== */

self.addEventListener("install", event => {

  event.waitUntil(

    (async function() {

      const cache =
        await caches.open(CACHE_NAME);

      for (const file of APP_FILES) {

        try {

          await cache.add(file);

          console.log("CACHE SUCCESS:", file);

        } catch (error) {

          const clients =
            await self.clients.matchAll({
              type: "window",
              includeUncontrolled: true
            });

          clients.forEach(client => {

            client.postMessage({

              type: "SW_INSTALL_FAILED",

              file: file,

              message: error.message

            });

          });

          throw error;

        }

      }

    })()

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

      .then(() => {

        return self.clients.claim();

      })

  );

});



/* =====================================================
   FETCH
===================================================== */

self.addEventListener("fetch", event => {

  const request = event.request;

  // Only handle same-origin requests
  if (new URL(request.url).origin !== self.location.origin) {
    return;
  }

  event.respondWith(

    caches.match(request)
      .then(cachedResponse => {

        if (cachedResponse) {
          return cachedResponse;
        }

        return fetch(request)
          .then(networkResponse => {

            // Return actual server response
            return networkResponse;

          })
          .catch(() => {

            // Offline fallback only for page navigation
            if (request.mode === "navigate") {
              return caches.match("./index.html");
            }

            // Never return HTML for CSS, JS or images
            return new Response(
              "File unavailable offline",
              {
                status: 503,
                statusText: "Service Unavailable"
              }
            );

          });

      })

  );

});



/* =================================
   SERVICE WORKER MESSAGE HANDLER
================================= */

self.addEventListener(
  "message",
  function(event) {

    // ===== SERVICE WORKER UPDATE =====

    if (
      event.data &&
      event.data.type === "SKIP_WAITING"
    ) {

      self.skipWaiting();

      return;
    }


    // ===== BILL SAVED NOTIFICATION =====

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
            "./assets/icons/icon-192.png",

          badge:
            "./assets/icons/icon-192.png",

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
