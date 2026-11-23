// Expanded Vocabulary Module for Luma
// Integrates with external APIs for dynamic vocabulary enrichment
(() => {
  "use strict";

  const api = window.LumaVocabAPI;
  const vocabExtra = window.LumaVocabularyExtra;
  const verbData = window.LumaVerbDataExtended || window.LumaVerbData;

  // Vocabulary state
  let currentCategory = "all";
  let currentView = "browse"; // browse, search, category, api-enriched
  let searchQuery = "";
  let enrichedCache = new Map();
  let isLoading = false;

  // DOM elements
  let root = null;
  let apiRef = null;

  // Categories from vocab-extra.js
  const LOCAL_CATEGORIES = Object.keys(vocabExtra);

  // Scientific categories from API
  const SCIENTIFIC_CATEGORIES = api.categories || [];

  function escapeHtml(text) {
    return String(text ?? "").replace(/[&<>"']/g, c => ({
      "&": "\u0026", "<": "\u003C", ">": "\u003E", '"': "\u0022", "'": "\u0027"
    })[c]);
  }

  function icon(name, size = 20) {
    return `<svg class="l-icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${window.LUMA_ICONS[name] || window.LUMA_ICONS["circle-dot"]}</svg>`;
  }

  function renderVocabCard(entry, showActions = true) {
    const { word, meaning, example, pos, source = "local", category = "" } = entry;
    const isVerb = verbData.some(v => v.base === word.toLowerCase());
    const badge = isVerb ? `<span class="vocab-badge verb">${icon("git-branch", 12)} Verbo</span>` : 
                    pos ? `<span class="vocab-badge">${escapeHtml(pos)}</span>` : "";
    const sourceBadge = source !== "local" ? `<span class="vocab-source">${escapeHtml(source)}</span>` : "";
    const pic = window.LumaVocabPictures?.picture(word, category) || {
      emoji: "🔤",
      icon: "circle-dot",
      iconColor: "",
      iconMarkup: "🔤",
      phonetic: "",
      html: "",
    };

    return `<article class="vocab-card ${source !== "local" ? "enriched" : ""}" data-word="${escapeHtml(word)}">
      <div class="vocab-head">
        <div class="vocab-word-block">
          <div class="vocab-wordline">
            <span class="vocab-picture" aria-hidden="true">${pic.iconMarkup || escapeHtml(pic.emoji)}</span>
            <div class="vocab-wordtext">
              <h3 lang="en">${escapeHtml(word)}${badge}${sourceBadge}</h3>
              ${pic.phonetic ? `<span class="vocab-phonetic" lang="en">${escapeHtml(pic.phonetic)}</span>` : ""}
            </div>
          </div>
          <p class="vocab-meaning">${escapeHtml(meaning)}</p>
        </div>
        ${showActions ? `
        <div class="vocab-actions">
          <button type="button" class="iconbtn vocab-audio" data-word="${escapeHtml(word)}" aria-label="Escuchar ${word}">${icon("volume-2", 16)}</button>
          <button type="button" class="iconbtn vocab-expand" data-word="${escapeHtml(word)}" aria-label="Expandir ${word}">${icon("chevron-down", 16)}</button>
        </div>` : ""}
      </div>
      ${example ? `<p class="vocab-example" lang="en">${escapeHtml(example)}</p>` : ""}
      <div class="vocab-expanded" hidden></div>
    </article>`;
  }

  function renderCategoryTabs(activeCategory) {
    const allCats = [
      { id: "all", name: "Todo", icon: "layers" },
      { id: "local", name: "Luma", icon: "book-open" },
      { id: "scientific", name: "Ciencia", icon: "flask-conical" },
      ...LOCAL_CATEGORIES.map(c => ({ id: c, name: c, icon: "tag" })),
      ...SCIENTIFIC_CATEGORIES.map(c => ({ id: "sci-" + c, name: c.replace("_", " "), icon: "microscope" }))
    ];
    return allCats.map(cat => 
      `<button type="button" class="cat-tab ${cat.id === activeCategory ? "active" : ""}" 
        data-category="${cat.id}" aria-pressed="${cat.id === activeCategory}">
        ${icon(cat.icon, 14)} ${escapeHtml(cat.name)}
      </button>`
    ).join("");
  }

  function renderSearchBar() {
    return `<div class="vocab-search">
      <label class="search-wrapper">
        ${icon("search", 18)}
        <input type="search" id="vocab-search-input" placeholder="Buscar palabra, verbo o concepto..." autocomplete="off" aria-label="Buscar vocabulario">
        <button type="button" class="iconbtn search-clear" aria-label="Limpiar búsqueda" hidden>${icon("x", 16)}</button>
      </label>
      <button type="button" class="vocab-api-btn" id="vocab-enrich-btn" aria-label="Enriquecer con APIs externas">
        ${icon("wifi", 16)} Ampliar
      </button>
    </div>`;
  }

  function renderResults(words, title = "Resultados") {
    if (!words.length) {
      return `<div class="vocab-empty">${icon("book-marked", 48)}<h2>Sin resultados</h2><p>Prueba con otro término o usa el botón "Ampliar" para buscar en APIs externas.</p></div>`;
    }
    return `<section class="vocab-section">
      <h2>${escapeHtml(title)} <span class="count">${words.length}</span></h2>
      <div class="vocab-grid">${words.map(renderVocabCard).join("")}</div>
    </section>`;
  }

  // Get local vocabulary entries
  function getLocalEntries(category) {
    if (category === "all" || category === "local") {
      const entries = [];
      for (const [cat, words] of Object.entries(vocabExtra)) {
        if (category === "all" || cat === category) {
          entries.push(...words.map(([word, meaning, example, pos]) => ({
            word, meaning, example, pos, category: cat, source: "local"
          })));
        }
      }
      return entries;
    }
    if (vocabExtra[category]) {
      return vocabExtra[category].map(([word, meaning, example, pos]) => ({
        word, meaning, example, pos, category, source: "local"
      }));
    }
    return [];
  }

  // Search local vocabulary
  function searchLocal(query) {
    const q = query.toLowerCase().trim();
    if (!q) return getLocalEntries("all");
    const entries = getLocalEntries("all");
    return entries.filter(e => 
      e.word.toLowerCase().includes(q) ||
      e.meaning.toLowerCase().includes(q) ||
      (e.example && e.example.toLowerCase().includes(q))
    );
  }

  // Enrich a word with API data
  async function enrichWord(word) {
    const cacheKey = `enrich:${word}`;
    if (enrichedCache.has(cacheKey)) return enrichedCache.get(cacheKey);

    try {
      const result = await api.search(word, { limit: 15, includeRelated: true });
      const enriched = {
        word: result.query,
        definitions: result.exact?.meanings?.flatMap(m => 
          m.definitions?.slice(0, 3).map(d => ({
            pos: m.partOfSpeech,
            definition: d.definition,
            example: d.example
          })) || []
        ) || [],
        synonyms: result.synonyms || [],
        related: result.related || [],
        scientificContext: result.scientificContext || [],
        source: "api"
      };
      enrichedCache.set(cacheKey, enriched);
      return enriched;
    } catch (error) {
      console.warn("Enrichment failed for", word, error);
      return { word, error: error.message, source: "api" };
    }
  }

  // Enrich multiple words
  async function enrichBatch(words, onProgress) {
    isLoading = true;
    const results = {};
    for (let i = 0; i < words.length; i++) {
      results[words[i]] = await enrichWord(words[i]);
      if (onProgress) onProgress(i + 1, words.length);
      await new Promise(r => setTimeout(r, 100)); // Rate limiting
    }
    isLoading = false;
    return results;
  }

  // Get vocabulary by scientific category
  async function getScientificCategory(category, onProgress) {
    const cacheKey = `scicat:${category}`;
    if (enrichedCache.has(cacheKey)) return enrichedCache.get(cacheKey);

    try {
      const result = await api.getByCategory(category, { 
        includeSynonyms: true, 
        includeAntonyms: true,
        includeTriggers: true,
        includeDefinitions: true,
        includeScientificContext: true,
        discipline: category.replace("_", " ")
      });
      enrichedCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.warn("Scientific category failed", category, error);
      return { error: error.message };
    }
  }

  // Render expanded vocabulary details
  function renderExpandedDetails(word, data) {
    if (!data || data.error) {
      return `<p class="vocab-error">No se pudo cargar información adicional${data?.error ? ": " + escapeHtml(data.error) : ""}.</p>`;
    }

    let html = `<div class="vocab-detail">`;

    if (data.definitions?.length) {
      html += `<div class="detail-block">
        <h4>${icon("book-open", 14)} Definiciones</h4>
        <dl>${data.definitions.map(d => `
          <dt>${escapeHtml(d.pos || "definición")}</dt>
          <dd>${escapeHtml(d.definition)}${d.example ? ` <em lang="en">"${escapeHtml(d.example)}"</em>` : ""}</dd>
        `).join("")}</dl>
      </div>`;
    }

    if (data.synonyms?.length) {
      html += `<div class="detail-block">
        <h4>${icon("link", 14)} Sinónimos</h4>
        <div class="word-chips">${data.synonyms.slice(0, 12).map(s => 
          `<button type="button" class="word-chip" data-word="${escapeHtml(s)}">${escapeHtml(s)}</button>`
        ).join("")}</div>
      </div>`;
    }

    if (data.antonyms?.length) {
      html += `<div class="detail-block">
        <h4>${icon("minus-circle", 14)} Antónimos</h4>
        <div class="word-chips">${data.antonyms.slice(0, 8).map(a => 
          `<button type="button" class="word-chip" data-word="${escapeHtml(a)}">${escapeHtml(a)}</button>`
        ).join("")}</div>
      </div>`;
    }

    if (data.triggers?.length) {
      html += `<div class="detail-block">
        <h4>${icon("zap", 14)} Palabras asociadas</h4>
        <div class="word-chips">${data.triggers.slice(0, 12).map(t => 
          `<button type="button" class="word-chip" data-word="${escapeHtml(t)}">${escapeHtml(t)}</button>`
        ).join("")}</div>
      </div>`;
    }

    if (data.related?.length) {
      html += `<div class="detail-block">
        <h4>${icon("git-branch", 14)} Relacionadas</h4>
        <div class="word-chips">${data.related.slice(0, 12).map(r => 
          `<button type="button" class="word-chip" data-word="${escapeHtml(r)}">${escapeHtml(r)}</button>`
        ).join("")}</div>
      </div>`;
    }

    if (data.scientificContext?.length) {
      html += `<div class="detail-block">
        <h4>${icon("flask-conical", 14)} Contexto científico</h4>
        ${data.scientificContext.map(ctx => `
          <div class="sci-context">
            <p>${escapeHtml(ctx.context)}</p>
            <cite>— ${escapeHtml(ctx.source)}${ctx.year ? ` (${ctx.year})` : ""}${ctx.doi ? ` · DOI: ${ctx.doi}` : ""}</cite>
          </div>
        `).join("")}</div>`;
    }

    if (data.conceptnet) {
      const cn = data.conceptnet;
      if (cn.edges?.length) {
        html += `<div class="detail-block">
          <h4>${icon("network", 14)} Red semántica (ConceptNet)</h4>
          <div class="cn-relations">${cn.edges.slice(0, 10).map(e => 
            `<span class="cn-edge" title="${escapeHtml(e.rel?.label || e.rel?.['@id'])}">${escapeHtml(e.end?.label || e.end?.['@id'])}</span>`
          ).join("")}</div>
        </div>`;
      }
    }

    html += `</div>`;
    return html;
  }

  // Main render function
  function render(rootEl, apiRef_) {
    root = rootEl;
    apiRef = apiRef_;
    
    root.innerHTML = `<section class="vocab-panel">
      <header class="vocab-header">
        <h1>Vocabulario</h1>
        <p>Explora, busca y amplía tu léxico con definiciones, sinónimos, contexto científico y APIs externas.</p>
      </header>
      
      <div class="vocab-toolbar">
        <div class="vocab-categories" role="tablist" aria-label="Categorías de vocabulario">
          ${renderCategoryTabs(currentCategory)}
        </div>
      </div>
      
      ${renderSearchBar()}
      
      <div id="vocab-results" class="vocab-results">
        ${renderResults(getLocalEntries(currentCategory))}
      </div>
      
      <div id="vocab-loading" class="vocab-loading" hidden>
        ${icon("loader", 32)} <span>Cargando...</span>
      </div>
    </section>`;

    bindEvents();
    updateResults();
  }

  function bindEvents() {
    // Category tabs
    root.querySelectorAll(".cat-tab").forEach(btn => {
      btn.onclick = () => {
        currentCategory = btn.dataset.category;
        currentView = "browse";
        searchQuery = "";
        root.querySelector("#vocab-search-input").value = "";
        root.querySelectorAll(".cat-tab").forEach(b => {
          b.classList.toggle("active", b.dataset.category === currentCategory);
          b.setAttribute("aria-pressed", b.dataset.category === currentCategory);
        });
        updateResults();
      };
    });

    // Search input
    const searchInput = root.querySelector("#vocab-search-input");
    const clearBtn = root.querySelector(".search-clear");
    
    searchInput.addEventListener("input", (e) => {
      searchQuery = e.target.value;
      clearBtn.hidden = !searchQuery;
      currentView = "search";
      updateResults();
    });

    clearBtn.onclick = () => {
      searchInput.value = "";
      searchQuery = "";
      clearBtn.hidden = true;
      currentView = "browse";
      updateResults();
      searchInput.focus();
    };

    // Enrich button
    root.querySelector("#vocab-enrich-btn").onclick = async () => {
      if (isLoading) return;
      const words = getVisibleWords();
      if (!words.length) return;
      
      const loading = root.querySelector("#vocab-loading");
      loading.hidden = false;
      
      try {
        await enrichBatch(words.slice(0, 20), (done, total) => {
          loading.querySelector("span").textContent = `Enriqueciendo ${done}/${total}...`;
        });
        currentView = "api-enriched";
        updateResults();
      } catch (error) {
        apiRef.toast("Error al enriquecer: " + error.message);
      } finally {
        loading.hidden = true;
      }
    };

    // Expand/collapse cards
    root.addEventListener("click", async (e) => {
      const expandBtn = e.target.closest(".vocab-expand");
      if (expandBtn) {
        const card = expandBtn.closest(".vocab-card");
        const word = expandBtn.dataset.word;
        const expanded = card.querySelector(".vocab-expanded");
        const isOpen = !expanded.hidden;
        
        if (isOpen) {
          expanded.hidden = true;
          expandBtn.innerHTML = icon("chevron-down", 16);
          return;
        }

        expandBtn.innerHTML = icon("loader", 16);
        expandBtn.disabled = true;

        try {
          let data;
          // Check if it's a verb
          const verb = verbData.find(v => v.base === word.toLowerCase());
          if (verb) {
            data = { 
              definitions: [{
                pos: "verbo",
                definition: verb.es,
                example: verb.complement ? `She ${verb.base}s ${verb.complement}.` : ""
              }],
              synonyms: [],
              triggers: [],
              conceptnet: await api.conceptnet.relations(word, null, 10).catch(() => ({}))
            };
          } else {
            data = await enrichWord(word);
          }
          
          expanded.innerHTML = renderExpandedDetails(word, data);
          expanded.hidden = false;
          expandBtn.innerHTML = icon("chevron-up", 16);
          
          // Bind chip clicks
          expanded.querySelectorAll(".word-chip").forEach(chip => {
            chip.onclick = () => {
              searchInput.value = chip.dataset.word;
              searchQuery = chip.dataset.word;
              clearBtn.hidden = false;
              currentView = "search";
              updateResults();
            };
          });
        } catch (error) {
          expanded.innerHTML = `<p class="vocab-error">Error: ${escapeHtml(error.message)}</p>`;
          expanded.hidden = false;
          expandBtn.innerHTML = icon("chevron-down", 16);
        } finally {
          expandBtn.disabled = false;
        }
      }

      // Audio buttons
      const audioBtn = e.target.closest(".vocab-audio");
      if (audioBtn) {
        const word = audioBtn.dataset.word;
        speakWord(word);
      }
    });

    // Scientific category loading
    root.addEventListener("click", async (e) => {
      const catTab = e.target.closest(".cat-tab[data-category^='sci-']");
      if (catTab && !catTab.classList.contains("loading")) {
        const category = catTab.dataset.category.replace("sci-", "");
        catTab.classList.add("loading");
        catTab.innerHTML = `${icon("loader", 14)} Cargando...`;
        
        try {
          const data = await getScientificCategory(category, (done, total) => {
            catTab.innerHTML = `${icon("loader", 14)} ${done}/${total}`;
          });
          
          // Store and switch view
          enrichedCache.set(`scicat:${category}`, data);
          currentView = "category";
          currentCategory = catTab.dataset.category;
          updateResults();
        } catch (error) {
          apiRef.toast("Error cargando categoría: " + error.message);
        } finally {
          catTab.classList.remove("loading");
          catTab.innerHTML = `${icon("microscope", 14)} ${escapeHtml(category.replace("_", " "))}`;
        }
      }
    });
  }

  function getVisibleWords() {
    if (currentView === "search") return searchLocal(searchQuery).map(e => e.word);
    if (currentView === "browse") return getLocalEntries(currentCategory).map(e => e.word);
    return [];
  }

  function updateResults() {
    const container = root.querySelector("#vocab-results");
    let words = [];
    let title = "Resultados";

    if (currentView === "search") {
      words = searchLocal(searchQuery);
      title = searchQuery ? `Resultados para "${searchQuery}"` : "Todo el vocabulario";
    } else if (currentView === "api-enriched") {
      const enrichedWords = getVisibleWords().slice(0, 20);
      words = enrichedWords.map(w => {
        const cached = enrichedCache.get(`enrich:${w}`);
        if (cached) {
          return { word: w, meaning: cached.definitions[0]?.definition || "Ver detalles", 
                   example: cached.definitions[0]?.example, pos: cached.definitions[0]?.pos, source: "api" };
        }
        const local = getLocalEntries("all").find(e => e.word === w);
        return local || { word: w, meaning: "Sin datos locales", source: "api", category: "" };
      });
      title = "Vocabulario enriquecido (API)";
    } else if (currentView === "category" && currentCategory.startsWith("sci-")) {
      const cat = currentCategory.replace("sci-", "");
      const data = enrichedCache.get(`scicat:${cat}`);
      if (data && !data.error) {
        words = Object.entries(data).map(([word, entry]) => ({
          word,
          meaning: entry.definitions?.[0]?.definition || entry.meaning || "Ver detalles",
          example: entry.definitions?.[0]?.example,
          pos: entry.definitions?.[0]?.pos,
          source: "api",
          category: cat
        }));
        title = `Categoría: ${cat.replace("_", " ")}`;
      } else {
        words = [];
        title = "Error cargando categoría";
      }
    } else {
      words = getLocalEntries(currentCategory);
      title = currentCategory === "all" ? "Todo el vocabulario" : 
              currentCategory === "local" ? "Vocabulario Luma" : currentCategory;
    }

    container.innerHTML = renderResults(words, title);
  }

  function speakWord(word) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith("en"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }

  function dispose() {
    root = null;
    apiRef = null;
  }

  window.LumaVocabExpanded = Object.freeze({
    render,
    dispose,
    enrichWord,
    enrichBatch,
    getScientificCategory,
    searchLocal,
    getLocalEntries,
    categories: [...LOCAL_CATEGORIES, ...SCIENTIFIC_CATEGORIES.map(c => "sci-" + c)]
  });
})();