// Expanded Scientific Topics Module for Luma
// Dynamically generates new scientific topics using APIs and structured templates
(() => {
  "use strict";

  const api = window.LumaVocabAPI;
  const dailyData = window.LumaDailyData;
  const features = window.LumaFeatures;
  const catalog = window.LumaScienceCatalog;

  function icon(name, size = 20) {
    return `<svg class="l-icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${window.LUMA_ICONS[name] || window.LUMA_ICONS["circle-dot"]}</svg>`;
  }

  function escapeHtml(text) {
    return String(text ?? "").replace(/[&<>"']/g, c => ({
      "&": "\u0026", "<": "\u003C", ">": "\u003E", '"': "\u0022", "'": "\u0027"
    })[c]);
  }

  // Las ramas viven en el catálogo. El vocabulario es un pozo común: la
  // metodología cambia, las palabras y la teoría no.
  const EXTRA_THEMES = {
    math: ["teoría de grafos", "optimización convexa", "sistemas dinámicos", "análisis de Fourier"],
    physics: ["entrelaçamiento cuántico", "superconductividad", "oscilación de neutrinos", "aislantes topológicos"],
    biology: ["fotosíntesis C4", "micorrizas", "dispersión de semillas", "biología marina"],
    chemistry: ["catálisis enzimática", "química de clic", "marcos metal-orgánicos", "química verde"],
    medicine: ["ensayos clínicos", "farmaco-vigilancia", "epidemiología", "salud pública"],
    astronomy: ["formación estelar", "exoplanetas", "agujeros negros", "radiación de fondo"],
    statistics: ["inferencia bayesiana", "diseño experimental", "series temporales", "regresión"],
    engineering: ["diseño de puentes", "redes eléctricas", "sistemas embebidos", "tratamiento de agua"],
    biotechnology: ["edición del genoma", "biología sintética", "bioinformática", "bioprocesos"],
    linguistics: ["adquisición del lenguaje", "semántica formal", "lenguaje y cerebro", "corpus lingüístico"],
    sociology: ["redes sociales", "estratificación", "sociología urbana", "investigación con encuestas"],
    microbiology: ["microbioma humano", "resistencia antimicrobiana", "virología", "cultivos microbianos"],
    molecular_biology: ["regulación génica", "epigenética", "CRISPR", "estructura de proteínas"],
  };
  const COMMON_VOCAB = (() => {
    const core = ["evidence", "observe", "compare", "explain", "infer", "measure", "model", "data", "claim", "result", "method", "conclusion", "limit"];
    const extra = window.LumaVocabularyExtra || {};
    const pooled = Object.values(extra)
      .flat()
      .map((entry) => entry && entry[0])
      .filter((word) => typeof word === "string" && word.length > 2);
    return [...new Set([...core, ...pooled])];
  })();
  const TOPIC_TEMPLATES = Object.fromEntries(
    catalog.SCIENCES.map((science) => [
      science.id,
      {
        themes: [...science.branches.map((branch) => branch.label), ...(EXTRA_THEMES[science.id] || [])],
        vocabulary: COMMON_VOCAB,
        sources: science.sources,
      },
    ]),
  );


  // Level-appropriate language patterns
  const LEVEL_PATTERNS = {
    A1: {
      sentenceStarters: ["This is a", "Look at the", "A scientist sees a", "The", "It has", "It can"],
      connectors: ["and", "but", "because", "so"],
      tenses: ["present"],
      maxSentences: 3
    },
    A2: {
      sentenceStarters: ["The", "A", "Scientists", "When", "If", "This helps"],
      connectors: ["and", "but", "because", "so", "then", "also"],
      tenses: ["present", "past"],
      maxSentences: 4
    },
    B1: {
      sentenceStarters: ["Imagine", "Suppose", "Research shows that", "The data suggest", "One reason is", "This means"],
      connectors: ["however", "therefore", "although", "while", "since", "unless"],
      tenses: ["present", "past", "present perfect"],
      maxSentences: 5
    },
    B2: {
      sentenceStarters: ["Evidence indicates that", "The findings imply", "A key question is", "Contrary to expectations", "This raises the possibility"],
      connectors: ["nevertheless", "furthermore", "consequently", "in contrast", "moreover", "accordingly"],
      tenses: ["present", "past", "present perfect", "past perfect"],
      maxSentences: 6
    },
    C1: {
      sentenceStarters: ["The interpretation hinges on", "A critical limitation is", "This challenges the view that", "The evidence warrants", "Distinguishing between"],
      connectors: ["notwithstanding", "inasmuch as", "whereby", "lest", "provided that", "insofar as"],
      tenses: ["all"],
      maxSentences: 7
    }
  };

  // Generate a new topic from template
  function generateTopic(domain, level, customTheme = null) {
    const template = TOPIC_TEMPLATES[domain];
    if (!template) return null;

    const theme = customTheme || template.themes[Math.floor(Math.random() * template.themes.length)];
    const patterns = LEVEL_PATTERNS[level] || LEVEL_PATTERNS.A1;
    
    // Generate passage based on level
    const passage = generatePassage(theme, domain, level, patterns);
    const question = generateQuestion(theme, level, domain);
    const words = selectVocabulary(COMMON_VOCAB, level, 7);
    
    return {
      id: `gen-${domain}-${theme.replace(/\s+/g, "-")}-${level}`,
      domain,
      title: capitalizeFirst(theme),
      theme: domainLabel(domain),
      image: domainImage(domain),
      description: `Explora ${theme} en nivel ${level}.`,
      level,
      en: passage.en,
      es: passage.es,
      words,
      question: question.en,
      options: question.options,
      answer: question.answer,
      note: question.note,
      sources: template.sources.slice(0, 2),
      generated: true,
      timestamp: Date.now()
    };
  }

  function generatePassage(theme, domain, level, patterns) {
    const science = catalog.get(domain);
    const method = science.method;
    const connectors = patterns.connectors;
    const maxS = patterns.maxSentences;
    const numSentences = Math.min(maxS, 2 + Math.floor(Math.random() * (maxS - 1)));
    const en = [
      `Researchers in ${science.en} study ${theme}.`,
      `They ${method.verbs[0][0]} carefully and look for ${method.evidenceEn}.`,
      `${capitalizeFirst(theme)} connects a question with evidence.`,
      method.questionEn,
      "The conclusion remains open to revision when new evidence appears.",
    ];
    const es = [
      `Los investigadores de ${science.label.toLowerCase()} estudian ${theme}.`,
      `Ellos ${method.verbs[0][1]} con cuidado y buscan ${method.evidence}.`,
      `${capitalizeFirst(theme)} conecta una pregunta con la evidencia.`,
      method.question,
      "La conclusión sigue abierta a revisión cuando aparece nueva evidencia.",
    ];
    const selected = en.slice(0, numSentences);
    const selectedEs = es.slice(0, numSentences);
    let english = selected.join(" ");
    let spanish = selectedEs.join(" ");
    if (level !== "A1" && numSentences > 2) {
      const conn = connectors[Math.floor(Math.random() * connectors.length)];
      english = english.replace(/\. (\w)/, `. ${conn} $1`);
      spanish = spanish.replace(/\. (\w)/, `. ${conn} $1`);
    }
    return { en: english, es: spanish };
  }


  function generateQuestion(theme, level, domain) {
    const questions = {
      A1: {
        templates: [
          { q: `What is ${theme}?`, opts: [`A process.`, `An animal.`, `A plant.`], a: 0, note: "What pregunta qué es algo." },
          { q: `Where does ${theme} happen?`, opts: [`In the ocean.`, `In space.`, `In a lab.`], a: 0, note: "Where pregunta dónde ocurre algo." },
          { q: `Who studies ${theme}?`, opts: [`A scientist.`, `A teacher.`, `A driver.`], a: 0, note: "Who pregunta quién hace algo." }
        ]
      },
      A2: {
        templates: [
          { q: `Why is ${theme} important?`, opts: [`It helps survival.`, `It makes light.`, `It creates water.`], a: 0, note: "Why pregunta la razón o causa." },
          { q: `How do scientists study ${theme}?`, opts: [`With instruments.`, `With books.`, `With guesses.`], a: 0, note: "How pregunta el método o manera." },
          { q: `What can ${theme} tell us?`, opts: [`About nature.`, `About history.`, `About math.`], a: 0, note: "What puede preguntar qué información da algo." }
        ]
      },
      B1: {
        templates: [
          { q: `Which factor influences ${theme} most?`, opts: [`Environment.`, `Temperature.`, `Light.`], a: 0, note: "Which selecciona entre opciones específicas." },
          { q: `What happens when ${theme} changes?`, opts: [`The system adapts.`, `Nothing changes.`, `It disappears.`], a: 0, note: "What happens pregunta por consecuencias." },
          { q: `How does ${theme} relate to other processes?`, opts: [`It connects them.`, `It separates them.`, `It replaces them.`], a: 0, note: "How does relaciona un proceso con otros." }
        ]
      },
      B2: {
        templates: [
          { q: `What evidence supports the role of ${theme}?`, opts: [`Experimental data.`, `Anecdotal reports.`, `Theoretical guesses.`], a: 0, note: "Evidence indica datos observables que respaldan una idea." },
          { q: `Which interpretation best fits the data on ${theme}?`, opts: [`The causal model.`, `The correlation only.`, `The null hypothesis.`], a: 0, note: "Best fits evalúa qué explicación coincide mejor con observaciones." },
          { q: `What limitation affects studies of ${theme}?`, opts: [`Measurement precision.`, `Sample size.`, `Both factors.`], a: 2, note: "Limitation identifica un límite en lo que se puede concluir." }
        ]
      },
      C1: {
        templates: [
          { q: `What distinguishes causation from correlation in ${theme}?`, opts: [`Temporal precedence and mechanism.`, `Statistical significance alone.`, `Expert consensus.`], a: 0, note: "Causation requiere mecanismo y orden temporal; correlation solo asociación." },
          { q: `Which claim about ${theme} is most warranted by current evidence?`, opts: [`A provisional mechanism.`, `A definitive law.`, `An absolute prediction.`], a: 0, note: "Warranted indica lo que la evidencia justifica, no lo que prueba." },
          { q: `What would falsify the leading hypothesis on ${theme}?`, opts: [`A reproducible null result.`, `A theoretical objection.`, `A funding cut.`], a: 0, note: "Falsify significa qué observación contradiría la hipótesis." }
        ]
      }
    };

    const levelQuestions = questions[level] || questions.A1;
    const science = catalog.get(domain);
    const templates =
      level === "C1"
        ? [
            ...levelQuestions.templates,
            {
              q: science.method.questionEn,
              opts: [
                "The claim that fits the evidence and its limits.",
                "The first explanation proposed.",
                "The most popular answer.",
              ],
              a: 0,
              note: `Warranted indica lo que la evidencia justifica. En ${science.label.toLowerCase()} se revisa ${science.method.evidence}.`,
            },
          ]
        : levelQuestions.templates;
    const template = templates[Math.floor(Math.random() * templates.length)];
    
    return {
      en: template.q.replace("${theme}", theme),
      options: template.opts,
      answer: template.a,
      note: template.note
    };
  }

  function selectVocabulary(vocabList, level, count) {
    const levelCounts = { A1: 3, A2: 4, B1: 5, B2: 6, C1: 7 };
    const num = levelCounts[level] || 5;
    const shuffled = [...vocabList].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(num, count)).map(word => [word, ""]);
  }

  function capitalizeFirst(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function domainLabel(domain) {
    return catalog.labelFor(domain);
  }

  function domainImage(domain) {
    return catalog.get(domain).image || "science";
  }


  // Batch generate topics for a domain
  async function generateTopicBatch(domain, levels = ["A1", "A2", "B1", "B2", "C1"], count = 3) {
    const template = TOPIC_TEMPLATES[domain];
    if (!template) return [];

    const topics = [];
    for (const level of levels) {
      for (let i = 0; i < count; i++) {
        const theme = template.themes[Math.floor(Math.random() * template.themes.length)];
        topics.push(generateTopic(domain, level, theme));
      }
    }
    return topics.filter(Boolean);
  }

  // Enrich generated topic with API data
  async function enrichTopic(topic) {
    if (!topic) return topic;
    
    try {
      const keyTerms = topic.words.map(w => w[0]).filter(Boolean);
      if (keyTerms.length) {
        const enriched = await api.enrichBatch(keyTerms.slice(0, 5));
        topic.enrichedVocab = enriched;
        
        // Add scientific context
        for (const term of keyTerms.slice(0, 3)) {
          const context = await api.getScientificContext(term, domainLabel(topic.domain).toLowerCase());
          if (context.length) {
            topic.scientificContext = topic.scientificContext || [];
            topic.scientificContext.push(...context);
          }
        }
      }
    } catch (error) {
      console.warn("Topic enrichment failed:", error);
    }
    return topic;
  }

  // Save generated topics to localStorage
  function saveGeneratedTopics(topics) {
    const existing = JSON.parse(localStorage.getItem("luma.generatedTopics") || "[]");
    const merged = [...existing, ...topics].slice(-100); // Keep last 100
    localStorage.setItem("luma.generatedTopics", JSON.stringify(merged));
  }

  function getGeneratedTopics() {
    return JSON.parse(localStorage.getItem("luma.generatedTopics") || "[]");
  }

  // Render topic explorer UI
  function renderTopicExplorer(root, apiRef) {
    const preferred = catalog.normalize(apiRef && apiRef.get ? apiRef.get("interest", "all") : "all");
    const domains = Object.keys(TOPIC_TEMPLATES).sort((a, b) => (a === preferred ? -1 : b === preferred ? 1 : 0));
    const saved = getGeneratedTopics();
    
    root.innerHTML = `<section class="topic-explorer">
      <header class="te-header">
        <h1>Explorador de Temas</h1>
        <p>Genera nuevas sesiones por disciplina y rama. La metodología se adapta; el vocabulario y la teoría son comunes. Elige un dominio, nivel y tema para crear una lectura adaptada.</p>
      </header>
      
      <div class="te-controls">
        <div class="te-form">
          <label>Dominio
            <select id="te-domain">
              ${domains.map(d => `<option value="${d}" ${d === preferred ? "selected" : ""}>${domainLabel(d)}</option>`).join("")}
            </select>
          </label>
          <label>Nivel
            <select id="te-level">
              <option value="A1">A1 - Inicial</option>
              <option value="A2">A2 - Elemental</option>
              <option value="B1" selected>B1 - Intermedio</option>
              <option value="B2">B2 - Intermedio alto</option>
              <option value="C1">C1 - Avanzado</option>
            </select>
          </label>
          <label>Tema (opcional)
            <input type="text" id="te-theme" placeholder="Deja vacío para aleatorio" list="theme-suggestions">
            <datalist id="theme-suggestions"></datalist>
          </label>
          <label>Cantidad
            <select id="te-count">
              <option value="1">1 sesión</option>
              <option value="3" selected>3 sesiones</option>
              <option value="5">5 sesiones</option>
            </select>
          </label>
          <button type="button" class="solid-button" id="te-generate">
            ${icon("sparkles", 16)} Generar sesiones
          </button>
        </div>
      </div>
      
      <div id="te-loading" class="te-loading" hidden>
        ${icon("loader", 32)} <span>Generando y enriqueciendo...</span>
      </div>
      
      <div id="te-results" class="te-results"></div>
      
      ${saved.length ? `
      <section class="te-saved">
        <h2>${icon("bookmark", 16)} Temas generados recientemente</h2>
        <div class="te-saved-grid">
          ${saved.slice(-6).reverse().map(t => `
            <article class="te-saved-card" data-id="${t.id}">
              <span class="te-badge">${t.level}</span>
              <h3 lang="en">${t.title}</h3>
              <p>${t.theme}</p>
              <button type="button" class="te-use-btn" data-id="${t.id}">Usar esta sesión</button>
            </article>
          `).join("")}
        </div>
      </section>
      ` : ""}
    </section>`;

    bindTopicEvents(root, apiRef);
  }

  function bindTopicEvents(root, apiRef) {
    const domainSelect = root.querySelector("#te-domain");
    const themeInput = root.querySelector("#te-theme");
    const datalist = root.querySelector("#theme-suggestions");
    
    // Update theme suggestions when domain changes
    domainSelect.onchange = () => {
      const template = TOPIC_TEMPLATES[domainSelect.value];
      if (template) {
        datalist.innerHTML = template.themes.map(t => `<option value="${t}">`).join("");
        themeInput.value = "";
      }
    };
    
    // Initialize
    domainSelect.onchange();
    
    // Generate button
    root.querySelector("#te-generate").onclick = async () => {
      const domain = domainSelect.value;
      const level = root.querySelector("#te-level").value;
      const theme = themeInput.value.trim() || null;
      const count = parseInt(root.querySelector("#te-count").value, 10);
      
      const loading = root.querySelector("#te-loading");
      const results = root.querySelector("#te-results");
      loading.hidden = false;
      results.innerHTML = "";
      
      try {
        const topics = await generateTopicBatch(domain, [level], count);
        
        // Enrich each topic
        for (let i = 0; i < topics.length; i++) {
          loading.querySelector("span").textContent = `Enriqueciendo ${i + 1}/${topics.length}...`;
          topics[i] = await enrichTopic(topics[i]);
        }
        
        saveGeneratedTopics(topics);
        renderGeneratedTopics(results, topics, apiRef);
      } catch (error) {
        results.innerHTML = `<div class="te-error">${icon("alert-circle", 24)} Error: ${error.message}</div>`;
      } finally {
        loading.hidden = true;
      }
    };
    
    // Use saved topic
    root.querySelectorAll(".te-use-btn").forEach(btn => {
      btn.onclick = () => {
        const id = btn.dataset.id;
        const saved = getGeneratedTopics();
        const topic = saved.find(t => t.id === id);
        if (topic) {
          apiRef.set("daily.customTopic", topic);
          apiRef.go("daily");
        }
      };
    });
  }

  function renderGeneratedTopics(container, topics, apiRef) {
    container.innerHTML = topics.map((topic, i) => `
      <article class="te-generated-card" data-index="${i}">
        <div class="te-card-header">
          <span class="te-level-badge">${topic.level}</span>
          <span class="te-domain-badge">${topic.theme}</span>
          ${topic.generated ? `<span class="te-gen-badge">${icon("sparkles", 12)} Generado</span>` : ""}
        </div>
        <h2 lang="en">${topic.title}</h2>
        <p class="te-description">${topic.description}</p>
        
        <details class="te-preview">
          <summary>Ver pasaje (${topic.level})</summary>
          <div class="te-passage">
            <p lang="en">${topic.en}</p>
            <p class="te-es">${topic.es}</p>
          </div>
          <dl class="te-vocab">
            ${topic.words.map(([w, m]) => `<dt lang="en">${w}</dt><dd>${m || "—"}</dd>`).join("")}
          </dl>
          <div class="te-quiz">
            <p lang="en"><strong>Pregunta:</strong> ${topic.question}</p>
            <div class="te-options">
              ${topic.options.map((opt, idx) => `<label><input type="radio" name="q${i}" ${idx === topic.answer ? "checked" : ""} disabled> ${opt}</label>`).join("")}
            </div>
            <p class="te-note">${topic.note}</p>
          </div>
        </details>
        
        <div class="te-actions">
          <button type="button" class="te-save-btn" data-index="${i}">${icon("bookmark", 14)} Guardar</button>
          <button type="button" class="te-use-btn primary" data-index="${i}">${icon("play", 14)} Estudiar ahora</button>
        </div>
      </article>
    `).join("");
    
    // Bind actions
    container.querySelectorAll(".te-use-btn.primary").forEach(btn => {
      btn.onclick = () => {
        const topic = topics[parseInt(btn.dataset.index, 10)];
        apiRef.set("daily.customTopic", topic);
        apiRef.go("daily");
      };
    });
    
    container.querySelectorAll(".te-save-btn").forEach(btn => {
      btn.onclick = () => {
        const topic = topics[parseInt(btn.dataset.index, 10)];
        saveGeneratedTopics([topic]);
        apiRef.toast("Tema guardado para usar luego");
        btn.textContent = "Guardado ✓";
        btn.disabled = true;
      };
    });
  }

  // Export
  window.LumaTopicsExpanded = Object.freeze({
    generateTopic,
    generateTopicBatch,
    enrichTopic,
    renderTopicExplorer,
    getGeneratedTopics,
    saveGeneratedTopics,
    domains: Object.keys(TOPIC_TEMPLATES),
    domainLabel,
    TOPIC_TEMPLATES,
    LEVEL_PATTERNS
  });
})();