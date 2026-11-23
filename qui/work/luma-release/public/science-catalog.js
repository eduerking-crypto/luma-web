// Catálogo único de ciencias de Luma.
// Centraliza nombres, ramas, búsquedas y metodología de lectura. El vocabulario
// y la teoría NO se ramifican: siguen siendo comunes para todos los alumnos.
(() => {
  "use strict";

  const b = (label, query, wiki) => ({ label, query, wiki });
  const m = (name, focus, question, questionEn, evidence, evidenceEn, verbs, signals, lead) => ({
    name,
    focus,
    question,
    questionEn,
    evidence,
    evidenceEn,
    verbs,
    signals,
    lead,
  });

  const SCIENCES = [
    {
      id: "all",
      label: "Todas las ciencias",
      en: "Science",
      short: "Todas",
      icon: "shuffle",
      image: "sample",
      query: "science discovery research evidence",
      wiki: "Science",
      branches: [
        b("Método científico", "scientific method", "Scientific method"),
        b("Revisión por pares", "peer review", "Peer review"),
        b("Divulgación científica", "science communication", "Science communication"),
      ],
      sources: ["Nature", "Science", "Scientific Reports", "Royal Society Open Science"],
      method: m(
        "Mirada integradora",
        "pregunta, observación y explicación",
        "¿Qué se observó, qué explicación se probó y qué sigue siendo incierto?",
        "What was observed, which explanation was tested, and what remains uncertain?",
        "observaciones, comparaciones y conclusiones",
        "observations, comparisons and conclusions",
        [["observe", "observar"], ["compare", "comparar"], ["explain", "explicar"]],
        ["evidence", "result", "conclusion", "observed", "study", "data"],
        "En ciencia en general, lee cada texto como una cadena entre una pregunta, una observación y una explicación provisional.",
      ),
    },
    {
      id: "math",
      label: "Matemática",
      en: "Mathematics",
      short: "Matemática",
      icon: "shapes",
      image: "math",
      query: "mathematics proof structure pattern theorem",
      wiki: "Mathematics",
      branches: [
        b("Álgebra", "algebra", "Algebra"),
        b("Geometría", "geometry", "Geometry"),
        b("Análisis", "mathematical analysis", "Mathematical analysis"),
        b("Teoría de números", "number theory", "Number theory"),
        b("Topología", "topology", "Topology"),
        b("Optimización", "mathematical optimization", "Mathematical optimization"),
        b("Matemática aplicada", "applied mathematics", "Applied mathematics"),
      ],
      sources: ["Annals of Mathematics", "Inventiones Mathematicae", "SIAM Review", "Journal of the AMS"],
      method: m(
        "Definir y demostrar",
        "definiciones, estructura y prueba",
        "¿Qué patrón se mantiene y qué condición permite demostrarlo?",
        "Which pattern holds, and what condition makes the proof work?",
        "definiciones, ejemplos y contraejemplos",
        "definitions, examples and counterexamples",
        [["define", "definir"], ["derive", "derivar"], ["prove", "probar"]],
        ["proof", "theorem", "structure", "pattern", "condition", "define", "converge", "model"],
        "Desde la matemática, lee cada afirmación como una estructura que debe definirse, probarse y comprobarse con ejemplos.",
      ),
    },
    {
      id: "physics",
      label: "Física",
      en: "Physics",
      short: "Física",
      icon: "atom",
      image: "physics",
      query: "physics quantum mechanics particle experiment",
      wiki: "Physics",
      branches: [
        b("Mecánica", "classical mechanics", "Classical mechanics"),
        b("Termodinámica", "thermodynamics", "Thermodynamics"),
        b("Electromagnetismo", "electromagnetism", "Electromagnetism"),
        b("Óptica", "optics", "Optics"),
        b("Física cuántica", "quantum mechanics", "Quantum mechanics"),
        b("Relatividad", "relativity", "Theory of relativity"),
        b("Física de partículas", "particle physics", "Particle physics"),
      ],
      sources: ["Physical Review Letters", "Nature Physics", "Science", "Physics Today"],
      method: m(
        "Medir y modelar",
        "magnitudes, modelos y predicciones",
        "¿Qué magnitud se midió y qué predicción del modelo se puso a prueba?",
        "Which quantity was measured, and which model prediction was tested?",
        "mediciones, instrumentos y comparación con modelos",
        "measurements, instruments and comparison with models",
        [["measure", "medir"], ["detect", "detectar"], ["predict", "predecir"]],
        ["measure", "detector", "signal", "model", "prediction", "experiment", "quantum", "energy"],
        "Desde la física, separa siempre la magnitud medida del modelo que se usa para interpretarla.",
      ),
    },
    {
      id: "biology",
      label: "Biología",
      en: "Biology",
      short: "Biología",
      icon: "leaf",
      image: "ocean",
      query: "biology ecology evolution organism genetics",
      wiki: "Biology",
      branches: [
        b("Botánica", "botany plant biology", "Botany"),
        b("Zoología", "zoology animal biology", "Zoology"),
        b("Ecología", "ecology ecosystem", "Ecology"),
        b("Genética", "genetics heredity", "Genetics"),
        b("Evolución", "evolutionary biology", "Evolution"),
        b("Fisiología", "physiology organism function", "Physiology"),
        b("Biología marina", "marine biology ocean ecosystem", "Marine biology"),
      ],
      sources: ["Nature", "PLOS Biology", "Ecology Letters", "Frontiers in Ecology and Evolution"],
      method: m(
        "Observar y clasificar",
        "observación, función y entorno",
        "¿Qué se observó en el organismo y cómo se relaciona con su entorno?",
        "What was observed in the organism, and how does it relate to its environment?",
        "observaciones de campo, comparaciones entre especies y función",
        "field observations, comparisons across species and function",
        [["observe", "observar"], ["classify", "clasificar"], ["adapt", "adaptar"]],
        ["species", "ecosystem", "organism", "adaptation", "evolution", "function", "habitat", "cell"],
        "Desde la biología, parte de la observación del ser vivo y pregunta cómo su estructura cumple una función en su entorno.",
      ),
    },
    {
      id: "chemistry",
      label: "Química",
      en: "Chemistry",
      short: "Química",
      icon: "flask-conical",
      image: "chemistry",
      query: "chemistry molecular reaction materials synthesis",
      wiki: "Chemistry",
      branches: [
        b("Química orgánica", "organic chemistry", "Organic chemistry"),
        b("Química inorgánica", "inorganic chemistry", "Inorganic chemistry"),
        b("Fisicoquímica", "physical chemistry", "Physical chemistry"),
        b("Química analítica", "analytical chemistry", "Analytical chemistry"),
        b("Bioquímica", "biochemistry", "Biochemistry"),
        b("Química verde", "green chemistry sustainability", "Green chemistry"),
        b("Ciencia de materiales", "materials science", "Materials science"),
      ],
      sources: ["Journal of the American Chemical Society", "Angewandte Chemie", "Nature Chemistry", "Chemical Science"],
      method: m(
        "Seguir la reacción",
        "sustancias, condiciones y mecanismo",
        "¿Qué sustancias cambiaron, bajo qué condiciones y por qué mecanismo?",
        "Which substances changed, under which conditions, and through what mechanism?",
        "ecuaciones, condiciones experimentales y mecanismos",
        "equations, experimental conditions and mechanisms",
        [["mix", "mezclar"], ["react", "reaccionar"], ["form", "formar"]],
        ["reaction", "molecule", "bond", "catalyst", "mechanism", "compound", "yield", "equilibrium"],
        "Desde la química, identifica primero las sustancias, después las condiciones y al final la explicación del cambio.",
      ),
    },
    {
      id: "medicine",
      label: "Medicina",
      en: "Medicine",
      short: "Medicina",
      icon: "heart",
      image: "sample",
      query: "medicine clinical trial patient evidence public health",
      wiki: "Medicine",
      branches: [
        b("Anatomía", "anatomy", "Anatomy"),
        b("Fisiología humana", "human physiology", "Human physiology"),
        b("Patología", "pathology disease", "Pathology"),
        b("Farmacología", "pharmacology drugs", "Pharmacology"),
        b("Epidemiología", "epidemiology", "Epidemiology"),
        b("Medicina clínica", "clinical medicine trial", "Clinical medicine"),
        b("Salud pública", "public health", "Public health"),
      ],
      sources: ["The Lancet", "New England Journal of Medicine", "JAMA", "BMJ"],
      method: m(
        "Evaluar la evidencia",
        "paciente, intervención y resultado",
        "¿A quién se estudió, qué intervención se aplicó y qué resultado se observó?",
        "Who was studied, what intervention was used, and what outcome was observed?",
        "datos clínicos, comparaciones y límites del estudio",
        "clinical data, comparisons and study limitations",
        [["treat", "tratar"], ["monitor", "monitorizar"], ["evaluate", "evaluar"]],
        ["patient", "clinical", "trial", "outcome", "treatment", "dose", "evidence", "risk"],
        "Desde la medicina, distingue el caso individual del grupo estudiado y comprueba siempre el beneficio, el riesgo y el límite de la evidencia.",
      ),
    },
    {
      id: "astronomy",
      label: "Astronomía",
      en: "Astronomy",
      short: "Astronomía",
      icon: "telescope",
      image: "nebula",
      query: "astronomy galaxy telescope astrophysics cosmology",
      wiki: "Astronomy",
      branches: [
        b("Astrofísica", "astrophysics", "Astrophysics"),
        b("Cosmología", "cosmology universe", "Cosmology"),
        b("Planetología", "planetary science", "Planetary science"),
        b("Astrobiología", "astrobiology", "Astrobiology"),
        b("Astronomía observacional", "observational astronomy telescope", "Observational astronomy"),
        b("Astronomía de rayos X", "X-ray astronomy", "X-ray astronomy"),
        b("Formación estelar", "star formation", "Star formation"),
      ],
      sources: ["NASA Science", "ESA", "The Astrophysical Journal", "Nature Astronomy"],
      method: m(
        "Leer la señal",
        "observación lejana, escala e interpretación",
        "¿Qué señal llegó al instrumento y qué nos permite inferir sobre el objeto lejano?",
        "What signal reached the instrument, and what does it let us infer about the distant object?",
        "imágenes, espectros, temporadas de observación y modelos",
        "images, spectra, observing campaigns and models",
        [["observe", "observar"], ["detect", "detectar"], ["infer", "deducir"]],
        ["telescope", "galaxy", "stellar", "light", "orbit", "redshift", "nebula", "instrument"],
        "Desde la astronomía, separa lo que el telescopio capta de la historia que se reconstruye a partir de esa señal.",
      ),
    },
    {
      id: "statistics",
      label: "Estadística",
      en: "Statistics",
      short: "Estadística",
      icon: "chart-column-increasing",
      image: "math",
      query: "statistics inference probability data uncertainty",
      wiki: "Statistics",
      branches: [
        b("Probabilidad", "probability theory", "Probability theory"),
        b("Inferencia estadística", "statistical inference", "Statistical inference"),
        b("Regresión", "regression analysis", "Regression analysis"),
        b("Diseño experimental", "design of experiments", "Design of experiments"),
        b("Series temporales", "time series", "Time series"),
        b("Estadística bayesiana", "Bayesian statistics", "Bayesian statistics"),
        b("Análisis de datos", "data analysis", "Data analysis"),
      ],
      sources: ["Journal of the American Statistical Association", "Biometrika", "Annals of Statistics", "Statistical Science"],
      method: m(
        "Cuantificar la incertidumbre",
        "datos, variación y estimación",
        "¿Qué datos se reunieron, qué variación muestran y cuánto se puede afirmar?",
        "What data were collected, how much do they vary, and how far can the claim go?",
        "muestras, intervalos, comparaciones y supuestos",
        "samples, intervals, comparisons and assumptions",
        [["sample", "muestrear"], ["estimate", "estimar"], ["test", "comprobar"]],
        ["data", "sample", "estimate", "uncertainty", "probability", "model", "variation", "confidence"],
        "Desde la estadística, lee cada cifra como una estimación con variación: pregunta por la muestra, el método y el margen de incertidumbre.",
      ),
    },
    {
      id: "engineering",
      label: "Ingenierías",
      en: "Engineering",
      short: "Ingenierías",
      icon: "blocks",
      image: "transit",
      query: "engineering design system materials optimization",
      wiki: "Engineering",
      branches: [
        b("Ingeniería civil", "civil engineering infrastructure", "Civil engineering"),
        b("Ingeniería mecánica", "mechanical engineering", "Mechanical engineering"),
        b("Ingeniería eléctrica", "electrical engineering", "Electrical engineering"),
        b("Ingeniería informática", "computer engineering", "Computer engineering"),
        b("Ingeniería química", "chemical engineering", "Chemical engineering"),
        b("Ingeniería ambiental", "environmental engineering water", "Environmental engineering"),
        b("Ingeniería biomédica", "biomedical engineering", "Biomedical engineering"),
      ],
      sources: ["Nature Engineering", "ASCE Journals", "IEEE Spectrum", "Science Advances"],
      method: m(
        "Diseñar y verificar",
        "necesidad, restricciones y rendimiento",
        "¿Qué problema se quiere resolver, qué restricciones hay y cómo se verificó la solución?",
        "What problem is being solved, what constraints apply, and how was the solution verified?",
        "requisitos, prototipos, pruebas y criterios de eficiencia",
        "requirements, prototypes, tests and efficiency criteria",
        [["design", "diseñar"], ["build", "construir"], ["test", "probar"]],
        ["design", "system", "model", "efficiency", "constraint", "prototype", "performance", "material"],
        "Desde las ingenierías, lee el texto como un diseño: necesidad, restricciones, solución y prueba de que funciona.",
      ),
    },
    {
      id: "biotechnology",
      label: "Biotecnología",
      en: "Biotechnology",
      short: "Biotecnología",
      icon: "combine",
      image: "ink",
      query: "biotechnology synthetic biology genome editing bioprocess",
      wiki: "Biotechnology",
      branches: [
        b("Ingeniería genética", "genetic engineering", "Genetic engineering"),
        b("Biología sintética", "synthetic biology", "Synthetic biology"),
        b("Bioprocesos", "bioprocess engineering fermentation", "Bioprocess engineering"),
        b("Biotecnología médica", "medical biotechnology", "Biotechnology"),
        b("Agrobiotecnología", "agricultural biotechnology", "Agricultural biotechnology"),
        b("Bioinformática", "bioinformatics", "Bioinformatics"),
        b("Enzimología industrial", "industrial enzymes", "Enzyme"),
      ],
      sources: ["Nature Biotechnology", "Science", "Cell Systems", "ACS Synthetic Biology"],
      method: m(
        "Diseñar con vida",
        "sistema biológico, herramienta y aplicación",
        "¿Qué sistema biológico se usa, qué herramienta lo modifica y para qué aplicación?",
        "Which biological system is used, which tool modifies it, and for what application?",
        "experimentos controlados, rendimiento y seguridad",
        "controlled experiments, yield and safety",
        [["engineer", "modificar"], ["express", "expresar"], ["apply", "aplicar"]],
        ["gene", "genome", "cell", "enzyme", "design", "edit", "vectors", "production"],
        "Desde la biotecnología, identifica el organismo o sistema vivo, la herramienta empleada y el problema práctico que se quiere resolver.",
      ),
    },
    {
      id: "linguistics",
      label: "Lingüística",
      en: "Linguistics",
      short: "Lingüística",
      icon: "languages",
      image: "ink",
      query: "linguistics syntax semantics language acquisition corpus",
      wiki: "Linguistics",
      branches: [
        b("Fonética", "phonetics speech sounds", "Phonetics"),
        b("Fonología", "phonology", "Phonology"),
        b("Morfología", "morphology linguistics", "Morphology (linguistics)"),
        b("Sintaxis", "syntax linguistics", "Syntax"),
        b("Semántica", "semantics linguistics", "Semantics"),
        b("Pragmática", "pragmatics", "Pragmatics"),
        b("Sociolingüística", "sociolinguistics", "Sociolinguistics"),
        b("Lingüística computacional", "computational linguistics", "Computational linguistics"),
      ],
      sources: ["Language", "Linguistic Inquiry", "Computational Linguistics", "Journal of Linguistics"],
      method: m(
        "Analizar el uso",
        "forma, significado y contexto",
        "¿Qué forma aparece, qué significa en el texto y cómo cambia con el contexto?",
        "Which form appears, what does it mean in the text, and how does context change it?",
        "corpus, ejemplos de uso y contrastes entre hablantes",
        "corpora, examples of use and contrasts between speakers",
        [["describe", "describir"], ["interpret", "interpretar"], ["compare", "comparar"]],
        ["language", "word", "meaning", "syntax", "speaker", "context", "sentence", "corpus"],
        "Desde la lingüística, observa la forma de la lengua antes que nada; después relaciona significado, uso y contexto.",
      ),
    },
    {
      id: "sociology",
      label: "Sociología",
      en: "Sociology",
      short: "Sociología",
      icon: "hand",
      image: "transit",
      query: "sociology social research society institutions inequality",
      wiki: "Sociology",
      branches: [
        b("Teoría social", "social theory", "Social theory"),
        b("Métodos de investigación", "social research methods", "Social research"),
        b("Estratificación social", "social stratification", "Social stratification"),
        b("Sociología de la familia", "family sociology", "Family"),
        b("Sociología de la educación", "sociology of education", "Sociology of education"),
        b("Sociología urbana", "urban sociology", "Urban sociology"),
        b("Sociología digital", "digital sociology social media", "Digital sociology"),
      ],
      sources: ["American Sociological Review", "Sociological Science", "The British Journal of Sociology", "Social Forces"],
      method: m(
        "Explicar lo social",
        "grupos, relaciones e instituciones",
        "¿Qué grupo se estudió, qué relación se observó y qué contexto social importa?",
        "Which group was studied, what relationship was observed, and which social context matters?",
        "entrevistas, encuestas, estadísticas sociales y comparaciones",
        "interviews, surveys, social statistics and comparisons",
        [["survey", "encuestar"], ["compare", "comparar"], ["interpret", "interpretar"]],
        ["society", "group", "social", "institution", "inequality", "community", "survey", "context"],
        "Desde la sociología, no pierdas de vista al grupo: quién participa, qué relación se mide y qué contexto social la explica.",
      ),
    },
    {
      id: "microbiology",
      label: "Microbiología",
      en: "Microbiology",
      short: "Microbiología",
      icon: "microscope",
      image: "sample",
      query: "microbiology bacteria virus microbiome microbe",
      wiki: "Microbiology",
      branches: [
        b("Bacteriología", "bacteriology", "Bacteriology"),
        b("Virología", "virology", "Virology"),
        b("Micología", "mycology fungi", "Mycology"),
        b("Parasitología", "parasitology", "Parasitology"),
        b("Microbiología ambiental", "environmental microbiology", "Environmental microbiology"),
        b("Microbiología clínica", "clinical microbiology", "Clinical microbiology"),
        b("Inmunología", "immunology", "Immunology"),
      ],
      sources: ["Nature Microbiology", "Microbiology", "Cell Host & Microbe", "mBio"],
      method: m(
        "Ver lo invisible",
        "organismo, hábitat y efecto",
        "¿Qué microorganismo aparece, dónde vive y qué efecto tiene en su huésped o entorno?",
        "Which microorganism appears, where does it live, and what effect does it have on its host or environment?",
        "cultivos, secuenciación, microscopía y comparaciones",
        "cultures, sequencing, microscopy and comparisons",
        [["culture", "cultivar"], ["identify", "identificar"], ["measure", "medir"]],
        ["bacteria", "microbe", "microbiome", "virus", "cell", "host", "culture", "sequence"],
        "Desde la microbiología, haz visible lo invisible: identifica el organismo, su hábitat y el efecto que produce antes de aceptar una conclusión.",
      ),
    },
    {
      id: "molecular_biology",
      label: "Biología molecular",
      en: "Molecular biology",
      short: "Biología molecular",
      icon: "dna",
      image: "ink",
      query: "molecular biology gene expression genome protein DNA",
      wiki: "Molecular biology",
      branches: [
        b("Genómica", "genomics", "Genomics"),
        b("Proteómica", "proteomics", "Proteomics"),
        b("Regulación génica", "gene regulation", "Gene expression"),
        b("Transcripción y traducción", "transcription translation biology", "Transcription (biology)"),
        b("Epigenética", "epigenetics", "Epigenetics"),
        b("Edición del genoma", "genome editing CRISPR", "Genome editing"),
        b("Estructura de proteínas", "protein structure", "Protein structure"),
      ],
      sources: ["Nature", "Cell", "Molecular Cell", "Nucleic Acids Research"],
      method: m(
        "Seguir la información",
        "molécula, secuencia y mecanismo",
        "¿Qué molécula participa, qué secuencia importa y cómo se transmite la información?",
        "Which molecule is involved, which sequence matters, and how is information transmitted?",
        "secuencias, estructuras, experimentos de expresión y controles",
        "sequences, structures, expression experiments and controls",
        [["sequence", "secuenciar"], ["bind", "unir"], ["express", "expresar"]],
        ["gene", "DNA", "protein", "sequence", "expression", "genome", "molecule", "cells"],
        "Desde la biología molecular, sigue el rastro de la información: molécula, secuencia, mecanismo y control experimental.",
      ),
    },
  ];

  // Compatibilidad con las disciplinas que ya existían en versiones anteriores.
  const LEGACY = Object.freeze({
    ocean: "biology",
    plants: "biology",
    space: "astronomy",
    earth: "engineering",
    math: "math",
    physics: "physics",
    chemistry: "chemistry",
    all: "all",
  });

  const byId = new Map(SCIENCES.map((science) => [science.id, science]));
  const norm = (value) =>
    String(value ?? "")
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[\s-]+/g, "_");

  function normalize(id) {
    const key = norm(id);
    if (byId.has(key)) return key;
    if (Object.hasOwn(LEGACY, key)) return LEGACY[key];
    return "all";
  }

  function get(id) {
    return byId.get(normalize(id)) || SCIENCES[0];
  }

  function branchFor(id, label) {
    const science = get(id);
    const key = norm(label);
    if (!key) return null;
    return science.branches.find((branch) => norm(branch.label) === key) || null;
  }

  function queryFor(id, branchLabel) {
    const science = get(id);
    const branch = branchFor(id, branchLabel);
    return [science.query, branch?.query].filter(Boolean).join(" ");
  }

  function wikiFor(id, branchLabel) {
    const science = get(id);
    return branchFor(id, branchLabel)?.wiki || science.wiki;
  }

  function labelFor(id) {
    return get(id).label;
  }

  function methodFor(id) {
    return get(id).method;
  }

  window.LumaScienceCatalog = Object.freeze({
    SCIENCES: Object.freeze(SCIENCES),
    ALL: SCIENCES[0],
    LEGACY,
    normalize,
    get,
    branchFor,
    queryFor,
    wikiFor,
    labelFor,
    methodFor,
  });
})();
