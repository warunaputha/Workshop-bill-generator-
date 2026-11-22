/* =====================================================
   PWA SERVICE WORKER + UPDATE
===================================================== */


/* =================================
   SERVICE WORKER ERROR LISTENER
================================= */

console.log("PWA.JS LOADED SUCCESSFULLY");


if ("serviceWorker" in navigator) {

  navigator.serviceWorker.addEventListener(
    "message",
    function(event) {

      if (
        event.data &&
        event.data.type === "SW_INSTALL_FAILED"
      ) {

        console.error(
          "CACHE FAILED FILE:",
          event.data.file
        );

        console.error(
          "CACHE ERROR:",
          event.data.message
        );

      }

    }
  );

}


/* =================================
   SERVICE WORKER REGISTRATION
================================= */

if ("serviceWorker" in navigator) {

  window.addEventListener("load", function() {

    navigator.serviceWorker
      .register("./service-worker.js")

      .then(function(registration) {

        console.log(
          "Service Worker registered:",
          registration.scope
        );


        /* =================================
           CHECK FOR NEW VERSION
        ================================= */

        registration.addEventListener(
          "updatefound",
          function() {

            const newWorker =
              registration.installing;

            if (!newWorker) return;

            newWorker.addEventListener(
              "statechange",
              function() {

                if (
                  newWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {

                  showUpdateNotification(
                    registration
                  );

                }

              }
            );

          }
        );

      })

      .catch(function(error) {

        console.error(
          "Service Worker registration failed:",
          error
        );

      });

  });

}


/* =================================
   SHOW UPDATE NOTIFICATION
================================= */

function showUpdateNotification(registration) {

  const notification =
    document.getElementById(
      "updateNotification"
    );

  const updateBtn =
    document.getElementById(
      "updateAppBtn"
    );
    
    // DOM SAFETY CHECK

if (!notification) return;

if (!updateBtn) return;
    


  notification.style.display = "flex";


  updateBtn.onclick = function() {

    updateBtn.disabled = true;

    updateBtn.textContent =
      "Updating...";


    if (
      registration.waiting
    ) {

      registration.waiting.postMessage({
        type: "SKIP_WAITING"
      });

    }

  };

}



/* =================================
   RELOAD AFTER UPDATE
================================= */

if ("serviceWorker" in navigator) {

  let refreshing = false;

  navigator.serviceWorker.addEventListener(
    "controllerchange",
    function() {

      if (refreshing) return;

      refreshing = true;

      console.log(
        "NEW SERVICE WORKER ACTIVATED"
      );

      window.location.reload();

    }
  );

}



/* =================================
   ONLINE / OFFLINE STATUS
================================= */

function updateConnectionStatus() {

  const status =
    document.getElementById("connectionStatus");

  // DOM SAFETY CHECK
  if (!status) return;


  if (navigator.onLine) {

    status.textContent = "🟢 Online";

    status.classList.remove("offline");
    status.classList.add("online");

  } else {

    status.textContent = "🔴 Offline";

    status.classList.remove("online");
    status.classList.add("offline");

  }

}


// Check when app opens
updateConnectionStatus();


// Listen for internet connection changes
window.addEventListener(
  "online",
  updateConnectionStatus
);

window.addEventListener(
  "offline",
  updateConnectionStatus
);









/* =================================
   PWA INSTALL
================================= */

let deferredInstallPrompt = null;

const installAppBtn =
  document.getElementById("installAppBtn");


// Browser install prompt එක ready වුණාම
window.addEventListener(
  "beforeinstallprompt",
  function(event) {

    event.preventDefault();

    deferredInstallPrompt = event;

    if (installAppBtn) {
      installAppBtn.style.display = "block";
    }

  }
);


// Install button click
if (installAppBtn) {

  installAppBtn.addEventListener(
    "click",
    async function() {

      if (!deferredInstallPrompt) {
        return;
      }

      try {

        deferredInstallPrompt.prompt();

        const { outcome } =
          await deferredInstallPrompt.userChoice;

        console.log(
          "PWA install result:",
          outcome
        );

      } catch (error) {

        console.error(
          "PWA installation failed:",
          error
        );

      }

      deferredInstallPrompt = null;

      installAppBtn.style.display = "none";

    }
  );

}


// App install වුණාම button එක hide කරන්න
window.addEventListener(
  "appinstalled",
  function() {

    console.log(
      "HighResist MOTORS installed"
    );

    if (installAppBtn) {
      installAppBtn.style.display = "none";
    }

    deferredInstallPrompt = null;

  }
);

