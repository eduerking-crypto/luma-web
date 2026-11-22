(() => {
  "use strict";
  const routes = {
    home: ["Inicio", "layout-dashboard", "Panel de estudio"],
    path: ["Ruta de estudio", "route", "Tu secuencia de aprendizaje"],
    library: [
      "Biblioteca",
      "library-big",
      "Lecturas científicas y artículos guardados",
    ],
    news: [
      "Noticias",
      "newspaper",
      "Revistas científicas y canales de divulgación",
    ],
    practice: ["Práctica", "shapes", "Todos los talleres de inglés"],
    reading: ["Lectura", "book-open", "Comprensión de textos"],
    writing: ["Escritura", "pencil-line", "Expresión escrita"],
    speaking: ["Pronunciación", "audio-lines", "Escucha y repetición"],
    vocabulary: ["Vocabulario", "layers-3", "Palabras para recordar"],
    theory: ["Teoría", "lightbulb", "Conceptos y gramática"],
    games: ["Juegos", "gamepad-2", "Juega con palabras"],
    exercises: ["Ejercicios", "list-checks", "Práctica con ejemplos"],
    exams: ["Exámenes", "graduation-cap", "Pruebas de A1 a C1"],
    present: ["Exposición", "presentation", "Presenta lo que has leído"],
    tutor: ["Tutor Lumi", "sparkles", "Preguntas sobre ciencia e inglés"],
    streak: [
      "Mi progreso",
      "chart-no-axes-column-increasing",
      "Racha y actividad diaria",
    ],
    settings: ["Configuración", "settings", "Perfil, nivel y accesibilidad"],
    astro: [
      "Where stars are born",
      "telescope",
      "El nacimiento de las estrellas",
    ],
    plants: ["How leaves feed a forest", "leaf", "La energía de las hojas"],
  };
  const skills = ["reading", "writing", "speaking", "vocabulary"];
  const tones = {
    reading: ["#eae5fb", "#765abb"],
    writing: ["#e1efff", "#4b77ad"],
    speaking: ["#fce9e4", "#b66b58"],
    vocabulary: ["#dff2e9", "#49856b"],
    exercises: ["#eee9fb", "#7463ab"],
    present: ["#e0f0ef", "#3e807a"],
    games: ["#f9eaf0", "#ac6384"],
    theory: ["#f8eeca", "#907213"],
    exams: ["#e2ecfb", "#5e75a2"],
  };
  const stories = [
    {
      id: "reading",
      title: "The ocean that glows",
      headline: "The ocean<br>that glows",
      desc: "La ciencia de la bioluminiscencia marina.",
      image: "ocean",
      field: "Biología marina",
      minutes: 6,
    },
    {
      id: "astro",
      title: "Where stars are born",
      headline: "Where stars<br>are born",
      desc: "Una mirada a las nubes donde nacen las estrellas.",
      image: "nebula",
      field: "Astronomía",
      minutes: 4,
    },
    {
      id: "plants",
      title: "How leaves feed a forest",
      headline: "How leaves feed<br>a forest",
      desc: "Sigue el viaje del carbono desde el aire hasta una hoja.",
      image: "plant",
      field: "Botánica",
      minutes: 4,
    },
  ];
  const levels = ["A1", "A2", "B1", "B2", "C1"];
  const root = document.getElementById("content"),
    rail = document.getElementById("rail"),
    topbar = document.getElementById("topbar"),
    finder = document.getElementById("finder");
  const stateKey = "luma.learning.v1",
    pendingKey = "luma.sync.v1";
  function unpack(key) {
    try {
      return JSON.parse(localStorage.getItem(key) || "{}") || {};
    } catch {
      return {};
    }
  }
  let state = unpack(stateKey),
    pending = unpack(pendingKey),
    connected = false,
    flushing = false,
    syncTimer;
  let current = "",
    slide = 0,
    toastTimer;
  const escape = (x) =>
    String(x ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const icon = (name, size = 20) =>
    `<svg class="l-icon" aria-hidden="true" width="${Number(size) || 20}" height="${Number(size) || 20}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${window.LUMA_ICONS[name] || window.LUMA_ICONS["circle-dot"]}</svg>`;
  const get = (key, def) => (Object.hasOwn(state, key) ? state[key] : def);
  const level = () =>
    levels.includes(get("level", "A1")) ? get("level", "A1") : "A1";
  function persist() {
    try {
      localStorage.setItem(stateKey, JSON.stringify(state));
      localStorage.setItem(pendingKey, JSON.stringify(pending));
    } catch {
      toast(
        "El navegador está lleno. Esta sesión conserva los cambios en memoria.",
      );
    }
  }
  function set(key, value) {
    state[key] = value;
    pending[key] = value;
    persist();
    clearTimeout(syncTimer);
    syncTimer = setTimeout(flush, 450);
    if (["name", "level", "largeText", "reduceMotion"].includes(key)) chrome();
  }
  async function flush() {
    if (!connected || flushing) return;
    flushing = true;
    try {
      while (Object.keys(pending).length) {
        const key = Object.keys(pending)[0],
          value = pending[key];
        const r = await fetch("/api/progress", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ key, value }),
          signal: AbortSignal.timeout(6000),
        });
        if (!r.ok) break;
        if (pending[key] === value) delete pending[key];
        persist();
      }
    } catch {
    } finally {
      flushing = false;
    }
  }
  async function hydrate() {
    if (location.protocol === "file:") return;
    try {
      const r = await fetch("/api/progress", {
        signal: AbortSignal.timeout(4500),
      });
      if (!r.ok || !r.headers.get("content-type")?.includes("json")) return;
      const data = await r.json();
      if (!data.values || typeof data.values !== "object") return;
      state = { ...state, ...data.values, ...pending };
      connected = true;
      persist();
      chrome();
      if (current === "home") home();
      flush();
    } catch {}
  }
  function dayId(d = new Date()) {
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  }
  function dateOffset(n, date = new Date()) {
    const d = new Date(date);
    d.setDate(d.getDate() + n);
    return d;
  }
  function entries(date = dayId()) {
    const val = get("day." + date, []);
    const prefix = "completed." + date + ".";
    return [
      ...new Set([
        ...(Array.isArray(val) ? val : []),
        ...Object.keys(state)
          .filter((k) => k.startsWith(prefix) && state[k] === true)
          .map((k) => k.slice(prefix.length)),
      ]),
    ];
  }
  function history() {
    const dates = new Set();
    for (const k of Object.keys(state)) {
      const match = k.match(/^(?:day|completed)\.(\d{4}-\d{2}-\d{2})(?:\.|$)/);
      if (match && entries(match[1]).length) dates.add(match[1]);
    }
    return [...dates].sort();
  }
  function streak() {
    let n = 0,
      i = entries().length ? 0 : -1;
    while (entries(dayId(dateOffset(i))).length) {
      n++;
      i--;
    }
    return n;
  }
  function complete(id) {
    if (typeof id !== "string" || !id) return;
    const today = entries();
    if (today.includes(id)) return;
    set("completed." + dayId() + "." + id, true);
    chrome();
    toast("Actividad completada. Tu progreso está guardado.");
  }
  function toast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2800);
  }
  const api = { level, go, complete, get, set, icon, toast };
  function navItem(id) {
    const [label, glyph] = routes[id];
    return `<button type="button" class="nav-item ${id === current ? "active" : ""}" ${id === current ? 'aria-current="page"' : ""} data-luma-go="${id}">${icon(glyph, 18)}${label}</button>`;
  }
  function chrome() {
    const name = String(get("name", "Explorador")).trim() || "Explorador";
    document.documentElement.classList.toggle(
      "big-text",
      !!get("largeText", false),
    );
    document.documentElement.classList.toggle(
      "no-motion",
      !!get("reduceMotion", false),
    );
    rail.innerHTML = `<button class="brand" data-luma-go="home" aria-label="Luma, ir a inicio"><img src="assets/luma.svg" alt=""><span><b>Luma</b><small>Inglés con ciencia</small></span></button><nav>${[
      ["MI ESPACIO", ["home", "path", "library", "news"]],
      ["APRENDIZAJE", ["practice", "games", "exams", "tutor"]],
      ["ACTIVIDAD", ["streak"]],
    ]
      .map(
        ([heading, items]) =>
          `<div class="nav-group"><p class="nav-heading">${heading}</p>${items.map(navItem).join("")}</div>`,
      )
      .join(
        "",
      )}</nav><div class="rail-foot">${navItem("settings")}<button class="user-box" data-luma-go="settings"><span class="avatar">${escape([...name][0]?.toUpperCase())}</span><span><b>${escape(name.slice(0, 20))}</b><small>Mi perfil</small></span>${icon("chevron-right", 15)}</button></div>`;
    const days = streak();
    topbar.innerHTML = `<div class="crumb"><button id="menu-button" class="iconbtn mobile-menu" aria-expanded="${rail.classList.contains("open")}" aria-controls="rail" aria-label="Abrir navegación">${icon("menu", 22)}</button><span class="crumb-home">Mi espacio</span>${icon("chevron-right", 13).replace("l-icon", "l-icon crumb-divider")}<strong>${routes[current]?.[0] || "Inicio"}</strong></div><div class="top-actions"><button class="search-launch" data-action="search" aria-label="Buscar en Luma, Control K">${icon("search", 17)}<span>Buscar</span><kbd>Ctrl K</kbd></button><button class="chip streak" data-luma-go="streak" title="Ver mi racha">${icon("flame", 15)} ${days} ${days === 1 ? "día" : "días"}</button><button class="chip level" data-luma-go="settings" title="Cambiar nivel de inglés">${icon("chart-no-axes-column-increasing", 15)} Nivel ${level()}</button></div>`;
  }
  function tile(id, size = 20) {
    const [tint, tone] = tones[id] || ["#eae6f7", "#6f609d"];
    return `<span class="icon-tile" style="--tint:${tint};--tone:${tone}">${icon(routes[id][1], size)}</span>`;
  }
  function studyCard(id) {
    return `<button class="practice-card" data-luma-go="${id}">${tile(id, 22)}<span class="small-next">${icon("chevron-right", 14)}</span><div><h3>${routes[id][0]}</h3><p>${routes[id][2]}</p></div></button>`;
  }
  function sessionIds() {
    const d = new Date();
    return [
      ["reading", "writing", "present"],
      ["astro", "speaking", "exercises"],
      ["plants", "vocabulary", "writing"],
    ][
      Math.floor(
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 86400000,
      ) % 3
    ];
  }
  function row(id, desc = "", meta = "") {
    const done = entries().some(
      (v) =>
        v === id ||
        v.startsWith(id + "-") ||
        v.startsWith("reading-" + id + "-"),
    );
    return `<button class="route-row" data-luma-go="${id}">${tile(id, 17)}<span class="route-label"><strong>${routes[id][0]}</strong><small>${escape(desc || routes[id][2])}</small></span>${meta ? `<span class="row-meta">${meta}</span>` : ""}${icon(done ? "circle-check" : "chevron-right", 16)}</button>`;
  }
  function week() {
    const now = new Date(),
      start = dateOffset(-((now.getDay() + 6) % 7), now);
    return `<div class="week">${["L", "M", "X", "J", "V", "S", "D"]
      .map((l, i) => {
        const d = dateOffset(i, start),
          key = dayId(d),
          done = entries(key).length > 0;
        return `<div class="week-item" aria-label="${key}, ${done ? "con actividad" : "sin actividad"}"><span>${l}</span><span class="week-day ${key === dayId() ? "today" : ""} ${done ? "done" : ""}">${done ? icon("check", 14) : d.getDate()}</span></div>`;
      })
      .join("")}</div>`;
  }
  function feature() {
    const a = stories[slide],
      saved = get("saved", []).includes(a.id);
    return `<img class="feature-photo" src="assets/${a.image}.webp" alt=""><div class="feature-top"><span class="hero-flag">${icon("book-open", 13)} LECTURA DESTACADA</span><button class="bookmark" data-action="save" aria-pressed="${saved}" aria-label="${saved ? "Quitar de" : "Añadir a"} guardados">${icon(saved ? "bookmark-check" : "bookmark", 16)}</button></div><div class="hero-text"><h2 lang="en">${a.headline}</h2><p>${a.desc}</p><div class="hero-meta"><span>${icon("atom", 13)}${a.field}</span><i class="sep"></i><span>${icon("clock", 13)}${a.minutes} min</span></div></div><div class="feature-bottom"><button class="solid-button" data-luma-go="${a.id}">${icon("book-open", 16)}Empezar lectura</button><div class="dots" aria-label="Elegir lectura">${stories.map((s, i) => `<button class="dot-button" data-slide="${i}" aria-label="Ver ${s.title}" aria-pressed="${i === slide}"><i></i></button>`).join("")}</div></div>`;
  }
  function pageIntro(group, title, desc, glyph = "atom") {
    return `<div class="page-intro"><div class="page-tag">${icon(glyph, 14)} ${group}</div><h1>${title}</h1><p>${desc}</p></div>`;
  }
  function home() {
    const today = new Intl.DateTimeFormat("es", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }).format(new Date()),
      completed = entries().length,
      goal = Number(get("goal", 3)) || 3;
    root.innerHTML = `<div class="intro"><div><div class="dateline">${icon("calendar-days", 14)}${escape(today)}</div><h1>Tu laboratorio de inglés</h1><p>Lee ciencia en inglés y pon en práctica lo que descubres.</p></div></div>
 <div class="hero-grid"><article class="feature" id="feature">${feature()}</article><aside class="tutor-card"><span class="tutor-tag">${icon("sparkles", 14)} TUTOR DE CIENCIA</span><div class="lumi-wrap"><img src="assets/lumi-cutout.webp" alt="Lumi, un ajolote lavanda con gafas y bata"><span class="spark-decoration">${icon("sparkles", 16)}</span><span class="spark-decoration second">${icon("star", 12)}</span></div><h2>Aprende con Lumi</h2><p>Tu guía de ciencia e inglés.</p><button class="outline-button" data-luma-go="tutor" aria-label="Hablar con Lumi">${icon("message-circle", 15)} Hablar con Lumi</button></aside></div>
 <section class="section"><div class="section-title"><h2>Mesa de práctica</h2><button class="text-button" data-luma-go="practice">Ver actividades ${icon("chevron-right", 14)}</button></div><div class="practice-grid">${skills.map(studyCard).join("")}</div></section>
 <section class="section"><div class="section-title"><h2>Tu sesión de hoy</h2><button class="text-button" data-luma-go="path">Ver ruta de estudio ${icon("chevron-right", 14)}</button></div><div class="mini-grid"><div class="panel"><div class="panel-header"><h3>Plan de práctica</h3><span class="eyeline">NIVEL ${level()}</span></div>${sessionIds()
   .map((id, i) => row(id, "", ["Leer", "Practicar", "Consolidar"][i]))
   .join(
     "",
   )}</div><div class="panel"><div class="panel-header"><h3>Objetivo diario</h3><span class="eyeline">${completed} / ${goal}</span></div><div class="progress-track" role="progressbar" aria-label="Actividades de hoy" aria-valuemin="0" aria-valuemax="${goal}" aria-valuenow="${Math.min(goal, completed)}"><i style="width:${Math.min(100, (completed / goal) * 100)}%"></i></div>${week()}<p class="status-text">${completed >= goal ? "Has alcanzado tu objetivo de hoy." : completed ? "Cada actividad cuenta para tu racha." : "Completa una actividad para encender tu racha."}</p><button class="text-button" data-luma-go="streak">Mi progreso ${icon("chevron-right", 14)}</button></div></div></section>`;
  }
  function pathPage() {
    root.innerHTML =
      pageIntro(
        "MI ESPACIO",
        "Ruta de estudio",
        "Pasa de comprender un artículo a explicarlo con tus propias palabras.",
        "route",
      ) +
      `<div class="path-list">${[
        ["reading", "Lee sobre la luz en las profundidades."],
        ["theory", "Conecta el fenómeno con una estructura del inglés."],
        ["vocabulary", "Recupera palabras sin mirar la respuesta."],
        ["speaking", "Escucha el modelo y graba tu propia versión."],
        ["writing", "Redacta una explicación en inglés."],
        ["present", "Prepara una exposición breve del artículo."],
        ["exams", "Comprueba qué habilidades conviene reforzar."],
      ]
        .map(([id, d], i) => row(id, d, "Paso " + (i + 1)))
        .join("")}</div>`;
  }
  function practicePage() {
    root.innerHTML =
      pageIntro(
        "APRENDIZAJE",
        "Mesa de práctica",
        "Elige una habilidad para trabajar en el nivel " + level() + ".",
        "shapes",
      ) +
      `<div class="study-list">${[...skills, "theory", "present", "exercises", "games", "exams"].map(studyCard).join("")}</div>`;
  }
  function progressPage() {
    const days = history(),
      all = days.reduce((s, d) => s + entries(d).length, 0);
    root.innerHTML =
      pageIntro(
        "ACTIVIDAD",
        "Mi progreso",
        "Consulta los días que has practicado y las actividades que has completado.",
        "chart-no-axes-column-increasing",
      ) +
      `<div class="metric-grid">${[
        [streak(), "Días de racha"],
        [days.length, "Días de estudio"],
        [all, "Actividades completadas"],
      ]
        .map(
          ([n, label]) =>
            `<div class="panel"><b>${n}</b><span>${label}</span></div>`,
        )
        .join(
          "",
        )}</div><div class="panel large-week"><div class="panel-header"><h3>Esta semana</h3>${icon("calendar-days", 20)}</div>${week()}<p class="status-text">La racha cuenta los días consecutivos con al menos una actividad completada.</p></div><section class="section"><div class="section-title"><h2>Actividad reciente</h2></div>${
        days.length
          ? `<div class="path-list">${days
              .slice(-7)
              .reverse()
              .map(
                (d) =>
                  `<div class="panel"><b>${escape(new Date(d + "T12:00:00").toLocaleDateString("es", { weekday: "long", month: "long", day: "numeric" }))}</b><p class="status-text">${entries(
                    d,
                  )
                    .map((id) => escape(routes[id.split("-")[0]]?.[0] || id))
                    .join(" · ")}</p></div>`,
              )
              .join("")}</div>`
          : `<div class="panel"><p>Tu primera lectura puede ser el inicio de tu racha.</p><button class="text-button" data-luma-go="reading">Abrir lectura ${icon("chevron-right", 14)}</button></div>`
      }</section>`;
  }
  function settingsPage() {
    root.innerHTML =
      pageIntro(
        "MI ESPACIO",
        "Configuración",
        "Ajusta tu perfil, el nivel de inglés y tu objetivo de práctica.",
        "settings",
      ) +
      `<form id="settings-form" class="settings-list"><div class="panel settings-grid"><h2>Mi aprendizaje</h2><label class="field"><span>Nombre</span><input name="name" required maxlength="32" value="${escape(get("name", "Explorador"))}" autocomplete="given-name"></label><label class="field"><span>Nivel de inglés</span><select name="level">${levels.map((l, i) => `<option value="${l}" ${level() === l ? "selected" : ""}>${l} · ${["Inicial", "Elemental", "Intermedio", "Intermedio alto", "Avanzado"][i]}</option>`).join("")}</select></label><label class="field full"><span>Actividades al día</span><select name="goal">${[1, 2, 3, 4, 5].map((n) => `<option value="${n}" ${Number(get("goal", 3)) === n ? "selected" : ""}>${n} ${n === 1 ? "actividad" : "actividades"}</option>`).join("")}</select></label></div><div class="panel settings-grid"><h2>Lectura y movimiento</h2><label class="check-row"><input type="checkbox" name="large" ${get("largeText", false) ? "checked" : ""}>Texto más grande</label><label class="check-row"><input type="checkbox" name="reduced" ${get("reduceMotion", false) ? "checked" : ""}>Reducir animaciones</label></div><button class="solid-button" type="submit">${icon("check", 16)} Guardar cambios</button></form>`;
  }
  const narrow = window.matchMedia("(max-width:740px)");
  function syncDrawer() {
    const opened = rail.classList.contains("open") && narrow.matches;
    rail.inert = narrow.matches && !opened;
    document.querySelector(".stage").inert = opened;
    document.getElementById("shade").hidden = !opened;
  }
  narrow.addEventListener("change", () => {
    closeMenu();
  });
  function closeMenu() {
    rail.classList.remove("open");
    syncDrawer();
    document.getElementById("shade").hidden = true;
    document
      .getElementById("menu-button")
      ?.setAttribute("aria-expanded", "false");
  }
  function go(id) {
    if (!Object.hasOwn(routes, id)) id = "home";
    finder.close();
    closeMenu();
    if (location.hash.slice(1) === id) {
      render(id);
      return;
    }
    location.hash = id;
  }
  function render(id) {
    if (!Object.hasOwn(routes, id)) id = "home";
    const prior = current;
    window.LumaLearn?.dispose?.();
    window.LumaScience?.dispose?.();
    window.LumaLibrary?.dispose?.();
    if (prior && prior !== id) window.speechSynthesis?.cancel();
    current = id;
    chrome();
    document.title = routes[id][0] + " · Luma";
    root.innerHTML = "";
    if (id === "home") home();
    else if (id === "path") pathPage();
    else if (id === "practice") practicePage();
    else if (id === "streak") progressPage();
    else if (id === "settings") settingsPage();
    else if (["news", "tutor"].includes(id))
      window.LumaScience.render(id, root, api);
    else if (["library", "astro", "plants"].includes(id))
      window.LumaLibrary.render(id, root, api);
    else window.LumaLearn.render(id, root, api);
    window.scrollTo(0, 0);
    if (prior) root.focus({ preventScroll: true });
  }
  function search() {
    const q = document.getElementById("query");
    q.value = "";
    matches("");
    if (!finder.open) finder.showModal();
    q.focus();
  }
  const norm = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  function matches(q) {
    const ids = Object.keys(routes).filter((id) =>
      norm(
        [
          id,
          ...routes[id],
          ...(id === "reading"
            ? ["The ocean that glows", "océano", "bioluminiscencia", "medusas"]
            : []),
        ].join(" "),
      ).includes(norm(q.trim())),
    );
    const results = q.trim()
      ? ids
      : ["reading", "library", "vocabulary", "tutor", "news"];
    document.getElementById("matches").innerHTML = results.length
      ? results.map((id) => row(id)).join("")
      : '<p class="status-text">Ninguna coincidencia. Prueba con «inglés», «práctica» o «ciencia».</p>';
  }
  document.addEventListener("click", (e) => {
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.hasAttribute("data-luma-go")) {
      go(btn.dataset.lumaGo);
      return;
    }
    if (btn.id === "menu-button") {
      rail.classList.add("open");
      syncDrawer();
      document.getElementById("shade").hidden = false;
      btn.setAttribute("aria-expanded", "true");
      rail.querySelector(".brand").focus();
    }
    if (btn.dataset.action === "search") search();
    if (btn.id === "close-search") finder.close();
    if (btn.hasAttribute("data-slide")) {
      slide = Number(btn.dataset.slide);
      document.getElementById("feature").innerHTML = feature();
      document
        .querySelector('[data-slide="' + slide + '"]')
        ?.focus({ preventScroll: true });
    }
    if (btn.dataset.action === "save") {
      const id = stories[slide].id,
        arr = get("saved", []);
      set(
        "saved",
        arr.includes(id) ? arr.filter((s) => s !== id) : [...arr, id],
      );
      document.getElementById("feature").innerHTML = feature();
      document.querySelector(".bookmark")?.focus({ preventScroll: true });
      toast(
        arr.includes(id)
          ? "Lectura retirada de guardados."
          : "Lectura guardada en tu biblioteca.",
      );
    }
  });
  document.addEventListener("submit", (e) => {
    if (e.target.id !== "settings-form") return;
    e.preventDefault();
    const f = new FormData(e.target);
    set("name", String(f.get("name")).trim() || "Explorador");
    set("level", f.get("level"));
    set("goal", Number(f.get("goal")));
    set("largeText", f.has("large"));
    set("reduceMotion", f.has("reduced"));
    toast("Configuración guardada.");
  });
  document
    .getElementById("query")
    .addEventListener("input", (e) => matches(e.target.value));
  document.getElementById("shade").addEventListener("click", closeMenu);
  finder.addEventListener("click", (e) => {
    if (e.target === finder) {
      const r = finder.getBoundingClientRect();
      if (
        e.clientX < r.left ||
        e.clientX > r.right ||
        e.clientY < r.top ||
        e.clientY > r.bottom
      )
        finder.close();
    }
  });
  document.addEventListener("keydown", (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
      e.preventDefault();
      search();
    }
    if (e.key === "Tab" && rail.classList.contains("open") && narrow.matches) {
      const links = rail.querySelectorAll("button");
      if (!e.shiftKey && document.activeElement === links[links.length - 1]) {
        e.preventDefault();
        links[0].focus();
      } else if (e.shiftKey && document.activeElement === links[0]) {
        e.preventDefault();
        links[links.length - 1].focus();
      }
    }
    if (e.key === "Escape" && rail.classList.contains("open")) {
      closeMenu();
      document.getElementById("menu-button")?.focus();
    }
  });
  window.addEventListener("hashchange", () => render(location.hash.slice(1)));
  window.addEventListener("online", hydrate);
  window.addEventListener("focus", () => {
    if (connected) flush();
  });
  render(location.hash.slice(1) || "home");
  syncDrawer();
  hydrate();
})();
