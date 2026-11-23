(() => {
  "use strict";

  const levels = ["A1", "A2", "B1", "B2", "C1"];
  const topics = {
    ocean: {
      title: "Light in the deep",
      theme: "Biología marina",
      image: "ocean",
      prompt: "¿Qué nos cuenta un destello en el océano?",
      sourceName: "Martini y Haddock · Scientific Reports",
      sourceDate: "2017",
      sourceUrl: "https://doi.org/10.1038/srep45750",
      extra: [
        [
          "NOAA · Bioluminescence",
          "https://oceanservice.noaa.gov/facts/biolum.html",
        ],
      ],
      phrases: [
        "Some fish make light.",
        "A flash may help a fish hide.",
        "Light comes from a chemical reaction.",
        "A flash could serve more than one purpose.",
        "The observation alone cannot establish the function of the flash.",
      ],
    },
    space: {
      title: "Where stars are born",
      theme: "Astronomía",
      image: "nebula",
      prompt: "¿Qué podemos descubrir en una nube de polvo estelar?",
      sourceName: "NASA Webb Mission Team · Cosmic Cliffs",
      sourceDate: "12 de julio de 2022",
      sourceUrl:
        "https://science.nasa.gov/missions/webb/nasas-webb-reveals-cosmic-cliffs-glittering-landscape-of-star-birth/",
      extra: [["NASA · Stars", "https://science.nasa.gov/universe/stars/"]],
      phrases: [
        "A star can form in a cloud.",
        "The cloud contains gas and dust.",
        "Gravity pulls material together.",
        "Infrared light reveals young objects behind dust.",
        "Proximity alone does not show that one event triggered the other.",
      ],
    },
    plants: {
      title: "Carbon in the canopy",
      theme: "Botánica",
      image: "plant",
      prompt: "¿De dónde viene el carbono de un árbol?",
      sourceName: "NASA Earth Observatory · The Carbon Cycle",
      sourceDate: "16 de junio de 2011",
      sourceUrl:
        "https://science.nasa.gov/earth/earth-observatory/the-carbon-cycle/",
      extra: [
        [
          "NASA Landsat · Boreal forest growth",
          "https://science.nasa.gov/missions/landsat/nasa-study-finds-potential-carbon-sink-in-boreal-forest-growth/",
        ],
      ],
      phrases: [
        "Leaves make sugar.",
        "The tree takes in carbon dioxide from the air.",
        "Carbon can move from the air into wood.",
        "We must compare carbon gains and losses.",
        "The projection depends on the forest surviving and maturing.",
      ],
    },
    physics: {
      title: "A ripple from space",
      theme: "Física",
      image: "physics",
      prompt: "¿Cómo detectamos una colisión lejana sin verla?",
      sourceName: "LIGO y Virgo · Physical Review Letters",
      sourceDate: "11 de febrero de 2016",
      sourceUrl: "https://doi.org/10.1103/PhysRevLett.116.061102",
    },
    chemistry: {
      title: "Three forms of water",
      theme: "Química",
      image: "chemistry",
      prompt: "¿Pueden coexistir hielo, agua líquida y vapor?",
      sourceName: "NIST · Traceable Comparisons of Water-Triple-Point Cells",
      sourceDate: "noviembre de 2024",
      sourceUrl: "https://doi.org/10.6028/NIST.IR.8533",
    },
    math: {
      title: "A number in every circle",
      theme: "Matemáticas",
      image: "math",
      prompt: "¿Qué relación comparten una moneda y una rueda?",
      sourceName: "NASA Jet Propulsion Laboratory · Pi Day Challenge",
      sourceDate: "10 de marzo de 2022",
      sourceUrl:
        "https://www.jpl.nasa.gov/news/pi-day-challenge-solve-math-problems-with-nasa/",
    },
    earth: {
      title: "Where a puddle goes",
      theme: "Ciencias de la Tierra",
      image: "earth",
      prompt: "¿Adónde va el agua cuando se seca un charco?",
      sourceName: "USGS Water Science School · Evaporation and the Water Cycle",
      sourceDate: "8 de junio de 2019",
      sourceUrl:
        "https://www.usgs.gov/water-science-school/science/evaporation-and-water-cycle",
    },
  };

  // The solved example and all numerical classroom scenarios are Luma teaching material.
  function lesson(en, es, words, question, answer, alternatives, note, model) {
    return { en, es, words, question, answer, alternatives, note, model };
  }
  const material = {
    physics: {
      A1: lesson(
        "Two black holes meet in space. They make waves. A detector on Earth can find these waves.",
        "Dos agujeros negros se encuentran en el espacio. Producen ondas. Un detector en la Tierra puede captar estas ondas.",
        [
          ["wave", "onda"],
          ["Earth", "Tierra"],
          ["find", "encontrar"],
        ],
        "What does the detector find?",
        "Waves.",
        ["Rain.", "Trees."],
        "Find significa encontrar. El aparato capta las ondas que llegan a la Tierra.",
        "The detector finds waves.",
      ),
      A2: lesson(
        "When two black holes join, they send out waves. The waves travel through space. Scientists use detectors far from the black holes to measure a very small change.",
        "Cuando dos agujeros negros se unen, emiten ondas. Las ondas viajan por el espacio. Los científicos usan detectores alejados de los agujeros negros para medir un cambio muy pequeño.",
        [
          ["join", "unirse"],
          ["travel", "viajar"],
          ["measure", "medir"],
        ],
        "Where can a detector measure the change?",
        "Far from the black holes.",
        ["Only inside a black hole.", "Only between the two black holes."],
        "Far from indica distancia. La onda transporta la señal hasta el detector.",
        "The waves travel far from the black holes.",
      ),
      B1: lesson(
        "A passing gravitational wave changes the distances between freely moving objects by a tiny amount. LIGO compared light travelling along two arms. When their relative lengths changed, the pattern made by the returning light changed too.",
        "Una onda gravitacional cambia ligeramente las distancias entre objetos en caída libre. LIGO comparó luz que recorría dos brazos. Al cambiar sus longitudes relativas, también cambió el patrón de la luz que regresaba.",
        [
          ["arm", "brazo"],
          ["tiny", "diminuto"],
          ["pattern", "patrón"],
        ],
        "What observation helped LIGO identify a change?",
        "The returning light formed a different pattern.",
        [
          "One arm emitted sound into space.",
          "The mirrors showed a photograph of a black hole.",
        ],
        "Observa la relación entre relative lengths y light pattern. El patrón de la luz permite comparar las longitudes.",
        "The light pattern changed because the relative arm lengths changed.",
      ),
      B2: lesson(
        "In September 2015, two LIGO sites recorded similar signals a few milliseconds apart. The brief delay was compatible with a wave reaching one site before the other. Agreement between distant detectors helped researchers assess whether a disturbance was local.",
        "En septiembre de 2015, dos sedes de LIGO registraron señales similares con milisegundos de diferencia. El pequeño retraso era compatible con una onda que llegaba primero a una sede. Comparar detectores distantes ayudó a evaluar si la perturbación era local.",
        [
          ["delay", "retraso"],
          ["disturbance", "perturbación"],
          ["agreement", "concordancia"],
        ],
        "Why compare the two records?",
        "To test whether the signal could extend beyond one site.",
        [
          "To make a local disturbance larger.",
          "To show that the signals arrived at exactly the same instant.",
        ],
        "Compatible with expresa coherencia con una explicación. El pequeño retraso importa en la comparación.",
        "Similar signals at distant sites weaken an explanation based on local noise.",
      ),
      C1: lesson(
        "The detectors recorded a changing strain, while the interpretation involved a merger of two black holes. That inference depended on how well competing waveform predictions accounted for the timing and shape of the signal. A defensible account should distinguish the measured quantity from the model used to infer the source.",
        "Los detectores registraron una deformación variable y se interpretó que procedía de la fusión de dos agujeros negros. Esa inferencia dependía de qué tan bien explicaban el tiempo y la forma de la señal distintas predicciones de ondas. Conviene distinguir la magnitud medida del modelo empleado para deducir la fuente.",
        [
          ["strain", "deformación relativa"],
          ["account for", "explicar"],
          ["infer", "deducir"],
        ],
        "Which statement preserves the distinction between measurement and inference?",
        "Strain was measured, and waveform comparisons supported a merger interpretation.",
        [
          "The detectors directly measured the event with a camera.",
          "A measured time delay uniquely fixes every property of the source.",
        ],
        "Was measured identifica el dato instrumental. Supported sitúa la conclusión en la comparación con modelos.",
        "A merger best explains the observed waveform within the models compared.",
      ),
    },
    chemistry: {
      A1: lesson(
        "Ice is solid. The water in a glass is liquid. Water can also be a gas. It is still water in all three forms.",
        "El hielo es sólido. El agua de un vaso es líquida. El agua también puede ser un gas. Sigue siendo agua en sus tres formas.",
        [
          ["ice", "hielo"],
          ["liquid", "líquido"],
          ["glass", "vaso"],
        ],
        "What is solid water called?",
        "Ice.",
        ["Air.", "Salt."],
        "Ice es el nombre del agua cuando está en estado sólido.",
        "Ice is solid water.",
      ),
      A2: lesson(
        "Water can be ice, liquid water or water vapor. In a special glass cell scientists can keep the three forms together. They control the conditions inside the cell.",
        "El agua puede ser hielo, agua líquida o vapor. En una celda especial de vidrio, los científicos pueden mantener juntas las tres formas. Controlan las condiciones del interior.",
        [
          ["cell", "celda"],
          ["together", "juntas"],
          ["vapor", "vapor"],
        ],
        "What can the cell hold together?",
        "Ice, liquid water and water vapor.",
        ["Three different elements.", "Only ice and salt."],
        "Together significa juntas. Las tres formas pertenecen a la misma sustancia.",
        "The cell holds three forms of water.",
      ),
      B1: lesson(
        "At the triple point of pure water, ice, liquid and vapor can remain in equilibrium. The temperature and the pressure must both have particular values. A glass of melting ice on the table does not, by itself, establish that these conditions hold.",
        "En el punto triple del agua pura, hielo, líquido y vapor pueden permanecer en equilibrio. Tanto la temperatura como la presión deben tener valores concretos. Un vaso con hielo que se derrite sobre una mesa por sí solo no demuestra que se cumplan esas condiciones.",
        [
          ["pure", "pura"],
          ["pressure", "presión"],
          ["both", "ambas"],
        ],
        "Which pair matters for the triple point?",
        "Temperature and pressure.",
        ["Color and smell.", "Height and width of the table."],
        "Both señala que deben cumplirse dos condiciones a la vez.",
        "Both temperature and pressure matter at the triple point.",
      ),
      B2: lesson(
        "A triple-point cell provides a stable temperature reference when the three phases of pure water coexist in equilibrium. Reaching a similar temperature in an ordinary flask is insufficient evidence of the same state. The pressure and the presence of all three phases also matter.",
        "Una celda de punto triple proporciona una referencia estable de temperatura cuando coexisten en equilibrio las tres fases del agua pura. Alcanzar una temperatura similar en un matraz corriente es evidencia insuficiente del mismo estado. También importan la presión y la presencia de las tres fases.",
        [
          ["reference", "referencia"],
          ["flask", "matraz"],
          ["coexist", "coexistir"],
        ],
        "A flask has a similar temperature. What else would you check?",
        "Its pressure and the phases present in equilibrium.",
        ["The color of the label.", "Only the time of day."],
        "Insufficient evidence indica qué parte de la explicación requiere más comprobaciones.",
        "A similar temperature alone cannot establish three-phase equilibrium.",
      ),
      C1: lesson(
        "A fixed point is an equilibrium state, whereas a thermometer reading is an observation with uncertainty. Two instruments can disagree slightly even when compared against the same cell. Attributing the discrepancy to a change in the reference would require independent evidence about the cell and the measurement procedure.",
        "Un punto fijo es un estado de equilibrio y una lectura termométrica es una observación con incertidumbre. Dos instrumentos pueden discrepar levemente incluso al compararse con la misma celda. Atribuir esa diferencia a un cambio de la referencia requeriría evidencia independiente sobre la celda y el procedimiento.",
        [
          ["fixed point", "punto fijo"],
          ["uncertainty", "incertidumbre"],
          ["discrepancy", "discrepancia"],
        ],
        "Two readings differ slightly. Which conclusion is warranted?",
        "The discrepancy invites checks of both the comparison and the reference.",
        [
          "The fixed point has necessarily changed.",
          "Both instruments must be equally accurate.",
        ],
        "Would require marca una condición para atribuir la causa. Una diferencia observada admite varias explicaciones.",
        "A discrepancy warrants further checks before it is attributed to the reference.",
      ),
    },
    math: {
      A1: lesson(
        "A wheel is round. Draw a line across its circle. If the line goes through the center and joins two points on the edge, it is a diameter.",
        "Una rueda es redonda. Dibuja una línea de un lado a otro de su círculo. Si pasa por el centro y une dos puntos del borde, es un diámetro.",
        [
          ["wheel", "rueda"],
          ["round", "redonda"],
          ["center", "centro"],
        ],
        "Where does a diameter pass?",
        "Through the center.",
        ["Outside the circle.", "Along the edge."],
        "Through significa a través de. El diámetro cruza el centro del círculo.",
        "The diameter goes through the center.",
      ),
      A2: lesson(
        "Take a coin and a large wheel. Measure around each circle. Then measure across the center. The large wheel has a longer distance around it, but the two distances grow in the same proportion.",
        "Toma una moneda y una rueda grande. Mide alrededor de cada círculo y luego a través del centro. La rueda tiene una distancia mayor alrededor, pero las dos distancias crecen en la misma proporción.",
        [
          ["coin", "moneda"],
          ["around", "alrededor"],
          ["across", "de lado a lado"],
        ],
        "What do you measure around a circle?",
        "Its circumference.",
        ["Its diameter.", "Its temperature."],
        "Around indica que recorres el borde. Across the center indica que atraviesas el centro.",
        "A bigger circle has a longer circumference.",
      ),
      B1: lesson(
        "For a circle, divide the circumference by the diameter. The result is pi, about 3.14. In a classroom example, a circle with a diameter of 10 centimeters has a circumference of about 31.4 centimeters.",
        "En un círculo, divide la circunferencia por el diámetro. El resultado es pi, aproximadamente 3,14. En un ejemplo de clase, un círculo con diámetro de 10 centímetros tiene una circunferencia de unos 31,4 centímetros.",
        [
          ["divide", "dividir"],
          ["about", "aproximadamente"],
          ["ratio", "razón"],
        ],
        "Why does the example say about 31.4 centimeters?",
        "It uses a rounded value of pi.",
        ["The circle has no center.", "The diameter was measured in seconds."],
        "About indica aproximación. 3,14 es el valor de pi redondeado a dos decimales.",
        "The circumference is approximately pi times the diameter.",
      ),
      B2: lesson(
        "Suppose a circular track is enlarged so that its diameter doubles. Its circumference doubles too. In the quotient of circumference and diameter the scale factor cancels, although the two distances have both increased.",
        "Supón que se amplía una pista circular hasta duplicar su diámetro. La circunferencia también se duplica. En el cociente entre circunferencia y diámetro se cancela el factor de escala, aunque ambas distancias hayan aumentado.",
        [
          ["double", "duplicarse"],
          ["quotient", "cociente"],
          ["scale factor", "factor de escala"],
        ],
        "What happens to the quotient after enlargement?",
        "It stays the same.",
        ["It doubles.", "It is divided by two."],
        "Aunque las longitudes cambien, el mismo factor aparece en el numerador y en el denominador.",
        "Both lengths double, so their quotient remains unchanged.",
      ),
      C1: lesson(
        "Imagine estimating pi from a coin with a flexible tape. A ratio of 3.16 could reflect a small error in either measured length, or a departure from a perfect circle. Repeated measurements can reveal scatter, while a consistently stretched tape or a biased procedure may produce errors that repetition alone fails to expose.",
        "Imagina estimar pi con una moneda y una cinta flexible. Una razón de 3,16 podría deberse a errores en las longitudes o a una forma imperfecta. Repetir mediciones revela dispersión, pero una cinta estirada o un procedimiento sesgado pueden introducir errores que la repetición por sí sola deja ocultos.",
        [
          ["scatter", "dispersión"],
          ["biased", "sesgado"],
          ["departure", "desviación"],
        ],
        "Repeated trials cluster around 3.16. What follows?",
        "The method may be repeatable and still contain a systematic error.",
        [
          "Pi has changed for this particular coin.",
          "A tight cluster guarantees mathematical exactness.",
        ],
        "Could reflect deja abiertas las causas del desajuste. La repetibilidad no basta para establecer exactitud.",
        "Consistent readings could still reflect a bias in how the diameter was located.",
      ),
    },
    earth: {
      A1: lesson(
        "There is water on the ground. Later, the ground is dry. Some water goes into the air. Water in the air can be a gas.",
        "Hay agua en el suelo. Más tarde el suelo está seco. Parte del agua pasa al aire. El agua del aire puede ser un gas.",
        [
          ["ground", "suelo"],
          ["dry", "seco"],
          ["air", "aire"],
        ],
        "Where can some water go?",
        "Into the air.",
        ["Into a star.", "Only into a rock."],
        "Into indica hacia dónde se mueve el agua cuando se evapora.",
        "Some water goes into the air.",
      ),
      A2: lesson(
        "Water in a puddle can change into vapor and enter the air. This change is called evaporation. Water vapor can cool and form small drops. This second change is called condensation.",
        "El agua de un charco puede convertirse en vapor y pasar al aire. Este cambio se llama evaporación. El vapor de agua puede enfriarse y formar gotas. Este segundo cambio se llama condensación.",
        [
          ["puddle", "charco"],
          ["drop", "gota"],
          ["cool", "enfriarse"],
        ],
        "What happens during condensation?",
        "Water vapor forms liquid drops.",
        ["Liquid water becomes vapor.", "A rock becomes water."],
        "En la condensación el vapor pasa a líquido. En la evaporación el cambio ocurre en sentido inverso.",
        "Vapor can form small drops.",
      ),
      B1: lesson(
        "A shallow puddle can shrink even when the water never boils. Some molecules escape from its surface into the air. The puddle loses liquid water through evaporation, and the atmosphere gains water vapor.",
        "Un charco poco profundo puede encogerse sin que el agua hierva. Algunas moléculas escapan de la superficie al aire. El charco pierde agua líquida por evaporación y la atmósfera gana vapor de agua.",
        [
          ["shallow", "poco profundo"],
          ["shrink", "encogerse"],
          ["surface", "superficie"],
        ],
        "Does evaporation require the puddle to boil?",
        "No. Molecules can leave the surface below boiling temperature.",
        [
          "Yes. All of the water must boil at once.",
          "Yes. The ground must first freeze.",
        ],
        "Even when indica que el cambio observado puede ocurrir por debajo del punto de ebullición.",
        "A puddle can shrink because surface molecules enter the air.",
      ),
      B2: lesson(
        "Consider a sealed transparent container holding liquid water. Some water can evaporate and later condense on its cooler lid. Liquid leaving the bottom has changed location or phase. The total amount of water in the sealed container can remain constant.",
        "Imagina un recipiente transparente sellado con agua líquida. Parte puede evaporarse y condensarse en la tapa más fría. El líquido que abandona el fondo cambia de lugar o de fase. La cantidad total de agua del recipiente sellado puede mantenerse constante.",
        [
          ["sealed", "sellado"],
          ["lid", "tapa"],
          ["amount", "cantidad"],
        ],
        "Why can liquid on the bottom decrease while total water remains constant?",
        "Water can move to the air or the lid within the container.",
        ["All evaporated water ceases to exist.", "The lid creates new water."],
        "El sistema incluye el aire, las paredes y el líquido. Un cambio de fase conserva el agua del conjunto.",
        "The water changes phase while remaining inside the sealed container.",
      ),
      C1: lesson(
        "A fall in water level after a sunny afternoon is consistent with evaporation. It cannot by itself determine how much water evaporated if seepage or runoff also occurred. Estimating the evaporative loss therefore requires either controlling the other pathways or measuring their contributions to the water balance.",
        "Un descenso del nivel tras una tarde soleada es compatible con la evaporación. Por sí solo no determina cuánto se evaporó si también hubo infiltración o escorrentía. Para estimar la pérdida por evaporación hay que controlar las demás vías o medir su contribución al balance de agua.",
        [
          ["seepage", "infiltración"],
          ["runoff", "escorrentía"],
          ["water balance", "balance de agua"],
        ],
        "What would make the evaporation estimate more defensible?",
        "Quantifying or controlling the other water-loss pathways.",
        [
          "Using sunshine alone as proof of the exact amount.",
          "Repeating the same unsupported assumption.",
        ],
        "Consistent with expresa compatibilidad. Para atribuir una cantidad hacen falta datos sobre las otras salidas.",
        "The level change constrains total loss, while evaporation alone requires additional measurements.",
      ),
    },
  };

  function getReading(id, level) {
    if (id === "ocean") {
      const u = window.LumaLearn.unit(level);
      return {
        en: u.en.join("\n\n"),
        es: u.es.join("\n\n"),
        words: u.words,
        question: u.read.prompt,
        answer: u.read.options[u.read.answer],
        alternatives: u.read.options.filter((_, i) => i !== u.read.answer),
        note: u.read.why,
        model: u.model,
      };
    }
    if (id === "space" || id === "plants") {
      const r = window.LumaLibrary.lesson(
        id === "space" ? "astro" : "plants",
        level,
      );
      return {
        en: r.en,
        es: r.es,
        words: r.words,
        question: r.question,
        answer: r.options[r.answer],
        alternatives: r.options.filter((_, i) => i !== r.answer),
        note: r.note,
        model: topics[id].phrases[levels.indexOf(level)],
      };
    }
    return material[id][level];
  }
  window.LumaDailyData = Object.freeze({ topics, levels, getReading });
})();
