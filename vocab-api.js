// Vocabulary API integration for Luma
// Connects to WordNet, Datamuse, ConceptNet, and other free APIs
(() => {
  "use strict";

  const API_ENDPOINTS = {
    datamuse: "https://api.datamuse.com/words",
    conceptnet: "https://api.conceptnet.io",
    wordnet: "https://api.dictionaryapi.dev/api/v2/entries/en",
    wiktionary: "https://en.wiktionary.org/api/rest_v1/page/definition",
    crossref: "https://api.crossref.org/works",
    semanticScholar: "https://api.semanticscholar.org/graph/v1",
    pubmed: "https://eutils.ncbi.nlm.nih.gov/entrez/eutils",
    wikipedia: "https://en.wikipedia.org/w/api.php"
  };

  const CACHE_TTL = 24 * 60 * 60 * 1000; // 24 hours
  const REQUEST_TIMEOUT = 10000;
  const RATE_LIMIT = {
    datamuse: 100, // per minute
    conceptnet: 120,
    wordnet: 60,
    wiktionary: 100
  };

  const cache = new Map();
  const rateLimits = new Map();

  function normalizeKey(key) {
    return key.toLowerCase().trim().replace(/\s+/g, "_");
  }

  function isRateLimited(api) {
    const now = Date.now();
    const limit = rateLimits.get(api) || { count: 0, reset: now + 60000 };
    if (now > limit.reset) {
      limit.count = 0;
      limit.reset = now + 60000;
    }
    if (limit.count >= RATE_LIMIT[api]) return true;
    limit.count++;
    rateLimits.set(api, limit);
    return false;
  }

  async function fetchWithTimeout(url, options = {}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      return response;
    } finally {
      clearTimeout(timeout);
    }
  }

  async function getCached(key, fetchFn) {
    const entry = cache.get(key);
    if (entry && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.data;
    }
    const data = await fetchFn();
    cache.set(key, { data, timestamp: Date.now() });
    if (cache.size > 500) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }
    return data;
  }

  // Datamuse API - related words, synonyms, triggers, etc.
  async function datamuseRelations(word, rel = "rel_trg", max = 20) {
    if (isRateLimited("datamuse")) throw new Error("Rate limited: datamuse");
    const cacheKey = `datamuse:${rel}:${word}:${max}`;
    return getCached(cacheKey, async () => {
      const url = new URL(API_ENDPOINTS.datamuse);
      url.searchParams.set(rel, word);
      url.searchParams.set("max", String(max));
      url.searchParams.set("md", "d,p,f"); // definitions, parts of speech, frequency
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error("Datamuse request failed");
      return res.json();
    });
  }

  async function datamuseDefinitions(word) {
    return datamuseRelations(word, "ml", 10); // "means like"
  }

  async function datamuseSynonyms(word) {
    return datamuseRelations(word, "rel_syn", 15);
  }

  async function datamuseAntonyms(word) {
    return datamuseRelations(word, "rel_ant", 10);
  }

  async function datamuseTriggers(word) {
    return datamuseRelations(word, "rel_trg", 20); // statistically associated
  }

  async function datamuseSoundsLike(word) {
    return datamuseRelations(word, "sl", 10);
  }

  async function datamuseSpelledLike(word) {
    return datamuseRelations(word, "sp", 10);
  }

  // ConceptNet API - semantic relationships
  async function conceptnetRelations(word, rel = null, limit = 20) {
    if (isRateLimited("conceptnet")) throw new Error("Rate limited: conceptnet");
    const cacheKey = `conceptnet:${word}:${rel || "all"}:${limit}`;
    return getCached(cacheKey, async () => {
      const encoded = encodeURIComponent(word.toLowerCase().replace(/\s+/g, "_"));
      let url = `${API_ENDPOINTS.conceptnet}/c/en/${encoded}`;
      if (rel) url += `/${rel}`;
      url += `?limit=${limit}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error("ConceptNet request failed");
      return res.json();
    });
  }

  async function conceptnetSynonyms(word) {
    return conceptnetRelations(word, "related", 20);
  }

  async function conceptnetIsA(word) {
    return conceptnetRelations(word, "/r/IsA", 20);
  }

  async function conceptnetPartOf(word) {
    return conceptnetRelations(word, "/r/PartOf", 15);
  }

  async function conceptnetUsedFor(word) {
    return conceptnetRelations(word, "/r/UsedFor", 15);
  }

  async function conceptnetCapableOf(word) {
    return conceptnetRelations(word, "/r/CapableOf", 15);
  }

  async function conceptnetCauses(word) {
    return conceptnetRelations(word, "/r/Causes", 15);
  }

  async function conceptnetAtLocation(word) {
    return conceptnetRelations(word, "/r/AtLocation", 15);
  }

  // Dictionary API (Free Dictionary API)
  async function dictionaryDefinition(word) {
    if (isRateLimited("wordnet")) throw new Error("Rate limited: dictionary");
    const cacheKey = `dict:${word}`;
    return getCached(cacheKey, async () => {
      const url = `${API_ENDPOINTS.wordnet}/${encodeURIComponent(word)}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error("Dictionary request failed");
      const data = await res.json();
      return Array.isArray(data) ? data[0] : data;
    });
  }

  // Wiktionary
  async function wiktionaryDefinition(word) {
    if (isRateLimited("wiktionary")) throw new Error("Rate limited: wiktionary");
    const cacheKey = `wikt:${word}`;
    return getCached(cacheKey, async () => {
      const url = `${API_ENDPOINTS.wiktionary}/${encodeURIComponent(word)}`;
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error("Wiktionary request failed");
      return res.json();
    });
  }

  // Crossref - scientific publications for vocabulary in context
  async function crossrefSearch(query, rows = 5) {
    const cacheKey = `crossref:${query}:${rows}`;
    return getCached(cacheKey, async () => {
      const url = new URL(API_ENDPOINTS.crossref);
      url.searchParams.set("query", query);
      url.searchParams.set("rows", String(rows));
      url.searchParams.set("select", "DOI,title,author,abstract,container-title,published");
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error("Crossref request failed");
      return res.json();
    });
  }

  // Semantic Scholar - paper search
  async function semanticScholarSearch(query, limit = 5) {
    const cacheKey = `semantic:${query}:${limit}`;
    return getCached(cacheKey, async () => {
      const url = new URL(`${API_ENDPOINTS.semanticScholar}/paper/search`);
      url.searchParams.set("query", query);
      url.searchParams.set("limit", String(limit));
      url.searchParams.set("fields", "title,abstract,venue,year,authors");
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error("Semantic Scholar request failed");
      return res.json();
    });
  }

  // Wikipedia - article summaries
  async function wikipediaSummary(title) {
    const cacheKey = `wiki:${title}`;
    return getCached(cacheKey, async () => {
      const url = new URL(API_ENDPOINTS.wikipedia);
      url.searchParams.set("action", "query");
      url.searchParams.set("format", "json");
      url.searchParams.set("prop", "extracts");
      url.searchParams.set("exintro", "true");
      url.searchParams.set("explaintext", "true");
      url.searchParams.set("titles", title);
      const res = await fetchWithTimeout(url);
      if (!res.ok) throw new Error("Wikipedia request failed");
      const data = await res.json();
      const pages = data.query?.pages;
      if (!pages) return null;
      const page = Object.values(pages)[0];
      return page.extract || null;
    });
  }

  // Scientific context extraction from abstracts
  async function getScientificContext(term, discipline = "biology") {
    const queries = [
      `${term} ${discipline}`,
      `"${term}" mechanism`,
      `"${term}" function`,
      `"${term}" pathway`
    ];
    const results = [];
    for (const q of queries.slice(0, 2)) {
      try {
        const data = await crossrefSearch(q, 3);
        const items = data.message?.items || [];
        for (const item of items) {
          if (item.abstract) {
            // Extract sentences containing the term
            const sentences = item.abstract.split(/[.!?]+/);
            const relevant = sentences.filter(s => 
              s.toLowerCase().includes(term.toLowerCase())
            ).slice(0, 2);
            if (relevant.length) {
              results.push({
                source: item["container-title"]?.[0] || "Journal",
                doi: item.DOI,
                year: item.published?.["date-parts"]?.[0]?.[0],
                context: relevant.join(". ").trim() + "."
              });
            }
          }
        }
      } catch {}
      if (results.length >= 3) break;
    }
    return results.slice(0, 3);
  }

  // Batch vocabulary enrichment
  async function enrichVocabularyBatch(words, options = {}) {
    const {
      includeSynonyms = true,
      includeAntonyms = true,
      includeTriggers = true,
      includeDefinitions = true,
      includeScientificContext = false,
      discipline = "biology",
      maxPerWord = 10
    } = options;

    const results = {};
    for (const word of words) {
      const entry = { word, synonyms: [], antonyms: [], triggers: [], definitions: [], scientificContext: [] };
      
      try {
        if (includeDefinitions) {
          try {
            const dict = await dictionaryDefinition(word);
            if (dict?.meanings) {
              entry.definitions = dict.meanings.flatMap(m => 
                m.definitions?.slice(0, 2).map(d => ({
                  pos: m.partOfSpeech,
                  definition: d.definition,
                  example: d.example
                })) || []
              ).slice(0, 4);
            }
          } catch {}
        }

        if (includeSynonyms) {
          try {
            const syns = await datamuseSynonyms(word);
            entry.synonyms = syns.slice(0, maxPerWord).map(s => ({
              word: s.word,
              score: s.score,
              tags: s.tags,
              defs: s.defs
            }));
          } catch {}
        }

        if (includeAntonyms) {
          try {
            const ants = await datamuseAntonyms(word);
            entry.antonyms = ants.slice(0, maxPerWord).map(a => ({
              word: a.word,
              score: a.score,
              tags: a.tags
            }));
          } catch {}
        }

        if (includeTriggers) {
          try {
            const trigs = await datamuseTriggers(word);
            entry.triggers = trigs.slice(0, maxPerWord).map(t => ({
              word: t.word,
              score: t.score,
              tags: t.tags
            }));
          } catch {}
        }

        if (includeScientificContext) {
          entry.scientificContext = await getScientificContext(word, discipline);
        }

      } catch (error) {
        entry.error = error.message;
      }

      results[word] = entry;
      
      // Small delay to respect rate limits
      await new Promise(r => setTimeout(r, 50));
    }

    return results;
  }

  // Vocabulary categories for thematic expansion
  const SCIENTIFIC_CATEGORIES = {
    "molecular_biology": [
      "transcription", "translation", "replication", "mutation", "expression",
      "regulation", "promoter", "enhancer", "splicing", "polymerase",
      "ribosome", "codon", "exon", "intron", "allele", "genotype",
      "phenotype", "plasmid", "vector", "cloning", "sequencing",
      "amplification", "hybridization", "probe", "primer", "template"
    ],
    "ecology": [
      "ecosystem", "biodiversity", "population", "community", "niche",
      "habitat", "succession", "trophic", "predation", "competition",
      "symbiosis", "mutualism", "parasitism", "keystone", "carrying",
      "capacity", "limiting", "factor", "biome", "biogeochemical",
      "cycle", "productivity", "trophic", "cascade", "resilience"
    ],
    "chemistry": [
      "reaction", "catalyst", "equilibrium", "kinetics", "thermodynamics",
      "stoichiometry", "molarity", "concentration", "solubility", "pH",
      "buffer", "titration", "oxidation", "reduction", "electrochemistry",
      "spectroscopy", "chromatography", "distillation", "crystallization",
      "synthesis", "yield", "purity", "reagent", "solvent"
    ],
    "physics": [
      "force", "energy", "momentum", "velocity", "acceleration",
      "mass", "charge", "field", "potential", "wave",
      "frequency", "amplitude", "wavelength", "interference", "diffraction",
      "quantum", "particle", "relativity", "entropy", "thermodynamics",
      "pressure", "temperature", "volume", "density", "viscosity"
    ],
    "neuroscience": [
      "neuron", "synapse", "neurotransmitter", "action", "potential",
      "depolarization", "repolarization", "axon", "dendrite", "myelin",
      "plasticity", "learning", "memory", "cortex", "hippocampus",
      "amygdala", "cerebellum", "brainstem", "thalamus", "hypothalamus"
    ],
    "earth_science": [
      "plate", "tectonics", "earthquake", "volcano", "magma",
      "lava", "erosion", "weathering", "sediment", "stratigraphy",
      "fossil", "mineral", "crystal", "rock", "formation",
      "atmosphere", "climate", "ocean", "current", "tide"
    ],
    "astronomy": [
      "star", "planet", "galaxy", "nebula", "black hole",
      "supernova", "redshift", "lightyear", "parsec", "spectral",
      "luminosity", "magnitude", "orbit", "rotation", "revolution",
      "eclipse", "transit", "exoplanet", "habitable", "zone"
    ],
    "mathematics": [
      "function", "derivative", "integral", "limit", "series",
      "sequence", "convergence", "divergence", "matrix", "vector",
      "eigenvalue", "eigenvector", "probability", "distribution", "variance",
      "correlation", "regression", "hypothesis", "significance", "interval"
    ]
  };

  // Get vocabulary by scientific category
  async function getVocabularyByCategory(category, options = {}) {
    const words = SCIENTIFIC_CATEGORIES[category] || [];
    return enrichVocabularyBatch(words, { 
      ...options, 
      discipline: category.replace("_", " "),
      includeScientificContext: true
    });
  }

  // Search vocabulary across APIs
  async function searchVocabulary(query, options = {}) {
    const { limit = 20, includeRelated = true } = options;
    const results = {
      query,
      exact: null,
      synonyms: [],
      related: [],
      definitions: [],
      scientificContext: []
    };

    try {
      // Exact definition
      results.exact = await dictionaryDefinition(query);
    } catch {}

    try {
      // Synonyms
      const syns = await datamuseSynonyms(query);
      results.synonyms = syns.slice(0, limit).map(s => s.word);
    } catch {}

    if (includeRelated) {
      try {
        const trigs = await datamuseTriggers(query);
        results.related = trigs.slice(0, limit).map(t => t.word);
      } catch {}
    }

    try {
      results.scientificContext = await getScientificContext(query);
    } catch {}

    return results;
  }

  // Export public API
  window.LumaVocabAPI = Object.freeze({
    // Core API calls
    datamuse: {
      synonyms: datamuseSynonyms,
      antonyms: datamuseAntonyms,
      triggers: datamuseTriggers,
      definitions: datamuseDefinitions,
      soundsLike: datamuseSoundsLike,
      spelledLike: datamuseSpelledLike
    },
    conceptnet: {
      relations: conceptnetRelations,
      synonyms: conceptnetSynonyms,
      isA: conceptnetIsA,
      partOf: conceptnetPartOf,
      usedFor: conceptnetUsedFor,
      capableOf: conceptnetCapableOf,
      causes: conceptnetCauses,
      atLocation: conceptnetAtLocation
    },
    dictionary: dictionaryDefinition,
    wiktionary: wiktionaryDefinition,
    crossref: crossrefSearch,
    semanticScholar: semanticScholarSearch,
    wikipedia: wikipediaSummary,
    
    // High-level functions
    enrichBatch: enrichVocabularyBatch,
    getScientificContext,
    getByCategory: getVocabularyByCategory,
    search: searchVocabulary,
    
    // Categories available
    categories: Object.keys(SCIENTIFIC_CATEGORIES),
    categoryWords: SCIENTIFIC_CATEGORIES,
    
    // Utilities
    clearCache: () => cache.clear(),
    getCacheStats: () => ({ size: cache.size, keys: [...cache.keys()] })
  });
})();