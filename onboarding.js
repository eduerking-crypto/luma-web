// Onboarding de ingreso a Luma · inspirado en Duolingo, mejorado.
// Metodología: observar el flujo de ingreso (bienvenida -> nivel -> interés ->
// objetivo -> cuenta), descomponerlo y reimplementarlo con la identidad Luma
// (Lumi, tokens y botones existentes). No altera el diseño del resto de la app.
(() => {
  "use strict";

  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "\u0026", "<": "\u003C", ">": "\u003E", '"': "\u0022", "'": "\u0027" })[c],
    );

  // Pasos del recorrido
  const STEPS = ["welcome", "name", "level", "science", "goal", "entry"];
  // Mapa de pasos a etiqueta del asistente (bocadillo de Lumi)
  const speech = {
    welcome: "\u00a1Hola! Soy Lumi. Vamos a empezar.",
    name: "\u00bfC\u00f3mo te llamas?",
    level: "\u00bfCu\u00e1nto ingl\u00e9s sabes ya?",
    science: "\u00bfQu\u00e9 ciencia te gusta m\u00e1s?",
    goal: "\u00bfCu\u00e1nto quieres practicar al d\u00eda?",
    entry: "Ya casi estamos. \u00a1Empecemos!",
  };

  // Niveles con descripciones claras (sin tecnicismos, como Duolingo)
  const LEVELS = [
    ["A1", "Empiezo de cero", "Reconozco muy pocas palabras y necesito ejemplo y apoyo."],
    ["A2", "S\u00e9 lo b\u00e1sico", "Entiendo frases simples y vocabulario frecuente."],
    ["B1", "Leo lo esencial", "Puedo leer textos cortos y entender la idea principal."],
    ["B2", "Leo con soltura", "Quiero matizar, comparar y argumentar mejor."],
    ["C1", "Busco precisi\u00f3n", "Quiero distinguir matices y defender con evidencia."],
  ];

  // Disciplinas y ramas: una sola fuente compartida con el resto de Luma.
  const catalog = window.LumaScienceCatalog;
  const SCIENCE = catalog.SCIENCES.map((s) => [s.id, s.short || s.label, s.icon]);

  // Objetivo diario en actividades (misma semántica de la app)
  const GOALS = [
    [1, "Suave", "Una actividad corta al d\u00eda."],
    [2, "Constante", "Dos actividades para no perder ritmo."],
    [3, "Enfocado", "Tres actividades, el equilibrio recomendado."],
    [4, "Intenso", "Cuatro actividades si vienes con ganas."],
    [5, "Imparable", "Cinco actividades, a por todas."],
  ];

  let root = null;
  let apiRef = null;
  let idx = 0;
  const draft = { name: "", level: "A1", interest: "all", branch: "", goal: 3, email: "" };

  const levelGuard = () => (apiRef ? apiRef.level() : "A1");

  function icon(name, size) {
    const api = apiRef || window.LumaApp?.api;
    return api && api.icon ? api.icon(name, size) : "";
  }

  function commitSeedsFromState() {
    if (!apiRef) return;
    draft.name = String(apiRef.get("name", "") || "");
    const lv = levelGuard();
    draft.level = LEVELS.some(([l]) => l === lv) ? lv : "A1";
    const savedInterest = catalog.normalize(apiRef.get("interest", "all"));
    draft.interest = SCIENCE.some(([i]) => i === savedInterest) ? savedInterest : "all";
    const savedBranch = catalog.branchFor(draft.interest, apiRef.get("scienceBranch", ""));
    draft.branch = savedBranch ? savedBranch.label : "";
    const g = Number(apiRef.get("goal", 3));
    draft.goal = GOALS.some(([n]) => n === g) ? g : 3;
  }

  function progressPct() {
    return Math.round((idx / (STEPS.length - 1)) * 100);
  }

  function render() {
    if (!root) return;
    const step = STEPS[idx];
    const isFirst = idx === 0;
    const isLast = idx === STEPS.length - 1;
    const canNext =
      (step === "name" && draft.name.trim().length >= 1) ||
      step !== "name";

    root.innerHTML = `<section class="ob-overlay"><div class="ob-card">
      ${isFirst ? "" : `<button type="button" class="ob-back" data-ob-back aria-label="Volver">${icon("chevron-left", 20)}</button>`}
      <div class="ob-bar" role="progressbar" aria-label="Progreso del registro" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${progressPct()}"><i style="width:${progressPct()}%"></i></div>
      <div class="ob-hero">
        <img class="ob-lumi" src="assets/lumi-cutout.webp" alt="Lumi, la mascota de Luma">
        <p class="ob-bubble">${esc(speech[step])}</p>
      </div>
      <div id="ob-body">${renderStep(step, isLast)}</div>
    </div></section>`;

    const back = root.querySelector("[data-ob-back]");
    if (back)
      back.onclick = () => {
        if (idx > 0) { idx--; render(); }
      };

    const card = root.querySelector(".ob-card");
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        const el = document.activeElement;
        const nextBtn = root.querySelector("[data-ob-next]");
        if (el && el.tagName === "INPUT" && nextBtn && !nextBtn.disabled) {
          e.preventDefault();
          nextBtn.click();
        }
      }
    });

    bindStep(step, isLast);
    const focusTarget = root.querySelector("input, [data-ob-next]");
    focusTarget?.focus({ preventScroll: true });
  }

  function renderStep(step, isLast) {
    if (step === "welcome")
      return `<h1 class="ob-title">Aprende ingl\u00e9s<br>con ciencia</h1>
        <div class="ob-actions">
          <button type="button" class="solid-button" data-ob-next>${icon("sparkles", 17)} Empezar</button>
          <button type="button" class="outline-button" data-ob-jump>Ya tengo cuenta · entrar</button>
        </div>`;

    if (step === "name")
      return `<h1 class="ob-title">\u00bfC\u00f3mo te llamas?</h1>
        <p class="ob-sub">As\u00ed te saludar\u00e1 Lumi cada d\u00eda. Puedes cambiarlo despu\u00e9s en Configuraci\u00f3n.</p>
        <label class="ob-field"><span>Tu nombre</span><input data-ob-name autocomplete="given-name" maxlength="32" placeholder="Por ejemplo, Ana" value="${esc(draft.name)}"></label>
        <div class="ob-actions">
          <button type="button" class="solid-button" data-ob-next ${draft.name.trim() ? "" : "disabled"}>Continuar</button>
        </div>`;

    if (step === "level")
      return `<h1 class="ob-title">\u00bfCu\u00e1nto ingl\u00e9s sabes?</h1>
        <p class="ob-sub">Elige tu punto de partida. Siempre lo podr\u00e1s cambiar.</p>
        <div class="ob-options" role="group" aria-label="Nivel de ingl\u00e9s">
          ${LEVELS.map(
            ([lv, title, desc]) => `
            <button type="button" class="ob-opt" data-ob-level="${lv}" aria-pressed="${draft.level === lv}">
              <span class="ob-badge">${lv}</span>
              <span class="ob-opt-text"><b>${esc(title)}</b><span>${esc(desc)}</span></span>
              <span class="ob-check">${icon("check", 18)}</span>
            </button>`,
          ).join("")}
        </div>
        <div class="ob-actions"><button type="button" class="solid-button" data-ob-next>Continuar</button></div>`;

    if (step === "science")
      return `<h1 class="ob-title">¿Qué ciencia te gusta?</h1>
        <p class="ob-sub">Elige una disciplina y, si quieres, una rama. La metodología de lectura se adapta a tu elección.</p>
        <div class="ob-grid science ob-options" role="group" aria-label="Disciplina científica">
          ${SCIENCE.map(
            ([id, name, glyph]) => `
            <button type="button" class="ob-opt" data-ob-interest="${id}" aria-pressed="${draft.interest === id}">
              <span class="ob-badge">${icon(glyph, 19)}</span>
              <span class="ob-opt-text"><span>${esc(name)}</span></span>
              <span class="ob-check">${icon("check", 14)}</span>
            </button>`,
          ).join("")}
        </div>
        ${branchMarkup(draft.interest, draft.branch)}
        <div class="ob-actions"><button type="button" class="solid-button" data-ob-next>Continuar</button></div>`;

    if (step === "goal")
      return `<h1 class="ob-title">Objetivo diario</h1>
        <p class="ob-sub">Cu\u00e1ntas actividades quieres hacer cada d\u00eda. Constancia gana a intensidad.</p>
        <div class="ob-options" role="group" aria-label="Objetivo diario">
          ${GOALS.map(
            ([n, title, desc]) => `
            <button type="button" class="ob-opt" data-ob-goal="${n}" aria-pressed="${draft.goal === n}">
              <span class="ob-badge">${n}</span>
              <span class="ob-opt-text"><b>${esc(title)}</b><span>${esc(desc)}</span></span>
              <span class="ob-check">${icon("check", 18)}</span>
            </button>`,
          ).join("")}
        </div>
        <div class="ob-actions"><button type="button" class="solid-button" data-ob-next>Continuar</button></div>`;

    // entry
    return `<h1 class="ob-title">Ya casi estamos${draft.name ? ", " + esc(firstName(draft.name)) : ""}</h1>
        <p class="ob-sub">Crea tu cuenta para sincronizar entre dispositivos, o empieza ahora y guarda tu avance en este equipo.</p>
        <label class="ob-field"><span>Correo (opcional)</span><input data-ob-email type="email" autocomplete="email" inputmode="email" placeholder="tu@correo.com" value="${esc(draft.email)}"></label>
        <div class="ob-actions">
          <button type="button" class="solid-button" data-ob-finish>${icon("play", 16)} Empezar ahora</button>
          <button type="button" class="outline-button" data-ob-finish-account>${icon("user-round", 16)} Crear cuenta con correo</button>
        </div>
        <p class="ob-note">Puedes usar Luma sin cuenta: tu progreso se guarda en este navegador y funciona sin conexi\u00f3n.</p>
        <p class="ob-legal">Al continuar aceptas los <a href="#" onclick="return false">t\u00e9rminos</a> y la <a href="#" onclick="return false">pol\u00edtica de privacidad</a>.</p>`;
  }

  function firstName(name) {
    return String(name).trim().split(/\s+/)[0] || "";
  }

  function branchMarkup(scienceId, selectedBranch) {
    const science = catalog.get(scienceId);
    const branch = catalog.branchFor(scienceId, selectedBranch)?.label || "";
    return `<div class="ob-branches" id="ob-branches">
      <div class="ob-branch-head"><b>Ramas de estudio</b><span>${esc(science.method.name)}</span></div>
      <p class="ob-method-q">${esc(science.method.question)}</p>
      <div class="ob-branch-list">
        <button type="button" data-ob-branch="" aria-pressed="${branch ? "false" : "true"}">Todas</button>
        ${science.branches
          .map(
            (b) =>
              `<button type="button" data-ob-branch="${esc(b.label)}" aria-pressed="${b.label === branch}">${esc(b.label)}</button>`
          )
          .join("")}
      </div>
    </div>`;
  }
  function bindBranches() {
    root.querySelectorAll("[data-ob-branch]").forEach((b) => {
      b.onclick = () => {
        draft.branch = b.dataset.obBranch || "";
        root.querySelectorAll("[data-ob-branch]").forEach((o) =>
          o.setAttribute("aria-pressed", String(o === b)),
        );
      };
    });
  }
  function updateBranches(scienceId, selectedBranch) {
    const box = root && root.querySelector("#ob-branches");
    if (!box) return;
    box.outerHTML = branchMarkup(scienceId, selectedBranch);
    bindBranches();
  }

  function bindStep(step, isLast) {
    if (step === "welcome") {
      root.querySelector("[data-ob-jump]").onclick = () => {
        idx = 1;
        render();
      };
    }
    if (step === "name") {
      const input = root.querySelector("[data-ob-name]");
      const next = root.querySelector("[data-ob-next]");
      const sync = () => {
        draft.name = input.value;
        const ok = draft.name.trim().length >= 1;
        next.disabled = !ok;
      };
      input.addEventListener("input", sync);
      sync();
    }
    if (step === "level") {
      root.querySelectorAll("[data-ob-level]").forEach((b) => {
        b.onclick = () => {
          draft.level = b.dataset.obLevel;
          root.querySelectorAll("[data-ob-level]").forEach((o) =>
            o.setAttribute("aria-pressed", String(o === b)),
          );
        };
      });
    }
    if (step === "science") {
      root.querySelectorAll("[data-ob-interest]").forEach((b) => {
        b.onclick = () => {
          draft.interest = b.dataset.obInterest;
          draft.branch = "";
          root.querySelectorAll("[data-ob-interest]").forEach((o) =>
            o.setAttribute("aria-pressed", String(o === b)),
          );
          updateBranches(draft.interest, draft.branch);
        };
      });
      bindBranches();
    }
    if (step === "goal") {
      root.querySelectorAll("[data-ob-goal]").forEach((b) => {
        b.onclick = () => {
          draft.goal = Number(b.dataset.obGoal);
          root.querySelectorAll("[data-ob-goal]").forEach((o) =>
            o.setAttribute("aria-pressed", String(o === b)),
          );
        };
      });
    }
    if (step === "entry") {
      const emailInput = root.querySelector("[data-ob-email]");
      if (emailInput)
        emailInput.addEventListener("input", () => {
          draft.email = emailInput.value;
        });
    }
    const next = root.querySelector("[data-ob-next]");
    if (next)
      next.onclick = () => {
        if (idx < STEPS.length - 1 && !next.disabled) {
          idx++;
          render();
        }
      };
    const finish = root.querySelector("[data-ob-finish]");
    if (finish) finish.onclick = () => finishOnboarding(false);
    const finishAcc = root.querySelector("[data-ob-finish-account]");
    if (finishAcc) finishAcc.onclick = () => finishOnboarding(true);
  }

  function finishOnboarding(withAccount) {
    if (!apiRef) return;
    draft.name = firstName(draft.name) || draft.name.trim() || "Explorador";
    apiRef.set("name", draft.name.trim() || "Explorador");
    apiRef.set("level", draft.level);
    apiRef.set("interest", draft.interest);
    apiRef.set("scienceBranch", draft.branch);
    apiRef.set("goal", draft.goal);
    const email = String(draft.email || "").trim();
    if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      apiRef.set("accountEmail", email);
      apiRef.set("accountMode", withAccount ? "account" : "local");
    } else {
      apiRef.set("accountMode", "local");
    }
    apiRef.set("onboarded", true);
    apiRef.toast(
      withAccount
        ? "Cuenta creada. \u00a1Bienvenido a Luma!"
        : "\u00a1Listo! Ya puedes empezar tu primera sesi\u00f3n.",
    );
    document.body.classList.remove("ob-active");
    apiRef.go("home");
  }

  function renderInto(rootEl, api) {
    root = rootEl;
    apiRef = api;
    document.body.classList.add("ob-active");
    commitSeedsFromState();
    idx = 0;
    if (draft.name) idx = Math.min(1, STEPS.length - 1);
    render();
  }

  function dispose() {
    document.body.classList.remove("ob-active");
    root = null;
    apiRef = null;
  }

  window.LumaOnboarding = Object.freeze({
    render: renderInto,
    dispose,
    get isActive() {
      return !!root;
    },
  });
})();