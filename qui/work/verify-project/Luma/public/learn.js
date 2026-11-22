/* Luma's guided unit. All educational text and activities are original. */
(() => {
  "use strict";
  const levels = ["A1", "A2", "B1", "B2", "C1"];
  const sources =
    '<a href="https://doi.org/10.1038/srep45750" target="_blank" rel="noopener noreferrer">Martini y Haddock · Scientific Reports (2017)</a> · <a href="https://oceanexplorer.noaa.gov/ocean-fact/living-light/" target="_blank" rel="noopener noreferrer">NOAA Ocean Exploration</a>';
  // Each question stores the correct option and a teaching note separately.
  const q = (prompt, options, answer, why) => ({
    prompt,
    options,
    answer,
    why,
  });
  const units = {
    A1: {
      goal: "Reconocer colores y describir un animal en presente.",
      en: [
        "The sea is dark. A small fish swims in the water. It has a light on its body.",
        "Some sea animals make their own light. The light is often blue. We call this bioluminescence.",
      ],
      es: [
        "El mar está oscuro. Un pez pequeño nada en el agua. Tiene una luz en el cuerpo.",
        "Algunos animales marinos producen su propia luz. La luz suele ser azul. A esto lo llamamos bioluminiscencia.",
      ],
      words: [
        ["dark", "oscuro"],
        ["body", "cuerpo"],
        ["light", "luz"],
        ["blue", "azul"],
      ],
      read: q(
        "What do some sea animals make?",
        ["Their own light", "A blue sky", "Fresh water"],
        0,
        "“Make their own light” significa que producen su propia luz.",
      ),
      model: "The sea is dark. The fish has a blue light.",
      task: "Describe el mar y el pez en dos oraciones. Usa sea o fish y un color.",
      min: 6,
      checks: [
        ["un animal o su entorno", /\b(fish|sea|ocean|animal)\b/i],
        ["un color", /\b(blue|green|red|white|yellow)\b/i],
      ],
      say: "The fish has a light.",
      oral: "En fish /fɪʃ/, termina con el sonido suave de pedir silencio. En light /laɪt/, deja oír la t final.",
      grammar: "El presente con be y have",
      rule: "Usa is para describir una cosa. Usa has para decir qué tiene una persona o un animal.",
      examples: [
        ["The water is dark.", "El agua está oscura."],
        ["The fish has a light.", "El pez tiene una luz."],
      ],
      exercises: [
        q(
          "The water ___ dark.",
          ["are", "is", "am"],
          1,
          "Water es singular, por eso se usa is.",
        ),
        q(
          "The fish ___ a light.",
          ["has", "have", "are"],
          0,
          "Con un sujeto singular de tercera persona usamos has.",
        ),
      ],
      exam: [
        q(
          "“The fish is blue.” ¿Qué color tiene?",
          ["Negro", "Azul", "Rojo"],
          1,
          "Blue significa azul.",
        ),
        q(
          "One small fish ___ in the sea.",
          ["live", "are", "lives"],
          2,
          "Fish es singular aquí. En el presente, live lleva -s.",
        ),
        q(
          "Completa “I can see two ___.”",
          ["animals", "animal", "an animal"],
          0,
          "Two indica más de uno. El plural de animal es animals.",
        ),
        q(
          "¿Cuál es una pregunta?",
          ["The sea is dark.", "Is the sea dark?", "The dark sea."],
          1,
          "Para preguntar con be, pon is antes del sujeto.",
        ),
      ],
      talk: ["This article is about…", "The animal is…", "It has…"],
      talkGoal: "Nombra el tema y describe al animal con dos detalles.",
    },
    A2: {
      goal: "Explicar una función con can y for.",
      en: [
        "In deep water, sunlight is weak. Some fish and jellyfish can make light inside their bodies. This light is usually blue.",
        "A fish can use light to find food. Other animals flash when a bigger animal comes near. A flash can give them time to swim away.",
      ],
      es: [
        "En aguas profundas, la luz del sol es débil. Algunos peces y medusas pueden producir luz en su cuerpo. Esta luz suele ser azul.",
        "Un pez puede usar la luz para encontrar alimento. Otros animales emiten un destello cuando se acerca un animal más grande. Un destello puede darles tiempo para alejarse nadando.",
      ],
      words: [
        ["deep", "profundo"],
        ["food", "alimento"],
        ["flash", "destello"],
        ["near", "cerca"],
      ],
      read: q(
        "How can a flash help an animal?",
        [
          "It warms the sea.",
          "It makes the water clear.",
          "It gives the animal time to escape.",
        ],
        2,
        "“Time to swim away” describe una oportunidad para escapar.",
      ),
      model:
        "Some fish can make light. They use it to find food or to escape from bigger animals.",
      task: "Escribe dos maneras en que la luz ayuda a los animales. Usa can y un verbo que describa una acción.",
      min: 10,
      checks: [
        ["el verbo modal can", /\bcan\b/i],
        [
          "una acción del animal",
          /\b(find|escape|swim|hide|hunt|catch|attract)\b/i,
        ],
      ],
      say: "A flash can help a fish escape.",
      oral: "Distingue flash /flæʃ/ de fish /fɪʃ/. En escape, la sílaba fuerte es la segunda: es-CAPE.",
      grammar: "Capacidad y propósito",
      rule: "Después de can, usa el verbo en su forma base. Usa to seguido de verbo para explicar para qué sirve algo.",
      examples: [
        ["A squid can swim.", "Un calamar puede nadar."],
        ["It glows to attract prey.", "Brilla para atraer presas."],
      ],
      exercises: [
        q(
          "A squid can ___ away.",
          ["swims", "swim", "swimming"],
          1,
          "Can va seguido del verbo base swim.",
        ),
        q(
          "The animal flashes ___ escape.",
          ["to", "for", "at"],
          0,
          "To escape expresa propósito. For pediría un sustantivo o una forma en -ing en otro contexto.",
        ),
      ],
      exam: [
        q(
          "“The deeper water is colder.” What is being compared?",
          ["Two animals", "Two depths", "Two colors"],
          1,
          "Deeper y colder son comparativos sobre agua a distintas profundidades.",
        ),
        q(
          "Some animals ___ make light.",
          ["cans", "can to", "can"],
          2,
          "Can se mantiene igual con un sujeto plural.",
        ),
        q(
          "Select the past tense of swim.",
          ["swam", "swimmed", "swims"],
          0,
          "Swim es irregular. Su pasado simple es swam.",
        ),
        q(
          "Choose a sentence about purpose.",
          [
            "The fish lives here.",
            "The fish glows to find prey.",
            "The fish was blue.",
          ],
          1,
          "To find prey explica para qué brilla.",
        ),
      ],
      talk: ["The article describes…", "This animal can…", "It uses light to…"],
      talkGoal: "Explica una capacidad del animal y para qué le sirve.",
    },
    B1: {
      goal: "Relacionar una observación con su causa.",
      en: [
        "In the twilight zone, a fish may look like a dark shape against the faint light above it. A predator swimming below can see that shape.",
        "Some fish produce light on the lower side of their bodies. When this light matches the background, their outline becomes harder to see. Scientists call this kind of camouflage counterillumination.",
      ],
      es: [
        "En la zona crepuscular, un pez puede parecer una silueta oscura contra la débil luz que llega desde arriba. Un depredador que nade debajo puede ver esa silueta.",
        "Algunos peces producen luz en la parte inferior del cuerpo. Cuando esa luz coincide con la del fondo, es más difícil distinguir su silueta. Los científicos llaman contrailuminación a este camuflaje.",
      ],
      words: [
        ["below", "debajo"],
        ["outline", "silueta"],
        ["faint", "tenue"],
        ["matches", "coincide con"],
      ],
      read: q(
        "Why is a glowing belly sometimes useful?",
        [
          "It always scares predators.",
          "It makes the fish blend into the light above.",
          "It helps sunlight reach the seabed.",
        ],
        1,
        "La luz inferior reduce el contraste de la silueta vista desde abajo.",
      ),
      model:
        "A predator may see the outline of a fish from below. The fish is harder to see because its belly gives off light that matches the background.",
      task: "Explica cómo puede esconderse un pez que brilla. Menciona el punto de vista del depredador y usa because o so.",
      min: 16,
      checks: [
        ["una relación causal", /\b(because|so|since)\b/i],
        ["la posición del observador", /\b(below|under|underneath|beneath)\b/i],
      ],
      say: "The fish is harder to see from below.",
      oral: "Une harder to see como un grupo. En below /bɪˈloʊ/, la segunda sílaba recibe el acento.",
      grammar: "Causa y efecto",
      rule: "Because introduce una razón. So introduce la consecuencia. Cambia el orden de las ideas al pasar de una forma a la otra.",
      examples: [
        [
          "The outline fades because the lights match.",
          "La silueta se atenúa porque las luces coinciden.",
        ],
        [
          "The lights match, so the outline fades.",
          "Las luces coinciden, así que la silueta se atenúa.",
        ],
      ],
      exercises: [
        q(
          "The belly glows, ___ the outline is less visible.",
          ["because", "although", "so"],
          2,
          "La segunda parte expresa la consecuencia.",
        ),
        q(
          "“Faint light” means light that is…",
          ["weak", "bright", "moving"],
          0,
          "Faint describe una luz tenue o débil.",
        ),
      ],
      exam: [
        q(
          "The fish blends in because its belly matches the sky. What is the cause?",
          ["It blends in.", "Its belly matches the sky.", "It swims fast."],
          1,
          "Después de because aparece la causa.",
        ),
        q(
          "Complete “If the light changes, the fish ___ easier to see.”",
          ["was", "being", "may be"],
          2,
          "May be expresa una consecuencia posible.",
        ),
        q(
          "A scientist who studies fish is a person ___ studies fish.",
          ["who", "where", "when"],
          0,
          "Who introduce una oración relativa referida a una persona.",
        ),
        q(
          "Choose the best paraphrase of “harder to see”.",
          ["More colorful", "Less visible", "Less likely to swim"],
          1,
          "Harder to see significa menos visible.",
        ),
      ],
      talk: [
        "The question is…",
        "One explanation is…",
        "This matters because…",
      ],
      talkGoal: "Une el fenómeno, su explicación y una consecuencia.",
    },
    B2: {
      goal: "Describir un método y distinguir medición de inferencia.",
      en: [
        "How common is the ability to glow? Researchers studied videos from remotely operated vehicles off California. They identified animals in the water column and used previous evidence to classify the ability of each group to produce light.",
        "Roughly three quarters of the observed individuals were considered capable of producing light. This estimate concerns a biological ability. An animal could therefore be counted even when it was not glowing on camera.",
      ],
      es: [
        "¿Qué tan frecuente es la capacidad de brillar? Un equipo estudió videos de vehículos operados a distancia frente a California. Identificó animales en la columna de agua y usó evidencia previa para clasificar la capacidad de cada grupo de producir luz.",
        "Se consideró que cerca de tres cuartas partes de los individuos observados eran capaces de producir luz. La estimación se refiere a una capacidad biológica. Por eso un animal podía incluirse aunque no estuviera brillando ante la cámara.",
      ],
      words: [
        ["evidence", "evidencia"],
        ["estimate", "estimación"],
        ["roughly", "aproximadamente"],
        ["capable", "capaz"],
      ],
      read: q(
        "Which statement follows from the method?",
        [
          "Every individual glowed on camera.",
          "The study covered every ocean.",
          "Prior knowledge helped classify animals.",
        ],
        2,
        "El equipo combinó identificación en video y evidencia previa sobre los grupos.",
      ),
      model:
        "The animals were identified from video records. Although many belonged to groups capable of producing light, this does not tell us how often each animal actually glowed.",
      task: "Resume el método en voz pasiva y añade una limitación con although, however o while.",
      min: 20,
      checks: [
        [
          "una construcción pasiva",
          /\b(were|was|are|is)\s+(identified|classified|observed|recorded|counted|estimated|studied|used|based|examined|analysed|analyzed)/i,
        ],
        ["una reserva o contraste", /\b(although|however|while|whereas)\b/i],
      ],
      say: "The animals were classified using previous evidence.",
      oral: "En classified /ˈklæsɪfaɪd/, acentúa la primera sílaba. En evidence, también: EV-i-dence.",
      grammar: "Voz pasiva para describir métodos",
      rule: "Combina be con un participio para destacar el objeto de estudio. Conserva el tiempo verbal del estudio.",
      examples: [
        [
          "Researchers recorded the dives.",
          "El equipo registró las inmersiones.",
        ],
        ["The dives were recorded.", "Las inmersiones fueron registradas."],
      ],
      exercises: [
        q(
          "The animals ___ from video records.",
          ["were identified", "were identify", "had identifying"],
          0,
          "La pasiva en pasado combina were e identified.",
        ),
        q(
          "Which phrase describes an estimate?",
          [
            "Without exception",
            "Approximately three quarters",
            "In every ocean",
          ],
          1,
          "Approximately comunica que el valor es aproximado.",
        ),
      ],
      exam: [
        q(
          "“The organisms were classified by group.” What is emphasized?",
          [
            "The researchers’ names",
            "The organisms and the method",
            "The date of the next dive",
          ],
          1,
          "La voz pasiva pone el foco en lo que se clasificó.",
        ),
        q(
          "Which sentence reports ability?",
          [
            "They glowed throughout the dive.",
            "They emitted a flash at noon.",
            "They were capable of emitting light.",
          ],
          2,
          "Capable of se refiere a una capacidad.",
        ),
        q(
          "Which connector signals a limitation?",
          ["However", "Therefore", "Consequently"],
          0,
          "However introduce una reserva o contraste.",
        ),
        q(
          "A sample came from California. Which claim is supported?",
          [
            "The sample represents every sea.",
            "The result describes the observed sample.",
            "No animals elsewhere can glow.",
          ],
          1,
          "La ubicación restringe lo que puede inferirse directamente.",
        ),
      ],
      talk: [
        "The researchers examined…",
        "The study estimated…",
        "One limitation is…",
      ],
      talkGoal: "Presenta el método, el resultado y una limitación.",
    },
    C1: {
      goal: "Matizar una conclusión y evaluar hasta dónde se puede generalizar.",
      en: [
        "An estimate of prevalence depends on what counts as evidence. In a survey off California, researchers assigned light-producing capability to observed animals using taxonomic identifications and information about those groups. The resulting figure, about 76 percent, describes individuals within the sampled water column.",
        "Interpreting that figure as the fraction emitting light at any given instant would conflate capacity with behaviour. Extending it to a different habitat would require a further assumption: that the observed assemblage adequately represents the new population.",
      ],
      es: [
        "Una estimación de prevalencia depende de qué se acepta como evidencia. En un estudio frente a California, el equipo atribuyó capacidad luminosa a los animales observados a partir de su identificación taxonómica e información sobre esos grupos. El valor resultante, alrededor del 76 %, describe individuos de la columna de agua muestreada.",
        "Interpretar ese valor como la fracción que emitía luz en un instante dado confundiría capacidad con comportamiento. Extenderlo a otro hábitat requeriría un supuesto adicional: que el conjunto observado representa adecuadamente a la nueva población.",
      ],
      words: [
        ["prevalence", "prevalencia"],
        ["conflate", "confundir conceptos"],
        ["assemblage", "conjunto de organismos"],
        ["assumption", "supuesto"],
      ],
      read: q(
        "What would justify extrapolating the result?",
        [
          "Evidence that the target assemblage is comparable",
          "A larger font for the estimate",
          "Replacing an estimate with an absolute claim",
        ],
        0,
        "Se necesita justificar que muestra y población de destino sean comparables.",
      ),
      model:
        "Although the estimate suggests that light-producing capability is widespread in the sampled assemblage, it cannot establish emission frequency. Generalisation would require evidence that the target habitat supports a comparable population.",
      task: "Interpreta el 76 % para un lector que lo aplica a todo el océano. Distingue muestra y población y formula una condición para extrapolar.",
      min: 25,
      checks: [
        [
          "el alcance de la muestra",
          /\b(sample|sampled|population|assemblage|sampling)\b/i,
        ],
        [
          "un supuesto o condición",
          /\b(would|if|provided|unless|assuming|requires?|depends?)\b/i,
        ],
      ],
      say: "The estimate depends on how representative the sample is.",
      oral: "En representative /ˌrɛprɪˈzɛntətɪv/, destaca ZEN. Agrupa the estimate depends on antes de la segunda parte.",
      grammar: "Matices y condiciones de validez",
      rule: "Suggests expresa apoyo provisional. Would require y provided that permiten nombrar qué evidencia haría razonable una generalización.",
      examples: [
        [
          "The estimate suggests a widespread trait.",
          "La estimación apunta a un rasgo extendido.",
        ],
        [
          "The inference holds provided that the samples are comparable.",
          "La inferencia se sostiene siempre que las muestras sean comparables.",
        ],
      ],
      exercises: [
        q(
          "Which wording best calibrates the claim?",
          [
            "The survey proves a universal rule.",
            "The estimate suggests a common trait in this sample.",
            "Every individual emitted light.",
          ],
          1,
          "Suggests y in this sample preservan la fuerza y el alcance de la evidencia.",
        ),
        q(
          "“Provided that” introduces…",
          [
            "a contradiction",
            "a cause already verified",
            "a condition that must hold",
          ],
          2,
          "La expresión especifica la condición de la que depende la inferencia.",
        ),
      ],
      exam: [
        q(
          "Which inference conflates capacity with behaviour?",
          [
            "Individuals classified as capable must have glowed during filming.",
            "The groups differ in capability.",
            "The study classified observed organisms.",
          ],
          0,
          "Atribuir un evento observado a partir de una capacidad confunde categorías.",
        ),
        q(
          "Complete “Were the sampling frame to change, the estimate ___ shift.”",
          ["has", "might", "is"],
          1,
          "La inversión expresa una condición hipotética compatible con might.",
        ),
        q(
          "Why qualify a proportion with “among observed individuals”?",
          [
            "To imply absolute certainty",
            "To remove units",
            "To identify the denominator and scope",
          ],
          2,
          "La frase precisa a quiénes incluye el cálculo.",
        ),
        q(
          "Choose the best way to test transferability.",
          [
            "Replicate observations in a second habitat using comparable methods.",
            "Remove habitat labels.",
            "Use a stronger adjective in the conclusion.",
          ],
          0,
          "Una réplica comparable permite evaluar directamente la generalización.",
        ),
      ],
      talk: [
        "The claim rests on…",
        "A competing interpretation would be…",
        "To distinguish them, we would need…",
      ],
      talkGoal:
        "Delimita una inferencia y propón evidencia que permita ponerla a prueba.",
    },
  };

  const vocabulary = {
    Océano: [
      ["wave", "ola", "A wave moves across the sea."],
      ["prey", "presa", "The fish moves closer to its prey."],
      ["depth", "profundidad", "The sensor measures depth."],
      ["glow", "brillo / brillar", "Some sea animals glow."],
      ["current", "corriente", "The current carries the drifting jellyfish."],
      ["surface", "superficie", "The boat stays on the surface."],
    ],
    Cuerpo: [
      ["eye", "ojo", "The eye detects light."],
      ["heart", "corazón", "The heart pumps blood."],
      ["hand", "mano", "Raise your hand."],
      ["skin", "piel", "The skin protects the body."],
      ["brain", "cerebro", "The brain receives signals."],
      ["bone", "hueso", "A rib is a bone."],
    ],
    Viajes: [
      ["ticket", "boleto", "I have a train ticket."],
      ["station", "estación", "We meet at the station."],
      ["map", "mapa", "Our map shows the coast."],
      ["journey", "viaje", "The journey takes two hours."],
      ["luggage", "equipaje", "My luggage is light."],
      ["departure", "salida", "Check the departure time."],
    ],
    Colores: [
      ["blue", "azul", "The light is blue."],
      ["green", "verde", "This leaf is green."],
      ["yellow", "amarillo", "The label is yellow."],
      ["red", "rojo", "The pen is red."],
      ["white", "blanco", "The page is white."],
      ["purple", "morado", "The flower is purple."],
    ],
    Números: [
      ["zero", "cero", "The count starts at zero."],
      ["three", "tres", "The jar has three shells."],
      ["thirteen", "trece", "We counted thirteen stones."],
      ["thirty", "treinta", "Wait thirty seconds."],
      ["hundred", "cien", "One hundred metres is a short walk."],
      ["half", "mitad", "Half the circle is shaded."],
    ],
    Objetos: [
      ["desk", "escritorio", "My notebook is on the desk."],
      ["ruler", "regla", "Measure the leaf with a ruler."],
      ["lamp", "lámpara", "Turn on the lamp."],
      ["bottle", "botella", "Fill the bottle with water."],
      ["key", "llave", "The key opens the door."],
      ["lens", "lente", "The lens bends light."],
    ],
    "Física y matemáticas": [
      ["force", "fuerza", "Gravity is a force."],
      ["angle", "ángulo", "A right angle is ninety degrees."],
      ["mass", "masa", "The two blocks have the same mass."],
      ["speed", "rapidez", "Speed is distance divided by time."],
      ["ratio", "razón / proporción", "The ratio is two to one."],
      ["slope", "pendiente", "The slope of this line is positive."],
    ],
    "Tierra y espacio": [
      ["rock", "roca", "The rock has layers."],
      ["orbit", "órbita", "The Moon follows an orbit around Earth."],
      ["crater", "cráter", "The crater is visible tonight."],
      ["mantle", "manto", "Earth’s mantle lies below the crust."],
      ["tide", "marea", "The tide rises along the coast."],
      ["star", "estrella", "The Sun is a star."],
    ],
    Química: [
      ["atom", "átomo", "An atom has a nucleus."],
      ["mixture", "mezcla", "Air is a mixture of gases."],
      ["solid", "sólido", "Ice is a solid."],
      ["liquid", "líquido", "Water is a liquid at room temperature."],
      ["solution", "disolución", "Salt water is a solution."],
      ["bond", "enlace", "Atoms form a chemical bond."],
    ],
    Investigación: [
      ["sample", "muestra", "The researchers collected a sample."],
      ["estimate", "estimación", "The estimate depends on the sample."],
      ["evidence", "evidencia", "The evidence supports the claim."],
      ["uncertainty", "incertidumbre", "The estimate has some uncertainty."],
      ["assumption", "supuesto", "The authors explain their assumption."],
      ["bias", "sesgo", "The instrument may introduce bias."],
    ],
  };

  const escape = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (char) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[char],
    );
  const titles = {
    reading: ["Lectura guiada", "The ocean that glows"],
    writing: ["Escritura", "Cuaderno de escritura"],
    speaking: ["Pronunciación", "Estudio de voz"],
    theory: ["Teoría", "Gramática en contexto"],
    games: ["Juegos", "Parejas de palabras"],
    exercises: ["Ejercicios", "Práctica guiada"],
    exams: ["Exámenes", "Examen de práctica"],
    vocabulary: ["Vocabulario", "Banco de palabras"],
    present: ["Expresión oral", "Expón un artículo"],
  };
  let teardown = () => {};
  function dispose() {
    teardown();
    teardown = () => {};
  }
  const shuffled = (values) => {
    const copy = [...values];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };
  const countWords = (value) =>
    (value.match(/[a-zA-ZÀ-ÿ]+(?:['’-][a-zA-ZÀ-ÿ]+)*/g) || []).length;
  const action = (id, text, primary = false) =>
    `<button type="button" class="ll-button ${primary ? "ll-primary" : ""}" data-ll="${id}">${text}</button>`;
  const nextButton = (id, label) =>
    `<button type="button" class="ll-button" data-ll-go="${id}">${label}</button>`;
  const card = (content, extra = "") =>
    `<section class="ll-card ${extra}">${content}</section>`;
  const feedback = () =>
    '<div class="ll-feedback" aria-live="polite" hidden></div>';
  const show = (el, message, mode = "") => {
    el.hidden = false;
    el.className = `ll-feedback ${mode}`;
    el.textContent = message;
  };
  function speak(text, output, rate = 0.86) {
    if (
      !("speechSynthesis" in window) ||
      !("SpeechSynthesisUtterance" in window)
    ) {
      show(
        output,
        "La síntesis de voz no está disponible aquí. Puedes seguir el texto y la guía de sonidos en pantalla.",
      );
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";
    utterance.rate = rate;
    utterance.onerror = (event) => {
      if (!["canceled", "interrupted"].includes(event.error))
        show(
          output,
          "El navegador no ha podido reproducir la voz. Puedes practicar con el texto en pantalla.",
        );
    };
    window.speechSynthesis.speak(utterance);
  }
  function render(route, root, api) {
    dispose();
    if (!titles[route]) return false;
    const level = levels.includes(api.level()) ? api.level() : "A1";
    const u = units[level],
      [category, title] = titles[route],
      cleanup = [];
    teardown = () => {
      cleanup.splice(0).forEach((f) => f());
      if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    };
    const hasLevel = !["vocabulary", "games"].includes(route);
    const intro = {
      reading: u.goal,
      writing: u.task,
      speaking:
        "Escucha una frase en inglés, graba tu voz y compara las dos versiones.",
      theory: u.goal,
      games: "Une cada palabra en inglés con su significado en español.",
      exercises:
        "Practica la estructura de tu nivel con un ejemplo y dos preguntas.",
      exams:
        "Responde cuatro preguntas de inglés científico. Al terminar podrás revisar cada respuesta.",
      vocabulary:
        "Explora palabras por tema. Escucha cada ejemplo y guarda lo que quieras repasar.",
      present: u.talkGoal,
    }[route];
    root.innerHTML = `<div class="lumalearn"><header class="ll-head"><div><div class="ll-overline">${category}</div><h1 ${route === "reading" ? 'lang="en"' : ""}>${title}</h1><p>${intro}</p></div>${hasLevel ? `<label class="ll-level">Nivel<select aria-label="Nivel de inglés">${levels.map((item) => `<option ${item === level ? "selected" : ""}>${item}</option>`).join("")}</select></label>` : ""}</header><div class="ll-body"></div></div>`;
    const host = root.querySelector(".lumalearn"),
      body = host.querySelector(".ll-body");
    const levelSelect = host.querySelector(".ll-level select");
    if (levelSelect)
      levelSelect.onchange = () => {
        api.set("level", levelSelect.value);
        render(route, root, api);
      };
    host.addEventListener("click", (event) => {
      const link = event.target.closest("[data-ll-go]");
      if (link) api.go(link.dataset.llGo);
    });
    const completed = (id) => api.complete(`${id}-${level}`);
    const ctx = { body, u, level, api, completed, cleanup };
    const views = {
      reading,
      writing,
      speaking,
      theory,
      games,
      exercises,
      exams,
      vocabulary: wordBank,
      present,
    };
    views[route](ctx);
    return true;
  }

  function quizCard(container, question, onCorrect, onAttempt = () => {}) {
    container.innerHTML = `<h3>${escape(question.prompt)}</h3><div class="ll-choices">${question.options.map((option, i) => `<button class="ll-choice" type="button" data-choice="${i}">${escape(option)}</button>`).join("")}</div>${feedback()}`;
    const buttons = [...container.querySelectorAll("[data-choice]")],
      note = container.querySelector(".ll-feedback");
    buttons.forEach((button, i) => {
      button.onclick = () => {
        if (button.disabled) return;
        onAttempt(i === question.answer);
        if (i !== question.answer) {
          button.disabled = true;
          button.classList.add("ll-missed");
          show(note, "Revisa tu elección. " + question.why, "ll-hint");
          return;
        }
        buttons.forEach((b) => {
          b.disabled = true;
        });
        button.classList.add("ll-right");
        show(note, "Correcto. " + question.why, "ll-good");
        onCorrect();
      };
    });
  }
  const gloss = (words) =>
    `<dl class="ll-gloss">${words.map(([en, es]) => `<div><dt lang="en">${en}</dt><dd>${es}</dd></div>`).join("")}</dl>`;
  function reading({ body, u, completed }) {
    body.innerHTML = `<div class="ll-columns"><div class="ll-stack">${card(`<div class="ll-reader-image" role="img" aria-label="Escena marina de la unidad sobre bioluminiscencia"></div><div class="ll-pad"><div class="ll-row ll-between"><span class="ll-chip">Biología marina</span>${action("listen", "Escuchar lectura")}</div><div class="ll-reading" lang="en">${u.en.map((p) => `<p>${p}</p>`).join("")}</div>${feedback()}<details><summary>Leer la traducción</summary>${u.es.map((p) => `<p>${p}</p>`).join("")}</details><p class="ll-source">Lectura educativa original basada en ${sources}.</p></div>`, "ll-edge")}${card('<div class="ll-overline">Comprensión</div><div class="ll-quiz"></div>')}</div><aside class="ll-stack">${card(`<h2>Palabras de la lectura</h2>${gloss(u.words)}${nextButton("vocabulary", "Abrir vocabulario")}`)}${card(`<h2>Continúa la práctica</h2><div class="ll-actions">${nextButton("writing", "Escribir un resumen")}${nextButton("present", "Preparar una exposición")}</div>`)}</aside></div>`;
    body.querySelector('[data-ll="listen"]').onclick = () =>
      speak(u.en.join(" "), body.querySelector(".ll-feedback"));
    quizCard(body.querySelector(".ll-quiz"), u.read, () =>
      completed("reading"),
    );
  }
  function writing({ body, u, level, api, completed }) {
    const key = `writing-draft-${level}`;
    body.innerHTML = `<div class="ll-columns"><div>${card(`<label class="ll-label" for="ll-write">Tu texto en inglés</label><textarea id="ll-write" lang="en" placeholder="Write your answer here…" rows="8" maxlength="6000"></textarea><div class="ll-row ll-between"><span class="ll-count"></span>${action("review", "Revisar mi texto", true)}</div>${feedback()}<div class="ll-review" hidden></div>`)}</div><aside class="ll-stack">${card(`<h2>Palabras de apoyo</h2>${gloss(u.words)}${nextButton("reading", "Consultar lectura")}`)}${card(`<details><summary>Ver una respuesta modelo</summary><p lang="en">${u.model}</p></details>`)}</aside></div>`;
    const field = body.querySelector("textarea"),
      counter = body.querySelector(".ll-count"),
      review = body.querySelector(".ll-review"),
      note = body.querySelector(".ll-feedback");
    const refresh = () => {
      counter.textContent = `${countWords(field.value)} palabras · guardado automático`;
    };
    field.value = api.get(key, "");
    refresh();
    field.oninput = () => {
      api.set(key, field.value);
      refresh();
      review.hidden = true;
      note.hidden = true;
    };
    body.querySelector('[data-ll="review"]').onclick = () => {
      if (!field.value.trim()) {
        show(note, "Escribe tu respuesta para revisarla.");
        field.focus();
        return;
      }
      const checks = [
        [
          countWords(field.value) >= u.min,
          `Al menos ${u.min} palabras para desarrollar la idea`,
        ],
        ...u.checks.map(([desc, re]) => [
          re.test(field.value),
          `Incluye ${desc}`,
        ]),
        [
          /[.!?]["”']?$/.test(field.value.trim()),
          "Termina con un signo de puntuación",
        ],
      ];
      review.hidden = false;
      review.innerHTML = `<h3>Lista de revisión</h3><ul>${checks.map(([ok, desc]) => `<li><strong>${ok ? "Listo" : "Revisa"}</strong> · ${desc}</li>`).join("")}</ul><p>Compara el sentido y la gramática con una versión posible.</p><blockquote lang="en">${u.model}</blockquote>`;
      show(
        note,
        "Esta revisión local comprueba rasgos de tu texto. Puedes volver a editarlo y probar otras formulaciones.",
      );
      if (checks.every((c) => c[0])) {
        completed("writing");
        show(
          note,
          "Has trabajado los rasgos de esta consigna. Tu práctica quedó registrada.",
          "ll-good",
        );
      }
    };
  }
  function theory({ body, u, completed }) {
    body.innerHTML = `<div class="ll-columns"><div class="ll-stack">${card(`<h2>${u.grammar}</h2><p>${u.rule}</p><div class="ll-examples">${u.examples.map(([en, es]) => `<blockquote><strong lang="en">${en}</strong><span>${es}</span></blockquote>`).join("")}</div>`)}${card('<div class="ll-overline">Comprueba la idea</div><div class="ll-quiz"></div>')}</div><aside>${card(`<h2>En la lectura</h2><p lang="en">${u.en[0]}</p>${nextButton("exercises", "Más ejercicios")}`)}</aside></div>`;
    quizCard(body.querySelector(".ll-quiz"), u.exercises[0], () =>
      completed("theory"),
    );
  }
  function exercises({ body, u, completed }) {
    body.innerHTML = `<div class="ll-columns"><div class="ll-stack">${u.exercises.map((_, i) => card(`<div class="ll-overline">Ejercicio ${i + 1} de ${u.exercises.length}</div><div class="ll-quiz"></div>`)).join("")}</div><aside>${card(`<h2>Ejemplo resuelto</h2><blockquote lang="en">${u.examples[0][0]}</blockquote><p>${u.examples[0][1]}</p><p>${u.rule}</p>${nextButton("theory", "Consultar teoría")}`)}</aside></div>`;
    let done = 0;
    body.querySelectorAll(".ll-quiz").forEach((node, i) =>
      quizCard(node, u.exercises[i], () => {
        if (++done === u.exercises.length) completed("exercises");
      }),
    );
  }
  function exams({ body, u, level, api, completed }) {
    let position = 0;
    const answers = [];
    const key = `exam-best-${level}`;
    function draw() {
      const question = u.exam[position];
      const previous = api.get(key, null);
      body.innerHTML = card(
        `<div class="ll-row ll-between"><span class="ll-chip">Pregunta ${position + 1} de ${u.exam.length}</span>${previous !== null ? `<span class="ll-meta">Mejor resultado · ${Number(previous)}/${u.exam.length}</span>` : ""}</div><progress class="ll-progress" max="${u.exam.length}" value="${position}">${position}</progress><fieldset><legend>${question.prompt}</legend><div class="ll-choices">${question.options.map((opt, i) => `<label class="ll-choice"><input type="radio" name="ll-answer" value="${i}"><span>${opt}</span></label>`).join("")}</div></fieldset><div class="ll-row">${action("next", position + 1 === u.exam.length ? "Ver resultado" : "Siguiente pregunta", true)}</div>${feedback()}`,
        "ll-narrow",
      );
      body.querySelector('[data-ll="next"]').onclick = () => {
        const selected = body.querySelector("input:checked");
        if (!selected) {
          show(
            body.querySelector(".ll-feedback"),
            "Elige una respuesta para continuar.",
          );
          return;
        }
        answers.push(Number(selected.value));
        if (++position < u.exam.length) draw();
        else result();
      };
    }
    function result() {
      const score = answers.filter(
        (answer, i) => answer === u.exam[i].answer,
      ).length;
      api.set(key, Math.max(Number(api.get(key, 0)), score));
      completed("exams");
      body.innerHTML = card(
        `<span class="ll-chip">Práctica ${level} completada</span><h2>${score} de ${u.exam.length} respuestas correctas</h2><p>Este resultado corresponde a la práctica de esta unidad.</p><div class="ll-exam-review">${u.exam.map((item, i) => `<div><strong>${answers[i] === item.answer ? "Correcto" : "Para repasar"} · ${item.prompt}</strong><p>Elegiste <b>${item.options[answers[i]]}</b>. ${answers[i] !== item.answer ? `La respuesta es <b>${item.options[item.answer]}</b>. ` : ""}${item.why}</p></div>`).join("")}</div><div class="ll-row">${action("again", "Repetir examen")}${nextButton("theory", "Repasar teoría")}</div>`,
        "ll-narrow",
      );
      body.querySelector('[data-ll="again"]').onclick = () => {
        position = 0;
        answers.length = 0;
        draw();
      };
    }
    draw();
  }
  const dayMs = 86400000;
  function wordMemory(api, term) {
    const record = api.get("word-memory." + term, null);
    return record && Number.isFinite(record.firstSeenAt) && record.halfLife > 0
      ? record
      : null;
  }
  function seeWord(api, term, now = Date.now()) {
    if (wordMemory(api, term)) return;
    api.set("word-memory." + term, {
      firstSeenAt: now,
      lastAttemptAt: null,
      halfLife: 1,
      correct: 0,
      incorrect: 0,
      assisted: 0,
      daily: {},
    });
  }
  function recallEstimate(record, now) {
    const days =
      Math.max(0, now - (record.lastAttemptAt ?? record.firstSeenAt)) / dayMs;
    return 2 ** (-days / record.halfLife);
  }
  function recordAttempt(api, term, correct, guided) {
    const now = Date.now(),
      item = wordMemory(api, term),
      date = new Date(now);
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    const kind = correct ? (guided ? "assisted" : "correct") : "incorrect";
    const counts = item.daily[key] || { correct: 0, incorrect: 0, assisted: 0 };
    const spaced =
      item.lastAttemptAt === null || now - item.lastAttemptAt >= 10 * 60000;
    const halfLife =
      spaced && !guided
        ? Math.max(0.25, Math.min(90, item.halfLife * (correct ? 2 : 0.5)))
        : item.halfLife;
    api.set("word-memory." + term, {
      ...item,
      halfLife,
      lastAttemptAt: now,
      [kind]: item[kind] + 1,
      daily: { ...item.daily, [key]: { ...counts, [kind]: counts[kind] + 1 } },
    });
  }
  function wordBank({ body, api, completed, cleanup }) {
    const categories = Object.keys(vocabulary);
    let topic = api.get("word-topic", categories[0]);
    if (!categories.includes(topic) && topic !== "Guardadas")
      topic = categories[0];
    let saved = api.get("word-saved", []);
    if (!Array.isArray(saved)) saved = [];
    body.innerHTML = `<div class="ll-bank-tools"><label class="ll-field">Tema<select data-ll="topic">${[...categories, "Guardadas"].map((c) => `<option ${c === topic ? "selected" : ""}>${c}</option>`).join("")}</select></label><label class="ll-field">Buscar una palabra<input type="search" placeholder="En inglés o español" data-ll="filter"></label></div><div class="ll-meta ll-results" aria-live="polite"></div><div class="ll-bank"></div>`;
    const grid = body.querySelector(".ll-bank"),
      filter = body.querySelector('[data-ll="filter"]');
    const allWords = Object.values(vocabulary).flat();
    saved
      .filter((en) => allWords.some((w) => w[0] === en))
      .forEach((en) => seeWord(api, en));
    body
      .querySelector(".ll-bank-tools")
      .insertAdjacentHTML(
        "beforeend",
        action("recall", "Repaso espaciado", true),
      );
    const recallButton = body.querySelector('[data-ll="recall"]');
    body
      .querySelector(".ll-bank-tools")
      .insertAdjacentHTML(
        "afterend",
        '<section class="ll-card ll-recall" aria-label="Repaso de vocabulario" hidden></section>',
      );
    const recall = body.querySelector(".ll-recall");
    let observer;
    cleanup.push(() => observer?.disconnect());
    const studyNote =
      '<details><summary>Cómo se calcula el repaso</summary><p>La estimación es p = 2<sup>−d/h</sup>. La d mide los días desde la última práctica o la primera vista. La semivida h comienza en un día. Un acierto la duplica y un error la reduce a la mitad, entre 6 horas y 90 días. Las correcciones guiadas y los intentos a menos de diez minutos mantienen h. Luma usa esta regla heurística para ordenar tus palabras.</p><p><a href="https://aclanthology.org/P16-1174/" target="_blank" rel="noopener noreferrer">Settles y Meeder · A Trainable Spaced Repetition Model for Language Learning (2016)</a></p></details>';
    const normalized = (value) =>
      value
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase();
    const draw = () => {
      const query = normalized(filter.value.trim());
      const all =
        topic === "Guardadas"
          ? Object.values(vocabulary)
              .flat()
              .filter((word) => saved.includes(word[0]))
          : vocabulary[topic];
      const words = all.filter((word) =>
        normalized(word[0] + " " + word[1]).includes(query),
      );
      recall.hidden = true;
      grid.hidden = false;
      recallButton.hidden = false;
      const results = body.querySelector(".ll-results");
      results.hidden = false;
      recallButton.onclick = () => {
        // Flush first impressions that a fast click may precede in IntersectionObserver.
        grid.querySelectorAll("[data-en]").forEach((node) => {
          const rect = node.getBoundingClientRect();
          if (rect.bottom > 0 && rect.top < innerHeight)
            seeWord(api, node.dataset.en);
        });
        const now = Date.now();
        const queue = allWords
          .filter(([en]) => wordMemory(api, en))
          .map((word) => ({
            word,
            p: recallEstimate(wordMemory(api, word[0]), now),
          }))
          .sort((a, b) => a.p - b.p || a.word[0].localeCompare(b.word[0], "en"))
          .slice(0, 6);
        recall.hidden = false;
        if (!queue.length) {
          recall.innerHTML =
            "<p>Explora un tema o guarda una palabra para iniciar tu repaso.</p>" +
            studyNote;
          return;
        }
        grid.hidden = true;
        results.hidden = true;
        recallButton.hidden = true;
        let index = 0,
          independent = 0;
        function question() {
          const { word: target, p } = queue[index],
            term = target[0];
          const choices = shuffled([
            target,
            ...shuffled(allWords.filter((w) => w[1] !== target[1])).slice(0, 2),
          ]).map((w) => w[1]);
          recall.innerHTML = `<div class="ll-row ll-between"><span class="ll-chip">Palabra ${index + 1} de ${queue.length}</span><span class="ll-meta">Recuerdo estimado · ${Math.round(100 * p)} %</span></div><div class="ll-quiz"></div><div class="ll-row">${action("continue", index === queue.length - 1 ? "Ver resultado" : "Siguiente palabra", true)}${action("leave", "Volver al vocabulario")}</div>${studyNote}`;
          const next = recall.querySelector("[data-ll=continue]");
          next.hidden = true;
          let missed = false;
          quizCard(
            recall.querySelector(".ll-quiz"),
            q(
              "¿Qué significa “" + term + "”?",
              choices,
              choices.indexOf(target[1]),
              term + " significa «" + target[1] + "». " + target[2],
            ),
            () => {
              next.hidden = false;
              completed("vocabulary");
            },
            (correct) => {
              recordAttempt(api, term, correct, missed);
              if (!correct) missed = true;
              else if (!missed) independent++;
            },
          );
          next.onclick = () => {
            if (++index < queue.length) {
              question();
              return;
            }
            recall.innerHTML = `<h2>Repaso completado</h2><p>Recordaste ${independent} de ${queue.length} palabras al primer intento.</p>${action("leave", "Volver al vocabulario")}${studyNote}`;
            recall.querySelector("[data-ll=leave]").onclick = draw;
          };
          recall.querySelector("[data-ll=leave]").onclick = draw;
          recall.querySelector("[data-choice]").focus({ preventScroll: true });
        }
        question();
      };
      body.querySelector(".ll-results").textContent =
        `${words.length} ${words.length === 1 ? "palabra" : "palabras"} · ${topic}`;
      grid.innerHTML = words.length
        ? words
            .map(([en, es, example], i) =>
              card(
                `<div class="ll-row ll-between"><h2 lang="en">${en}</h2><button class="ll-save" type="button" data-save="${i}" aria-pressed="${saved.includes(en)}" aria-label="${saved.includes(en) ? "Quitar de guardadas" : "Guardar"} ${en}">${saved.includes(en) ? "★" : "☆"}</button></div><p class="ll-trans">${es}</p><p lang="en">${example}</p>${action("sound-" + i, "Escuchar ejemplo")}${feedback()}`,
              ),
            )
            .join("")
        : card(
            `<h2>${topic === "Guardadas" && !all.length ? "Tu colección empieza aquí" : "Sin coincidencias"}</h2><p>${topic === "Guardadas" && !all.length ? "Usa la estrella de una palabra para volver a ella más tarde." : "Prueba otro término o cambia de tema."}</p>`,
          );
      grid.querySelectorAll("[data-save]").forEach(
        (b) =>
          (b.onclick = () => {
            const en = words[Number(b.dataset.save)][0],
              selected = saved.includes(en);
            seeWord(api, en);
            saved = selected
              ? saved.filter((word) => word !== en)
              : [...saved, en];
            api.set("word-saved", saved);
            if (topic === "Guardadas") draw();
            else {
              b.setAttribute("aria-pressed", String(!selected));
              b.setAttribute(
                "aria-label",
                (selected ? "Guardar " : "Quitar de guardadas ") + en,
              );
              b.textContent = selected ? "☆" : "★";
            }
          }),
      );
      observer?.disconnect();
      if ("IntersectionObserver" in window)
        observer = new IntersectionObserver(
          (entries) => {
            entries
              .filter((e) => e.isIntersecting)
              .forEach((e) => {
                seeWord(api, e.target.dataset.en);
                observer.unobserve(e.target);
              });
          },
          { threshold: 0.3 },
        );
      words.forEach((word, i) => {
        const button = grid.querySelector(`[data-ll="sound-${i}"]`),
          tile = button.closest(".ll-card");
        tile.dataset.en = word[0];
        if (observer) observer.observe(tile);
        else seeWord(api, word[0]);
        button.onclick = (event) => {
          seeWord(api, word[0]);
          speak(
            word[0] + ". " + word[2],
            event.currentTarget.parentElement.querySelector(".ll-feedback"),
          );
        };
      });
    };
    filter.oninput = draw;
    body.querySelector('[data-ll="topic"]').onchange = (e) => {
      topic = e.target.value;
      api.set("word-topic", topic);
      draw();
    };
    draw();
  }
  function games({ body, api, completed }) {
    const categories = Object.keys(vocabulary);
    let topic = api.get("game-topic", categories[0]);
    if (!categories.includes(topic)) topic = categories[0];
    const newRound = () => {
      const words = shuffled(vocabulary[topic]).slice(0, 4),
        right = shuffled(words);
      const matches = new Set();
      let active = null;
      body.innerHTML = card(
        `<div class="ll-game-head"><label class="ll-field">Tema<select data-ll="topic">${categories.map((c) => `<option ${c === topic ? "selected" : ""}>${c}</option>`).join("")}</select></label><span class="ll-chip ll-score">0 de 4 parejas</span></div><p>Elige una palabra de cada columna.</p><div class="ll-pairs">${[
          [words, "Inglés", "en"],
          [right, "Español", "es"],
        ]
          .map(
            ([column, label, lang], side) =>
              `<div><h3>${label}</h3>${column.map((word) => `<button class="ll-choice" type="button" data-side="${side}" data-id="${words.indexOf(word)}" lang="${lang}" aria-pressed="false">${word[side]}</button>`).join("")}</div>`,
          )
          .join(
            "",
          )}</div>${feedback()}<div class="ll-row ll-round" hidden>${action("again", "Jugar otra ronda", true)}${nextButton("vocabulary", "Abrir vocabulario")}</div>`,
        "ll-narrow",
      );
      const note = body.querySelector(".ll-feedback"),
        buttons = [...body.querySelectorAll("[data-side]")];
      const resetActive = () => {
        buttons.forEach((b) => {
          b.classList.remove("ll-selected");
          b.setAttribute("aria-pressed", "false");
        });
        active = null;
      };
      buttons.forEach(
        (b) =>
          (b.onclick = () => {
            if (active && active.dataset.side !== b.dataset.side) {
              if (active.dataset.id === b.dataset.id) {
                matches.add(b.dataset.id);
                [b, active].forEach((el) => {
                  el.disabled = true;
                  el.classList.add("ll-right");
                });
                resetActive();
                body.querySelector(".ll-score").textContent =
                  `${matches.size} de 4 parejas`;
                if (matches.size === 4) {
                  show(note, "Completaste las cuatro parejas.", "ll-good");
                  body.querySelector(".ll-round").hidden = false;
                  completed("games");
                } else
                  show(note, "Pareja correcta. Elige la siguiente.", "ll-good");
              } else {
                resetActive();
                show(
                  note,
                  "Esas palabras tienen significados distintos. Prueba otra pareja.",
                  "ll-hint",
                );
              }
            } else {
              const wasActive = active === b;
              resetActive();
              if (!wasActive) {
                active = b;
                b.classList.add("ll-selected");
                b.setAttribute("aria-pressed", "true");
              }
            }
          }),
      );
      body.querySelector('[data-ll="again"]').onclick = newRound;
      body.querySelector('[data-ll="topic"]').onchange = (e) => {
        topic = e.target.value;
        api.set("game-topic", topic);
        newRound();
      };
    };
    newRound();
  }
  function recorderMarkup() {
    return `<div class="ll-recorder"><div class="ll-row">${action("record", "Grabar mi voz")}<button type="button" class="ll-button" data-ll="stop" hidden>Detener grabación</button></div><p class="ll-meta">El audio se conserva solo mientras esta pantalla está abierta.</p><audio controls hidden aria-label="Reproducir mi grabación"></audio>${feedback()}</div>`;
  }
  function bindRecorder(host, cleanup) {
    const record = host.querySelector('[data-ll="record"]'),
      stop = host.querySelector('[data-ll="stop"]'),
      audio = host.querySelector("audio"),
      note = host.querySelector(".ll-feedback");
    let stream = null,
      recorder = null,
      url = null,
      closed = false,
      timer = null;
    const stopTracks = () => {
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
        stream = null;
      }
    };
    const resetButtons = () => {
      record.disabled = false;
      record.hidden = false;
      stop.hidden = true;
    };
    const release = () => {
      if (timer) clearTimeout(timer);
      stopTracks();
      if (url) {
        URL.revokeObjectURL(url);
        url = null;
      }
    };
    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      record.disabled = true;
      show(
        note,
        "Este navegador no ofrece grabación aquí. Lee el texto en voz alta y usa la guía para autoevaluarte.",
      );
    } else {
      record.onclick = async () => {
        record.disabled = true;
        try {
          if ("speechSynthesis" in window) window.speechSynthesis.cancel();
          const acquired = await navigator.mediaDevices.getUserMedia({
            audio: true,
          });
          if (closed) {
            acquired.getTracks().forEach((track) => track.stop());
            return;
          }
          release();
          audio.pause();
          audio.removeAttribute("src");
          audio.hidden = true;
          stream = acquired;
          recorder = new MediaRecorder(stream);
          const parts = [];
          recorder.ondataavailable = (event) => {
            if (event.data.size) parts.push(event.data);
          };
          recorder.onerror = () => {
            if (!closed) {
              resetButtons();
              stopTracks();
              show(
                note,
                "Se interrumpió la grabación. Puedes repetirla o practicar en voz alta.",
              );
            }
          };
          recorder.onstop = () => {
            if (timer) clearTimeout(timer);
            stopTracks();
            if (closed) return;
            resetButtons();
            if (parts.length) {
              url = URL.createObjectURL(
                new Blob(parts, { type: recorder.mimeType || parts[0].type }),
              );
              audio.src = url;
              audio.hidden = false;
              record.textContent = "Volver a grabar";
              show(
                note,
                "Tu voz está lista. Escúchala y elige un sonido o una pausa que quieras mejorar.",
                "ll-good",
              );
            } else show(note, "No se capturó audio. Vuelve a intentarlo.");
          };
          recorder.start();
          record.hidden = true;
          stop.hidden = false;
          show(
            note,
            "Grabando. Detén la grabación cuando termines (máximo dos minutos).",
          );
          timer = setTimeout(() => {
            if (recorder?.state === "recording") recorder.stop();
          }, 120000);
        } catch {
          stopTracks();
          resetButtons();
          if (!closed)
            show(
              note,
              "El micrófono no está disponible. Revisa el permiso del navegador o sigue con la práctica en voz alta.",
            );
        }
      };
      stop.onclick = () => {
        if (recorder?.state === "recording") {
          stop.disabled = true;
          recorder.stop();
          stop.disabled = false;
        }
      };
    }
    cleanup.push(() => {
      closed = true;
      if (recorder?.state === "recording") recorder.stop();
      audio.pause();
      release();
    });
  }
  function speaking({ body, u, completed, cleanup }) {
    body.innerHTML = `<div class="ll-columns"><div class="ll-stack">${card(`<div class="ll-overline">Frase del artículo</div><blockquote class="ll-phrase" lang="en">${u.say}</blockquote><div class="ll-row">${action("listen", "Escuchar", true)}${action("slower", "Escuchar despacio")}</div>${feedback()}`)}${card(`<h2>Escucha tu propia voz</h2>${recorderMarkup()}`)}</div><aside>${card(`<h2>Guía de sonidos</h2><p>${u.oral}</p><label class="ll-tick"><input type="checkbox">Practiqué la frase y revisé el sonido destacado.</label>${action("finish", "Registrar práctica")}${feedback()}`)}</aside></div>`;
    body.querySelector('[data-ll="listen"]').onclick = () =>
      speak(u.say, body.querySelector(".ll-feedback"), 0.9);
    body.querySelector('[data-ll="slower"]').onclick = () =>
      speak(u.say, body.querySelector(".ll-feedback"), 0.65);
    bindRecorder(body.querySelector(".ll-recorder"), cleanup);
    const note = body.querySelector("aside .ll-feedback");
    body.querySelector('[data-ll="finish"]').onclick = () => {
      if (!body.querySelector("input").checked) {
        show(note, "Practica la frase y marca la casilla de autoevaluación.");
        return;
      }
      completed("speaking");
      show(note, "Práctica oral registrada.", "ll-good");
    };
  }
  function present({ body, u, level, api, completed, cleanup }) {
    const key = `talk-draft-${level}`;
    const initial = api.get(key, {}) || {};
    body.innerHTML = `<div class="ll-columns"><div class="ll-stack">${card(`<h2>Prepara tu guion</h2><label class="ll-field">Título del artículo<input data-ll="title" maxlength="250" placeholder="The ocean that glows"></label><label class="ll-field">Fuente o DOI<input data-ll="source" maxlength="500" placeholder="10.1038/srep45750"></label><label class="ll-field">Tu exposición en inglés<textarea lang="en" data-ll="script" rows="6" maxlength="6000" placeholder="Today I’d like to share…"></textarea></label><div class="ll-row">${action("listen", "Escuchar mi guion")}</div>${feedback()}`)}${card(`<h2>Ensaya tu exposición</h2>${recorderMarkup()}<label class="ll-tick"><input type="checkbox" data-ll="rehearsed">Ensayé en voz alta e identifiqué una mejora.</label>${action("finish", "Guardar práctica", true)}<div class="ll-finish-note">${feedback()}</div>`)}</div><aside class="ll-stack">${card(`<h2>Frases para empezar</h2><ul class="ll-starters" lang="en">${u.talk.map((s) => `<li>${s}</li>`).join("")}</ul>`)}${card(`<h2>Lectura de esta unidad</h2><p lang="en">The ocean that glows</p>${nextButton("reading", "Consultar lectura")}`)}</aside></div>`;
    const title = body.querySelector('[data-ll="title"]'),
      source = body.querySelector('[data-ll="source"]'),
      script = body.querySelector('[data-ll="script"]'),
      checked = body.querySelector('[data-ll="rehearsed"]');
    title.value = initial.title ?? "The ocean that glows";
    source.value = initial.source ?? "10.1038/srep45750";
    script.value = initial.script ?? "";
    const save = () =>
      api.set(key, {
        title: title.value,
        source: source.value,
        script: script.value,
      });
    [title, source, script].forEach(
      (el) =>
        (el.oninput = () => {
          checked.checked = false;
          save();
        }),
    );
    body.querySelector('[data-ll="listen"]').onclick = () => {
      const note = body.querySelector(".ll-feedback");
      if (script.value.trim()) speak(script.value, note);
      else {
        show(note, "Escribe tu guion para escucharlo.");
        script.focus();
      }
    };
    body.querySelector('[data-ll="finish"]').onclick = () => {
      const note = body.querySelector(".ll-finish-note .ll-feedback");
      if (
        !title.value.trim() ||
        !source.value.trim() ||
        countWords(script.value) < u.min ||
        !checked.checked
      ) {
        show(
          note,
          `Incluye un título, una fuente y al menos ${u.min} palabras. Marca la casilla cuando termines el ensayo.`,
        );
        return;
      }
      save();
      completed("present");
      show(
        note,
        "Exposición registrada. Tu guion queda disponible para otro ensayo.",
        "ll-good",
      );
    };
    bindRecorder(body.querySelector(".ll-recorder"), cleanup);
  }

  window.LumaLearn = Object.freeze({ render, dispose });
})();
