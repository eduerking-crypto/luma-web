// Expanded Longreads / Complete Scientific Articles for Luma
// Full bilingual articles with 5+ chapters each, multiple levels
(() => {
  "use strict";

  // Additional complete scientific articles for the "Lecturas de fondo" section
  const ADDITIONAL_ARTICLES = [
    {
      id: "deep-sea-vents",
      title: "Life Without Sunlight",
      theme: "Biología marina · Oceanografía",
      image: "vents",
      description: "Descubre ecosistemas que prosperan en la oscuridad total, alimentados por química en lugar de luz solar.",
      sources: [
        ["NOAA Ocean Explorer · Hydrothermal Vents", "https://oceanexplorer.noaa.gov/edu/learning/vents/vents.html"],
        ["WHOI · Life at Hydrothermal Vents", "https://www.whoi.edu/know-your-ocean/ocean-topics/hydrothermal-vents/"]
      ],
      chapters: [
        {
          title: "The Black Smokers",
          A1: {
            en: "Deep in the ocean, there are cracks in the Earth. Hot water comes out of these cracks. The water is very hot, more than 300 degrees. It looks like black smoke. Scientists call them black smokers. Strange animals live near them.",
            es: "En lo profundo del océano, hay grietas en la Tierra. Sale agua muy caliente de estas grietas. El agua tiene más de 300 grados. Parece humo negro. Los científicos los llaman fumadores negros. Animales extraños viven cerca de ellos.",
            words: [["crack", "grieta"], ["smoke", "humo"], ["strange", "extraño"]],
            question: "What comes out of the cracks in the ocean floor?",
            options: ["Cold water.", "Hot water.", "Oil."],
            answer: 1,
            note: "Hot water sale de las grietas. Looks like black smoke describe su apariencia."
          },
          A2: {
            en: "In 1977, scientists found a surprise on the ocean floor near the Galapagos Islands. Cracks in the crust released hot, mineral-rich water. The water was 350 degrees Celsius but did not boil because of the pressure. Around these vents, they found animals that no one had seen before. Giant tube worms, white crabs, and blind shrimp lived there.",
            es: "En 1977, los científicos hallaron una sorpresa en el fondo del océano cerca de las islas Galápagos. Grietas en la corteza liberaban agua caliente rica en minerales. El agua estaba a 350 grados Celsius pero no hervía por la presión. Alrededor de estas chimeneas encontraron animales que nadie había visto. Gusanos tubulares gigantes, cangrejos blancos y camarones ciegos vivían allí.",
            words: [["crust", "corteza"], ["mineral-rich", "rico en minerales"], ["pressure", "presión"], ["vent", "chimenea/hidrotermal"]],
            question: "Why doesn't the 350-degree water boil?",
            options: ["It is not hot enough.", "The pressure prevents boiling.", "It is fresh water."],
            answer: 1,
            note: "Because of the pressure explica por qué el agua no hierve a 350°C."
          },
          B1: {
            en: "The discovery of hydrothermal vents changed biology. Before 1977, scientists thought all life depended on sunlight. Plants use light for photosynthesis. Animals eat plants or other animals. But at the vents, there is no light at all. The base of the food web is not plants. It is bacteria that use chemicals from the hot water to make energy. This process is called chemosynthesis.",
            es: "El descubrimiento de chimeneas hidrotermales cambió la biología. Antes de 1977, los científicos creían que toda la vida dependía de la luz solar. Las plantas usan luz para la fotosíntesis. Los animales comen plantas u otros animales. Pero en las chimeneas no hay luz. La base de la red alimentaria no son plantas. Son bacterias que usan químicos del agua caliente para obtener energía. Este proceso se llama quimiosíntesis.",
            words: [["hydrothermal vent", "chimenea hidrotermal"], ["chemosynthesis", "quimiosíntesis"], ["food web", "red alimentaria"], ["bacteria", "bacteria"]],
            question: "What is the energy source for the vent food web?",
            options: ["Sunlight.", "Chemicals from hot water.", "Heat from the Earth."],
            answer: 1,
            note: "Chemosynthesis usa químicos, no luz. The base of the food web identifica el nivel trófico basal."
          },
          B2: {
            en: "Chemosynthetic bacteria oxidize hydrogen sulfide from the vent fluid. The reaction releases energy the bacteria use to fix carbon dioxide into organic molecules. This primary production supports a dense community. Giant tube worms (Riftia pachyptila) have no mouth or gut. They host symbiotic bacteria in a specialized organ called the trophosome. The worm's red plume absorbs hydrogen sulfide and oxygen, delivering them to the bacteria. In return, the bacteria provide organic carbon to the worm.",
            es: "Las bacterias quimiosintéticas oxidan sulfuro de hidrógeno del fluido de la chimenea. La reacción libera energía que las bacterias usan para fijar dióxido de carbono en moléculas orgánicas. Esta producción primaria sustenta una comunidad densa. Los gusanos tubulares gigantes (Riftia pachyptila) no tienen boca ni intestino. Albergan bacterias simbióticas en un órgano especializado llamado trofosoma. La pluma roja del gusano absorbe sulfuro de hidrógeno y oxígeno, llevándolos a las bacterias. A cambio, las bacterias proveen carbono orgánico al gusano.",
            words: [["oxidize", "oxidar"], ["hydrogen sulfide", "sulfuro de hidrógeno"], ["fix carbon", "fijar carbono"], ["symbiotic", "simbiótico"], ["trophosome", "trofosoma"]],
            question: "How do tube worms get nutrition without a digestive system?",
            options: ["They absorb nutrients through their skin.", "Symbiotic bacteria in their trophosome provide organic carbon.", "They filter feed on vent particles."],
            answer: 1,
            note: "Host symbiotic bacteria describe la relación mutualista. In return indica el beneficio mutuo."
          },
          C1: {
            en: "The vent ecosystem challenges the paradigm that all ecosystems are ultimately solar-powered. Chemosynthetic primary production here rivals photosynthetic rates in surface waters. However, vent communities are ephemeral. Tectonic shifts can seal a vent, cutting off the chemical supply. Species must disperse to new vents before the old ones die. This creates a metapopulation dynamic where local extinction and recolonization maintain genetic connectivity across ridge segments. The evolutionary implication is profound: chemosynthesis may have preceded photosynthesis on early Earth, and similar processes could sustain life on ocean worlds like Europa or Enceladus.",
            es: "El ecosistema de chimeneas desafía el paradigma de que todos los ecosistemas dependen finalmente del sol. La producción primaria quimiosintética aquí rivaliza con las tasas fotosintéticas en aguas superficiales. Sin embargo, las comunidades de chimeneas son efímeras. Cambios tectónicos pueden sellar una chimenea, cortando el suministro químico. Las especies deben dispersarse a nuevas chimeneas antes de que las antiguas mueran. Esto crea una dinámica de metapoblación donde la extinción local y la recolonización mantienen la conectividad genética entre segmentos de dorsales. La implicación evolutiva es profunda: la quimiosíntesis pudo preceder a la fotosíntesis en la Tierra temprana, y procesos similares podrían sostener vida en mundos oceánicos como Europa o Encélado.",
            words: [["paradigm", "paradigma"], ["ephemeral", "efímero"], ["metapopulation", "metapoblación"], ["recolonization", "recolonización"], ["ridge segment", "segmento de dorsal"]],
            question: "What does the metapopulation dynamic at vents imply for species survival?",
            options: ["Species are permanently stable at each vent.", "Local extinction is balanced by recolonization of new vents.", "All vent species go extinct when a vent seals."],
            answer: 1,
            note: "Metapopulation dynamic describe el equilibrio entre extinción local y recolonización. This creates indica consecuencia."
          }
        }
      ]
    },
    {
      id: "crispR-cas9",
      title: "Rewriting the Code of Life",
      theme: "Biología molecular · Genética",
      image: "crispr",
      description: "Cómo un sistema inmune bacteriano se convirtió en la herramienta de edición genética más poderosa.",
      sources: [
        ["Broad Institute · What is CRISPR?", "https://www.broadinstitute.org/what-crispr"],
        ["Nature · CRISPR: A game-changing genetic engineering technique", "https://www.nature.com/articles/d41586-018-05162-8"]
      ],
      chapters: [
        {
          title: "Bacterial Memory",
          A1: {
            en: "Bacteria have an immune system. When a virus attacks, the bacteria save a piece of the virus DNA. They keep it in their own DNA. This is like a memory. If the same virus comes again, the bacteria recognize it. They cut the virus DNA. The virus cannot multiply.",
            es: "Las bacterias tienen un sistema inmune. Cuando un virus ataca, la bacteria guarda un trozo del ADN del virus. Lo guarda en su propio ADN. Es como una memoria. Si el mismo virus vuelve, la bacteria lo reconoce. Corta el ADN del virus. El virus no puede multiplicarse.",
            words: [["immune system", "sistema inmune"], ["virus", "virus"], ["recognize", "reconocer"], ["multiply", "multiplicarse"]],
            question: "What do bacteria save when a virus attacks?",
            options: ["A piece of the virus DNA.", "A protein from the virus.", "A copy of their own DNA."],
            answer: 0,
            note: "Save a piece of the virus DNA describe el mecanismo de memoria inmunológica."
          },
          A2: {
            en: "Scientists call this system CRISPR. The name stands for Clustered Regularly Interspaced Short Palindromic Repeats. In simple terms, it is a library of virus DNA pieces. Each piece is a spacer. Between spacers are repeated sequences. The bacteria also make Cas proteins. Cas9 is a molecular scissors. It cuts DNA at a specific place.",
            es: "Los científicos llaman a este sistema CRISPR. El nombre significa Repeticiones Palindrómicas Cortas Agrupadas y Regularmente Espaciadas. En términos simples, es una biblioteca de trozos de ADN viral. Cada trozo es un espaciador. Entre espaciadores hay secuencias repetidas. Las bacterias también producen proteínas Cas. Cas9 son tijeras moleculares. Cortan el ADN en un lugar específico.",
            words: [["spacer", "espaciador"], ["repeated sequence", "secuencia repetida"], ["molecular scissors", "tijeras moleculares"], ["specific", "específico"]],
            question: "What does Cas9 do?",
            options: ["Copies DNA.", "Cuts DNA at a specific place.", "Repairs DNA."],
            answer: 1,
            note: "Molecular scissors es una metáfora para la función de corte. Specific place indica precisión."
          },
          B1: {
            en: "In 2012, Jennifer Doudna and Emmanuelle Charpentier showed that CRISPR-Cas9 could be programmed. They made a guide RNA that matches any DNA sequence. The guide RNA leads Cas9 to that sequence. Cas9 cuts the DNA there. The cell tries to repair the cut. Scientists can add a new DNA piece during repair. This changes the gene. It works in human cells, plants, and animals.",
            es: "En 2012, Jennifer Doudna y Emmanuelle Charpentier demostraron que CRISPR-Cas9 se puede programar. Crearon un ARN guía que coincide con cualquier secuencia de ADN. El ARN guía lleva Cas9 a esa secuencia. Cas9 corta el ADN allí. La célula intenta reparar el corte. Los científicos pueden añadir un nuevo trozo de ADN durante la reparación. Esto cambia el gen. Funciona en células humanas, plantas y animales.",
            words: [["guide RNA", "ARN guía"], ["program", "programar"], ["repair", "reparar"], ["gene", "gen"]],
            question: "How do scientists change a specific gene with CRISPR?",
            options: ["They cut random DNA pieces.", "They make a guide RNA that matches the target sequence.", "They remove the Cas9 protein."],
            answer: 1,
            note: "Guide RNA matches the target sequence explica la especificidad. During repair describe el momento de la edición."
          },
          B2: {
            en: "CRISPR applications are transforming medicine and agriculture. In clinical trials, researchers edit T cells to better recognize cancer. They remove the PD-1 gene that cancers use to hide from the immune system. In agriculture, scientists create crops resistant to drought, pests, and disease. Rice edited with CRISPR survives floods. Wheat resists powdery mildew. The technology is faster, cheaper, and more precise than older methods like zinc-finger nucleases or TALENs.",
            es: "Las aplicaciones de CRISPR transforman la medicina y la agricultura. En ensayos clínicos, investigadores editan células T para reconocer mejor el cáncer. Eliminan el gen PD-1 que los cánceres usan para esconderse del sistema inmune. En agricultura, crean cultivos resistentes a sequía, plagas y enfermedades. Arroz editado con CRISPR sobrevive inundaciones. Trigo resiste el mildiu polvoriento. La tecnología es más rápida, barata y precisa que métodos antiguos como nucleasas de dedo de zinc o TALENs.",
            words: [["clinical trial", "ensayo clínico"], ["T cell", "célula T"], ["drought", "sequía"], ["powdery mildew", "mildiu polvoriento"], ["zinc-finger nuclease", "nucleasa de dedo de zinc"]],
            question: "What advantage does CRISPR have over older gene-editing methods?",
            options: ["It is slower but more accurate.", "It is faster, cheaper, and more precise.", "It only works in bacteria."],
            answer: 1,
            note: "Faster, cheaper, and more precise resume las ventajas comparativas. Clinical trials indica etapa de desarrollo."
          },
          C1: {
            en: "The power of CRISPR raises profound ethical questions. Germline editing—changes in embryos, sperm, or eggs—would be heritable. In 2018, a researcher announced the birth of gene-edited babies, sparking global condemnation. The scientific consensus calls for a moratorium on clinical germline editing until safety and societal implications are resolved. Off-target effects remain a technical concern: Cas9 can cut at similar but unintended sequences. Base editors and prime editors now offer greater precision without double-strand breaks. The debate extends beyond therapy to enhancement: should we edit genes for intelligence, height, or appearance? The answer requires not just science, but broad societal dialogue.",
            es: "El poder de CRISPR plantea preguntas éticas profundas. La edición de línea germinal—cambios en embriones, espermatozoides u óvulos—sería heredable. En 2018, un investigador anunció el nacimiento de bebés editados genéticamente, provocando condena global. El consenso científico pide una moratoria sobre la edición germinal clínica hasta resolver seguridad e implicaciones sociales. Los efectos fuera de blanco siguen siendo una preocupación técnica: Cas9 puede cortar en secuencias similares pero no intencionadas. Los editores de base y editores prime ahora ofrecen mayor precisión sin roturas de doble cadena. El debate se extiende más allá de la terapia hacia la mejora: ¿debemos editar genes para inteligencia, altura o apariencia? La respuesta requiere no solo ciencia, sino un amplio diálogo social.",
            words: [["germline editing", "edición de línea germinal"], ["heritable", "heredable"], ["moratorium", "moratoria"], ["off-target effects", "efectos fuera de blanco"], ["base editor", "editor de base"], ["enhancement", "mejora/mejora genética"]],
            question: "What is the main technical concern limiting clinical germline editing?",
            options: ["The cost of the procedure.", "Off-target effects where Cas9 cuts unintended sequences.", "The inability to edit human embryos."],
            answer: 1,
            note: "Off-target effects describe el riesgo técnico principal. Scientific consensus calls for indica la postura experta."
          }
        }
      ]
    },
    {
      id: "quantum-entanglement",
      title: "Spooky Action at a Distance",
      theme: "Física cuántica",
      image: "quantum",
      description: "El fenómeno que Einstein llamó 'fantasmal' y que ahora permite computación cuántica y teleportación.",
      sources: [
        ["NIST · Quantum Entanglement", "https://www.nist.gov/topics/quantum-entanglement"],
        ["Caltech · Quantum Entanglement Explained", "https://scienceexchange.caltech.edu/topics/quantum-science/quantum-entanglement"]
      ],
      chapters: [
        {
          title: "Two Coins, One Fate",
          A1: {
            en: "Imagine two magic coins. You take one to Madrid. Your friend takes the other to Tokyo. You flip your coin. It shows heads. At the same moment, your friend's coin also shows heads. It always matches. This is quantum entanglement. Two particles act like one, even far apart.",
            es: "Imagina dos monedas mágicas. Llevas una a Madrid. Tu amigo lleva la otra a Tokio. Lanzas tu moneda. Sale cara. En el mismo momento, la moneda de tu amigo también sale cara. Siempre coinciden. Esto es entrelazamiento cuántico. Dos partículas actúan como una, incluso lejos.",
            words: [["coin", "moneda"], ["flip", "lanzar"], ["heads", "cara"], ["match", "coincidir"], ["far apart", "lejos"]],
            question: "What happens when you flip one entangled coin?",
            options: ["The other coin shows the opposite side.", "The other coin shows the same side.", "Nothing happens to the other coin."],
            answer: 1,
            note: "Always matches describe la correlación perfecta. At the same moment indica simultaneidad."
          },
          A2: {
            en: "In the quantum world, particles like photons or electrons can become entangled. When they interact, they share a quantum state. Measuring one particle instantly determines the state of its partner. This happens faster than light could travel between them. Einstein called it 'spooky action at a distance'. He thought something was missing from quantum theory. But experiments proved him wrong. The connection is real.",
            es: "En el mundo cuántico, partículas como fotones o electrones pueden entrelazarse. Cuando interactúan, comparten un estado cuántico. Medir una partícula determina instantáneamente el estado de su pareja. Esto ocurre más rápido de lo que la luz podría viajar entre ellas. Einstein lo llamó 'acción fantasmal a distancia'. Pensó que faltaba algo en la teoría cuántica. Pero los experimentos demostraron que se equivocaba. La conexión es real.",
            words: [["photon", "fotón"], ["electron", "electrón"], ["quantum state", "estado cuántico"], ["instantly", "instantáneamente"], ["spooky", "fantasmal"]],
            question: "Why did Einstein disagree with quantum entanglement?",
            options: ["He thought it was too slow.", "He thought something was missing from the theory.", "He believed particles cannot interact."],
            answer: 1,
            note: "Thought something was missing describe la objeción de Einstein. Proved him wrong indica el resultado experimental."
          },
          B1: {
            en: "Entanglement is not just a curiosity. It is a resource for new technologies. Quantum computers use entangled qubits. A qubit can be 0 and 1 at the same time. This is superposition. When qubits are entangled, 50 qubits can represent 2^50 states simultaneously. This exponential scaling gives quantum computers power for certain problems like factoring large numbers or simulating molecules. Quantum cryptography uses entanglement to detect eavesdropping. Any measurement disturbs the entangled state, revealing the spy.",
            es: "El entrelazamiento no es solo una curiosidad. Es un recurso para nuevas tecnologías. Las computadoras cuánticas usan qubits entrelazados. Un qubit puede ser 0 y 1 al mismo tiempo. Esto es superposición. Cuando los qubits están entrelazados, 50 qubits pueden representar 2^50 estados simultáneamente. Esta escala exponencial da poder a las computadoras cuánticas para problemas como factorizar números grandes o simular moléculas. La criptografía cuántica usa el entrelazamiento para detectar espionaje. Cualquier medición perturba el estado entrelazado, revelando al espía.",
            words: [["qubit", "qubit"], ["superposition", "superposición"], ["exponential scaling", "escala exponencial"], ["factor", "factorizar"], ["eavesdropping", "espionaje/escucha clandestina"]],
            question: "How many states can 50 entangled qubits represent?",
            options: ["50 states.", "100 states.", "2^50 states."],
            answer: 2,
            note: "Exponential scaling explica la ventaja cuántica. 2^50 states simultaneously describe el paralelismo cuántico."
          },
          B2: {
            en: "Quantum teleportation uses entanglement to transfer quantum information. Alice has a qubit in an unknown state. She shares an entangled pair with Bob. Alice measures her qubit and her half of the pair together. This destroys the original state but sends two classical bits to Bob. Bob uses those bits to apply corrections to his half of the entangled pair. His qubit now matches Alice's original state. The original qubit is not transported—its information is. This protocol requires classical communication, so it cannot exceed light speed.",
            es: "La teleportación cuántica usa entrelazamiento para transferir información cuántica. Alice tiene un qubit en un estado desconocido. Comparte un par entrelazado con Bob. Alice mide su qubit y su mitad del par juntas. Esto destruye el estado original pero envía dos bits clásicos a Bob. Bob usa esos bits para aplicar correcciones a su mitad del par entrelazado. Su qubit ahora coincide con el estado original de Alice. El qubit original no se transporta—su información sí. Este protocolo requiere comunicación clásica, así que no puede exceder la velocidad de la luz.",
            words: [["quantum teleportation", "teleportación cuántica"], ["unknown state", "estado desconocido"], ["classical bits", "bits clásicos"], ["correction", "corrección"], ["protocol", "protocolo"]],
            question: "What is actually transferred in quantum teleportation?",
            options: ["The physical particle.", "The quantum information/state.", "Energy."],
            answer: 1,
            note: "Its information is aclara que no se transporta materia. Requires classical communication limita la velocidad."
          },
          C1: {
            en: "The 2022 Nobel Prize in Physics honored Aspect, Clauser, and Zeilinger for experiments with entangled photons that closed the locality and freedom-of-choice loopholes in Bell tests. Their work confirmed that nature violates local realism: measurement outcomes are not predetermined, and no local hidden variables can explain the correlations. This has profound implications. It means the quantum state is not a description of our ignorance, but an objective feature of reality. Device-independent quantum cryptography now uses these loophole-free tests to guarantee security even with untrusted devices. The remaining challenge is scaling: maintaining entanglement across noisy, lossy channels for a quantum internet. Quantum repeaters based on entanglement swapping and purification are the leading approach.",
            es: "El Premio Nobel de Física 2022 honró a Aspect, Clauser y Zeilinger por experimentos con fotones entrelazados que cerraron las lagunas de localidad y libertad de elección en los tests de Bell. Su trabajo confirmó que la naturaleza viola el realismo local: los resultados de medición no están predeterminados, y ninguna variable oculta local puede explicar las correlaciones. Esto tiene implicaciones profundas. Significa que el estado cuántico no es una descripción de nuestra ignorancia, sino una característica objetiva de la realidad. La criptografía cuántica independiente del dispositivo usa estos tests sin lagunas para garantizar seguridad incluso con dispositivos no confiables. El reto restante es la escalabilidad: mantener el entrelazamiento a través de canales ruidosos y con pérdidas para una internet cuántica. Los repetidores cuánticos basados en intercambio de entrelazamiento y purificación son el enfoque principal.",
            words: [["Bell test", "test de Bell"], ["local realism", "realismo local"], ["hidden variables", "variables ocultas"], ["loophole", "laguna"], ["device-independent", "independiente del dispositivo"], ["quantum repeater", "repetidor cuántico"], ["entanglement swapping", "intercambio de entrelazamiento"]],
            question: "What did the 2022 Nobel-winning experiments definitively rule out?",
            options: ["Quantum entanglement itself.", "Local hidden variables as an explanation for quantum correlations.", "The existence of photons."],
            answer: 1,
            note: "Confirmed that nature violates local realism describe el hallazgo clave. Ruled out local hidden variables indica lo que se descartó."
          }
        }
      ]
    },
    {
      id: "human-microbiome",
      title: "The Universe Within",
      theme: "Microbiología · Salud humana",
      image: "microbiome",
      description: "Billones de microbios viven en ti: descubren cómo afectan tu digestión, inmunidad e incluso tu estado de ánimo.",
      sources: [
        ["NIH Human Microbiome Project", "https://hmpdacc.org/"],
        ["Nature · The human microbiome", "https://www.nature.com/subjects/human-microbiome"]
      ],
      chapters: [
        {
          title: "You Are Not Alone",
          A1: {
            en: "Your body has trillions of tiny living things. They are bacteria, viruses, and fungi. Most live in your intestines. This community is called the microbiome. You have more microbial cells than human cells. They help you digest food. They make vitamins. They protect you from bad germs.",
            es: "Tu cuerpo tiene billones de seres vivos diminutos. Son bacterias, virus y hongos. La mayoría viven en tus intestinos. Esta comunidad se llama microbioma. Tienes más células microbianas que humanas. Te ayudan a digerir la comida. Producen vitaminas. Te protegen de gérminos malos.",
            words: [["trillion", "billón"], ["intestine", "intestino"], ["microbiome", "microbioma"], ["digest", "digerir"], ["vitamin", "vitamina"], ["protect", "proteger"]],
            question: "Where do most microbes in your body live?",
            options: ["On your skin.", "In your intestines.", "In your blood."],
            answer: 1,
            note: "Most live in your intestines indica la ubicación principal. Community is called the microbiome define el término."
          },
          A2: {
            en: "The microbiome starts forming at birth. Babies born vaginally get microbes from their mother. Babies born by C-section get different microbes, mostly from skin. Breast milk feeds beneficial bacteria with special sugars called oligosaccharides. By age three, a child's microbiome looks like an adult's. Diet, antibiotics, and stress change it throughout life.",
            es: "El microbioma empieza a formarse en el nacimiento. Los bebés nacidos por parto vaginal reciben microbios de su madre. Los nacidos por cesárea reciben microbios distintos, mayormente de la piel. La leche materna alimenta bacterias beneficiosas con azúcares especiales llamados oligosacáridos. A los tres años, el microbioma de un niño parece el de un adulto. La dieta, los antibióticos y el estrés lo cambian durante toda la vida.",
            words: [["vaginally", "por vía vaginal"], ["C-section", "cesárea"], ["breast milk", "leche materna"], ["oligosaccharide", "oligosacárido"], ["antibiotic", "antibiótico"]],
            question: "What does breast milk provide for beneficial bacteria?",
            es: "special sugars called oligosaccharides",
            options: ["Antibodies.", "Special sugars called oligosaccharides.", "Probiotics."],
            answer: 1,
            note: "Feeds beneficial bacteria describe la función prebiótica. Special sugars called oligosaccharides identifica el compuesto."
          },
          B1: {
            en: "Your gut bacteria talk to your brain. This is the gut-brain axis. Microbes make neurotransmitters like serotonin and GABA. About 90% of your body's serotonin is made in the gut. Studies in mice show that changing gut bacteria changes behavior. Germ-free mice are more anxious. Giving them certain bacteria reduces anxiety. In humans, probiotics may improve mood and cognition. The mechanism involves the vagus nerve, immune signals, and microbial metabolites.",
            es: "Tus bacterias intestinales hablan con tu cerebro. Esto es el eje intestino-cerebro. Los microbios producen neurotransmisores como serotonina y GABA. Cerca del 90% de la serotonina de tu cuerpo se hace en el intestino. Estudios en ratones muestran que cambiar las bacterias intestinales cambia el comportamiento. Ratones sin gérmenes son más ansiosos. Darles ciertas bacterias reduce la ansiedad. En humanos, los probióticos pueden mejorar el estado de ánimo y la cognición. El mecanismo involucra el nervio vago, señales inmunes y metabolitos microbianos.",
            words: [["gut-brain axis", "eje intestino-cerebro"], ["neurotransmitter", "neurotransmisor"], ["serotonin", "serotonina"], ["germ-free", "libre de gérmenes"], ["vagus nerve", "nervio vago"], ["metabolite", "metabolito"]],
            question: "Where is most of the body's serotonin produced?",
            options: ["In the brain.", "In the gut.", "In the liver."],
            answer: 1,
            note: "90% of your body's serotonin is made in the gut da la cifra clave. Gut-brain axis nombra la vía de comunicación."
          },
          B2: {
            en: "Dysbiosis—an imbalanced microbiome—is linked to many diseases. Inflammatory bowel disease, obesity, type 2 diabetes, allergies, autism, and depression all show microbial signatures. Antibiotics are a major cause of dysbiosis. A single course can reduce diversity for months. Fecal microbiota transplantation (FMT) restores healthy communities. It cures recurrent C. difficile infection with over 90% success. Researchers are testing FMT for ulcerative colitis, metabolic syndrome, and even melanoma immunotherapy response. The challenge is defining a 'healthy' microbiome—it varies by geography, diet, and genetics.",
            es: "La disbiosis—un microbioma desequilibrado—está vinculada a muchas enfermedades. Enfermedad inflamatoria intestinal, obesidad, diabetes tipo 2, alergias, autismo y depresión muestran firmas microbianas. Los antibióticos son una causa mayor de disbiosis. Un solo tratamiento puede reducir la diversidad por meses. El trasplante de microbiota fecal (TMF) restaura comunidades saludables. Cura la infección recurrente por C. difficile con más del 90% de éxito. Investigadores prueban TMF para colitis ulcerosa, síndrome metabólico e incluso respuesta a inmunoterapia en melanoma. El reto es definir un microbioma 'saludable'—varía por geografía, dieta y genética.",
            words: [["dysbiosis", "disbiosis"], ["inflammatory bowel disease", "enfermedad inflamatoria intestinal"], ["fecal microbiota transplantation", "trasplante de microbiota fecal"], ["recurrent", "recurrente"], ["immunotherapy", "inmunoterapia"], ["signature", "firma/patrón"]],
            question: "What is the success rate of FMT for recurrent C. difficile infection?",
            options: ["About 50%.", "Over 90%.", "Nearly 100%."],
            answer: 1,
            note: "Over 90% success da la cifra clínica. Cures indica eficacia terapéutica."
          },
          C1: {
            en: "The microbiome challenges the concept of biological individuality. You are a holobiont—host plus symbionts. Horizontal gene transfer between microbes and host blurs genomic boundaries. Microbial metabolites like short-chain fatty acids (butyrate, propionate, acetate) regulate host gene expression through histone deacetylase inhibition. This epigenetic modulation links diet to phenotype. Precision nutrition aims to tailor dietary interventions to individual microbial profiles. Machine learning on metagenomic data predicts personalized glycemic responses to foods. The future is not one-size-fits-all diets, but microbiome-informed precision nutrition and pharmacology.",
            es: "El microbioma desafía el concepto de individualidad biológica. Eres un holobionte—hospedador más simbiontes. La transferencia horizontal de genes entre microbios y hospedador difumina fronteras genómicas. Metabolitos microbianos como ácidos grasos de cadena corta (butirato, propionato, acetato) regulan la expresión génica del hospedador inhibiendo histona deacetilasa. Esta modulación epigenética vincula dieta y fenotipo. La nutrición de precisión busca adaptar intervenciones dietéticas a perfiles microbianos individuales. El aprendizaje automático en datos metagenómicos predice respuestas glucémicas personalizadas a alimentos. El futuro no son dietas talla única, sino nutrición y farmacología de precisión informadas por el microbioma.",
            words: [["holobiont", "holobionte"], ["horizontal gene transfer", "transferencia horizontal de genes"], ["short-chain fatty acid", "ácido graso de cadena corta"], ["histone deacetylase inhibition", "inhibición de histona deacetilasa"], ["epigenetic modulation", "modulación epigenética"], ["precision nutrition", "nutrición de precisión"], ["metagenomic", "metagenómico"], ["glycemic response", "respuesta glucémica"]],
            question: "How do microbial metabolites like butyrate influence host biology?",
            options: ["They damage host DNA.", "They inhibit histone deacetylase, regulating gene expression epigenetically.", "They replace host enzymes."],
            answer: 1,
            note: "Regulate host gene expression through histone deacetylase inhibition describe el mecanismo molecular. Epigenetic modulation nombra el tipo de regulación."
          }
        }
      ]
    },
    {
      id: "dark-matter",
      title: "The Invisible Universe",
      theme: "Astrofísica · Cosmología",
      image: "darkmatter",
      description: "El 85% de la materia del universo no emite luz. Exploramos la evidencia y los candidatos: WIMPs, axiones, y más.",
      sources: [
        ["NASA · Dark Matter", "https://science.nasa.gov/astrophysics/focus-areas/what-is-dark-matter/"],
        ["CERN · Dark Matter", "https://home.cern/science/physics/dark-matter"]
      ],
      chapters: [
        {
          title: "The Missing Mass",
          A1: {
            en: "When astronomers look at galaxies, they see a problem. Stars in the outer parts of a galaxy move too fast. They should fly away. But they stay. There must be extra gravity holding them. This gravity comes from mass we cannot see. We call it dark matter. It does not shine. It does not reflect light. But it has gravity.",
            es: "Cuando los astrónomos miran galaxias, ven un problema. Las estrellas en las partes externas de una galaxia se mueven muy rápido. Deberían escapar. Pero se quedan. Debe haber gravedad extra sujetándolas. Esta gravedad viene de masa que no podemos ver. La llamamos materia oscura. No brilla. No refleja luz. Pero tiene gravedad.",
            words: [["galaxy", "galaxia"], ["outer part", "parte externa"], ["gravity", "gravedad"], ["dark matter", "materia oscura"], ["shine", "brillar"]],
            question: "Why do we think dark matter exists?",
            options: ["We can see it with telescopes.", "Stars move too fast and need extra gravity to stay.", "It shines in infrared light."],
            answer: 1,
            note: "Stars move too fast and need extra gravity describe la evidencia observacional. We cannot see indica que es invisible."
          },
          A2: {
            en: "The first evidence for dark matter came in 1933. Fritz Zwicky studied the Coma galaxy cluster. The galaxies moved so fast the cluster should fly apart. He calculated there must be 400 times more mass than visible. He called it 'dunkle Materie'—dark matter. In the 1970s, Vera Rubin measured rotation curves of spiral galaxies. Stars at the edge moved as fast as stars near the center. This flat rotation curve meant unseen mass extends far beyond the visible disk.",
            es: "La primera evidencia de materia oscura llegó en 1933. Fritz Zwicky estudió el cúmulo de galaxias de Coma. Las galaxias se movían tan rápido que el cúmulo debería deshacerse. Calculó que debía haber 400 veces más masa que la visible. La llamó 'dunkle Materie'—materia oscura. En los años 70, Vera Rubin midió curvas de rotación de galaxias espirales. Las estrellas en el borde se movían tan rápido como las del centro. Esta curva de rotación plana significaba que masa invisible se extiende mucho más allá del disco visible.",
            words: [["galaxy cluster", "cúmulo de galaxias"], ["rotation curve", "curva de rotación"], ["flat", "plana"], ["unseen mass", "masa invisible"], ["visible disk", "disco visible"]],
            question: "What did Vera Rubin's flat rotation curves imply?",
            options: ["Galaxies do not rotate.", "Unseen mass extends beyond the visible disk.", "Stars move slower at the edge."],
            answer: 1,
            note: "Flat rotation curve meant unseen mass extends far beyond the visible disk resume la implicación clave."
          },
          B1: {
            en: "Dark matter is not made of normal atoms. Normal matter (baryons) interacts with light. Dark matter does not. The cosmic microwave background shows that dark matter is about 27% of the universe's energy budget. Normal matter is only 5%. The rest is dark energy. Dark matter clumps under gravity. It forms a cosmic web of filaments and halos. Galaxies form inside these dark matter halos. Without dark matter, galaxies would not have formed in the time available since the Big Bang.",
            es: "La materia oscura no está hecha de átomos normales. La materia normal (bariones) interactúa con la luz. La materia oscura no. El fondo de microondas cósmico muestra que la materia oscura es cerca del 27% del presupuesto energético del universo. La materia normal es solo el 5%. El resto es energía oscura. La materia oscura se agrupa por gravedad. Forma una red cósmica de filamentos y halos. Las galaxias se forman dentro de estos halos de materia oscura. Sin materia oscura, las galaxias no se habrían formado en el tiempo transcurrido desde el Big Bang.",
            words: [["baryon", "barión"], ["cosmic microwave background", "fondo de microondas cósmico"], ["energy budget", "presupuesto energético"], ["dark energy", "energía oscura"], ["cosmic web", "red cósmica"], ["halo", "halo"]],
            question: "What percentage of the universe's energy budget is dark matter?",
            options: ["5%.", "27%.", "68%."],
            answer: 1,
            note: "About 27% of the universe's energy budget da la cifra del modelo cosmológico estándar. Normal matter is only 5% contrasta con materia bariónica."
          },
          B2: {
            en: "Leading candidates for dark matter are WIMPs (Weakly Interacting Massive Particles) and axions. WIMPs would have mass 10-1000 times a proton and interact via the weak force. Detectors like XENONnT and LUX search for WIMP collisions with xenon nuclei. Axions are extremely light particles proposed to solve a problem in the strong force. Experiments like ADMX search for axions converting to photons in strong magnetic fields. So far, no confirmed detection. Alternative theories like MOND (Modified Newtonian Dynamics) modify gravity instead of adding matter. But MOND struggles with galaxy clusters and the cosmic microwave background.",
            es: "Los candidatos principales de materia oscura son WIMPs (Partículas Masivas de Interacción Débil) y axiones. Los WIMPs tendrían masa 10-1000 veces un protón e interactuarían vía fuerza débil. Detectores como XENONnT y LUX buscan colisiones de WIMPs con núcleos de xenón. Los axiones son partículas extremadamente ligeras propuestas para resolver un problema en la fuerza fuerte. Experimentos como ADMX buscan axiones convirtiéndose en fotones en campos magnéticos fuertes. Hasta ahora, ninguna detección confirmada. Teorías alternativas como MOND (Dinámica Newtoniana Modificada) modifican la gravedad en vez de añadir materia. Pero MOND lucha con cúmulos de galaxias y el fondo de microondas cósmico.",
            words: [["WIMP", "WIMP"], ["weak force", "fuerza débil"], ["axion", "axión"], ["strong force", "fuerza fuerte"], ["MOND", "MOND"], ["xenon nucleus", "núcleo de xenón"]],
            question: "What is the main difference between WIMPs and axions as dark matter candidates?",
            options: ["WIMPs are heavy and interact via weak force; axions are extremely light.", "WIMPs are made of normal matter; axions are not.", "Axions have been detected; WIMPs have not."],
            answer: 0,
            note: "WIMPs would have mass 10-1000 times a proton; axions are extremely light particles describe la diferencia fundamental de masa."
          },
          C1: {
            en: "The dark matter puzzle sits at the intersection of particle physics and cosmology. A detection would reveal physics beyond the Standard Model. The thermal relic paradigm predicts WIMPs with electroweak-scale mass and cross-section. But null results from LHC, direct detection, and indirect detection (Fermi-LAT, AMS-02) constrain parameter space. Axions gain motivation from the strong CP problem and string theory. The 'axion window' of micro-eV to meV masses is being probed by haloscopes (ADMX, HAYSTAC) and helioscopes (CAST, IAXO). Primordial black holes as dark matter have revived interest after LIGO's binary black hole mergers. The answer may be a mixture: multiple components. Future probes include 21-cm cosmology (HERA, SKA), gravitational lensing (Euclid, Roman), and collider searches for dark sectors.",
            es: "El enigma de la materia oscura está en la intersección de la física de partículas y la cosmología. Una detección revelaría física más allá del Modelo Estándar. El paradigma de reliquia térmica predice WIMPs con masa y sección eficaz de escala electroweak. Pero resultados nulos del LHC, detección directa e indirecta (Fermi-LAT, AMS-02) restringen el espacio de parámetros. Los axiones ganan motivación del problema fuerte CP y teoría de cuerdas. La 'ventana de axión' de micro-eV a meV se investiga con haloscopios (ADMX, HAYSTAC) y helioscopios (CAST, IAXO). Los agujeros negros primordiales como materia oscura han revivido interés tras las fusiones de binarios de LIGO. La respuesta puede ser una mezcla: múltiples componentes. Futuros sondeos incluyen cosmología de 21-cm (HERA, SKA), lente gravitacional (Euclid, Roman), y búsquedas en colisionadores de sectores oscuros.",
            words: [["Standard Model", "Modelo Estándar"], ["thermal relic", "reliquia térmica"], ["cross-section", "sección eficaz"], ["parameter space", "espacio de parámetros"], ["strong CP problem", "problema fuerte CP"], ["haloscope", "haloscopio"], ["helioscope", "helioscopio"], ["primordial black hole", "agujero negro primordial"], ["dark sector", "sector oscuro"], ["21-cm cosmology", "cosmología de 21-cm"]],
            question: "What has constrained the WIMP parameter space in recent years?",
            options: ["Theoretical calculations only.", "Null results from LHC, direct detection, and indirect detection.", "Discovery of axions."],
            answer: 1,
            note: "Null results from LHC, direct detection, and indirect detection describe la evidencia experimental negativa. Constrain parameter space indica el efecto en los modelos."
          }
        }
      ]
    }
  ];

  // Merge with existing features
  const existingFeatures = window.LumaFeatures || [];
  const merged = [...existingFeatures, ...ADDITIONAL_ARTICLES];
  
  // Deduplicate by ID
  const seen = new Set();
  const unique = merged.filter(f => {
    if (seen.has(f.id)) return false;
    seen.add(f.id);
    return true;
  });
  
  window.LumaFeatures = Object.freeze(unique);
})();