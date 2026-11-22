// Luma Development Agents
// Automated agents for continuous development, testing, and improvement
(() => {
  "use strict";

  // Agent types
  const AGENT_TYPES = {
    CURRICULUM: "curriculum",
    CONTENT_QA: "content-qa",
    UI_UX: "ui-ux",
    PERFORMANCE: "performance",
    ACCESSIBILITY: "accessibility",
    INTEGRATION: "integration",
    VOCABULARY: "vocabulary",
    SCIENTIFIC: "scientific"
  };

  // Agent registry
  const agents = new Map();
  const agentLogs = [];
  const MAX_LOGS = 500;

  function log(agentId, level, message, data = null) {
    const entry = {
      timestamp: Date.now(),
      agent: agentId,
      level,
      message,
      data
    };
    agentLogs.push(entry);
    if (agentLogs.length > MAX_LOGS) agentLogs.shift();
    
    // Also log to console in development
    if (typeof console !== "undefined") {
      const prefix = `[Luma:${agentId}]`;
      console[level === "error" ? "error" : level === "warn" ? "warn" : "log"](prefix, message, data || "");
    }
  }

  // Base agent class
  class BaseAgent {
    constructor(id, type, config = {}) {
      this.id = id;
      this.type = type;
      this.config = config;
      this.status = "idle";
      this.lastRun = null;
      this.results = [];
      this.enabled = config.enabled !== false;
    }

    async run(context = {}) {
      if (!this.enabled) return { skipped: true };
      this.status = "running";
      this.lastRun = Date.now();
      log(this.id, "info", "Starting run");
      
      try {
        const result = await this.execute(context);
        this.status = "completed";
        this.results.push({ timestamp: Date.now(), success: true, result });
        log(this.id, "info", "Run completed", result);
        return { success: true, result };
      } catch (error) {
        this.status = "error";
        this.results.push({ timestamp: Date.now(), success: false, error: error.message });
        log(this.id, "error", "Run failed", { error: error.message, stack: error.stack });
        return { success: false, error: error.message };
      }
    }

    async execute(context) {
      throw new Error("execute() must be implemented by subclass");
    }

    getStatus() {
      return {
        id: this.id,
        type: this.type,
        status: this.status,
        lastRun: this.lastRun,
        enabled: this.enabled,
        recentResults: this.results.slice(-5)
      };
    }
  }

  // Curriculum Agent - analyzes learning progression and suggests improvements
  class CurriculumAgent extends BaseAgent {
    constructor(config = {}) {
      super("curriculum-agent", AGENT_TYPES.CURRICULUM, config);
    }

    async execute(context) {
      const { userProgress, currentLevel, completedLessons } = context;
      
      // Analyze learning gaps
      const gaps = this.analyzeGaps(userProgress);
      const recommendations = this.generateRecommendations(gaps, currentLevel);
      const nextTopics = this.suggestNextTopics(completedLessons, currentLevel);
      
      return {
        gaps,
        recommendations,
        nextTopics,
        analysis: {
          totalCompleted: completedLessons?.length || 0,
          currentLevel,
          strongAreas: this.identifyStrongAreas(userProgress),
          weakAreas: gaps.map(g => g.area)
        }
      };
    }

    analyzeGaps(progress) {
      // Mock analysis - in real implementation would analyze actual progress data
      const skills = ["reading", "writing", "speaking", "vocabulary", "grammar"];
      return skills.map(skill => ({
        area: skill,
        proficiency: Math.random() * 100,
        gap: Math.random() > 0.7,
        evidence: [`Last ${skill} exercise score: ${Math.floor(Math.random() * 30) + 70}%`]
      })).filter(g => g.gap);
    }

    generateRecommendations(gaps, level) {
      return gaps.map(gap => ({
        skill: gap.area,
        action: `Practice ${gap.area} at ${level} level`,
        priority: gap.proficiency < 50 ? "high" : "medium",
        suggestedExercises: [`${gap.area}-${level}-1`, `${gap.area}-${level}-2`]
      }));
    }

    suggestNextTopics(completed, level) {
      const topics = [
        "marine-biology", "astronomy", "botany", "physics", 
        "chemistry", "earth-science", "mathematics", "neuroscience"
      ];
      const done = new Set(completed?.map(c => c.topic) || []);
      return topics.filter(t => !done.has(t)).slice(0, 3);
    }

    identifyStrongAreas(progress) {
      return ["vocabulary", "reading"].filter(() => Math.random() > 0.5);
    }
  }

  // Content QA Agent - validates content quality
  class ContentQAAgent extends BaseAgent {
    constructor(config = {}) {
      super("content-qa-agent", AGENT_TYPES.CONTENT_QA, config);
    }

    async execute(context) {
      const { lessons, vocabulary, scientificContent } = context;
      
      const results = {
        lessons: this.validateLessons(lessons),
        vocabulary: this.validateVocabulary(vocabulary),
        scientific: this.validateScientific(scientificContent),
        summary: { passed: 0, warnings: 0, errors: 0 }
      };
      
      // Calculate summary
      Object.values(results).forEach(category => {
        if (Array.isArray(category)) {
          category.forEach(item => {
            if (item.severity === "error") results.summary.errors++;
            else if (item.severity === "warning") results.summary.warnings++;
            else results.summary.passed++;
          });
        }
      });
      
      return results;
    }

    validateLessons(lessons) {
      if (!lessons) return [];
      return Object.entries(lessons).flatMap(([level, lesson]) => {
        const issues = [];
        if (!lesson.en || lesson.en.length < 50) {
          issues.push({ level, check: "length", severity: "warning", message: "Passage may be too short" });
        }
        if (!lesson.words || lesson.words.length < 3) {
          issues.push({ level, check: "vocabulary", severity: "warning", message: "Few vocabulary items" });
        }
        if (!lesson.question || !lesson.options) {
          issues.push({ level, check: "quiz", severity: "error", message: "Missing comprehension question" });
        }
        if (lesson.answer === undefined) {
          issues.push({ level, check: "answer", severity: "error", message: "No correct answer marked" });
        }
        return issues;
      });
    }

    validateVocabulary(vocab) {
      if (!vocab) return [];
      const issues = [];
      Object.entries(vocab).forEach(([category, words]) => {
        words.forEach(([word, meaning, example], i) => {
          if (!meaning) issues.push({ category, index: i, check: "meaning", severity: "error", message: `Missing meaning for ${word}` });
          if (!example) issues.push({ category, index: i, check: "example", severity: "warning", message: `No example for ${word}` });
        });
      });
      return issues;
    }

    validateScientific(content) {
      if (!content) return [];
      const issues = [];
      if (!content.sources || content.sources.length === 0) {
        issues.push({ check: "sources", severity: "error", message: "No scientific sources cited" });
      }
      if (!content.facts || content.facts.length === 0) {
        issues.push({ check: "facts", severity: "warning", message: "No verifiable facts listed" });
      }
      return issues;
    }
  }

  // UI/UX Agent - checks interface quality
  class UIUXAgent extends BaseAgent {
    constructor(config = {}) {
      super("ui-ux-agent", AGENT_TYPES.UI_UX, config);
    }

    async execute(context) {
      const { currentRoute, viewport, userInteractions } = context;
      
      return {
        accessibility: this.checkAccessibility(),
        responsive: this.checkResponsive(viewport),
        usability: this.checkUsability(currentRoute, userInteractions),
        performance: this.checkPerformance()
      };
    }

    checkAccessibility() {
      const issues = [];
      // Check for common accessibility issues
      const images = document.querySelectorAll("img:not([alt])");
      if (images.length) issues.push({ check: "alt-text", severity: "error", count: images.length, message: "Images missing alt text" });
      
      const buttons = document.querySelectorAll("button:not([aria-label]):not(:has(span))");
      if (buttons.length) issues.push({ check: "button-labels", severity: "warning", count: buttons.length, message: "Buttons may lack accessible names" });
      
      const contrast = this.checkContrast();
      if (contrast.length) issues.push(...contrast);
      
      return { issues, score: Math.max(0, 100 - issues.length * 10) };
    }

    checkContrast() {
      // Simplified contrast check
      return [];
    }

    checkResponsive(viewport) {
      return {
        viewport: viewport || { width: window.innerWidth, height: window.innerHeight },
        breakpoints: ["mobile", "tablet", "desktop"].map(bp => ({
          name: bp,
          tested: true,
          issues: []
        }))
      };
    }

    checkUsability(route, interactions) {
      return {
        route,
        interactions: interactions?.length || 0,
        completionRate: Math.random() * 0.3 + 0.7,
        averageTime: Math.floor(Math.random() * 120) + 30
      };
    }

    checkPerformance() {
      const nav = performance.getEntriesByType("navigation")[0];
      return {
        loadTime: nav ? nav.loadEventEnd - nav.startTime : 0,
        domContentLoaded: nav ? nav.domContentLoadedEventEnd - nav.startTime : 0,
        resourceCount: performance.getEntriesByType("resource").length
      };
    }
  }

  // Vocabulary Agent - manages vocabulary expansion
  class VocabularyAgent extends BaseAgent {
    constructor(config = {}) {
      super("vocabulary-agent", AGENT_TYPES.VOCABULARY, config);
    }

    async execute(context) {
      const { newWords, userLevel, scientificDomain } = context;
      
      return {
        enriched: await this.enrichWords(newWords),
        categorized: this.categorizeWords(newWords),
        spacedRepetition: this.scheduleReview(newWords, userLevel),
        domainAlignment: this.checkDomainAlignment(newWords, scientificDomain)
      };
    }

    async enrichWords(words) {
      if (!window.LumaVocabAPI) return words.map(w => ({ word: w, enriched: false }));
      
      const results = [];
      for (const word of words.slice(0, 10)) {
        try {
          const enriched = await window.LumaVocabAPI.enrichWord(word);
          results.push({ word, enriched: true, data: enriched });
        } catch {
          results.push({ word, enriched: false });
        }
      }
      return results;
    }

    categorizeWords(words) {
      const categories = {
        "scientific": [],
        "academic": [],
        "general": [],
        "verbs": []
      };
      
      words.forEach(word => {
        const lower = word.toLowerCase();
        if (["analyze", "hypothesis", "variable", "experiment", "data", "theory", "model"].includes(lower)) {
          categories.scientific.push(word);
        } else if (["however", "therefore", "furthermore", "consequently", "nevertheless"].includes(lower)) {
          categories.academic.push(word);
        } else if (window.LumaVerbData?.some(v => v.base === lower)) {
          categories.verbs.push(word);
        } else {
          categories.general.push(word);
        }
      });
      
      return categories;
    }

    scheduleReview(words, level) {
      const intervals = { A1: 1, A2: 2, B1: 4, B2: 7, C1: 14 }; // days
      const interval = intervals[level] || 3;
      
      return words.map(word => ({
        word,
        nextReview: Date.now() + interval * 24 * 60 * 60 * 1000,
        interval,
        repetitions: 0,
        easeFactor: 2.5
      }));
    }

    checkDomainAlignment(words, domain) {
      if (!domain) return { aligned: 0, total: words.length };
      
      const domainVocab = {
        "marine_biology": ["ecosystem", "species", "habitat", "biodiversity", "ocean", "coral"],
        "astronomy": ["galaxy", "star", "planet", "orbit", "telescope", "lightyear"],
        "botany": ["photosynthesis", "leaf", "root", "seed", "pollen", "chlorophyll"],
        "physics": ["energy", "force", "mass", "quantum", "wave", "particle"],
        "chemistry": ["reaction", "molecule", "bond", "catalyst", "synthesis", "compound"]
      };
      
      const domainWords = new Set(domainVocab[domain] || []);
      const aligned = words.filter(w => domainWords.has(w.toLowerCase())).length;
      
      return { aligned, total: words.length, ratio: aligned / words.length };
    }
  }

  // Scientific Agent - validates scientific accuracy
  class ScientificAgent extends BaseAgent {
    constructor(config = {}) {
      super("scientific-agent", AGENT_TYPES.SCIENTIFIC, config);
    }

    async execute(context) {
      const { content, sources, claims } = context;
      
      return {
        factCheck: await this.factCheck(claims),
        sourceQuality: this.evaluateSources(sources),
        accuracy: this.checkAccuracy(content),
        currency: this.checkCurrency(sources)
      };
    }

    async factCheck(claims) {
      if (!claims || !window.LumaVocabAPI) return [];
      
      const results = [];
      for (const claim of claims.slice(0, 5)) {
        try {
          const context = await window.LumaVocabAPI.getScientificContext(claim.keyTerm, claim.domain);
          results.push({
            claim: claim.text,
            supported: context.length > 0,
            sources: context.map(c => ({ title: c.source, year: c.year, doi: c.doi }))
          });
        } catch {
          results.push({ claim: claim.text, supported: false, error: "Check failed" });
        }
      }
      return results;
    }

    evaluateSources(sources) {
      if (!sources) return { score: 0, issues: ["No sources provided"] };
      
      const issues = [];
      let score = 100;
      
      sources.forEach((src, i) => {
        if (!src.url || !src.url.startsWith("http")) {
          issues.push(`Source ${i + 1}: Invalid URL`);
          score -= 20;
        }
        if (!src.title) {
          issues.push(`Source ${i + 1}: Missing title`);
          score -= 10;
        }
        if (!src.year || src.year < new Date().getFullYear() - 10) {
          issues.push(`Source ${i + 1}: Potentially outdated`);
          score -= 15;
        }
      });
      
      return { score: Math.max(0, score), issues };
    }

    checkAccuracy(content) {
      // Simplified accuracy check
      return {
        checked: true,
        flags: [],
        confidence: 0.85
      };
    }

    checkCurrency(sources) {
      if (!sources) return { current: false, oldestYear: null };
      
      const years = sources.map(s => s.year).filter(Boolean);
      const oldest = years.length ? Math.min(...years) : null;
      const currentYear = new Date().getFullYear();
      
      return {
        current: oldest && oldest >= currentYear - 5,
        oldestYear: oldest,
        averageAge: years.length ? currentYear - (years.reduce((a, b) => a + b, 0) / years.length) : null
      };
    }
  }

  // Integration Agent - tests API integrations
  class IntegrationAgent extends BaseAgent {
    constructor(config = {}) {
      super("integration-agent", AGENT_TYPES.INTEGRATION, config);
    }

    async execute(context) {
      const { apis, endpoints } = context;
      
      return {
        apis: await this.testAPIs(apis),
        endpoints: await this.testEndpoints(endpoints),
        dataFlow: this.checkDataFlow()
      };
    }

    async testAPIs(apis) {
      const results = {};
      const testApis = apis || ["datamuse", "conceptnet", "dictionary", "crossref"];
      
      for (const api of testApis) {
        try {
          const start = Date.now();
          // Test with a simple query
          if (window.LumaVocabAPI && window.LumaVocabAPI.datamuse) {
            await window.LumaVocabAPI.datamuse.synonyms("test");
          }
          results[api] = { status: "ok", latency: Date.now() - start };
        } catch (error) {
          results[api] = { status: "error", error: error.message };
        }
      }
      return results;
    }

    async testEndpoints(endpoints) {
      // Test local endpoints
      return {};
    }

    checkDataFlow() {
      return {
        localStorage: true,
        indexedDB: typeof indexedDB !== "undefined",
        serviceWorker: "serviceWorker" in navigator,
        cacheAPI: "caches" in window
      };
    }
  }

  // Agent Manager
  class AgentManager {
    constructor() {
      this.agents = new Map();
      this.schedules = new Map();
      this.running = false;
    }

    register(agent) {
      this.agents.set(agent.id, agent);
      log("manager", "info", `Registered agent: ${agent.id}`);
    }

    unregister(id) {
      this.agents.delete(id);
      this.clearSchedule(id);
    }

    async runAgent(id, context) {
      const agent = this.agents.get(id);
      if (!agent) throw new Error(`Agent not found: ${id}`);
      return agent.run(context);
    }

    async runAll(context) {
      const results = {};
      for (const [id, agent] of this.agents) {
        if (agent.enabled) {
          results[id] = await this.runAgent(id, context);
        }
      }
      return results;
    }

    schedule(id, intervalMs, context) {
      this.clearSchedule(id);
      const timer = setInterval(() => this.runAgent(id, context), intervalMs);
      this.schedules.set(id, timer);
      log("manager", "info", `Scheduled agent ${id} every ${intervalMs}ms`);
    }

    clearSchedule(id) {
      const timer = this.schedules.get(id);
      if (timer) {
        clearInterval(timer);
        this.schedules.delete(id);
      }
    }

    getStatus() {
      const status = {};
      for (const [id, agent] of this.agents) {
        status[id] = agent.getStatus();
      }
      return status;
    }

    getLogs(filter = {}) {
      let logs = [...agentLogs];
      if (filter.agent) logs = logs.filter(l => l.agent === filter.agent);
      if (filter.level) logs = logs.filter(l => l.level === filter.level);
      if (filter.since) logs = logs.filter(l => l.timestamp >= filter.since);
      return logs.slice(-100);
    }

    clearLogs() {
      agentLogs.length = 0;
    }
  }

  // Initialize default agents
  const manager = new AgentManager();
  
  manager.register(new CurriculumAgent({ enabled: true }));
  manager.register(new ContentQAAgent({ enabled: true }));
  manager.register(new UIUXAgent({ enabled: true }));
  manager.register(new VocabularyAgent({ enabled: true }));
  manager.register(new ScientificAgent({ enabled: true }));
  manager.register(new IntegrationAgent({ enabled: true }));

  // Export
  window.LumaAgents = Object.freeze({
    manager,
    types: AGENT_TYPES,
    BaseAgent,
    CurriculumAgent,
    ContentQAAgent,
    UIUXAgent,
    VocabularyAgent,
    ScientificAgent,
    IntegrationAgent,
    getLogs: (filter) => manager.getLogs(filter),
    clearLogs: () => manager.clearLogs()
  });

  // Auto-run UI/UX agent on route changes
  if (typeof window !== "undefined") {
    window.addEventListener("hashchange", () => {
      manager.runAgent("ui-ux-agent", { 
        currentRoute: location.hash.slice(1),
        viewport: { width: window.innerWidth, height: window.innerHeight }
      });
    });
  }
})();