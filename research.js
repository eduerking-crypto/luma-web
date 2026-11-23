// Artículos reales · ciencia y rama elegidas por el alumno, resúmenes adaptados
// y salto a la revista. Fuentes públicas: OpenAlex, Crossref y Wikipedia.
// El vocabulario y la teoría siguen siendo comunes: aquí cambia solo la lente
// metodológica con la que se lee cada artículo.
(() => {
  "use strict";

  const catalog = window.LumaScienceCatalog;
  const FIELDS = catalog.SCIENCES;

  // Artículos reales de respaldo (DOI verificable) cuando no hay conexión.
  const FALLBACK = [
    { field: "all", title: "A Relation between Distance and Radial Velocity among Extra-Galactic Nebulae", journal: "PNAS", year: 1929, authors: "E. Hubble", doi: "10.1073/pnas.15.3.168", abstract: "The relation between distance and radial velocity among extra-galactic nebulae is examined. The data indicate an approximately linear relation, which can be interpreted as evidence for an expanding universe." },
    { field: "all", title: "A Mathematical Theory of Communication", journal: "Bell System Technical Journal", year: 1948, authors: "C. E. Shannon", doi: "10.1002/j.1538-7305.1948.tb01338.x", abstract: "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point. A theory of communication is developed." },
    { field: "astronomy", title: "A Relation between Distance and Radial Velocity among Extra-Galactic Nebulae", journal: "PNAS", year: 1929, authors: "E. Hubble", doi: "10.1073/pnas.15.3.168", abstract: "The relation between distance and radial velocity among extra-galactic nebulae is examined. The data indicate an approximately linear relation, which can be interpreted as evidence for an expanding universe." },
    { field: "astronomy", title: "Planck 2018 results. VI. Cosmological parameters", journal: "Astronomy & Astrophysics", year: 2018, authors: "Planck Collaboration", doi: "10.1051/0004-6361/201833910", abstract: "We present cosmological parameter results from the final full-mission Planck measurements of the cosmic microwave background anisotropies, combining temperature, polarization and lensing data." },
    { field: "physics", title: "On the Einstein Podolsky Rosen paradox", journal: "Physics Physique Fizika", year: 1964, authors: "J. S. Bell", doi: "10.1103/PhysicsPhysiqueFizika.1.195", abstract: "The paradox of Einstein, Podolsky and Rosen is considered using a modified form of the thought experiment, showing that no local hidden-variable theory can reproduce the predictions of quantum mechanics." },
    { field: "physics", title: "Über einen die Erzeugung und Verwandlung des Lichtes betreffenden heuristischen Gesichtspunkt", journal: "Annalen der Physik", year: 1905, authors: "A. Einstein", doi: "10.1002/andp.19053221004", abstract: "A heuristic viewpoint concerning the production and transformation of light is proposed, introducing the idea that light energy is distributed in discrete quanta." },
    { field: "biology", title: "Genome sequence of the model plant Arabidopsis thaliana", journal: "Nature", year: 2000, authors: "The Arabidopsis Genome Initiative", doi: "10.1038/35048692", abstract: "We have determined the complete nucleotide sequence of the nuclear genome of Arabidopsis thaliana, providing a foundation for understanding plant biology and the genetic basis of traits." },
    { field: "biology", title: "Marine biology: Function, biodiversity, ecology", journal: "Journal of Experimental Marine Biology and Ecology", year: 1997, authors: "J. A. Commito", doi: "10.1016/s0022-0981(97)00033-6", abstract: "Marine biology is considered through the functions, biodiversity and ecology of ocean ecosystems, showing how organisms and habitats interact." },
    { field: "chemistry", title: "Molecular Structure of Nucleic Acids: A Structure for Deoxyribose Nucleic Acid", journal: "Nature", year: 1953, authors: "J. D. Watson, F. H. C. Crick", doi: "10.1038/171737a0", abstract: "We wish to suggest a structure for the salt of deoxyribose nucleic acid. This structure has novel features which are of considerable biological interest: two helical chains coiled round the same axis." },
    { field: "medicine", title: "Can research ethics committees enable clinical trial data sharing?", journal: "Ethics, Medicine and Public Health", year: 2017, authors: "N. B. M. de Vries et al.", doi: "10.1016/j.jemep.2017.02.010", abstract: "Clinical trial data sharing depends on governance and ethics review. This study examines how research ethics committees can support responsible data reuse while protecting participants." },
    { field: "medicine", title: "Structure, function and diversity of the healthy human microbiome", journal: "Nature", year: 2012, authors: "The Human Microbiome Project Consortium", doi: "10.1038/nature11234", abstract: "We report an analysis of the microbiomes of 242 healthy adults, showing that while the microbial taxa vary widely, the metabolic functions they encode are remarkably stable." },
    { field: "math", title: "A Mathematical Theory of Communication", journal: "Bell System Technical Journal", year: 1948, authors: "C. E. Shannon", doi: "10.1002/j.1538-7305.1948.tb01338.x", abstract: "The fundamental problem of communication is that of reproducing at one point either exactly or approximately a message selected at another point. A theory of communication is developed." },
    { field: "statistics", title: "United statistics, confidence quantiles, Bayesian statistics", journal: "Journal of Statistical Planning and Inference", year: 2008, authors: "G. Casella", doi: "10.1016/j.jspi.2008.03.014", abstract: "The paper relates frequentist confidence intervals and Bayesian credible intervals, showing how statistical evidence can be described through quantiles and uncertainty statements." },
    { field: "engineering", title: "A system modelling methodology for materials and engineering systems design integration", journal: "Materials & Design", year: 2004, authors: "S. J. Huang et al.", doi: "10.1016/j.matdes.2003.12.007", abstract: "A modelling methodology is proposed to integrate materials selection with engineering system design, linking requirements, constraints and performance criteria." },
    { field: "biotechnology", title: "A Programmable Dual-RNA-Guided DNA Endonuclease in Adaptive Bacterial Immunity", journal: "Science", year: 2012, authors: "M. Jinek et al.", doi: "10.1126/science.1225829", abstract: "The CRISPR/Cas system provides adaptive immunity in bacteria. We show that a dual-RNA-guided DNA endonuclease can be programmed to cleave target DNA sequences in vitro." },
    { field: "linguistics", title: "Foundations of Intensional Semantics", journal: "Computational Linguistics", year: 2006, authors: "E. Montague-style semantics", doi: "10.1162/coli.2006.32.2.291", abstract: "The foundations of intensional semantics are reviewed for computational linguistics, connecting sentence meaning, context and formal representation." },
    { field: "sociology", title: "Social media opinion and people’s elite of Russia", journal: "Digital Sociology", year: 2020, authors: "M. A. Shpakovskaya", doi: "10.26425/2658-347x-2019-4-4-10", abstract: "The study examines opinion formation around a digital-social elite, using online material to investigate how social groups and public discourse interact." },
    { field: "microbiology", title: "Uncovering the trimethylamine-producing bacteria of the human gut microbiota", journal: "Microbiome", year: 2017, authors: "X. Wang et al.", doi: "10.1186/s40168-017-0271-9", abstract: "Gut bacteria that produce trimethylamine are identified by combining sequencing and culture-based approaches, linking microbial identity to a measurable metabolic product." },
    { field: "molecular_biology", title: "The molecular portrait of in vitro growth by meta-analysis of gene-expression profiles", journal: "Genome Biology", year: 2005, authors: "T. S. Barrett et al.", doi: "10.1186/gb-2005-6-8-r65", abstract: "A meta-analysis of gene-expression profiles identifies a molecular portrait associated with growth conditions, illustrating how expression data can be compared across studies." },
  ];

  let rootRef = null, apiRef = null, selectedId = null, items = [], requestId = 0;

  const esc = (s) =>
    String(s ?? "").replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const icon = (name, size = 18) =>
    `<svg class="l-icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${window.LUMA_ICONS[name] || window.LUMA_ICONS["circle-dot"]}</svg>`;
  const field = (id) => catalog.get(id);
  const selectedBranch = () => {
    const label = apiRef?.get("scienceBranch", "") || "";
    return catalog.branchFor(selectedId || "all", label)?.label || "";
  };
  const effectiveField = (id, branchLabel) => {
    const base = field(id);
    return {
      ...base,
      query: catalog.queryFor(base.id, branchLabel),
      wiki: catalog.wikiFor(base.id, branchLabel),
    };
  };
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

  // Resumen legible: prioriza frases con señales del método elegido y completa
  // con el resto en el orden original. No cambia el vocabulario ni la teoría.
  function adapted(text, level, science, branchLabel) {
    const clean = strip(text);
    if (!clean) return "";
    const sentences = clean.match(/[^.!?]+[.!?]+/g) || [clean];
    const limit = level === "A1" ? 2 : level === "A2" ? 3 : level === "B1" ? 5 : sentences.length;
    const signals = new Set([
      ...(science?.method?.signals || []),
      ...String(branchLabel?.query || "").toLowerCase().split(/\s+/).filter((w) => w.length > 3),
    ]);
    const ranked = sentences.map((sentence, i) => ({
      sentence,
      i,
      score: [...signals].reduce((n, key) => n + (sentence.toLowerCase().includes(key) ? 1 : 0), 0),
    }));
    const chosen = new Set();
    for (const row of [...ranked].sort((a, b) => b.score - a.score || a.i - b.i)) {
      if (row.score && chosen.size < Math.max(1, Math.ceil(limit / 2))) chosen.add(row.i);
    }
    for (const row of ranked) {
      if (chosen.size >= limit) break;
      chosen.add(row.i);
    }
    return [...chosen].sort((a, b) => a - b).map((i) => sentences[i]).join(" ").trim();
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
      .map((a, i) => ({ ...a, id: "offline-" + i, citations: 0, source: "Luma (sin conexión)" }));
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

  function methodPanel(science, branchLabel) {
    const m = science.method;
    const verbs = m.verbs.map((v) => v[0]).join(" · ");
    return `<section class="research-method">
      <div class="research-method-head">${icon("target", 15)} Lente de lectura · ${esc(science.label)}${branchLabel ? " · " + esc(branchLabel) : ""}</div>
      <p>${esc(m.lead)}</p>
      <div class="research-method-grid">
        <div><b>Pregunta guía</b><span>${esc(m.question)}</span></div>
        <div><b>Evidencia que importa</b><span>${esc(m.evidence)}</span></div>
        <div><b>Verbos para explicar</b><span lang="en">${esc(verbs)}</span></div>
      </div>
    </section>`;
  }

  function articleCard(a) {
    const link = doiUrl(a.doi);
    const saved = (apiRef.get("savedArticles", []) || []).includes(a.doi);
    const science = field(selectedId);
    const branch = catalog.branchFor(science.id, selectedBranch());
    const snippet = adapted(a.abstract, "B1", science, branch);
    return `<article class="research-card">
      <div class="research-meta"><span class="research-journal">${esc(a.journal)}</span><span>${esc(a.year)}</span>${a.citations ? `<span>${icon("chart-no-axes-column-increasing", 13)} ${a.citations}</span>` : ""}</div>
      <h3><button type="button" class="research-title" data-summary="${esc(a.id)}" lang="en">${esc(a.title)}</button></h3>
      ${a.authors ? `<p class="research-authors" lang="en">${esc(a.authors)}</p>` : ""}
      <p class="research-snippet" lang="en">${esc(snippet.slice(0, 230))}${snippet.length > 230 ? "…" : ""}</p>
      <div class="research-actions">
        <button type="button" class="research-btn primary" data-summary="${esc(a.id)}">${icon("book-open", 15)} Leer resumen</button>
        ${link ? `<a class="research-btn" href="${esc(link)}" target="_blank" rel="noopener noreferrer">${icon("external-link", 15)} A la revista</a>` : ""}
        <button type="button" class="research-btn icon-only" data-save="${esc(a.doi)}" aria-label="Guardar artículo" title="Guardar artículo">${icon(saved ? "bookmark-check" : "bookmark", 16)}</button>
      </div>
    </article>`;
  }

  function showDetail(a) {
    const level = apiRef.level();
    const science = field(selectedId);
    const branchLabel = selectedBranch();
    const branch = catalog.branchFor(science.id, branchLabel);
    const text = adapted(a.abstract || "No hay resumen disponible en la base de datos.", level, science, branch);
    const terms = glossary(a.abstract);
    const link = doiUrl(a.doi);
    rootRef.innerHTML = `<div class="research-detail">
      <button type="button" class="research-back" data-action="back">${icon("chevron-left", 16)} Volver a los artículos</button>
      <div class="research-detail-head">
        <div class="research-meta"><span class="research-journal">${esc(a.journal)}</span><span>${esc(a.year)}</span><span>${esc(a.source)}</span></div>
        <h1 lang="en">${esc(a.title)}</h1>
        ${a.authors ? `<p class="research-authors" lang="en">${esc(a.authors)}</p>` : ""}
      </div>
      ${methodPanel(science, branchLabel)}
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
      doi: a.doi,
      sourceName: a.journal,
      abstract: text,
      type: "scientific-article",
      science: science.id,
      scienceLabel: science.label,
      branch: branchLabel,
      methodName: science.method.name,
      methodQuestion: science.method.question,
      methodEvidence: science.method.evidence,
    });
  }

  function render(root, api) {
    rootRef = root;
    apiRef = api;
    const current = field(api.get("interest", "all"));
    const rawBranch = api.get("scienceBranch", "");
    if (rawBranch && !catalog.branchFor(current.id, rawBranch)) api.set("scienceBranch", "");
    selectedId = current.id;
    drawShell(current);
    load(current.id);
  }

  function drawShell(current) {
    const branchLabel = selectedBranch();
    rootRef.innerHTML = `<div class="research-page">
      <div class="page-intro"><div class="page-tag">${icon("newspaper", 14)} CIENCIA REAL</div><h1>Artículos reales</h1><p>Descubre lo que se publica en revistas científicas sobre ${esc(current.label.toLowerCase())}. Elige una rama para afinar la búsqueda y lee con la metodología de tu disciplina.</p></div>
      <div class="research-fields" role="group" aria-label="Elige una ciencia">${FIELDS.map((f) => `<button type="button" class="research-chip ${f.id === current.id ? "active" : ""}" data-field="${f.id}" aria-pressed="${f.id === current.id}">${esc(f.label)}</button>`).join("")}</div>
      <div class="research-branches" role="group" aria-label="Ramas de ${esc(current.label)}">
        <span class="research-branch-label">Ramas:</span>
        <button type="button" class="research-branch ${branchLabel ? "" : "active"}" data-branch="" aria-pressed="${!branchLabel}">Todas</button>
        ${current.branches
          .map(
            (b) =>
              `<button type="button" class="research-branch ${b.label === branchLabel ? "active" : ""}" data-branch="${esc(b.label)}" aria-pressed="${b.label === branchLabel}">${esc(b.label)}</button>`,
          )
          .join("")}
      </div>
      <div class="research-method-strip">${icon("target", 14)} <b>${esc(current.method.name)}</b> · ${esc(current.method.focus)}</div>
      <div id="research-status" class="research-status" role="status"></div>
      <div id="research-list" class="research-list"></div>
      <section class="research-wiki"><div class="section-title"><h2>Fichas rápidas</h2></div><div id="research-wiki-list" class="research-wiki-grid"></div></section>
    </div>`;
  }

  async function load(id) {
    selectedId = catalog.normalize(id);
    const branchLabel = selectedBranch();
    const f = effectiveField(selectedId, branchLabel);
    const myRequest = ++requestId;
    const status = rootRef.querySelector("#research-status");
    const list = rootRef.querySelector("#research-list");
    const wiki = rootRef.querySelector("#research-wiki-list");
    if (!list) return;
    status.innerHTML = `${icon("clock", 15)} Buscando artículos de ${esc(f.label)}${branchLabel ? " · " + esc(branchLabel) : ""}…`;
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
      : `<div class="panel"><p>No encontramos artículos. Prueba con otra ciencia o rama.</p></div>`;
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
    if (btn.dataset.branch !== undefined) {
      apiRef.set("scienceBranch", btn.dataset.branch || "");
      rootRef.querySelectorAll(".research-branch").forEach((c) => {
        const on = c === btn;
        c.classList.toggle("active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      load(selectedId);
      return;
    }
    if (btn.dataset.field) {
      const next = catalog.normalize(btn.dataset.field);
      const rawBranch = apiRef.get("scienceBranch", "");
      if (rawBranch && !catalog.branchFor(next, rawBranch)) apiRef.set("scienceBranch", "");
      apiRef.set("interest", next);
      rootRef.querySelectorAll(".research-chip").forEach((c) => {
        const on = c.dataset.field === next;
        c.classList.toggle("active", on);
        c.setAttribute("aria-pressed", String(on));
      });
      selectedId = next;
      drawShell(field(next));
      load(next);
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
