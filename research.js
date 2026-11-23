// Artículos reales · ciencia elegida por el alumno, resúmenes y salto a la revista.
// Fuentes públicas: OpenAlex, Crossref y Wikipedia (todas con CORS).
(() => {
  "use strict";

  const FIELDS = [
    { id: "all", label: "Todas", query: "science discovery research", wiki: "Science" },
    { id: "ocean", label: "Biología marina", query: "marine biology ocean ecosystem", wiki: "Marine biology" },
    { id: "space", label: "Astronomía", query: "astronomy galaxy telescope astrophysics", wiki: "Astronomy" },
    { id: "plants", label: "Botánica", query: "plant biology photosynthesis botany", wiki: "Botany" },
    { id: "physics", label: "Física", query: "physics quantum mechanics particle", wiki: "Physics" },
    { id: "chemistry", label: "Química", query: "chemistry molecular reaction materials", wiki: "Chemistry" },
    { id: "math", label: "Matemáticas", query: "mathematics statistics algorithm proof", wiki: "Mathematics" },
    { id: "earth", label: "Ciencias de la Tierra", query: "geology climate earth atmosphere", wiki: "Earth science" },
  ];

  // Artículos reales de respaldo (con DOI verificable) cuando no hay conexión.
  const FALLBACK = [
    { field: "space", title: "A Relation between Distance and Radial Velocity among Extra-Galactic Nebulae", journal: "PNAS", year: 1929, authors: "E. Hubble", doi: "10.1073/pnas.15.3.168", abstract: "The relation between distance and radial velocity among extra-galactic nebulae is examined. The data indicate an approximately linear relation, which can be interpreted as evidence for an expanding universe." },
    { field: "space", title: "Planck 2018 results. VI. Cosmological parameters", journal: "Astronomy & Astrophysics", year: 2018, authors: "Planck Collaboration", doi: "10.1051/0004-6361/201833910", abstract: "We present cosmological parameter results from the final full-mission Planck measurements of the cosmic microwave background anisotropies, combining temperature, polarization and lensing data." },
    { field: "physics", title: "On the Einstein Podolsky Rosen paradox", journal: "Physics Physique Fizika", year: 1964, authors: "J. S. Bell", doi: "10.1103/PhysicsPhysiqueFizika.1.195", abstract: "The paradox of Einstein, Podolsky and Rosen is considered using a modified form of the thought experiment, showing that no local hidden-variable theory can reproduce the predictions of quantum mechanics." },
    { field: "physics", title: "Über einen die Erzeugung und Verwandlung des Lichtes betreffenden heuristischen Gesichtspunkt", journal: "Annalen der Physik", year: 1905, authors: "A. Einstein", doi: "10.1002/andp.19053221004", abstract: "A heuristic viewpoint concerning the production and transformation of light is proposed, introducing the idea that light energy is distributed in discrete quanta." },
    { field: "chemistry", title: "Molecular Structure of Nucleic Acids: A Structure for Deoxyribose Nucleic Acid", journal: "Nature", year: 1953, authors: "J. D. Watson, F. H. C. Crick", doi: "10.1038/171737a0", abstract: "We wish to suggest a structure for the salt of deoxyribose nucleic acid. This structure has novel features which are of considerable biological interest: two helical chains coiled round the same axis." },
    { field: "plants", title: "Genome sequence of the model plant Arabidopsis thaliana", journal: "Nature", year: 2000, authors: "The Arabidopsis Genome Initiative", doi: "10.1038/35048692", abstract: "We have determined the complete nucleotide sequence of the nuclear genome of Arabidopsis thaliana, providing a foundation for understanding plant biology and the genetic basis of traits." },
    { field: "earth", title: "Climate and atmospheric history of the past 420,000 years from the Vostok ice core", journal: "Nature", year: 1999, authors: "J. R. Petit et al.", doi: "10.1038/43699", abstract: "A detailed record of past climate and atmospheric composition has been obtained from the Vostok ice core in Antarctica, covering the last four glacial-interglacial cycles." },
    { field: "math", title: "A Mathematical Theory of Communication", journal: "Bell System Technical Journal", year: 1948, authors: "C. E. Shannon", doi: "10.1002/j.1538-7305.1948.tb01338.x", abstract: "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point. A theory of communication is developed." },
    { field: "ocean", title: "Structure, function and diversity of the healthy human microbiome", journal: "Nature", year: 2012, authors: "The Human Microbiome Project Consortium", doi: "10.1038/nature11234", abstract: "We report an analysis of the microbiomes of 242 healthy adults, showing that while the microbial taxa vary widely, the metabolic functions they encode are remarkably stable." },
    { field: "ocean", title: "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity", journal: "Science", year: 2012, authors: "M. Jinek et al.", doi: "10.1126/science.1225829", abstract: "The CRISPR/Cas system provides adaptive immunity in bacteria. We show that a dual-RNA-guided DNA endonuclease can be programmed to cleave target DNA sequences in vitro." },
  ];

  let rootRef = null, apiRef = null, selectedId = null, items = [], requestId = 0;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const icon = (name, size = 18) =>
    `<svg class="l-icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${window.LUMA_ICONS[name] || window.LUMA_ICONS["circle-dot"]}</svg>`;
  const field = (id) => FIELDS.find((f) => f.id === id) || FIELDS[0];
  const strip = (s) => String(s || "").replace(/<[^>]*>/g, "").replace(/\s+/g, " ").trim();

  function abstractFromInverted(inv) {
    if (!inv || typeof inv !== "object") return "";
    const positions = [];
    for (const [word, indexes] of Object.entries(inv))
      for (const i of indexes) positions[i] = word;
    return positions.filter(Boolean).join(" ");
  }

  function doiUrl(doi) {
    const clean = String(doi || "").replace(/^https?:\/\/(dx\.)?doi\.org\//i, "").trim();
    return clean ? "https://doi.org/" + clean : "";
  }

  function authorsLabel(list) {
    if (!Array.isArray(list) || !list.length) return "";
    const names = list.slice(0, 3).map((a) => a.name || [a.given, a.family].filter(Boolean).join(" "));
    return names.filter(Boolean).join(", ") + (list.length > 3 ? " et al." : "");
  }

  function glossary(text) {
    const found = [];
    const extra = window.LumaVocabularyExtra || {};
    const lower = String(text || "").toLowerCase();
    for (const words of Object.values(extra)) {
      for (const [word, meaning, example] of words) {
        if (word.length > 3 && lower.includes(word.toLowerCase()) && !found.some((f) => f.word === word))
          found.push({ word, meaning, example });
        if (found.length >= 8) break;
      }
      if (found.length >= 8) break;
    }
    return found;
  }

  // Resumen legible: recorta a las primeras frases completas según el nivel.
  function adapted(text, level) {
    const clean = strip(text);
    const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
    const limit = level === "A1" ? 2 : level === "A2" ? 3 : level === "B1" ? 5 : sentences.length;
    return sentences.slice(0, limit).join(" ").trim();
  }

  async function fetchJSON(url, timeout = 14000) {
    const r = await fetch(url, { signal: AbortSignal.timeout(timeout) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    return r.json();
  }

  async function fetchArticles(f) {
    try {
      const url =
        "https://api.openalex.org/works?search=" +
        encodeURIComponent(f.query) +
        "&filter=type:article&per-page=8&select=id,doi,title,publication_year,primary_location,abstract_inverted_index,cited_by_count,authorships";
      const data = await fetchJSON(url);
      const mapped = (data.results || [])
        .map((w) => ({
          id: w.id || w.doi,
          title: strip(w.title),
          journal: w.primary_location?.source?.display_name || "Revista científica",
          year: w.publication_year || "",
          authors: authorsLabel(w.authorships),
          doi: (w.doi || "").replace(/^https?:\/\/(dx\.)?doi\.org\//i, ""),
          abstract: abstractFromInverted(w.abstract_inverted_index),
          citations: w.cited_by_count || 0,
          source: "OpenAlex",
        }))
        .filter((a) => a.title && a.doi);
      // Primero artículos con resumen real; si faltan, completamos con el resto.
      const list = [...mapped.filter((a) => a.abstract), ...mapped.filter((a) => !a.abstract)].slice(0, 8);
      if (list.length) return { list, provider: "OpenAlex" };
    } catch {}

    try {
      const url =
        "https://api.crossref.org/works?query.bibliographic=" +
        encodeURIComponent(f.query) +
        "&rows=8&select=DOI,title,container-title,published,abstract,author,type";
      const data = await fetchJSON(url);
      const mapped = (data.message?.items || [])
        .filter((w) => w.type === "journal-article" && w.DOI)
        .map((w) => ({
          id: w.DOI,
          title: strip((w.title || [])[0]),
          journal: strip((w["container-title"] || [])[0]) || "Revista científica",
          year: w.published?.["date-parts"]?.[0]?.[0] || "",
          authors: authorsLabel(w.author),
          doi: w.DOI,
          abstract: strip(w.abstract),
          citations: 0,
          source: "Crossref",
        }))
        .filter((a) => a.title);
      const list = [...mapped.filter((a) => a.abstract), ...mapped.filter((a) => !a.abstract)].slice(0, 8);
      if (list.length) return { list, provider: "Crossref" };
    } catch {}

    const list = FALLBACK.filter((a) => f.id === "all" || a.field === f.id)
      .concat(f.id === "all" ? [] : FALLBACK.filter((a) => a.field !== f.id))
      .slice(0, 8)
      .map((a, i) => ({ ...a, id: "offline-" + i, citations: 0, source: "Luma" }));
    return { list, provider: "Luma (sin conexión)" };
  }

  async function fetchWiki(f) {
    try {
      const url =
        "https://en.wikipedia.org/w/api.php?action=query&generator=search&gsrsearch=" +
        encodeURIComponent(f.wiki) +
        "&gsrlimit=4&prop=extracts&exintro=1&explaintext=1&exsentences=2&format=json&origin=*";
      const data = await fetchJSON(url, 10000);
      return Object.values(data.query?.pages || {}).map((p) => ({
        title: p.title,
        extract: strip(p.extract),
        url: "https://en.wikipedia.org/?curid=" + p.pageid,
      }));
    } catch {
      return [];
    }
  }

  function articleCard(a) {
    const link = doiUrl(a.doi);
    const saved = (apiRef.get("savedArticles", []) || []).includes(a.doi);
    return `<article class="research-card">
      <div class="research-meta"><span class="research-journal">${esc(a.journal)}</span><span>${esc(a.year)}</span>${a.citations ? `<span>${icon("chart-no-axes-column-increasing", 13)} ${a.citations}</span>` : ""}</div>
      <h3><button type="button" class="research-title" data-summary="${esc(a.id)}" lang="en">${esc(a.title)}</button></h3>
      ${a.authors ? `<p class="research-authors" lang="en">${esc(a.authors)}</p>` : ""}
      <p class="research-snippet" lang="en">${esc(adapted(a.abstract, "B1").slice(0, 230))}${a.abstract.length > 230 ? "…" : ""}</p>
      <div class="research-actions">
        <button type="button" class="research-btn primary" data-summary="${esc(a.id)}">${icon("book-open", 15)} Leer resumen</button>
        ${link ? `<a class="research-btn" href="${esc(link)}" target="_blank" rel="noopener noreferrer">${icon("external-link", 15)} A la revista</a>` : ""}
        <button type="button" class="research-btn icon-only" data-save="${esc(a.doi)}" aria-label="Guardar artículo" title="Guardar artículo">${icon(saved ? "bookmark-check" : "bookmark", 16)}</button>
      </div>
    </article>`;
  }

  function showDetail(a) {
    const level = apiRef.level();
    const text = adapted(a.abstract || "No hay resumen disponible en la base de datos.", level);
    const terms = glossary(a.abstract);
    const link = doiUrl(a.doi);
    rootRef.innerHTML = `<div class="research-detail">
      <button type="button" class="research-back" data-action="back">${icon("chevron-left", 16)} Volver a los artículos</button>
      <div class="research-detail-head">
        <div class="research-meta"><span class="research-journal">${esc(a.journal)}</span><span>${esc(a.year)}</span><span>${esc(a.source)}</span></div>
        <h1 lang="en">${esc(a.title)}</h1>
        ${a.authors ? `<p class="research-authors" lang="en">${esc(a.authors)}</p>` : ""}
      </div>
      <section class="research-paper">
        <div class="research-paper-head"><h2>Resumen adaptado · ${esc(level)}</h2><span>${icon("sparkles", 15)} Luma</span></div>
        <p lang="en" class="research-abstract">${esc(text)}</p>
        ${a.abstract && text !== strip(a.abstract) ? `<details class="research-full"><summary>Ver el resumen completo en inglés</summary><p lang="en">${esc(strip(a.abstract))}</p></details>` : ""}
      </section>
      ${terms.length ? `<section class="research-glossary"><h2>${icon("languages", 16)} Glosario de este artículo</h2><div class="research-terms">${terms.map((t) => `<div class="research-term"><b lang="en">${esc(t.word)}</b><span>${esc(t.meaning)}</span><small lang="en">${esc(t.example)}</small></div>`).join("")}</div></section>` : ""}
      <div class="research-detail-actions">
        ${link ? `<a class="solid-button" href="${esc(link)}" target="_blank" rel="noopener noreferrer">${icon("external-link", 16)} Leer en la revista</a>` : ""}
        <button type="button" class="outline-button" data-action="ask">${icon("message-circle", 16)} Preguntar a Lumi</button>
        <button type="button" class="outline-button" data-action="back">${icon("chevron-left", 16)} Volver</button>
      </div>
    </div>`;
    apiRef.set("scienceContext", {
      title: a.title,
      journal: a.journal,
      abstract: text,
      type: "scientific-article",
    });
  }

  function render(root, api) {
    rootRef = root;
    apiRef = api;
    const current = field(api.get("interest", "all"));
    selectedId = current.id;
    drawShell(current);
    load(current.id);
  }

  function drawShell(current) {
    rootRef.innerHTML = `<div class="research-page">
      <div class="page-intro"><div class="page-tag">${icon("newspaper", 14)} CIENCIA REAL</div><h1>Artículos reales</h1><p>Descubre lo que se publica en revistas científicas sobre la ciencia que te gusta. Lee el resumen y salta a la fuente original.</p></div>
      <div class="research-fields" role="group" aria-label="Elige una ciencia">${FIELDS.map((f) => `<button type="button" class="research-chip ${f.id === current.id ? "active" : ""}" data-field="${f.id}" aria-pressed="${f.id === current.id}">${esc(f.label)}</button>`).join("")}</div>
      <div id="research-status" class="research-status" role="status"></div>
      <div id="research-list" class="research-list"></div>
      <section class="research-wiki"><div class="section-title"><h2>Fichas rápidas</h2></div><div id="research-wiki-list" class="research-wiki-grid"></div></section>
    </div>`;
  }

  async function load(id) {
    const f = field(id);
    selectedId = id;
    const myRequest = ++requestId;
    const status = rootRef.querySelector("#research-status");
    const list = rootRef.querySelector("#research-list");
    const wiki = rootRef.querySelector("#research-wiki-list");
    if (!list) return;
    status.innerHTML = `${icon("clock", 15)} Buscando artículos de ${esc(f.label)}…`;
    status.className = "research-status loading";
    list.innerHTML = "";
    if (wiki) wiki.innerHTML = "";

    const [result, quick] = await Promise.all([fetchArticles(f), fetchWiki(f)]);
    if (myRequest !== requestId || !rootRef.querySelector("#research-list")) return;
    items = result.list;
    status.innerHTML = `${icon("check", 14)} ${items.length} artículos · fuente: ${esc(result.provider)}`;
    status.className = "research-status";
    list.innerHTML = items.length
      ? items.map(articleCard).join("")
      : `<div class="panel"><p>No encontramos artículos. Prueba con otra ciencia.</p></div>`;
    if (wiki)
      wiki.innerHTML = quick.length
        ? quick.map((q) => `<a class="research-wiki-card" href="${esc(q.url)}" target="_blank" rel="noopener noreferrer"><b>${esc(q.title)}</b><span>${esc(q.extract)}</span><small>Wikipedia ↗</small></a>`).join("")
        : "";
  }

  function dispose() {
    requestId++;
    rootRef = null;
  }

  document.addEventListener("click", (e) => {
    if (!rootRef) return;
    const btn = e.target.closest("button");
    if (!btn) return;
    if (btn.dataset.field) {
      apiRef.set("interest", btn.dataset.field);
      rootRef.querySelectorAll(".research-chip").forEach((c) => {
        const on = c.dataset.field === btn.dataset.field;
        c.classList.toggle("active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      load(btn.dataset.field);
      return;
    }
    if (btn.dataset.summary) {
      const a = items.find((x) => String(x.id) === btn.dataset.summary);
      if (a) showDetail(a);
      return;
    }
    if (btn.dataset.save) {
      const saved = apiRef.get("savedArticles", []) || [];
      const i = saved.indexOf(btn.dataset.save);
      if (i >= 0) saved.splice(i, 1);
      else saved.push(btn.dataset.save);
      apiRef.set("savedArticles", saved);
      btn.innerHTML = icon(i >= 0 ? "bookmark" : "bookmark-check", 16);
      apiRef.toast(i >= 0 ? "Artículo eliminado de guardados." : "Artículo guardado.");
      return;
    }
    if (btn.dataset.action === "back") {
      drawShell(field(selectedId));
      load(selectedId);
      return;
    }
    if (btn.dataset.action === "ask") {
      apiRef.go("tutor");
    }
  });

  window.LumaResearch = Object.freeze({ render, dispose, FIELDS });
})();
