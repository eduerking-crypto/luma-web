(() => {
  "use strict";
  let deferredInstall = null;
  let offlineReady = false;
  let offlineFailed = false;
  const standalone = () =>
    matchMedia("(display-mode: standalone)").matches ||
    navigator.standalone === true;
  const installed = () => {
    deferredInstall = null;
    update();
  };
  window.addEventListener("appinstalled", installed);
  window.addEventListener("beforeinstallprompt", (event) => {
    event.preventDefault();
    deferredInstall = event;
    update();
  });
  function update() {
    const details = document.querySelector("[data-install-status]");
    const button = document.querySelector("[data-install-luma]");
    if (!details || !button) return;
    button.hidden = standalone();
    details.textContent = standalone()
      ? "Luma se está ejecutando como aplicación."
      : "Abre Luma desde la pantalla de inicio de tu dispositivo.";
    const status = document.querySelector("[data-offline-ready]");
    if (status)
      status.textContent = offlineReady
        ? "Las sesiones editoriales ya están disponibles sin conexión en este dispositivo."
        : location.protocol === "file:"
          ? "Esta copia usa los archivos de la carpeta que descargaste."
          : offlineFailed
            ? "Abre Luma con conexión en un navegador compatible para guardar las sesiones en este dispositivo."
            : "Preparando las sesiones editoriales para estudiar sin conexión…";
  }
  async function install() {
    if (deferredInstall) {
      const event = deferredInstall;
      deferredInstall = null;
      try {
        await event.prompt();
        await event.userChoice;
      } catch {}
      update();
      return;
    }
    const info = document.querySelector("[data-install-help]");
    if (info) {
      info.hidden = false;
      info.focus();
    }
  }
  window.LumaInstall = { update, install };
  if (location.protocol !== "file:" && "serviceWorker" in navigator) {
    window.addEventListener("load", async () => {
      try {
        const registration = await navigator.serviceWorker.register("./sw.js", {
          updateViaCache: "none",
        });
        const installing = registration.installing;
        if (installing)
          installing.addEventListener("statechange", () => {
            if (installing.state === "redundant" && !registration.active) {
              offlineFailed = true;
              update();
            }
          });
        await navigator.serviceWorker.ready;
        offlineReady = true;
      } catch {
        offlineFailed = true;
      }
      update();
    });
  } else {
    offlineFailed = true;
  }
})();
