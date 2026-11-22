(() => {
  "use strict";

  const journals = [
    ["0028-0836", "Nature", "Multidisciplinaria"],
    ["0036-8075", "Science", "Multidisciplinaria"],
    ["0031-9007", "Physical Review Letters", "Física"],
    ["1545-7885", "PLOS Biology", "Biología"],
    ["0002-7863", "Journal of the American Chemical Society", "Química"],
    ["1752-0894", "Nature Geoscience", "Ciencias de la Tierra"],
    ["0003-486X", "Annals of Mathematics", "Matemáticas"],
    ["0004-6361", "Astronomy & Astrophysics", "Astronomía"],
  ];
  const editorial = [
    {
      title:
        "Repeated and Widespread Evolution of Bioluminescence in Marine Fishes",
      journal: "PLOS ONE",
      date: "2016-06-08",
      doi: "10.1371/journal.pone.0155154",
      author: "M. P. Davis, J. S. Sparks y W. L. Smith",
      note: "Distintos linajes de peces marinos adquirieron la capacidad de emitir luz de forma independiente.",
      term: "glow",
      translation: "brillar",
    },
    {
      title:
        "Seven temperate terrestrial planets around the nearby ultracool dwarf star TRAPPIST-1",
      journal: "Nature",
      date: "2017-02-23",
      doi: "10.1038/nature21360",
      author: "M. Gillon y colaboradores",
      note: "Los tránsitos de los planetas frente a su estrella revelan sus tamaños y órbitas.",
      term: "orbit",
      translation: "órbita",
    },
    {
      title:
        "Observation of Gravitational Waves from a Binary Black Hole Merger",
      journal: "Physical Review Letters",
      date: "2016-02-11",
      doi: "10.1103/PhysRevLett.116.061102",
      author: "B. P. Abbott y colaboradores",
      note: "Dos detectores midieron una señal compatible con la fusión de dos agujeros negros.",
      term: "wave",
      translation: "onda",
    },
    {
      title: "Bounded gaps between primes",
      journal: "Annals of Mathematics",
      date: "2014-05-01",
      doi: "10.4007/annals.2014.179.3.7",
      author: "Y. Zhang",
      note: "Zhang demostró que hay infinitos pares de primos consecutivos cuya diferencia queda bajo una misma cota.",
      term: "gap",
      translation: "diferencia",
    },
  ];
  const social = [
    {
      title: "NASA Goddard Shorts",
      source: "YouTube",
      note: "Clips sobre la Tierra, el Sol y la exploración espacial.",
      url: "https://www.youtube.com/@NASAGoddard/shorts",
    },
    {
      title: "NASA",
      source: "TikTok",
      note: "Noticias y vídeos cortos de las misiones de la NASA.",
      url: "https://www.tiktok.com/@nasa",
    },
    {
      title: "NASA Earth",
      source: "Instagram",
      note: "Observa volcanes, nubes y corrientes desde un satélite.",
      url: "https://www.instagram.com/nasaearth/",
    },
  ];
  const archiveVideos = [
    {
      id: "01xgEYtko7s",
      title: "2027 Moon Phases - Northern Hemisphere",
      date: "2026-11-20",
    },
    {
      id: "xjvDN2mTvEc",
      title: "Pixels & Parcels - Managing New Mexico's Water with Landsat",
      date: "2026-11-17",
    },
    {
      id: "LYwTowVlUFs",
      title: "Hubble and Roman: A Partnership 36 Years in the Making",
      date: "2026-11-16",
    },
  ];
  const common = {
    glow: ["brillar", "Some fish glow in the dark."],
    light: ["luz", "Light travels through space."],
    surface: ["superficie", "Light reaches the surface."],
    ocean: ["océano", "The ocean covers much of Earth."],
    deep: ["profundo", "The deep ocean is dark."],
    water: ["agua", "Water carries heat."],
    orbit: ["órbita", "The planet follows an orbit."],
    wave: ["onda", "A wave carries energy."],
    gap: ["diferencia o intervalo", "The gap between five and seven is two."],
    measure: ["medir", "We measure the temperature."],
    evidence: ["evidencia", "The evidence supports the claim."],
    suggest: ["sugerir", "The data suggest a possible link."],
    study: ["estudio o estudiar", "This study compares two groups."],
    species: ["especie o especies", "Several species produce light."],
    increase: ["aumento o aumentar", "The temperature may increase."],
    because: ["porque", "The water warms because it absorbs energy."],
  };
  const models = {
    A1: [
      "Some fish make light.",
      "Algunos peces producen luz.",
      "Encuentra el verbo que significa «producir».",
      "make",
    ],
    A2: [
      "The fish glows in dark water.",
      "El pez brilla en aguas oscuras.",
      "¿Qué palabra describe el agua?",
      "dark",
    ],
    B1: [
      "Some fish produce light to attract prey.",
      "Algunos peces producen luz para atraer presas.",
      "¿Qué verbo indica la finalidad?",
      "attract",
    ],
    B2: [
      "The observations suggest that light may attract prey.",
      "Las observaciones sugieren que la luz podría atraer presas.",
      "¿Qué auxiliar expresa incertidumbre?",
      "may",
    ],
    C1: [
      "Although the observations are consistent with the hypothesis, they do not establish causality.",
      "Aunque las observaciones concuerdan con la hipótesis, no establecen causalidad.",
      "¿Qué conector introduce una concesión?",
      "although",
    ],
  };

  const html = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  function dateLabel(value) {
    if (!value || !/^\d{4}(-\d{2}){0,2}$/.test(value))
      return "Fecha sin indicar";
    if (value.length === 4) return value;
    const day = new Date(
      value + (value.length === 7 ? "-01" : "") + "T12:00:00Z",
    );
    if (Number.isNaN(day.getTime())) return value;
    return new Intl.DateTimeFormat("es", {
      year: "numeric",
      month: "short",
      ...(value.length === 10 ? { day: "numeric" } : {}),
      timeZone: "UTC",
    }).format(day);
  }
  async function fetchJSON(url, options = {}, timeout = 12000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    try {
      const res = await fetch(url, { ...options, signal: controller.signal });
      if (!res.ok) throw new Error("upstream-" + res.status);
      return await res.json();
    } finally {
      clearTimeout(timer);
    }
  }
  function crossrefUrl(issn, day = new Date().toISOString().slice(0, 10)) {
    if (!journals.some((item) => item[0] === issn)) throw new Error("journal");
    const url = new URL("https://api.crossref.org/journals/" + issn + "/works");
    url.search = new URLSearchParams({
      filter: "type:journal-article,until-pub-date:" + day,
      sort: "published",
      order: "desc",
      rows: "8",
      select: "DOI,title,published,author,container-title",
    }).toString();
    return url.href;
  }
  function cleanTitle(value) {
    return String(value || "")
      .replace(/<[^>]*>/g, "")
      .replace(
        /&(amp|lt|gt|quot|apos|nbsp);/g,
        (_, key) =>
          ({ amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " })[
            key
          ],
      )
      .slice(0, 500);
  }
  function readCrossref(payload, journal) {
    return (payload?.message?.items || [])
      .filter((work) => work.title?.[0] && /^10\.\d{4,9}\/\S+$/i.test(work.DOI))
      .map((work) => {
        const first = work.author?.[0];
        const author =
          first &&
          (first.name || [first.given, first.family].filter(Boolean).join(" "));
        return {
          title: cleanTitle(work.title[0]),
          doi: work.DOI,
          journal: work["container-title"]?.[0] || journal,
          date: (work.published?.["date-parts"]?.[0] || [])
            .map((n, i) => String(n).padStart(i ? 2 : 4, "0"))
            .join("-"),
          author: author
            ? author + (work.author.length > 1 ? " y colaboradores" : "")
            : "",
        };
      });
  }
  function linkFor(doi) {
    return (
      "https://doi.org/" + doi.split("/").map(encodeURIComponent).join("/")
    );
  }
  function cloudProtocol() {
    return /^https?:$/.test(location.protocol);
  }
  function validSnapshot(input) {
    return (
      Array.isArray(input?.items) &&
      input.items.length &&
      input.items.every(
        (item) =>
          typeof item?.title === "string" &&
          typeof item.doi === "string" &&
          /^10\.\d{4,9}\/\S+$/i.test(item.doi),
      ) &&
      Number.isFinite(Date.parse(input.fetched))
    );
  }
  function recordCard(item, index, isDaily) {
    return (
      '<article class="sci-record">' +
      (isDaily ? '<b class="sci-daily-label">Artículo del día</b>' : "") +
      '<div class="sci-meta">' +
      html(item.journal) +
      " · " +
      html(dateLabel(item.date)) +
      '</div><h3 lang="en">' +
      html(item.title) +
      "</h3>" +
      (item.note ? "<p>" + html(item.note) + "</p>" : "") +
      (item.author ? "<small>" + html(item.author) + "</small>" : "") +
      '<div class="sci-actions"><a target="_blank" rel="noopener noreferrer" href="' +
      html(linkFor(item.doi)) +
      '">Leer en la revista</a><button type="button" data-discuss="' +
      index +
      '">Practicar el título</button></div></article>'
    );
  }
  function news(root, api) {
    root.innerHTML =
      '<section class="sci-pane"><header class="sci-head"><p class="sci-kicker">EXPLORAR</p><h1>Noticias científicas</h1><p>Lee un título en inglés, sigue la evidencia y practica con el tutor.</p></header><div class="sci-switch"><button type="button" data-feed="journal" aria-pressed="true">Revistas</button><button type="button" data-feed="social" aria-pressed="false">Vídeos y redes</button></div><div class="sci-content"></div></section>';
    const area = root.querySelector(".sci-content");
    let current = [];
    let version = 0;
    let selected = api.get("newsJournal", journals[0][0]);
    if (!journals.some((j) => j[0] === selected)) selected = journals[0][0];
    function presentRecords(items, collection) {
      const now = new Date(),
        day = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-");
      const shelfKey = "dailyJournal." + collection;
      let daily = api.get(shelfKey, null);
      if (daily?.day !== day || typeof daily?.item?.doi !== "string") {
        const index =
          Math.floor(
            Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) /
              86400000,
          ) % items.length;
        daily = { day, item: items[index] };
        api.set(shelfKey, daily);
      }
      current = [daily.item, ...items.filter((i) => i.doi !== daily.item.doi)];
      area.querySelector(".sci-grid").innerHTML = current
        .map((item, index) => recordCard(item, index, index === 0))
        .join("");
    }
    async function feed(force = false) {
      const ticket = ++version;
      const options = journals
        .map(
          ([id, name, field]) =>
            '<option value="' +
            id +
            '" ' +
            (selected === id ? "selected" : "") +
            ">" +
            html(name) +
            " · " +
            field +
            "</option>",
        )
        .join("");
      area.innerHTML =
        '<div class="sci-toolbar"><label>Revista<select class="sci-journal">' +
        options +
        '</select></label><button type="button" class="sci-refresh">Actualizar</button></div><p class="sci-state" role="status"></p><div class="sci-grid"></div>';
      const status = area.querySelector(".sci-state");
      const key = "scienceCache." + selected;
      const cached = api.get(key, null);
      const hasCache = validSnapshot(cached);
      const recent =
        hasCache && Date.now() - Date.parse(cached.fetched) < 3600000;
      function savedLabel() {
        return (
          "Consulta guardada de Crossref · " +
          new Date(cached.fetched).toLocaleString("es", {
            dateStyle: "short",
            timeStyle: "short",
          })
        );
      }
      presentRecords(
        hasCache ? cached.items : editorial,
        hasCache ? selected : "archivo",
      );
      status.textContent = hasCache
        ? savedLabel()
        : "Selección editorial de archivo. Consultando los registros recientes…";
      area.querySelector(".sci-journal").onchange = (e) => {
        selected = e.target.value;
        api.set("newsJournal", selected);
        feed();
      };
      area.querySelector(".sci-refresh").onclick = () => feed(true);
      if (recent && !force) return;
      try {
        let payload;
        if (cloudProtocol()) {
          try {
            payload = await fetchJSON(
              "/api/news?journal=" + encodeURIComponent(selected),
              {},
              21000,
            );
          } catch {
            /* A static host can call Crossref directly. */
          }
        }
        if (!validSnapshot(payload)) {
          const record = journals.find((j) => j[0] === selected);
          const data = await fetchJSON(crossrefUrl(selected), {}, 20000);
          payload = {
            items: readCrossref(data, record[1]),
            fetched: new Date().toISOString(),
          };
        }
        if (!validSnapshot(payload)) throw new Error("empty-feed");
        if (!area.isConnected || ticket !== version) return;
        api.set(key, payload);
        presentRecords(payload.items, selected);
        status.textContent =
          "Registros de Crossref · Consulta del " +
          new Date(payload.fetched).toLocaleString("es", {
            dateStyle: "short",
            timeStyle: "short",
          });
      } catch {
        if (!area.isConnected || ticket !== version) return;
        status.textContent = hasCache
          ? savedLabel() + ". La actualización no está disponible."
          : "Selección editorial de archivo · La consulta de la revista no está disponible.";
      }
    }
    async function videos() {
      const ticket = ++version;
      area.innerHTML =
        '<div class="sci-social-live" role="status">Consultando vídeos recientes…</div><h2>Canales oficiales</h2><div class="sci-grid">' +
        social
          .map(
            (item) =>
              '<article class="sci-record"><div class="sci-meta">' +
              item.source +
              "</div><h3>" +
              item.title +
              "</h3><p>" +
              item.note +
              '</p><a target="_blank" rel="noopener noreferrer" href="' +
              item.url +
              '">Ver canal</a></article>',
          )
          .join("") +
        '</div><p class="sci-source"><a href="https://www.nasa.gov/social-media/" target="_blank" rel="noopener noreferrer">Directorio de cuentas de la NASA</a></p>';
      const output = area.querySelector(".sci-social-live");
      function showVideos(items, title) {
        output.innerHTML =
          "<h2>" +
          html(title) +
          '</h2><div class="sci-grid">' +
          items
            .filter((x) => /^[\w-]{11}$/.test(x.id))
            .map(
              (item) =>
                '<article class="sci-record"><div class="sci-meta">YouTube · ' +
                html(dateLabel(item.date)) +
                '</div><h3 lang="en">' +
                html(item.title) +
                '</h3><a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=' +
                html(item.id) +
                '">Ver vídeo</a></article>',
            )
            .join("") +
          "</div>";
      }
      showVideos(archiveVideos, "Vídeos de archivo de NASA Goddard");
      try {
        if (!cloudProtocol()) throw new Error("file");
        const data = await fetchJSON("/api/social");
        if (!data.items?.length) throw new Error("empty");
        if (ticket !== version || !area.isConnected) return;
        showVideos(data.items, "Últimos vídeos de NASA Goddard");
      } catch {
        /* The dated editorial selection stays available. */
      }
    }
    root.querySelectorAll("[data-feed]").forEach(
      (btn) =>
        (btn.onclick = () => {
          root
            .querySelectorAll("[data-feed]")
            .forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
          if (btn.dataset.feed === "social") videos();
          else feed();
        }),
    );
    area.onclick = (e) => {
      const btn = e.target.closest("[data-discuss]");
      if (!btn) return;
      const article = current[Number(btn.dataset.discuss)];
      if (!article) return;
      api.set("scienceContext", {
        title: article.title,
        doi: article.doi,
        term: article.term || "",
        note: article.note || "",
      });
      api.go("tutor");
    };
    feed();
  }

  const normalize = (input) =>
    String(input)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  function localAnswer(question, level, context, previous = "") {
    const q = normalize(question);
    const [sentence, spanish, exercise, answer] = models[level] || models.A1;
    if (
      previous.includes(exercise) &&
      /^(?:[a-z]+[.!?]?)$/i.test(question.trim())
    ) {
      return q.replace(/[^a-z]/g, "") === answer
        ? "¡Correcto! «" +
            answer +
            "» cumple esa función. Ahora úsalo en otra oración sobre el océano."
        : "Busca «" +
            answer +
            "» en la frase. Lee la traducción y compáralas: " +
            spanish;
    }
    if (/titulo|headline/.test(q) && context?.title) {
      return (
        "El título es «" +
        context.title +
        "». " +
        (context.note ||
          "Abre el artículo original para comprobar qué afirma el estudio.") +
        "\n\n" +
        (["A1", "A2"].includes(level)
          ? "Señala un sustantivo del título. Después completa: “This article is about ___.”"
          : "Condensa el tema en una oración. Después diferencia lo que el título afirma de los datos que necesitarías para comprobarlo.")
      );
    }
    if (/ejercicio|practicar|pregunta/.test(q))
      return sentence + "\n\n" + exercise;
    if (/explica|concepto|biolumi|luz|oceano/.test(q))
      return (
        "Algunos seres vivos emiten luz mediante reacciones químicas. A esto se le llama bioluminiscencia.\n\n" +
        sentence +
        "\n" +
        spanish
      );
    if (/pronuncia|sonido/.test(q))
      return "En “light” /laɪt/, une los dos sonidos de la vocal en una sola sílaba. Compáralo con “lit” /lɪt/. En el panel Pronunciación puedes escuchar y grabar tus intentos.";
    const word = Object.keys(common).find((w) =>
      new RegExp("\\b" + w + "\\b").test(q),
    );
    if (word)
      return (
        "“" +
        word +
        "” significa «" +
        common[word][0] +
        "».\n\n" +
        common[word][1] +
        "\n\nEscribe otra frase que use esta palabra."
      );
    if (/gramatica|frase|ejemplo/.test(q))
      return sentence + "\n" + spanish + "\n\n" + exercise;
    return "La guía local tiene vocabulario de la lectura y ejercicios por nivel. Prueba «¿Qué significa glow?» o «Dame un ejercicio». Para analizar un título, ábrelo desde Noticias.";
  }
  function tutor(root, api) {
    const level = api.level();
    const context = api.get("scienceContext", null);
    const historyKey =
      "tutorHistory." + level + (context?.doi ? "." + context.doi : "");
    let history = api.get(historyKey, []);
    if (!Array.isArray(history)) history = [];
    let ai = false;
    let sending = false;
    root.innerHTML =
      '<section class="sci-pane"><header class="sci-head"><p class="sci-kicker">ASISTENTE DE ESTUDIO</p><h1>Tutor Lumi</h1><p>Pregunta sobre una palabra, una idea científica o una frase en inglés.</p></header><article class="sci-chat"><div class="sci-chat-top"><div class="sci-partner"><img src="assets/lumi.webp" alt=""><h2>Conversación</h2></div><span class="sci-mode" role="status">Guía local · ' +
      html(level) +
      "</span></div>" +
      (context?.doi
        ? '<div class="sci-context"><b>Título en práctica</b><span lang="en">' +
          html(context.title) +
          '</span><div><a target="_blank" rel="noopener noreferrer" href="' +
          html(linkFor(context.doi)) +
          '">Consultar fuente</a> · <button type="button" data-leave>Quitar título</button></div></div>'
        : "") +
      '<div class="sci-log" role="log" aria-label="Mensajes del tutor" aria-live="polite"></div><div class="sci-prompts"></div><form class="sci-form"><label for="sci-question">Tu pregunta</label><textarea rows="2" maxlength="1200" id="sci-question" required placeholder="¿Qué significa glow?"></textarea><button type="submit">Enviar</button></form><p class="sci-state" data-hint aria-live="polite"></p></article></section>';
    const chat = root.querySelector(".sci-chat"),
      log = chat.querySelector(".sci-log"),
      input = chat.querySelector("textarea"),
      form = chat.querySelector("form"),
      mode = chat.querySelector(".sci-mode"),
      hint = chat.querySelector("[data-hint]");
    function paint() {
      log.innerHTML = history.length
        ? history
            .map(
              (m) =>
                '<div class="sci-bubble ' +
                (m.role === "user" ? "sci-user" : "sci-assistant") +
                '"><b>' +
                html(m.role === "user" ? "Tú" : m.label || "Guía local") +
                "</b><p>" +
                html(m.content) +
                "</p></div>",
            )
            .join("")
        : '<div class="sci-bubble sci-assistant"><b>Lumi</b><p>' +
          html(
            context
              ? "¿Qué palabras reconoces en el título que elegiste?"
              : "¿Qué te gustaría entender hoy? Puedes escribir en español o en inglés.",
          ) +
          "</p></div>";
      log.scrollTop = log.scrollHeight;
    }
    paint();
    const leave = chat.querySelector("[data-leave]");
    if (leave)
      leave.onclick = () => {
        api.set("scienceContext", null);
        tutor(root, api);
      };
    if (cloudProtocol())
      fetchJSON("/api/status", {}, 3500)
        .then((data) => {
          ai = !!data.tutor;
          if (ai && chat.isConnected)
            mode.textContent =
              (data.tutor === "ollama" ? "IA en este equipo" : "IA conectada") +
              " · " +
              level;
        })
        .catch(() => {});
    const suggested = [
      context ? "Ayúdame con el título" : "Explícame la bioluminiscencia",
      "¿Qué significa glow?",
      "Dame un ejercicio",
    ];
    const prompts = chat.querySelector(".sci-prompts");
    suggested.forEach((text) => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = text;
      b.onclick = () => {
        input.value = text;
        form.requestSubmit();
      };
      prompts.append(b);
    });
    form.onsubmit = async (e) => {
      e.preventDefault();
      const question = input.value.trim();
      if (!question || sending) return;
      sending = true;
      const previous =
        history.filter((m) => m.role === "assistant").at(-1)?.content || "";
      history.push({ role: "user", content: question });
      paint();
      input.value = "";
      form.querySelector("button").disabled = true;
      const usedAI = ai;
      hint.textContent = ai ? "Preparando la respuesta…" : "";
      let reply, label;
      if (usedAI) {
        try {
          const result = await fetchJSON(
            "/api/tutor",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                level,
                context: context?.title || "",
                history: history
                  .slice(-8)
                  .map((m) => ({ role: m.role, content: m.content })),
              }),
            },
            120000,
          );
          if (!result.reply || typeof result.reply !== "string")
            throw new Error("empty");
          reply = result.reply;
          label = result.provider === "ollama" ? "IA local" : "IA";
        } catch {
          hint.textContent =
            "La IA no pudo responder. Se muestra una pista de la guía local.";
        }
      }
      if (!reply) {
        reply = localAnswer(question, level, context, previous);
        label = "Guía local";
      }
      history.push({ role: "assistant", content: reply, label });
      history = history.slice(-16);
      api.set(historyKey, history);
      if (!chat.isConnected) return;
      if (usedAI && label !== "Guía local") hint.textContent = "";
      paint();
      sending = false;
      form.querySelector("button").disabled = false;
      input.focus();
    };
  }
  globalThis.LumaScience = {
    render(route, root, api) {
      return route === "news" ? news(root, api) : tutor(root, api);
    },
    journals,
    crossrefUrl,
    readCrossref,
  };
})();
