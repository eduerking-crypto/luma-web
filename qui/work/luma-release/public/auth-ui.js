// Interfaz de cuenta Luma · inicio de sesión, registro y configuración de Supabase.
(() => {
  "use strict";

  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const api = () => window.LumaApp?.api || null;
  const icon = (name, size = 17) => api()?.icon(name, size) || "";
  const auth = () => window.LumaAuth;
  let dialog = null;
  let mode = "login";
  let successCb = null;
  const accountListeners = new WeakMap();

  function ensureDialog() {
    if (dialog) return dialog;
    dialog = document.createElement("dialog");
    dialog.id = "auth-dialog";
    dialog.className = "auth-dialog";
    dialog.setAttribute("aria-labelledby", "auth-title");
    dialog.innerHTML = `<div class="auth-card">
      <button type="button" class="auth-close" data-auth-close aria-label="Cerrar">×</button>
      <div class="auth-logo" aria-hidden="true">${icon("sparkles", 26)}</div>
      <h1 id="auth-title">Tu cuenta Luma</h1>
      <p class="auth-sub" data-auth-sub>Guarda tu progreso y sigue donde lo dejaste en cualquier dispositivo.</p>
      <div class="auth-tabs" role="group" aria-label="Acceso">
        <button type="button" data-auth-tab="login" aria-pressed="true">Iniciar sesión</button>
        <button type="button" data-auth-tab="signup" aria-pressed="false">Crear cuenta</button>
      </div>
      <form class="auth-form" data-auth-form>
        <label><span>Correo electrónico</span><input type="email" name="email" autocomplete="email" inputmode="email" required placeholder="tu@correo.com"></label>
        <label><span>Contraseña</span><input type="password" name="password" autocomplete="current-password" minlength="6" required placeholder="Al menos 6 caracteres"></label>
        <p class="auth-status" role="status" data-auth-status></p>
        <button type="submit" class="solid-button" data-auth-submit>${icon("arrow-right", 16)} Entrar</button>
      </form>
      <button type="button" class="text-button auth-recover" data-auth-recover>¿Olvidaste tu contraseña?</button>
      <p class="auth-note">Tu correo y contraseña se envían directamente a Supabase. Luma no guarda tu contraseña.</p>
    </div>`;
    document.body.append(dialog);

    dialog.querySelector("[data-auth-close]").onclick = () => dialog.close();
    dialog.addEventListener("click", (e) => {
      if (e.target === dialog) dialog.close();
    });
    dialog.querySelectorAll("[data-auth-tab]").forEach((btn) => {
      btn.onclick = () => setMode(btn.dataset.authTab);
    });
    dialog.querySelector("[data-auth-form]").onsubmit = async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const email = String(form.email.value || "").trim();
      const password = String(form.password.value || "");
      const status = dialog.querySelector("[data-auth-status]");
      const submit = dialog.querySelector("[data-auth-submit]");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return (status.textContent = "Escribe un correo válido.");
      if (password.length < 6)
        return (status.textContent = "La contraseña debe tener al menos 6 caracteres.");
      submit.disabled = true;
      status.textContent = "Conectando…";
      try {
        const result =
          mode === "signup"
            ? await auth().signUp(email, password)
            : await auth().signIn(email, password);
        if (result.needsConfirmation) {
          status.textContent =
            "Cuenta creada. Revisa tu correo para confirmarla y vuelve a entrar.";
          return;
        }
        status.textContent = mode === "signup" ? "¡Cuenta creada!" : "¡Bienvenido de nuevo!";
        api()?.toast(status.textContent);
        dialog.close();
        successCb?.(result.session);
      } catch (error) {
        status.textContent = error?.message || "No se pudo completar la acción.";
      } finally {
        submit.disabled = false;
      }
    };
    dialog.querySelector("[data-auth-recover]").onclick = async () => {
      const email = String(dialog.querySelector('[name="email"]').value || "").trim();
      const status = dialog.querySelector("[data-auth-status]");
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
        return (status.textContent = "Escribe tu correo para recuperar la contraseña.");
      try {
        await auth().recover(email);
        status.textContent = "Te enviamos un correo para restablecer la contraseña.";
      } catch (error) {
        status.textContent = error?.message || "No se pudo enviar el correo.";
      }
    };
    return dialog;
  }

  function setMode(next) {
    mode = next;
    dialog.querySelectorAll("[data-auth-tab]").forEach((b) =>
      b.setAttribute("aria-pressed", String(b.dataset.authTab === mode)),
    );
    const signup = mode === "signup";
    dialog.querySelector("#auth-title").textContent = signup
      ? "Crea tu cuenta"
      : "Bienvenido de nuevo";
    dialog.querySelector("[data-auth-sub]").textContent = signup
      ? "Sincroniza tu progreso y tu racha entre dispositivos."
      : "Entra con tu correo para recuperar tu progreso en la nube.";
    dialog.querySelector('[name="password"]').autocomplete = signup
      ? "new-password"
      : "current-password";
    dialog.querySelector("[data-auth-submit]").innerHTML =
      icon(signup ? "user-round" : "arrow-right", 16) + (signup ? " Crear cuenta" : " Entrar");
    dialog.querySelector("[data-auth-status]").textContent = "";
  }

  function open(nextMode = "login", email = "", onSuccess) {
    if (!auth().configured()) {
      api()?.toast("Configura tu proyecto de Supabase en Configuración → Mi cuenta.");
      return false;
    }
    ensureDialog();
    setMode(nextMode);
    successCb = onSuccess;
    dialog.querySelector('[name="email"]').value = email || "";
    dialog.querySelector('[name="password"]').value = "";
    dialog.showModal();
    dialog.querySelector(email ? '[name="password"]' : '[name="email"]').focus();
    return true;
  }

  function setupMarkup() {
    const c = auth().config();
    return `<h2>Mi cuenta</h2>
      <p class="status-text">Activa las cuentas para sincronizar tu progreso y tu racha entre dispositivos.</p>
      <div class="auth-setup">
        <label class="field"><span>URL del proyecto Supabase</span><input data-auth-url type="url" placeholder="https://tuproyecto.supabase.co" value="${esc(c.url)}"></label>
        <label class="field"><span>Clave anónima (anon key)</span><input data-auth-key type="text" placeholder="eyJhbGciOi…" value="${esc(c.anonKey)}"></label>
        <button type="button" class="outline-button" data-auth-save-config>${icon("bookmark-check", 16)} Guardar configuración</button>
      </div>
      <p class="auth-status" data-auth-status role="status"></p>`;
  }

  function accountMarkup() {
    const session = auth().session();
    const email = session?.user?.email || "";
    return `<h2>Mi cuenta</h2>
      <div class="auth-account"><span class="auth-avatar">${icon("user-round", 22)}</span>
        <div><b>${esc(email)}</b><small>Sesión activa · progreso sincronizado</small></div>
      </div>
      <div class="auth-account-actions">
        <button type="button" class="outline-button" data-auth-sync>${icon("rotate-ccw", 16)} Sincronizar ahora</button>
        <button type="button" class="text-button" data-auth-logout>Cerrar sesión</button>
      </div>
      <p class="auth-status" data-auth-status role="status"></p>`;
  }

  function renderAccount(container, appApi) {
    if (!container) return;
    const draw = () => {
      const session = auth().session();
      container.innerHTML = auth().configured()
        ? session
          ? accountMarkup()
          : `<h2>Mi cuenta</h2>
            <p class="status-text">Entra con tu correo o crea una cuenta para sincronizar tu progreso.</p>
            <div class="auth-account-actions">
              <button type="button" class="solid-button" data-auth-open="login">${icon("arrow-right", 16)} Iniciar sesión</button>
              <button type="button" class="outline-button" data-auth-open="signup">${icon("user-round", 16)} Crear cuenta</button>
            </div>
            <p class="auth-status" data-auth-status role="status"></p>`
        : setupMarkup();
      bind(container, appApi);
    };
    draw();
    accountListeners.get(container)?.();
    accountListeners.set(container, auth().on(draw));
  }

  function bind(container, appApi) {
    container.querySelectorAll("[data-auth-open]").forEach((btn) => {
      btn.onclick = () =>
        open(btn.dataset.authOpen, "", async () => {
          appApi?.toast("Sesión iniciada. Tu progreso se sincronizará.");
          window.dispatchEvent(new CustomEvent("luma:account-ready"));
        });
    });
    const save = container.querySelector("[data-auth-save-config]");
    if (save)
      save.onclick = () => {
        const url = container.querySelector("[data-auth-url]").value;
        const key = container.querySelector("[data-auth-key]").value;
        const ok = auth().setConfig(url, key);
        container.querySelector("[data-auth-status]").textContent = ok
          ? "Configuración guardada. Ya puedes crear tu cuenta."
          : "Pega una URL https:// y una clave anónima válidas.";
        if (ok) renderAccount(container, appApi);
      };
    const logout = container.querySelector("[data-auth-logout]");
    if (logout)
      logout.onclick = async () => {
        await auth().signOut();
        appApi?.toast("Cerraste sesión. Tu progreso sigue en este dispositivo.");
        window.dispatchEvent(new CustomEvent("luma:account-ready"));
      };
    const sync = container.querySelector("[data-auth-sync]");
    if (sync)
      sync.onclick = async () => {
        const status = container.querySelector("[data-auth-status]");
        status.textContent = "Sincronizando…";
        try {
          await window.LumaCloud?.syncNow();
          status.textContent = "Progreso sincronizado.";
        } catch (e) {
          status.textContent = e?.message || "No se pudo sincronizar.";
        }
      };
  }

  window.LumaAuthUI = Object.freeze({ open, renderAccount, setMode });
})();
