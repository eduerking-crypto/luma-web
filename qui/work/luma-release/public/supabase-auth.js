// Cuentas Luma con Supabase Auth (REST, sin SDK) y sincronización del progreso.
// Funciona en la web y en el APK porque solo usa fetch y localStorage.
(() => {
  "use strict";

  const SESSION_KEY = "luma.auth.session";
  const CONFIG_KEY = "luma.auth.config";
  const PROFILE_TABLE = "luma_profiles";
  const listeners = new Set();
  let saveTimer = null;

  const defaults = () => window.LUMA_AUTH_CONFIG || { url: "", anonKey: "" };
  function config() {
    let override = {};
    try {
      override = JSON.parse(localStorage.getItem(CONFIG_KEY) || "{}") || {};
    } catch {}
    return {
      url: String(override.url || defaults().url || "").trim().replace(/\/+$/, ""),
      anonKey: String(override.anonKey || defaults().anonKey || "").trim(),
    };
  }
  function setConfig(url, anonKey) {
    const clean = {
      url: String(url || "").trim().replace(/\/+$/, ""),
      anonKey: String(anonKey || "").trim(),
    };
    if (clean.url && clean.anonKey)
      localStorage.setItem(CONFIG_KEY, JSON.stringify(clean));
    else localStorage.removeItem(CONFIG_KEY);
    emit();
    return configured();
  }
  const configured = () => {
    const c = config();
    return /^https:\/\/.+/i.test(c.url) && c.anonKey.length > 10;
  };

  function readSession() {
    try {
      const s = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
      return s && s.access_token && s.user ? s : null;
    } catch {
      return null;
    }
  }
  function writeSession(session) {
    if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    else localStorage.removeItem(SESSION_KEY);
    emit();
  }
  function emit() {
    const session = readSession();
    for (const cb of listeners) {
      try {
        cb(session);
      } catch {}
    }
    window.dispatchEvent(
      new CustomEvent("luma:auth", { detail: { session, configured: configured() } }),
    );
  }
  function on(cb) {
    listeners.add(cb);
    return () => listeners.delete(cb);
  }

  const message = (text, fallback) => {
    const t = String(text || fallback || "");
    if (/invalid login credentials/i.test(t))
      return "Correo o contraseña incorrectos.";
    if (/already registered|user already exists/i.test(t))
      return "Ya existe una cuenta con ese correo. Prueba a iniciar sesión.";
    if (/password should be at least/i.test(t))
      return "La contraseña debe tener al menos 6 caracteres.";
    if (/email not confirmed/i.test(t))
      return "Confirma tu correo antes de entrar.";
    if (/rate limit|too many/i.test(t))
      return "Demasiados intentos. Espera un momento y vuelve a probar.";
    if (/failed to fetch|network|load failed/i.test(t))
      return "No se pudo conectar. Comprueba tu conexión e inténtalo otra vez.";
    return t || fallback || "No se pudo completar la acción.";
  };

  async function request(path, { method = "GET", body, token, extraHeaders } = {}) {
    const c = config();
    if (!configured())
      throw new Error("Falta la configuración de Supabase en Mi cuenta.");
    const headers = {
      apikey: c.anonKey,
      Authorization: "Bearer " + (token || c.anonKey),
      ...(body === undefined ? {} : { "Content-Type": "application/json" }),
      ...(extraHeaders || {}),
    };
    let response;
    try {
      response = await fetch(c.url + path, {
        method,
        headers,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: AbortSignal.timeout(15000),
      });
    } catch (error) {
      throw new Error(message(error?.message, "No se pudo conectar con Supabase."));
    }
    let data = null;
    try {
      data = await response.json();
    } catch {}
    if (!response.ok) {
      throw new Error(
        message(data?.msg || data?.message || data?.error_description || `HTTP ${response.status}`),
      );
    }
    return data;
  }

  function sessionFromAuth(data, email) {
    return {
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: Date.now() + Number(data.expires_in || 3600) * 1000,
      token_type: data.token_type || "bearer",
      user: data.user || { email, id: data.user?.id || "" },
    };
  }

  async function signUp(email, password) {
    const data = await request("/auth/v1/signup", {
      method: "POST",
      body: { email, password },
    });
    if (data.access_token) {
      writeSession(sessionFromAuth(data, email));
      return { session: readSession(), needsConfirmation: false };
    }
    return { session: null, needsConfirmation: true };
  }

  async function signIn(email, password) {
    const data = await request("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: { email, password },
    });
    writeSession(sessionFromAuth(data, email));
    return { session: readSession(), needsConfirmation: false };
  }

  async function signOut() {
    const current = readSession();
    try {
      if (current?.access_token)
        await request("/auth/v1/logout", {
          method: "POST",
          token: current.access_token,
        });
    } catch {}
    writeSession(null);
  }

  async function recover(email) {
    await request("/auth/v1/recover", { method: "POST", body: { email } });
  }

  async function accessToken() {
    let current = readSession();
    if (!current) return null;
    if (current.expires_at && Date.now() < current.expires_at - 30000)
      return current.access_token;
    if (!current.refresh_token) return current.access_token;
    try {
      const data = await request("/auth/v1/token?grant_type=refresh_token", {
        method: "POST",
        body: { refresh_token: current.refresh_token },
      });
      current = sessionFromAuth(data, current.user?.email);
      writeSession(current);
      return current.access_token;
    } catch {
      return current.access_token;
    }
  }

  async function getCloudState() {
    const current = readSession();
    if (!current?.user?.id) return null;
    const token = await accessToken();
    if (!token) return null;
    const data = await request(
      `/rest/v1/${PROFILE_TABLE}?id=eq.${encodeURIComponent(current.user.id)}&select=state`,
      { token },
    );
    return Array.isArray(data) && data[0]?.state ? data[0].state : null;
  }

  async function saveCloudState(state) {
    const current = readSession();
    if (!current?.user?.id || !configured()) return false;
    const token = await accessToken();
    if (!token) return false;
    await request(`/rest/v1/${PROFILE_TABLE}`, {
      method: "POST",
      token,
      body: { id: current.user.id, state, updated_at: new Date().toISOString() },
      extraHeaders: { Prefer: "resolution=merge-duplicates,return=minimal" },
    });
    return true;
  }

  function queueSync(state) {
    if (!readSession()) return;
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      saveCloudState(state).catch(() => {});
    }, 1200);
  }

  window.LumaAuth = Object.freeze({
    configured,
    config,
    setConfig,
    session: readSession,
    on,
    signUp,
    signIn,
    signOut,
    recover,
    getCloudState,
    saveCloudState,
    queueSync,
  });
})();
