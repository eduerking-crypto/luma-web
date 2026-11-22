// Expanded Scientific Topics Module for Luma
// Dynamically generates new scientific topics using APIs and structured templates
(() => {
  "use strict";

  const api = window.LumaVocabAPI;
  const dailyData = window.LumaDailyData;
  const features = window.LumaFeatures;

  function icon(name, size = 20) {
    return `<svg class="l-icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${window.LUMA_ICONS[name] || window.LUMA_ICONS["circle-dot"]}</svg>`;
  }

  function escapeHtml(text) {
    return String(text ?? "").replace(/[&<>"']/g, c => ({
      "&": "\u0026", "<": "\u003C", ">": "\u003E", '"': "\u0022", "'": "\u0027"
    })[c]);
  }

  // Topic templates for different scientific domains
  const TOPIC_TEMPLATES = {
    marine_biology: {
      themes: [
        "bioluminiscencia", "arrecifes de coral", "migración marina", "zonas abisales",
        "fitoplancton", "ácido oceánico", "corrientes termohalinas", "mamíferos marinos",
        "ecosistemas de manglar", "especies invasoras marinas", "microplásticos",
        "simbiosis coral-alga", "tiburones y rayas", "cefalópodos", "fuentes hidrotermales"
      ],
      vocabulary: ["ecosystem", "biodiversity", "habitat", "species", "population", "adaptation", "migration", "predator", "prey", "symbiosis"],
      sources: ["NOAA Ocean Explorer", "Marine Biology Journal", "PLOS ONE", "Frontiers in Marine Science"]
    },
    astronomy: {
      themes: [
        "formación estelar", "exoplanetas", "agujeros negros", "materia oscura",
        "ondas gravitacionales", "supernovas", "nebulosas", "cúmulos globulares",
        "radiación de fondo", "inflación cósmica", "agujeros de gusano", "estrellas de neutrones",
        "lentes gravitacionales", "curso principal", "enanas blancas"
      ],
      vocabulary: ["galaxy", "nebula", "supernova", "gravity", "orbit", "telescope", "lightyear", "redshift", "cosmic", "stellar"],
      sources: ["NASA Science", "ESA", "Astrophysical Journal", "Nature Astronomy"]
    },
    botany: {
      themes: [
        "fotosíntesis C4", "comunicación vegetal", "micorrizas", "dispersión de semillas",
        "adaptación al desierto", "plantas carnívoras", "alelos", "ritmos circadianos vegetales",
        "fitorremediación", "polinización", "co-evolución", "domesticación",
        "genómica de cultivos", "resistencia a sequía", "señalización hormonal"
      ],
      vocabulary: ["photosynthesis", "chlorophyll", "root", "leaf", "seed", "pollen", "stomata", "xylem", "phloem", "meristem"],
      sources: ["Plant Cell", "New Phytologist", "Annals of Botany", "Frontiers in Plant Science"]
    },
    physics: {
      themes: [
        "entrelaazamiento cuántico", "superconductividad", "condensados de Bose-Einstein",
        "efecto Hall cuántico", "plasmas de quarks-gluones", "materia oscura directa",
        "oscilación de neutrinos", "violación CP", "física del Higgs", "gravedad cuántica de lazos",
        "termalización cuántica", "aislantes topológicos", "cristales temporales", "simetría PT",
        "hidrodinámica relativista"
      ],
      vocabulary: ["quantum", "particle", "wave", "energy", "field", "mass", "charge", "spin", "symmetry", "vacuum"],
      sources: ["Physical Review Letters", "Nature Physics", "Science", "Physics Today"]
    },
    chemistry: {
      themes: [
        "catálisis enzimática", "química de clic", "marcos metal-orgánicos", "química supramolecular",
        "polímeros conductores", "catálisis fotoredox", "química verde", "baterías de estado sólido",
        "captura de carbono", "química de flujo", "autoensamblaje molecular", "quimioinformática",
        "diseño de fármacos", "química prebiótica", "espectroscopía de un solo molécula"
      ],
      vocabulary: ["reaction", "catalyst", "molecule", "bond", "electron", "orbital", "synthesis", "yield", "solvent", "equilibrium"],
      sources: ["Journal of the American Chemical Society", "Angewandte Chemie", "Nature Chemistry", "Chemical Science"]
    },
    earth_science: {
      themes: [
        "tectónica de placas", "ciclo del carbono", "paleoclima", "isótopos estables",
        "geomorfología fluvial", "peligros volcánicos", "ciclo hidrológico", "calidad del aire",
        "erosión costera", "permafrost", "ciclo del nitrógeno", "weathering químico",
        "reconstrucción paleo", "modelos climáticos", "geoquímica de isótopos"
      ],
      vocabulary: ["plate", "tectonics", "volcano", "earthquake", "erosion", "sediment", "fossil", "mineral", "climate", "atmosphere"],
      sources: ["Nature Geoscience", "Geophysical Research Letters", "Earth and Planetary Science Letters", "Science Advances"]
    },
    mathematics: {
      themes: [
        "teoría de grafos", "optimización convexa", "ecuaciones diferenciales estocásticas",
        "topología algebraica", "teoría de números", "geometría diferencial", "álgebra lineal numérica",
        "métodos de Monte Carlo", "análisis de Fourier", "teoría de la información",
        "sistemas dinámicos", "geometría algebraica", "teoría de categorías", "homología persistente",
        "aprendizaje profundo matemático"
      ],
      vocabulary: ["function", "derivative", "integral", "matrix", "vector", "probability", "limit", "series", "convergence", "eigenvalue"],
      sources: ["Annals of Mathematics", "Inventiones Mathematicae", "Journal of the AMS", "SIAM Review"]
    },
    neuroscience: {
      themes: [
        "plasticidad sináptica", "neurogénesis adulta", "interfaz cerebro-máquina", "optogenética",
        "conectoma", "ondas cerebrales", "memoria de trabajo", "toma de decisiones neural",
        "procesamiento sensorial", "trastornos neurodegenerativos", "neuroinflamación",
        "células gliales", "barrera hematoencefálica", "neurotrasmisores", "ritmos circadianos neurales"
      ],
      vocabulary: ["neuron", "synapse", "neurotransmitter", "action potential", "cortex", "hippocampus", "dopamine", "plasticity", "axon", "dendrite"],
      sources: ["Neuron", "Nature Neuroscience", "Science", "Journal of Neuroscience"]
    }
  };

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
    const question = generateQuestion(theme, level);
    const words = selectVocabulary(template.vocabulary, level, 5);
    
    return {
      id: `gen-${domain}-${theme.replace(/\s+/g, "-")}-${level}`,
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
    const starters = patterns.sentenceStarters;
    const connectors = patterns.connectors;
    const maxS = patterns.maxSentences;
    const numSentences = Math.min(maxS, 2 + Math.floor(Math.random() * (maxS - 1)));
    
    // Domain-specific content templates
    const contentTemplates = {
      marine_biology: {
        en: [
          `The ocean contains many ${theme}.`,
          `Scientists study ${theme} to understand marine life.`,
          `${capitalizeFirst(theme)} plays an important role in the ecosystem.`,
          `Some animals use ${theme} for survival.`,
          `Research on ${theme} reveals new discoveries.`
        ],
        es: [
          `El océano contiene muchos ${theme}.`,
          `Los científicos estudian ${theme} para entender la vida marina.`,
          `${capitalizeFirst(theme)} juega un papel importante en el ecosistema.`,
          `Algunos animales usan ${theme} para sobrevivir.`,
          `La investigación sobre ${theme} revela nuevos descubrimientos.`
        ]
      },
      astronomy: {
        en: [
          `Astronomers observe ${theme} using telescopes.`,
          `${capitalizeFirst(theme)} helps us understand the universe.`,
          `New data about ${theme} changes our models.`,
          `The study of ${theme} requires precise instruments.`,
          `${capitalizeFirst(theme)} reveals cosmic history.`
        ],
        es: [
          `Los astrónomos observan ${theme} usando telescopios.`,
          `${capitalizeFirst(theme)} nos ayuda a entender el universo.`,
          `Nuevos datos sobre ${theme} cambian nuestros modelos.`,
          `El estudio de ${theme} requiere instrumentos precisos.`,
          `${capitalizeFirst(theme)} revela la historia cósmica.`
        ]
      },
      botany: {
        en: [
          `Plants use ${theme} to grow and survive.`,
          `The process of ${theme} is essential for life.`,
          `Scientists investigate how ${theme} works in different species.`,
          `${capitalizeFirst(theme)} connects plants to their environment.`,
          `Understanding ${theme} improves agriculture.`
        ],
        es: [
          `Las plantas usan ${theme} para crecer y sobrevivir.`,
          `El proceso de ${theme} es esencial para la vida.`,
          `Los científicos investigan cómo funciona ${theme} en distintas especies.`,
          `${capitalizeFirst(theme)} conecta las plantas con su entorno.`,
          `Entender ${theme} mejora la agricultura.`
        ]
      },
      physics: {
        en: [
          `Physicists study ${theme} to understand fundamental forces.`,
          `${capitalizeFirst(theme)} demonstrates quantum effects.`,
          `Experiments on ${theme} test theoretical predictions.`,
          `The mathematics of ${theme} describes nature precisely.`,
          `Applications of ${theme} include new technologies.`
        ],
        es: [
          `Los físicos estudian ${theme} para entender las fuerzas fundamentales.`,
          `${capitalizeFirst(theme)} demuestra efectos cuánticos.`,
          `Los experimentos sobre ${theme} ponen a prueba predicciones teóricas.`,
          `Las matemáticas de ${theme} describen la naturaleza con precisión.`,
          `Las aplicaciones de ${theme} incluyen nuevas tecnologías.`
        ]
      },
      chemistry: {
        en: [
          `Chemists explore ${theme} to create new materials.`,
          `${capitalizeFirst(theme)} involves molecular interactions.`,
          `The mechanism of ${theme} reveals reaction pathways.`,
          `Catalysis in ${theme} improves efficiency.`,
          `Green chemistry uses ${theme} for sustainability.`
        ],
        es: [
          `Los químicos exploran ${theme} para crear nuevos materiales.`,
          `${capitalizeFirst(theme)} involucra interacciones moleculares.`,
          `El mecanismo de ${theme} revela vías de reacción.`,
          `La catálisis en ${theme} mejora la eficiencia.`,
          `La química verde usa ${theme} para la sostenibilidad.`
        ]
      },
      earth_science: {
        en: [
          `Geologists examine ${theme} to read Earth's history.`,
          `${capitalizeFirst(theme)} shapes the planet's surface.`,
          `Data from ${theme} improves climate models.`,
          `The study of ${theme} connects past and present.`,
          `Understanding ${theme} helps predict natural hazards.`
        ],
        es: [
          `Los geólogos examinan ${theme} para leer la historia de la Tierra.`,
          `${capitalizeFirst(theme)} moldea la superficie del planeta.`,
          `Los datos de ${theme} mejoran los modelos climáticos.`,
          `El estudio de ${theme} conecta pasado y presente.`,
          `Entender ${theme} ayuda a predecir peligros naturales.`
        ]
      },
      mathematics: {
        en: [
          `Mathematicians use ${theme} to model complex systems.`,
          `${capitalizeFirst(theme)} provides tools for analysis.`,
          `The structure of ${theme} reveals deep patterns.`,
          `Applications of ${theme} span many sciences.`,
          `Recent advances in ${theme} solve old problems.`
        ],
        es: [
          `Los matemáticos usan ${theme} para modelar sistemas complejos.`,
          `${capitalizeFirst(theme)} proporciona herramientas de análisis.`,
          `La estructura de ${theme} revela patrones profundos.`,
          `Las aplicaciones de ${theme} abarcan muchas ciencias.`,
          `Avances recientes en ${theme} resuelven problemas antiguos.`
        ]
      },
      neuroscience: {
        en: [
          `Neuroscientists investigate ${theme} to understand the brain.`,
          `${capitalizeFirst(theme)} underlies behavior and cognition.`,
          `Techniques like optogenetics reveal ${theme}.`,
          `Disorders related to ${theme} affect millions.`,
          `The mechanism of ${theme} involves neural circuits.`
        ],
        es: [
          `Los neurocientíficos investigan ${theme} para entender el cerebro.`,
          `${capitalizeFirst(theme)} subyace al comportamiento y la cognición.`,
          `Técnicas como la optogenética revelan ${theme}.`,
          `Trastornos relacionados con ${theme} afectan a millones.`,
          `El mecanismo de ${theme} involucra circuitos neuronales.`
        ]
      }
    };

    const templates = contentTemplates[domain] || contentTemplates.marine_biology;
    const selected = templates.en.slice(0, numSentences);
    const selectedEs = templates.es.slice(0, numSentences);
    
    // Add connectors for higher levels
    let en = selected.join(" ");
    let es = selectedEs.join(" ");
    
    if (level !== "A1" && numSentences > 2) {
      const conn = connectors[Math.floor(Math.random() * connectors.length)];
      en = en.replace(/\. (\w)/, `. ${conn} $1`);
      es = es.replace(/\. (\w)/, `. ${conn} $1`);
    }

    return { en, es };
  }

  function generateQuestion(theme, level) {
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
    const template = levelQuestions.templates[Math.floor(Math.random() * levelQuestions.templates.length)];
    
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
    const labels = {
      marine_biology: "Biología marina",
      astronomy: "Astronomía",
      botany: "Botánica",
      physics: "Física",
      chemistry: "Química",
      earth_science: "Ciencias de la Tierra",
      mathematics: "Matemáticas",
      neuroscience: "Neurociencia"
    };
    return labels[domain] || domain;
  }

  function domainImage(domain) {
    const images = {
      marine_biology: "ocean",
      astronomy: "nebula",
      botany: "plant",
      physics: "atom",
      chemistry: "flask-conical",
      earth_science: "earth",
      mathematics: "shapes",
      neuroscience: "brain"
    };
    return images[domain] || "science";
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
          const context = await api.getScientificContext(term, domainLabel(topic.theme).toLowerCase());
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
    const domains = Object.keys(TOPIC_TEMPLATES);
    const saved = getGeneratedTopics();
    
    root.innerHTML = `<section class="topic-explorer">
      <header class="te-header">
        <h1>Explorador de Temas</h1>
        <p>Genera nuevas sesiones científicas a demanda. Elige un dominio, nivel y tema para crear una lectura adaptada.</p>
      </header>
      
      <div class="te-controls">
        <div class="te-form">
          <label>Dominio
            <select id="te-domain">
              ${domains.map(d => `<option value="${d}">${domainLabel(d)}</option>`).join("")}
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