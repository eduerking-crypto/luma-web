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
      pmid: "27276229",
      pmcid: "PMC4898709",
      fullTextInPmc: true,
      openAccess: true,
      doi: "10.1371/journal.pone.0155154",
      author: "M. P. Davis, J. S. Sparks y W. L. Smith",
      note: "Distintos linajes de peces marinos adquirieron la capacidad de emitir luz de forma independiente.",
      term: "glow",
      translation: "brillar",
      license: [
        {
          "content-version": "vor",
          URL: "https://creativecommons.org/licenses/by/4.0/",
          start: { timestamp: 1465344000000 },
        },
      ],
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
  editorial.push({
    title: "Photosynthesis: basics, history and modelling.",
    journal: "Annals of Botany",
    date: "2020-09-14",
    pmid: "31641747",
    pmcid: "PMC7489092",
    doi: "10.1093/aob/mcz171",
    author: "A. Stirbet, D. Lazár, Y. Guo y G. Govindjee",
    note: "Una revisión sobre cómo se representa la fotosíntesis con modelos.",
    term: "light",
    fullTextInPmc: true,
  });
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
    moon: ["luna", "The Moon orbits Earth."],
    star: ["estrella", "A star emits light."],
    stars: ["estrellas", "Stars form in clouds of gas and dust."],
    leaf: ["hoja", "A leaf absorbs light."],
    leaves: ["hojas", "Leaves exchange gases with the air."],
    heat: ["calor", "Heat flows from warmer to cooler regions."],
    motion: ["movimiento", "We measure motion over time."],
    energy: ["energía", "A moving object has kinetic energy."],
    salt: ["sal", "Salt dissolves in water."],
    air: ["aire", "Air contains several gases."],
    prime: ["primo", "Seven is a prime number."],
    number: ["número", "Seven is an odd number."],
    rock: ["roca", "This rock contains minerals."],
    change: ["cambio o cambiar", "Temperatures change during the day."],
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
  function crossrefUrl(
    issn,
    topic,
    day = new Date().toISOString().slice(0, 10),
  ) {
    if (!journals.some((item) => item[0] === issn)) throw new Error("journal");
    const url = new URL("https://api.crossref.org/journals/" + issn + "/works");
    url.search = new URLSearchParams({
      filter: "type:journal-article,until-pub-date:" + day,
      ...(topic
        ? { "query.title": topic }
        : { sort: "published", order: "desc" }),
      rows: "8",
      select:
        "DOI,title,published,author,container-title,license,update-to,updated-by",
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
  const validPmid = (id) => /^[1-9]\d{0,8}$/.test(id || "");
  const validPmcid = (id) => /^PMC[1-9]\d*$/.test(id || "");
  const paperKey = (article) =>
    article?.doi
      ? String(article.doi).toLowerCase()
      : validPmid(article?.pmid)
        ? "pmid:" + article.pmid
        : "";
  const pubmedLink = (pmid) => "https://pubmed.ncbi.nlm.nih.gov/" + pmid + "/";
  function uniqueByDoi(items) {
    const seen = new Set();
    return items.filter((item) => {
      const key = paperKey(item);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }
  function readCrossref(payload, journal) {
    const parsed = (payload?.message?.items || [])
      .filter((work) => work.title?.[0] && /^10\.\d{4,9}\/\S+$/i.test(work.DOI))
      .map((work) => {
        const first = work.author?.[0];
        const author =
          first &&
          (first.name || [first.given, first.family].filter(Boolean).join(" "));
        return {
          title: cleanTitle(work.title[0]),
          doi: work.DOI,
          license: work.license || [],
          "update-to": work["update-to"] || [],
          "updated-by": work["updated-by"] || [],
          journal: work["container-title"]?.[0] || journal,
          date: (work.published?.["date-parts"]?.[0] || [])
            .map((n, i) => String(n).padStart(i ? 2 : 4, "0"))
            .join("-"),
          author: author
            ? author + (work.author.length > 1 ? " y colaboradores" : "")
            : "",
        };
      });
    return uniqueByDoi(parsed);
  }
  function linkFor(doi) {
    return (
      "https://doi.org/" + doi.split("/").map(encodeURIComponent).join("/")
    );
  }
  const doiPattern = /^10\.\d{4,9}\/\S+$/i;
  function publicationInfo(record) {
    const messages = [];
    const labels = {
      correction: ["Corrección publicada", "Aviso de corrección"],
      erratum: ["Fe de erratas publicada", "Fe de erratas"],
      retraction: ["Retractación registrada", "Aviso de retractación"],
      withdrawal: ["Retirada registrada", "Aviso de retirada"],
      "expression-of-concern": [
        "Expresión de preocupación registrada",
        "Expresión de preocupación",
      ],
      reinstatement: ["Restitución registrada", "Aviso de restitución"],
    };
    for (const [index, field] of ["updated-by", "update-to"].entries()) {
      for (const item of Array.isArray(record[field]) ? record[field] : []) {
        const label = Object.hasOwn(labels, item?.type)
          ? labels[item.type][index]
          : "Actualización editorial";
        const doi = doiPattern.test(item?.DOI) ? item.DOI : "";
        if (!messages.some((m) => m.label === label && m.doi === doi))
          messages.push({ label, doi });
      }
    }
    const pubmedNotices = {
      "Retracted Publication": "Publicación retractada",
      "Retraction of Publication": "Aviso de retractación",
      "Expression of Concern": "Expresión de preocupación",
      "Published Erratum": "Fe de erratas publicada",
    };
    for (const type of Array.isArray(record.types) ? record.types : [])
      if (Object.hasOwn(pubmedNotices, type))
        messages.push({ label: pubmedNotices[type], doi: "" });
    let license = null;
    for (const item of Array.isArray(record.license) ? record.license : []) {
      if (item?.["content-version"] !== "vor") continue;
      const start =
        item.start?.timestamp ?? Date.parse(item.start?.["date-time"]);
      if (!Number.isFinite(start) || start > Date.now()) continue;
      const match = String(item.URL).match(
        /^https?:\/\/(?:www\.)?creativecommons\.org\/(licenses\/(by(?:-nc)?(?:-nd|-sa)?)|publicdomain\/(zero))\/(\d\.\d)\/?$/i,
      );
      if (!match) continue;
      const name = match[3] ? "CC0" : "CC " + match[2].toUpperCase();
      license = {
        label: name + " " + match[4],
        href:
          "https://creativecommons.org/" +
          match[1].toLowerCase() +
          "/" +
          match[4] +
          "/",
      };
      break;
    }
    return { messages, license };
  }
  function cloudProtocol() {
    return /^https?:$/.test(location.protocol);
  }
  function validSnapshot(input) {
    return (
      Array.isArray(input?.items) &&
      input.items.every(
        (item) =>
          typeof item?.title === "string" &&
          (doiPattern.test(item.doi) || validPmid(item.pmid)),
      ) &&
      Number.isFinite(Date.parse(input.fetched))
    );
  }
  function recordCard(item, index, isDaily) {
    const { license, messages } = publicationInfo(item);
    return (
      '<article class="sci-record">' +
      (isDaily ? '<b class="sci-daily-label">Artículo del día</b>' : "") +
      '<div class="sci-meta">' +
      html(item.journal) +
      " · " +
      html(
        item.date ? dateLabel(item.date) : item.dateText || "Fecha sin indicar",
      ) +
      '</div><h3 lang="en">' +
      html(item.title) +
      "</h3>" +
      (item.note ? "<p>" + html(item.note) + "</p>" : "") +
      "<small>" +
      html(item.author || "Autoría sin indicar en el registro") +
      "</small>" +
      '<p class="sci-identifiers">' +
      [
        validPmid(item.pmid)
          ? '<a href="' +
            pubmedLink(item.pmid) +
            '" rel="noopener noreferrer" target="_blank">PMID ' +
            html(item.pmid) +
            "</a>"
          : "",
        doiPattern.test(item.doi)
          ? '<a href="' +
            html(linkFor(item.doi)) +
            '" rel="noopener noreferrer" target="_blank">DOI ' +
            html(item.doi) +
            "</a>"
          : "",
      ]
        .filter(Boolean)
        .join(" · ") +
      "</p>" +
      (license
        ? '<p class="sci-rights">Acceso abierto · <a href="' +
          html(license.href) +
          '" target="_blank" rel="noopener noreferrer">' +
          html(license.label) +
          "</a></p>"
        : "") +
      messages
        .map(
          (m) =>
            '<p class="sci-update">' +
            html(m.label) +
            (m.doi
              ? ' · <a target="_blank" rel="noopener noreferrer" href="' +
                html(linkFor(m.doi)) +
                '">Consultar registro relacionado</a>'
              : "") +
            "</p>",
        )
        .join("") +
      '<div class="sci-actions"><a target="_blank" rel="noopener noreferrer" href="' +
      html(validPmid(item.pmid) ? pubmedLink(item.pmid) : linkFor(item.doi)) +
      '">' +
      (validPmid(item.pmid)
        ? "Ver en PubMed"
        : license
          ? "Leer en acceso abierto"
          : "Leer en la revista") +
      "</a>" +
      (validPmcid(item.pmcid) && item.fullTextInPmc
        ? '<a href="https://pmc.ncbi.nlm.nih.gov/articles/' +
          html(item.pmcid) +
          '/" target="_blank" rel="noopener noreferrer">' +
          (item.openAccess ? "Texto abierto en PMC" : "Texto completo en PMC") +
          "</a>"
        : "") +
      (validPmcid(item.pmcid)
        ? '<button type="button" aria-expanded="false" data-abstract="' +
          index +
          '">Consultar resumen</button>'
        : "") +
      '<button type="button" data-discuss="' +
      index +
      '">Practicar el título</button></div><div class="sci-abstract" aria-live="polite"></div></article>'
    );
  }
  async function openAbstract(item, btn, box, api) {
    const key = "scienceOpenSummary." + item.pmcid;
    const valid = (value) =>
      typeof value?.passage === "string" &&
      value.passage.length > 20 &&
      /^https:\/\/creativecommons\.org\/(licenses\/by|publicdomain\/zero)\/\d\.\d\/$/.test(
        value.licenseUrl || "",
      );
    // Keep a small device-local shelf so reading an abstract works again offline.
    const history = api.get("scienceOpenSummaryShelf", []);
    const shelf = Array.isArray(history) ? history : [];
    let packet = shelf.find((row) => row.id === key)?.packet;
    const pmcUrl = "https://pmc.ncbi.nlm.nih.gov/articles/" + item.pmcid + "/";
    if (btn.hasAttribute("data-study-summary")) {
      if (!valid(packet)) return;
      api.set("lessonContext", {
        kind: "published-abstract",
        title: item.title,
        passage: packet.passage,
        sourceName:
          item.journal + " · " + (item.author || "Autores del artículo"),
        sourceUrl: pmcUrl,
        level: api.level(),
      });
      api.go("tutor");
      return;
    }
    if (btn.getAttribute("aria-expanded") === "true") {
      box.hidden = true;
      btn.setAttribute("aria-expanded", "false");
      btn.textContent = "Consultar resumen";
      return;
    }
    box.hidden = false;
    btn.disabled = true;
    box.textContent = "Consultando el resumen y su licencia en PubMed Central…";
    try {
      if (!valid(packet)) {
        if (!cloudProtocol()) throw new Error("offline");
        packet = await fetchJSON(
          "/api/abstract?pmcid=" + encodeURIComponent(item.pmcid),
          {},
          19000,
        );
        if (!box.isConnected) return;
        if (valid(packet)) {
          const existing = api.get("scienceOpenSummaryShelf", []);
          api.set(
            "scienceOpenSummaryShelf",
            [
              { id: key, packet },
              ...(Array.isArray(existing) ? existing : []).filter(
                (row) => row.id !== key,
              ),
            ].slice(0, 6),
          );
        }
      }
      if (!box.isConnected) return;
      if (!valid(packet)) {
        box.innerHTML =
          '<p>La fuente no ofrece aquí un resumen con licencia de reutilización CC BY o CC0. Puedes consultar la publicación en <a href="' +
          pmcUrl +
          '" target="_blank" rel="noopener noreferrer">PubMed Central</a>.</p>';
      } else {
        box.innerHTML =
          "<h4>" +
          (packet.excerpt
            ? "Fragmento del resumen original"
            : "Resumen original en inglés") +
          "</h4>" +
          packet.passage
            .split(/\n+/)
            .filter(Boolean)
            .map((p) => '<p lang="en">' + html(p) + "</p>")
            .join("") +
          '<p class="sci-source">' +
          html(packet.attribution || item.author || item.journal) +
          ' · <a href="' +
          pmcUrl +
          '" target="_blank" rel="noopener noreferrer">PubMed Central</a> · <a href="' +
          html(packet.licenseUrl) +
          '" target="_blank" rel="noopener noreferrer">' +
          html(packet.licenseName) +
          "</a>. Formato de lectura adaptado.</p>" +
          '<button type="button" class="sci-refresh" data-study-summary="' +
          btn.dataset.abstract +
          '">Practicar este resumen con Lumi</button>';
      }
      btn.setAttribute("aria-expanded", "true");
      btn.textContent = "Ocultar resumen";
    } catch {
      if (box.isConnected)
        box.innerHTML =
          '<p>El resumen no está disponible en este momento. <a href="' +
          pmcUrl +
          '" target="_blank" rel="noopener noreferrer">Abrir la publicación en PMC</a>.</p>';
    } finally {
      btn.disabled = false;
    }
  }

  function news(root, api) {
    root.innerHTML =
      '<section class="sci-pane"><header class="sci-head"><p class="sci-kicker">EXPLORAR</p><h1>Noticias científicas</h1><p>Lee un título en inglés, sigue la evidencia y practica con el tutor.</p></header><div class="sci-switch"><button type="button" data-feed="journal" aria-pressed="true">Revistas y PubMed</button><button type="button" data-feed="social" aria-pressed="false">Vídeos y redes</button></div><div class="sci-content"></div></section>';
    const area = root.querySelector(".sci-content");
    let current = [];
    let currentVideos = [];
    let version = 0;
    let selected = api.get("newsJournal", journals[0][0]);
    if (selected !== "pubmed" && !journals.some((j) => j[0] === selected))
      selected = journals[0][0];
    let query = String(api.get("newsTopic", "") || "").slice(0, 160);
    function presentRecords(items, collection, allowDaily = true) {
      const now = new Date(),
        day = [now.getFullYear(), now.getMonth() + 1, now.getDate()].join("-");
      const shelfKey = "dailyJournal." + collection;
      let daily = api.get(shelfKey, null);
      const unique = uniqueByDoi(items);
      const eligible = allowDaily
        ? unique.filter((item) => !publicationInfo(item).messages.length)
        : [];
      const previous =
        daily?.day === day &&
        eligible.find((item) => paperKey(item) === paperKey(daily.item));
      let featured = previous;
      if (!featured && eligible.length) {
        const index =
          Math.floor(
            Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) /
              86400000,
          ) % eligible.length;
        featured = eligible[index];
        api.set(shelfKey, { day, item: featured });
      }
      current = featured
        ? [featured, ...unique.filter((i) => i !== featured)]
        : unique;
      area.querySelector(".sci-grid").innerHTML = current
        .map((item, index) =>
          recordCard(item, index, index === 0 && !!featured),
        )
        .join("");
    }
    async function feed(force = false) {
      const ticket = ++version;
      const provider = selected === "pubmed" ? "PubMed" : "Crossref";
      const options = [["pubmed", "PubMed", "Ciencias de la vida"], ...journals]
        .map(
          ([id, name, field]) =>
            `<option value="${id}" ${selected === id ? "selected" : ""}>${html(name)} · ${html(field)}</option>`,
        )
        .join("");
      area.innerHTML = `<form class="sci-toolbar sci-search"><label>Fuente<select class="sci-journal">${options}</select></label>
        <label>Tema en inglés<input type="search" class="sci-query" maxlength="160" autocomplete="off" placeholder="Ej. photosynthesis" value="${html(query)}"></label>
        <button class="sci-refresh" type="submit">Buscar</button></form>
        <p class="sci-filter-note">${selected === "pubmed" ? "PubMed reúne referencias de revistas de ciencias de la vida." : "Busca palabras del título en la revista seleccionada."} Deja el tema vacío para ver publicaciones recientes.</p>
        <p class="sci-state" role="status"></p><div class="sci-grid"></div>`;
      const status = area.querySelector(".sci-state");
      const sourceId = selected,
        topic = query,
        key = "scienceCache." + sourceId,
        searchKey = "scienceSearchCache." + sourceId;
      const history = api.get(searchKey, []),
        recentSearches = Array.isArray(history) ? history : [];
      const cached = topic
        ? recentSearches.find((r) => r.query === topic)?.data
        : api.get(key, null);
      const hasCache = validSnapshot(cached);
      const recent =
        hasCache && Date.now() - Date.parse(cached.fetched) < 3600000;
      const when = (stamp) =>
        new Date(stamp).toLocaleString("es", {
          dateStyle: "short",
          timeStyle: "short",
        });
      const sourceLabel =
        sourceId === "pubmed"
          ? "PubMed"
          : journals.find((r) => r[0] === sourceId)[1];
      const subject = sourceLabel + (topic ? " · «" + topic + "»" : "");
      const cachedLabel = () =>
        subject + " · Consulta guardada del " + when(cached.fetched) + ".";
      function showResults(payload) {
        if (payload.items.length)
          presentRecords(payload.items, sourceId, !topic);
        else {
          current = [];
          area.querySelector(".sci-grid").innerHTML =
            '<div class="sci-empty"><h3>Sin resultados</h3><p>Prueba con otra palabra en inglés o cambia la fuente.</p></div>';
        }
      }
      if (hasCache) {
        showResults(cached);
        status.textContent = cachedLabel();
      } else {
        current = [];
        status.textContent = "Consultando " + subject + "…";
      }
      area.querySelector(".sci-journal").onchange = (e) => {
        selected = e.target.value;
        query = area.querySelector(".sci-query").value.trim();
        api.set("newsJournal", selected);
        api.set("newsTopic", query);
        feed();
      };
      area.querySelector("form").onsubmit = (e) => {
        e.preventDefault();
        query = area
          .querySelector(".sci-query")
          .value.trim()
          .replace(/\s+/g, " ");
        api.set("newsTopic", query);
        feed(true);
      };
      if (recent && !force) return;
      try {
        let payload;
        if (cloudProtocol()) {
          try {
            payload = await fetchJSON(
              "/api/news?" +
                new URLSearchParams({ journal: sourceId, q: topic }),
              {},
              35000,
            );
          } catch (error) {
            if (sourceId === "pubmed") throw error;
          }
        }
        if (!validSnapshot(payload) && sourceId !== "pubmed") {
          const data = await fetchJSON(crossrefUrl(sourceId, topic), {}, 18000);
          if (!Array.isArray(data.message?.items)) throw new Error("records");
          payload = {
            items: readCrossref(data, sourceLabel),
            fetched: new Date().toISOString(),
            source: "Crossref",
          };
        }
        if (!validSnapshot(payload)) throw new Error("upstream");
        if (!area.isConnected || version !== ticket) return;
        if (topic)
          api.set(
            searchKey,
            [
              { query: topic, data: payload },
              ...recentSearches.filter((r) => r.query !== topic),
            ].slice(0, 3),
          );
        else api.set(key, payload);
        showResults(payload);
        const count = payload.items.length,
          origin = payload.source || provider;
        status.textContent =
          subject +
          (origin === sourceLabel ? "" : " · " + origin) +
          " · " +
          count +
          (count === 1 ? " resultado mostrado" : " resultados mostrados") +
          " · " +
          when(payload.fetched) +
          ".";
      } catch {
        if (!area.isConnected || version !== ticket) return;
        if (hasCache) {
          status.textContent =
            cachedLabel() + " La fuente no respondió a la actualización.";
          return;
        }
        const sample =
          sourceId === "pubmed"
            ? editorial.filter((item) => item.pmid)
            : editorial;
        presentRecords(sample, "archivo." + sourceId, !topic);
        status.textContent =
          subject +
          " · No se pudo consultar la fuente. A continuación se muestra la selección editorial de archivo.";
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
        currentVideos = items.filter(
          (x) => /^[\w-]{11}$/.test(x.id) && typeof x.title === "string",
        );
        output.innerHTML =
          "<h2>" +
          html(title) +
          '</h2><div class="sci-grid">' +
          currentVideos
            .map(
              (item, index) =>
                '<article class="sci-record"><div class="sci-meta">YouTube · ' +
                html(dateLabel(item.date)) +
                '</div><h3 lang="en">' +
                html(item.title) +
                '</h3><div class="sci-actions"><a target="_blank" rel="noopener noreferrer" href="https://www.youtube.com/watch?v=' +
                html(item.id) +
                '">Ver vídeo</a><button type="button" data-video="' +
                index +
                '">Practicar con el vídeo</button></div></article>',
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
        showVideos(
          data.items,
          "Últimos vídeos de NASA Goddard · " +
            (data.mode === "api" ? "YouTube Data API" : "Canal de YouTube"),
        );
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
    area.onclick = async (e) => {
      const btn = e.target.closest(
        "[data-discuss],[data-video],[data-abstract],[data-study-summary]",
      );
      if (!btn) return;
      if (
        btn.hasAttribute("data-abstract") ||
        btn.hasAttribute("data-study-summary")
      ) {
        const item =
          current[Number(btn.dataset.abstract ?? btn.dataset.studySummary)];
        if (!item || !validPmcid(item.pmcid)) return;
        const box = btn.closest("article").querySelector(".sci-abstract");
        await openAbstract(item, btn, box, api);
        return;
      }
      if (btn.hasAttribute("data-video")) {
        const video = currentVideos[Number(btn.dataset.video)];
        if (!video) return;
        api.set("lessonContext", null);
        api.set("scienceContext", {
          kind: "video",
          title: video.title,
          videoId: video.id,
          sourceName: "NASA Goddard · YouTube",
        });
        api.go("tutor");
        return;
      }
      const article = current[Number(btn.dataset.discuss)];
      if (!article) return;
      api.set("lessonContext", null);
      api.set("scienceContext", {
        title: article.title,
        doi: article.doi,
        pmid: article.pmid,
        term: article.term || "",
        note: article.note || "",
        sourceName: article.journal,
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
  function activeMaterial(api) {
    const selected = api.get("lessonContext", null);
    if (
      typeof selected?.title === "string" &&
      typeof selected.passage === "string" &&
      selected.passage.trim()
    ) {
      let sourceUrl = "";
      try {
        const parsed = new URL(selected.sourceUrl);
        if (
          parsed.protocol === "https:" &&
          !parsed.username &&
          !parsed.password
        )
          sourceUrl = parsed.href;
      } catch {
        /* A passage can still be studied without a source link. */
      }
      return {
        kind: "passage",
        publishedAbstract: selected.kind === "published-abstract",
        title: selected.title.slice(0, 500),
        passage: selected.passage.trim().slice(0, 2000),
        sourceUrl,
        sourceName: String(selected.sourceName || "Fuente de la lectura").slice(
          0,
          160,
        ),
        level: Object.hasOwn(models, selected.level)
          ? selected.level
          : api.level(),
      };
    }
    const item = api.get("scienceContext", null);
    if (typeof item?.title !== "string") return null;
    if (item.kind === "video" && /^[\w-]{11}$/.test(item.videoId)) {
      return {
        ...item,
        kind: "video",
        sourceUrl: "https://www.youtube.com/watch?v=" + item.videoId,
        sourceName: "NASA Goddard · YouTube",
      };
    }
    if (doiPattern.test(item.doi) || validPmid(item.pmid))
      return {
        ...item,
        kind: "article",
        sourceUrl: validPmid(item.pmid)
          ? pubmedLink(item.pmid)
          : linkFor(item.doi),
        sourceName: item.sourceName || "Revista de origen",
      };
    return null;
  }
  function materialWords(context) {
    return (
      (context?.passage || context?.title || "")
        .toLowerCase()
        .match(/[a-z]+(?:[-’'][a-z]+)*/g) || []
    );
  }
  function anchorWord(context) {
    const words = materialWords(context),
      lexical = new Set(words);
    if (context?.term && lexical.has(context.term)) return context.term;
    return (
      Object.keys(common).find((w) => lexical.has(w)) ||
      words.find(
        (w) =>
          w.length > 3 &&
          !/^(from|with|than|this|that|their|there|these|they|when|around|could|would|into)$/.test(
            w,
          ),
      ) ||
      words[0] ||
      ""
    );
  }
  function practicePrompt(context, level) {
    const elementary = ["A1", "A2"].includes(level);
    const topic = anchorWord(context);
    if (context.kind === "passage")
      return (
        "Tu turno. " +
        (elementary
          ? "Escribe una frase en inglés sobre la lectura. Puedes empezar con una palabra del pasaje, por ejemplo «" +
            topic +
            "»."
          : "Explica en inglés una idea del pasaje y apóyala en una expresión concreta del texto. Añade un matiz si la explicación es incierta.")
      );
    const media = context.kind === "video" ? "vídeo" : "artículo";
    return (
      "Tu turno. En el título «" +
      context.title +
      "», identifica el tema con tus propias palabras. " +
      (elementary
        ? "Completa en inglés «This " +
          (context.kind === "video" ? "video" : "article") +
          " is about ___.»"
        : "Escribe una frase en inglés sobre el tema y otra sobre una pregunta que comprobarías al consultar el " +
          media +
          ".")
    );
  }
  function checkExplanation(question, context, level) {
    const words = normalize(question).match(/[a-z]+/g) || [];
    const shared = materialWords(context).find(
      (w) =>
        w.length > 2 &&
        !/^(the|are|and|this|that|for|with|from|this|they|has|have|can|into|its|their)$/.test(
          w,
        ) &&
        words.includes(w),
    );
    const quote =
      context.kind === "passage"
        ? (context.passage.match(/^[^.!?]+[.!?]?/)?.[0] || context.title).slice(
            0,
            220,
          )
        : context.title;
    const start = shared
      ? "Usaste «" + shared + "», una palabra que aparece en el material. "
      : "Vuelve a esta línea: «" + quote + "». ";
    const levelHint = ["A1", "A2"].includes(level)
      ? "Revisa que tu frase tenga sujeto y verbo."
      : "Revisa que cada afirmación tenga apoyo en el texto e indica qué aspecto falta por comprobar.";
    return (
      start +
      levelHint +
      " Escribe tu segunda versión. Puedes volver al material destacado para compararla."
    );
  }
  function materialAnswer(question, level, context, previous) {
    const q = normalize(question),
      word = Object.keys(common).find((w) =>
        new RegExp("\\b" + w + "\\b").test(q),
      );
    if (/mi explicacion|dame un ejercicio|practicar|ejercicio/.test(q))
      return practicePrompt(context, level);
    if (
      (previous.startsWith("Tu turno.") ||
        previous.includes("Escribe tu segunda versión.")) &&
      !/[?¿]/.test(question.trim())
    )
      return checkExplanation(question, context, level);
    if (word && /signific|tradu|define|que es|english|vocab/.test(q))
      return (
        "«" +
        word +
        "» significa «" +
        common[word][0] +
        "». Ejemplo de Luma: “" +
        common[word][1] +
        "”. Busca si tiene ese mismo sentido en la fuente."
      );
    const excerpt =
      context.kind === "passage"
        ? (
            context.passage.match(/^[^.!?]+[.!?]?/)?.[0] || context.passage
          ).slice(0, 250)
        : context.title;
    const anchor = anchorWord(context),
      hint = Object.hasOwn(common, anchor)
        ? "Aquí puedes trabajar «" + anchor + "» (" + common[anchor][0] + "). "
        : "Localiza «" + anchor + "» y las palabras que la rodean. ";
    if (context.kind === "passage")
      return (
        (context.publishedAbstract
          ? "En el resumen publicado aparece «"
          : "En la adaptación de Luma aparece «") +
        excerpt +
        "». " +
        hint +
        (["A1", "A2"].includes(level)
          ? "Encuentra quién o qué realiza la acción y lee despacio el verbo."
          : "Identifica la afirmación principal y busca las palabras que limitan su alcance.")
      );
    return (
      "El título es «" +
      context.title +
      "». " +
      hint +
      (context.kind === "video"
        ? "Al ver el vídeo, apunta un detalle y el minuto en que lo observaste."
        : "Consulta el artículo para verificar el método y los resultados.")
    );
  }
  function localAnswer(question, level, context, previous = "") {
    if (context) return materialAnswer(question, level, context, previous);
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
    const context = activeMaterial(api);
    const level = context?.level || api.level();
    const scope =
      context?.doi ||
      (validPmid(context?.pmid) ? "pubmed." + context.pmid : "") ||
      context?.videoId ||
      (context?.kind === "passage"
        ? "lesson." + context.sourceName + "." + context.title
        : "");
    const historyKey =
      "tutorHistory." + level + (scope ? "." + scope.slice(0, 190) : "");
    const draftKey = "draft." + historyKey;
    let history = api.get(historyKey, []);
    if (!Array.isArray(history)) history = [];
    let ai = false;
    let sending = false;
    root.innerHTML =
      '<section class="sci-pane"><header class="sci-head"><p class="sci-kicker">ASISTENTE DE ESTUDIO</p><h1>Tutor Lumi</h1><p>Pregunta sobre una palabra, una idea científica o una frase en inglés.</p></header><article class="sci-chat"><div class="sci-chat-top"><div class="sci-partner"><img src="assets/lumi.webp" alt=""><h2>Conversación</h2></div><span class="sci-mode" role="status">Guía local · ' +
      html(level) +
      "</span></div>" +
      (context
        ? '<div class="sci-context"><b>' +
          {
            passage: context.publishedAbstract
              ? "Pasaje del resumen original"
              : "Lectura compartida con Lumi",
            article: "Título del artículo",
            video: "Título del vídeo",
          }[context.kind] +
          '</b><span lang="en">' +
          html(context.title) +
          "</span>" +
          (context.kind === "passage"
            ? '<blockquote lang="en">' + html(context.passage) + "</blockquote>"
            : "") +
          '<div class="sci-material-links">' +
          (context.sourceUrl
            ? '<a target="_blank" rel="noopener noreferrer" href="' +
              html(context.sourceUrl) +
              '">' +
              html(context.sourceName) +
              "</a>"
            : "") +
          '<button type="button" data-leave>Quitar material</button></div></div>'
        : "") +
      '<div class="sci-log" role="log" aria-label="Mensajes del tutor" aria-live="polite"></div><div class="sci-prompts"></div><form class="sci-form"><label for="sci-question">Tu pregunta</label><textarea rows="2" maxlength="1200" id="sci-question" required placeholder="¿Qué significa glow?"></textarea><button type="submit">Enviar</button></form><p class="sci-state" data-hint aria-live="polite"></p></article></section>';
    const chat = root.querySelector(".sci-chat"),
      log = chat.querySelector(".sci-log"),
      input = chat.querySelector("textarea"),
      form = chat.querySelector("form"),
      mode = chat.querySelector(".sci-mode"),
      hint = chat.querySelector("[data-hint]");
    input.value = String(api.get(draftKey, "") || "").slice(0, 1200);
    input.oninput = () => api.set(draftKey, input.value);
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
                "</p>" +
                (m.role === "assistant" && context?.sourceUrl
                  ? '<a class="sci-citation" target="_blank" rel="noopener noreferrer" href="' +
                    html(context.sourceUrl) +
                    '">' +
                    html(context.sourceName) +
                    "</a>"
                  : "") +
                "</div>",
            )
            .join("")
        : '<div class="sci-bubble sci-assistant"><b>Lumi</b><p>' +
          html(
            context?.kind === "passage"
              ? "Lee el fragmento compartido. ¿Qué palabra o idea te gustaría explicar?"
              : context
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
        api.set("lessonContext", null);
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
    const anchor = anchorWord(context);
    const suggested = context
      ? [
          context.kind === "passage"
            ? "Dame una pista para leer"
            : "Ayúdame con el título",
          ...(Object.hasOwn(common, anchor)
            ? ["¿Qué significa " + anchor + "?"]
            : []),
          "Practicar mi explicación",
        ]
      : [
          "Explícame la bioluminiscencia",
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
      api.set(draftKey, "");
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
                context: context
                  ? {
                      kind: context.publishedAbstract
                        ? "published-abstract"
                        : context.kind,
                      title: context.title,
                      passage: context.passage || "",
                      sourceName: context.sourceName,
                    }
                  : "",
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
