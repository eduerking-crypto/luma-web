(() => {
  "use strict";
  // La instalación de la PWA ya no se anuncia en la interfaz, pero el service
  // worker sigue registrándose para mantener las lecciones disponibles sin conexión.
  if (location.protocol !== "file:" && "serviceWorker" in navigator) {
    window.addEventListener("load", () => {
      navigator.serviceWorker
        .register("./sw.js", { updateViaCache: "none" })
        .catch(() => {
          /* La app sigue funcionando aunque la caché offline no esté disponible. */
        });
    });
  }
})();
