(() => {
  "use strict";

  const levels = ["A1", "A2", "B1", "B2", "C1"];
  const books = {
    reading: {
      title: "The ocean that glows",
      theme: "Biología marina",
      image: "ocean",
      description:
        "Descubre cómo y por qué algunos animales marinos emiten luz.",
    },
    astro: {
      title: "Where stars are born",
      theme: "Astronomía",
      image: "nebula",
      description:
        "Sigue las pistas que deja una estrella joven en una nube de polvo.",
      sources: [
        [
          "NASA Webb · Cosmic Cliffs",
          "https://science.nasa.gov/missions/webb/nasas-webb-reveals-cosmic-cliffs-glittering-landscape-of-star-birth/",
        ],
        ["NASA Science · Stars", "https://science.nasa.gov/universe/stars/"],
      ],
      lessons: {
        A1: {
          en: "Look at the stars. Some are young. A new star can form in a big cloud in space. The cloud has gas and dust.",
          es: "Mira las estrellas. Algunas son jóvenes. Una estrella nueva puede formarse en una nube grande en el espacio. La nube contiene gas y polvo.",
          words: [
            ["star", "estrella"],
            ["young", "joven"],
            ["cloud", "nube"],
          ],
          question: "Where can a new star form?",
          options: ["In the sea.", "In a cloud in space.", "In a leaf."],
          answer: 1,
          note: "La frase «in a big cloud in space» indica un lugar. Where pregunta dónde.",
        },
        A2: {
          en: "The Webb telescope looks at a cloud far from Earth. There are young stars inside it. Dust can hide them from our eyes. Webb uses infrared light to see some of these stars.",
          es: "El telescopio Webb observa una nube lejos de la Tierra. Hay estrellas jóvenes en su interior. El polvo puede ocultarlas a nuestros ojos. Webb usa luz infrarroja para observar algunas de estas estrellas.",
          words: [
            ["far from", "lejos de"],
            ["inside", "dentro de"],
            ["hide", "ocultar"],
          ],
          question: "What does Webb use to see some hidden stars?",
          options: ["Sea water.", "A cloud of gas.", "Infrared light."],
          answer: 2,
          note: "La última frase nombra lo que usa Webb. Uses es la forma de use para un sujeto singular.",
        },
        B1: {
          en: "Imagine looking inside a cold cloud in space. In some places, gas gathers into a dense clump. Gravity pulls the material closer together, and the centre becomes hotter. A young object called a protostar begins to form. More gas can still fall into it.",
          es: "Imagina que observas el interior de una nube fría en el espacio. En algunos puntos, el gas se reúne en una concentración densa. La gravedad acerca el material y el centro se calienta. Empieza a formarse un objeto joven llamado protoestrella. Todavía puede caer más gas hacia él.",
          words: [
            ["clump", "acumulación compacta"],
            ["pull", "atraer"],
            ["hotter", "más caliente"],
          ],
          question: "What happens as gravity pulls material together?",
          options: [
            "The centre heats up.",
            "The gas turns into water.",
            "Gravity disappears.",
          ],
          answer: 0,
          note: "As conecta dos procesos que ocurren a la vez. El centro se calienta durante la contracción.",
        },
        B2: {
          en: "In the Carina Nebula, a wall of gas and dust resembles a mountain range. The apparent peaks mark the edge of a cavity shaped by massive stars. When astronomers examined the region in infrared light, they could distinguish young objects previously obscured by dust. The change of wavelength changed what they could observe.",
          es: "En la nebulosa de Carina, una pared de gas y polvo se parece a una cordillera. Los aparentes picos marcan el borde de una cavidad moldeada por estrellas masivas. Al examinar la región en luz infrarroja, los astrónomos distinguieron objetos jóvenes que antes ocultaba el polvo. El cambio de longitud de onda cambió lo que podían observar.",
          words: [
            ["resemble", "parecerse a"],
            ["edge", "borde"],
            ["obscured", "oculto"],
          ],
          question: "Why did the infrared image add information?",
          options: [
            "It moved the stars closer.",
            "It revealed objects hidden in visible light.",
            "It removed dust from the region.",
          ],
          answer: 1,
          note: "Previously obscured describe una limitación de la observación anterior. Cambió la luz detectada y el polvo siguió en su sitio.",
        },
        C1: {
          en: "A cluster of young objects near the rim of a cavity invites a causal interpretation. Radiation from massive stars could have influenced when neighbouring clouds collapsed. Yet a shared location establishes proximity alone. To argue that the expanding rim triggered collapse, one would also need evidence that its arrival preceded the formation of those objects.",
          es: "Un grupo de objetos jóvenes cerca del borde de una cavidad invita a una interpretación causal. La radiación de estrellas masivas podría haber influido en el momento del colapso de nubes vecinas. Sin embargo, compartir ubicación solo demuestra proximidad. Para sostener que el borde en expansión desencadenó el colapso, también harían falta indicios de que llegó antes de formarse esos objetos.",
          words: [
            ["rim", "borde"],
            ["trigger", "desencadenar"],
            ["precede", "preceder"],
          ],
          question:
            "Which evidence would most directly strengthen the proposed sequence?",
          options: [
            "The stars look bright in the same picture.",
            "Two objects have the same apparent colour.",
            "Age estimates place collapse after the rim reached the cloud.",
          ],
          answer: 2,
          note: "El orden temporal es necesario para esta interpretación. Could have influenced deja abierta la posibilidad de otras explicaciones.",
        },
      },
    },
    plants: {
      title: "How leaves feed a forest",
      theme: "Botánica",
      image: "plant",
      description:
        "Acompaña al carbono en su viaje desde el aire hasta un árbol.",
      sources: [
        [
          "NASA Earth Observatory · The Carbon Cycle",
          "https://science.nasa.gov/earth/earth-observatory/the-carbon-cycle/",
        ],
        [
          "NASA Landsat · Carbon in boreal forests",
          "https://science.nasa.gov/missions/landsat/nasa-study-finds-potential-carbon-sink-in-boreal-forest-growth/",
        ],
      ],
      lessons: {
        A1: {
          en: "This is a tree. It has green leaves. The leaves use light from the Sun to make sugar. The tree uses this sugar to grow.",
          es: "Este es un árbol. Tiene hojas verdes. Las hojas usan la luz del Sol para producir azúcar. El árbol usa ese azúcar para crecer.",
          words: [
            ["tree", "árbol"],
            ["leaf / leaves", "hoja / hojas"],
            ["grow", "crecer"],
          ],
          question: "What do the leaves make?",
          options: ["Sugar.", "Stones.", "Sunlight."],
          answer: 0,
          note: "Las hojas producen azúcar. Make significa «producir» en esta frase.",
        },
        A2: {
          en: "A tree needs water, air and light. Its green leaves take in a gas from the air called carbon dioxide. With water and energy from sunlight, the leaves make sugar. The sugar helps the tree grow.",
          es: "Un árbol necesita agua, aire y luz. Sus hojas verdes toman del aire un gas llamado dióxido de carbono. Con agua y energía de la luz solar, las hojas producen azúcar. El azúcar ayuda al árbol a crecer.",
          words: [
            ["need", "necesitar"],
            ["take in", "absorber"],
            ["sunlight", "luz solar"],
          ],
          question: "Where does the tree get carbon dioxide?",
          options: ["From the Sun.", "From the air.", "From a stone."],
          answer: 1,
          note: "From the air indica el origen del dióxido de carbono. El Sol aporta energía.",
        },
        B1: {
          en: "Follow a carbon atom on its journey. At first it is part of carbon dioxide in the air. A leaf takes in the gas and uses energy from sunlight to make sugar. The atom can then become part of the wood as the tree grows. This is one way carbon moves into a forest.",
          es: "Sigue un átomo de carbono en su recorrido. Al principio forma parte del dióxido de carbono del aire. Una hoja absorbe el gas y usa energía solar para producir azúcar. Después, el átomo puede incorporarse a la madera al crecer el árbol. Así puede llegar el carbono al bosque.",
          words: [
            ["journey", "recorrido"],
            ["at first", "al principio"],
            ["wood", "madera"],
          ],
          question: "Which sequence follows the atom into the tree?",
          options: [
            "Wood, air, sunlight.",
            "Sunlight, rain, wood.",
            "Carbon dioxide, sugar, wood.",
          ],
          answer: 2,
          note: "At first y then ordenan los pasos del recorrido. La energía solar permite el proceso y el átomo procede del dióxido de carbono.",
        },
        B2: {
          en: "A forest both absorbs carbon dioxide and releases it. Photosynthesis draws carbon into plant tissue, while respiration and the decay of dead material return some of it to the atmosphere. To decide whether a forest gained carbon over a year, researchers have to compare the amount entering it with the amount leaving it.",
          es: "Un bosque absorbe dióxido de carbono y también lo libera. La fotosíntesis incorpora carbono al tejido vegetal, mientras que la respiración y la descomposición devuelven parte de él a la atmósfera. Para saber si un bosque ganó carbono en un año, hay que comparar la cantidad que entró con la que salió.",
          words: [
            ["tissue", "tejido"],
            ["decay", "descomposición"],
            ["release", "liberar"],
          ],
          question:
            "A forest absorbs 12 units of carbon and releases 9 over a year. What is its net gain in this example?",
          options: ["3 units.", "9 units.", "21 units."],
          answer: 0,
          note: "En este ejemplo hipotético, el balance es el ingreso menos la salida. While introduce aquí dos procesos que se contrastan.",
        },
        C1: {
          en: "Researchers estimating future carbon storage in boreal forests have to distinguish potential growth from realised gains. A young stand may accumulate carbon as it matures, provided it persists. Fire or other disturbances can alter that trajectory. A forecast therefore depends on assumptions about what will happen after the initial measurement.",
          es: "Al estimar el almacenamiento futuro de carbono en bosques boreales, los investigadores deben distinguir el crecimiento potencial de las ganancias efectivas. Una masa forestal joven puede acumular carbono al madurar, siempre que perdure. El fuego u otras perturbaciones pueden modificar su trayectoria. El pronóstico depende de supuestos sobre lo que ocurrirá tras la medición inicial.",
          words: [
            ["stand", "masa forestal"],
            ["provided", "siempre que"],
            ["disturbance", "perturbación"],
          ],
          question:
            "Which wording preserves the condition behind the projection?",
          options: [
            "Every young forest will store the projected amount.",
            "Storage could increase if the stand survives and grows.",
            "A single measurement settles the long-term outcome.",
          ],
          answer: 1,
          note: "Could y if mantienen el carácter condicional de la proyección. Provided introduce el supuesto de que el bosque perdura.",
        },
      },
    },
  };

  function savedIds(api) {
    const saved = api.get("saved", []);
    return Array.isArray(saved) ? saved : [];
  }

  const localDate = () => {
    const d = new Date();
    return [
      d.getFullYear(),
      String(d.getMonth() + 1).padStart(2, "0"),
      String(d.getDate()).padStart(2, "0"),
    ].join("-");
  };
  function catalog() {
    // Las sesiones breves se toman del catálogo diario. Se filtran las claves
    // ausentes para que un cambio de ciencias nunca deje la biblioteca vacía.
    const topics = window.LumaDailyData?.topics || {};
    const extra = ["physics", "chemistry", "math", "engineering"]
      .filter((id) => topics[id])
      .map((id) => {
        const topic = topics[id];
        return [id, { ...topic, description: topic.prompt, isSession: true }];
      });
    const long = Object.fromEntries(
      (window.LumaFeatures || []).map((story) => [
        "fondo-" + story.id,
        { ...story, isLong: true },
      ]),
    );
    return { ...books, ...Object.fromEntries(extra), ...long };
  }
  function bookmark(id, api) {
    const saved = savedIds(api).includes(id);
    const label =
      (saved ? "Quitar de guardados" : "Guardar lectura") +
      " · " +
      catalog()[id].title;
    return `<button type="button" class="lb-mark" data-bookmark="${id}" aria-label="${label}" aria-pressed="${saved}" title="${label}">${api.icon(saved ? "bookmark-check" : "bookmark", 19)}</button>`;
  }

  function toggleSaved(id, api) {
    const saved = savedIds(api);
    const adding = !saved.includes(id);
    api.set(
      "saved",
      adding ? [...saved, id] : saved.filter((item) => item !== id),
    );
    api.toast(adding ? "Lectura guardada" : "Lectura retirada de guardados");
  }

  function library(root, api, filter = "all") {
    const saved = savedIds(api);
    const list = Object.entries(catalog()).filter(
      ([id,book]) => filter === "all" || (filter === "saved" && saved.includes(id)) || (filter === "long" && book.isLong) || (filter === "guided" && !book.isLong),
    );
    root.innerHTML = `<section class="lb-panel">
      <header class="lb-heading"><h1>${filter==="long"?"Lecturas de fondo":"Biblioteca"}</h1><p>${filter==="long"?"Sigue una investigación en cinco capítulos bilingües, desde la primera observación hasta los límites de la evidencia.":"Elige una sesión breve o profundiza en un artículo bilingüe por capítulos."}</p></header>
      <div class="lb-filter" role="group" aria-label="Filtrar lecturas">
        <button type="button" data-filter="all" aria-pressed="${filter === "all"}">Todos</button>
        <button type="button" data-filter="guided" aria-pressed="${filter === "guided"}">Lecturas guiadas</button>
        <button type="button" data-filter="long" aria-pressed="${filter === "long"}">Lecturas de fondo</button>
        <button type="button" data-filter="saved" aria-pressed="${filter === "saved"}">${api.icon("bookmark", 16)} Guardados</button>
      </div>
      <div class="lb-grid">${list
        .map(
          ([id, book]) => `<article class="lb-card">
        <div class="lb-cover"><img src="assets/${book.image}.webp" alt="">${bookmark(id, api)}</div>
        <div class="lb-card-body"><span class="lb-subject">${book.theme}${book.isLong?" · 5 capítulos":""}</span>
        <h2 lang="en"><button type="button" data-open="${id}">${book.title}</button></h2><p>${book.description}</p>
        <div class="lb-card-actions"><button type="button" class="lb-text-btn" data-open="${id}" aria-label="Leer ${book.title}">${api.icon("book-open", 17)} ${book.isSession ? "Estudiar lectura" : "Leer artículo"}</button><button type="button" class="lb-btn lw-open" data-write="${id}" aria-label="Escribir sobre ${book.title}">${api.icon("pencil-line", 16)} Escribir</button></div></div>
      </article>`,
        )
        .join("")}</div>
      ${list.length ? "" : `<div class="lb-empty">${api.icon("book-marked", 32)}<h2>Aún no tienes lecturas guardadas</h2><p>Guarda una lectura con el marcador de su portada.</p><button class="lb-btn" type="button" data-filter="all">Ver lecturas</button></div>`}
    </section>`;
    root.querySelectorAll("[data-filter]").forEach(
      (btn) =>
        (btn.onclick = () => {
          library(root, api, btn.dataset.filter);
          root.querySelector(`[data-filter="${btn.dataset.filter}"]`)?.focus();
        }),
    );
    root.querySelectorAll("[data-open]").forEach(
      (btn) =>
        (btn.onclick = () => {
          const id = btn.dataset.open;
          if (catalog()[id].isSession) {
            api.set("daily.selection." + localDate(), id);
            api.go("daily");
          } else api.go(id);
        }),
    );
    root.querySelectorAll("[data-write]").forEach(
      (btn) =>
        (btn.onclick = () => {
          const id = btn.dataset.write;
          window.LumaWriting.render(id, catalog()[id], root, api, () =>
            library(root, api, filter),
          );
        }),
    );
    root.querySelectorAll("[data-bookmark]").forEach(
      (btn) =>
        (btn.onclick = () => {
          const id = btn.dataset.bookmark;
          toggleSaved(id, api);
          library(root, api, filter);
          (
            root.querySelector(`[data-bookmark="${id}"]`) ||
            root.querySelector('[data-filter="saved"]')
          )?.focus();
        }),
    );
  }

  function reader(id, root, api) {
    const book = books[id];
    const preferredLevel = api.level();
    const level = levels.includes(preferredLevel) ? preferredLevel : "A1";
    const lesson = book.lessons[level];
    const completedKey = "library-read-" + id + "-" + level;
    const alreadyRead = api.get(completedKey, false) === true;
    root.innerHTML = `<article class="lb-panel lb-reader">
      <button type="button" class="lb-return">${api.icon("chevron-left", 16)} Biblioteca</button>
      <header class="lb-reader-cover">
        <img src="assets/${book.image}.webp" alt=""><div class="lb-tint"></div>
        <div class="lb-reader-title"><span>${book.theme} · ${level}</span><h1 lang="en">${book.title}</h1></div>${bookmark(id, api)}
      </header>
      <div class="lb-paper">
        <div class="lb-tools"><label>Nivel <select aria-label="Nivel de lectura">${levels.map((item) => `<option${item === level ? " selected" : ""}>${item}</option>`).join("")}</select></label>
          <button type="button" class="lb-btn" data-audio>${api.icon("volume-2", 17)} Escuchar</button>
          <button type="button" class="lb-btn" data-ask-lumi>${api.icon("sparkles", 17)} Preguntar a Lumi</button><button type="button" class="lb-btn" data-translate aria-expanded="false" aria-controls="lb-spanish">${api.icon("languages", 17)} Traducción</button>
        </div>
        <p class="lb-copy" lang="en">${lesson.en}</p>
        <p class="lb-translation" id="lb-spanish" hidden>${lesson.es}</p><p class="lb-audio-status" role="status"></p>
        <h2>Palabras de la lectura</h2><dl class="lb-words">${lesson.words.map(([word, meaning]) => `<div><dt lang="en">${word}</dt><dd>${meaning}</dd></div>`).join("")}</dl>
        <section class="lb-quiz"><h2>Comprueba tu lectura</h2><p lang="en">${lesson.question}</p>
          <div class="lb-choices" role="group" aria-label="Respuestas de comprensión">${lesson.options.map((option, index) => `<button type="button" lang="en" data-choice="${index}" aria-pressed="false">${option}</button>`).join("")}</div>
          <p class="lb-feedback" role="status">${alreadyRead ? "Actividad completada. Puedes practicar otra vez." : ""}</p>
        </section>
        <footer class="lb-source"><strong>Fuentes de la adaptación de Luma</strong>${book.sources.map(([name, url]) => `<a href="${url}" target="_blank" rel="noopener noreferrer">${name} ${api.icon("external-link", 14)}</a>`).join("")}</footer>
      </div>
    </article>`;
    root.querySelector(".lb-return").onclick = () => api.go("library");
    root.querySelector("[data-ask-lumi]").onclick = () => {
      const [sourceName, sourceUrl] = book.sources[0];
      api.set("lessonContext", {
        title: book.title,
        passage: lesson.en,
        sourceName,
        sourceUrl,
        level,
      });
      api.go("tutor");
    };
    const select = root.querySelector("select");
    select.onchange = () => {
      stopAudio();
      api.set("level", select.value);
      releaseReader = reader(id, root, api);
      root.querySelector("select").focus();
    };
    const mark = root.querySelector("[data-bookmark]");
    mark.onclick = () => {
      toggleSaved(id, api);
      const saved = savedIds(api).includes(id);
      mark.setAttribute("aria-pressed", String(saved));
      mark.title =
        (saved ? "Quitar de guardados" : "Guardar lectura") +
        " · " +
        book.title;
      mark.setAttribute("aria-label", mark.title);
      mark.innerHTML = api.icon(saved ? "bookmark-check" : "bookmark", 19);
    };
    const translation = root.querySelector("#lb-spanish");
    const translate = root.querySelector("[data-translate]");
    translate.onclick = () => {
      translation.hidden = !translation.hidden;
      translate.setAttribute("aria-expanded", String(!translation.hidden));
    };
    const audioButton = root.querySelector("[data-audio]");
    const status = root.querySelector(".lb-audio-status");
    let current = null;
    const setAudioLabel = (playing) => {
      audioButton.innerHTML =
        api.icon(playing ? "square" : "volume-2", 17) +
        (playing ? " Detener" : " Escuchar");
    };
    function stopAudio() {
      if (!current) return;
      current.onend = current.onerror = null;
      current = null;
      window.speechSynthesis.cancel();
      setAudioLabel(false);
      window.removeEventListener("hashchange", stopAudio);
    }
    audioButton.onclick = () => {
      if (current) return stopAudio();
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
        status.textContent =
          "Este navegador no ofrece lectura en voz alta. Puedes seguir con el texto y la traducción.";
        return;
      }
      status.textContent = "";
      const utterance = new window.SpeechSynthesisUtterance(lesson.en);
      utterance.lang = "en-US";
      utterance.rate = window.LumaPreferences.speechRate(
        level === "A1" || level === "A2" ? 0.86 : 0.96,
      );
      const voice = window.speechSynthesis
        .getVoices()
        .find((item) => /^en[-_]/i.test(item.lang));
      if (voice) utterance.voice = voice;
      utterance.onend = () => {
        current = null;
        setAudioLabel(false);
        window.removeEventListener("hashchange", stopAudio);
      };
      utterance.onerror = () => {
        utterance.onend();
        status.textContent =
          "La voz en inglés no está disponible. Puedes continuar con el texto.";
      };
      current = utterance;
      window.speechSynthesis.cancel();
      window.addEventListener("hashchange", stopAudio, { once: true });
      setAudioLabel(true);
      window.speechSynthesis.speak(utterance);
    };
    const feedback = root.querySelector(".lb-feedback");
    const choices = [...root.querySelectorAll("[data-choice]")];
    choices.forEach(
      (btn) =>
        (btn.onclick = () => {
          choices.forEach((item) => {
            item.classList.remove("lb-right", "lb-wrong");
            item.setAttribute("aria-pressed", String(item === btn));
          });
          const correct = Number(btn.dataset.choice) === lesson.answer;
          btn.classList.add(correct ? "lb-right" : "lb-wrong");
          feedback.textContent =
            (correct
              ? "¡Así es! "
              : "Vuelve al pasaje y prueba otra opción. ") + lesson.note;
          if (correct) {
            api.complete("reading-" + id + "-" + level);
            if (!api.get(completedKey, false)) api.set(completedKey, true);
          }
        }),
    );
    return stopAudio;
  }

  let releaseReader = null;
  function dispose() {
    if (releaseReader) releaseReader();
    releaseReader = null;
  }
  window.LumaLibrary = {
    dispose,
    lesson(id, level) {
      return books[id]?.lessons?.[level];
    },
    render(route, root, api) {
      dispose();
      if (route === "library" || route === "longreads") library(root, api, route === "longreads" ? "long" : "all");
      else if (route === "astro" || route === "plants")
        releaseReader = reader(route, root, api);
      return dispose;
    },
  };
})();
