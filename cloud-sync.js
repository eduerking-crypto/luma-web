// Sincronización del progreso de Luma con Supabase al iniciar sesión.
(() => {
  "use strict";

  let getState = () => ({});
  let applyState = () => {};
  let ready = false;

  async function syncNow() {
    const auth = window.LumaAuth;
    if (!auth?.session() || !auth.configured()) return false;
    const remote = await auth.getCloudState();
    if (remote && typeof remote === "object") applyState(remote);
    await auth.saveCloudState(getState());
    return true;
  }

  function init(hooks) {
    if (ready) return;
    ready = true;
    getState = hooks.getState || getState;
    applyState = hooks.applyState || applyState;
    window.LumaAuth?.on((session) => {
      if (session) syncNow().catch(() => {});
    });
    window.addEventListener("luma:account-ready", () => {
      syncNow().catch(() => {});
    });
  }

  window.LumaCloud = Object.freeze({
    init,
    syncNow,
    queue(state) {
      window.LumaAuth?.queueSync(state);
    },
  });
})();
