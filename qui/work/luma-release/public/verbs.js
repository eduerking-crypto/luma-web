(() => {
  "use strict";

  const lexicon = window.LumaVerbDataExtended || window.LumaVerbData;
  const byBase = new Map(lexicon.map((verb) => [verb.base, verb]));
  const periods = {
    present: "Presente",
    past: "Pasado",
    future: "Futuro con will",
  };
  const aspects = {
    simple: "Simple",
    continuous: "Continuo",
    perfect: "Perfecto",
    perfectContinuous: "Perfecto continuo",
  };
  const modes = {
    positive: "Afirmativa",
    negative: "Negativa",
    question: "Interrogativa",
  };
  const people = [
    { subject: "I", meaning: "yo", number: "first" },
    { subject: "You", meaning: "tú / usted", number: "plural" },
    { subject: "She", meaning: "él / ella / ello", number: "third" },
    { subject: "We", meaning: "nosotros/as", number: "plural" },
    { subject: "You", meaning: "ustedes / vosotros", number: "plural" },
    { subject: "They", meaning: "ellos/as", number: "plural" },
  ];
  const explanations = {
    present: {
      simple: [
        "Present simple",
        "Describe un hábito, una propiedad o un hecho que se considera válido en el presente. En afirmativas, he, she e it llevan la forma de tercera persona.",
      ],
      continuous: [
        "Present continuous",
        "Presenta una acción en curso o una situación temporal. Combina am, is o are con la forma en -ing.",
      ],
      perfect: [
        "Present perfect",
        "Relaciona un hecho pasado con el presente. Puede indicar experiencia, un resultado actual o una situación que continúa. Usa have o has seguido del participio pasado.",
      ],
      perfectContinuous: [
        "Present perfect continuous",
        "Enfoca el desarrollo o la duración de una actividad anterior que continúa o deja señales en el presente. Usa have o has, después been y la forma en -ing.",
      ],
    },
    past: {
      simple: [
        "Past simple",
        "Sitúa un hecho, hábito o estado en un periodo pasado ya terminado. En una afirmativa, usa la forma pasada del verbo.",
      ],
      continuous: [
        "Past continuous",
        "Describe lo que estaba ocurriendo en un momento pasado. Combina was o were con la forma en -ing. Puede dar el contexto de otro suceso.",
      ],
      perfect: [
        "Past perfect",
        "Mira hacia atrás desde un punto del pasado. Para indicar que un hecho ocurrió antes de ese punto, usa had y el participio pasado.",
      ],
      perfectContinuous: [
        "Past perfect continuous",
        "Describe cuánto tiempo llevaba ocurriendo una actividad hasta un momento pasado. Combina had been con la forma en -ing.",
      ],
    },
    future: {
      simple: [
        "Future simple · will",
        "Usa will y la forma base para formular una predicción, una promesa o una decisión tomada al hablar. Will permanece igual con todos los sujetos.",
      ],
      continuous: [
        "Future continuous",
        "Sitúa una actividad en pleno desarrollo en un momento futuro. Después de will, usa be y la forma en -ing.",
      ],
      perfect: [
        "Future perfect",
        "Desde un punto del futuro, mira una acción que para entonces ya se habrá completado. Usa will have y el participio pasado.",
      ],
      perfectContinuous: [
        "Future perfect continuous",
        "Expresa la duración acumulada de una actividad hasta un punto futuro. Usa will have been y la forma en -ing.",
      ],
    },
  };
  const stative = new Set([
    "believe",
    "belong",
    "contain",
    "hate",
    "hear",
    "include",
    "know",
    "like",
    "love",
    "mean",
    "need",
    "owe",
    "own",
    "possess",
    "prefer",
    "recognize",
    "seem",
    "stand for",
    "understand",
    "want",
  ]);
  const notes = {
    be: "En pasado simple, I, he, she e it usan was. You, we y they usan were. La forma continua con being puede describir una conducta temporal, como actuar con cuidado.",
    have: "Aquí have lunch significa «almorzar» y describe una actividad. Para indicar posesión, la forma simple es la habitual.",
    do: "Como verbo principal, do significa «hacer». En preguntas del presente simple puede aparecer junto a su propio auxiliar, como en Does she do the exercise?",
    get: "En este catálogo se usa gotten como participio de get en el sentido de conseguir. En inglés británico se suele usar got.",
    read: "La forma base read suena /riːd/. El pasado y el participio se escriben también read y suenan /red/.",
    lie: "Esta ficha muestra lie con el sentido de tumbarse. El verbo lie con el sentido de mentir tiene el pasado y el participio lied.",
    lay: "Lay significa colocar algo. Su pasado y su participio son laid. Para tumbarse se emplea lie.",
    fit: "Con el sentido de colocar una pieza, el ejemplo usa fitted. También puedes encontrar fit en inglés estadounidense, especialmente cuando se habla de talla o ajuste.",
    cost: "En el sentido de tener un precio, el pasado y el participio son cost. Para hablar de estimar un presupuesto también existe costed.",
    hang: "La tabla usa hung para colgar un objeto.",
    shine:
      "En el sentido de brillar se usa shone. También existe shined, frecuente al hablar de sacar brillo a un objeto.",
    learn:
      "Learned se usa en inglés estadounidense y británico. En inglés británico también encontrarás learnt.",
    burn: "Burned se usa en inglés estadounidense y británico. En inglés británico también encontrarás burnt.",
    dream: "Dreamed y dreamt son dos formas aceptadas. Esta tabla usa dreamed.",
    travel:
      "La tabla adopta la grafía estadounidense traveled y traveling. La británica suele ser travelled y travelling.",
    practice:
      "En inglés estadounidense, practice se escribe igual como sustantivo y como verbo. En la norma británica el verbo se escribe practise.",
    analyze:
      "La grafía empleada aquí es analyze. En inglés británico también encontrarás analyse.",
    think:
      "El ejemplo think about describe la actividad de reflexionar. Para expresar una opinión con think that, se suele usar una forma simple.",
    feel: "El ejemplo describe la acción de palpar una tela. Feel también puede describir una sensación.",
    sound:
      "En el sentido de parecer por el sonido, es frecuente el uso simple. Una forma continua puede destacar una impresión cambiante o temporal.",
  };
  const normalization = (value) =>
    String(value)
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/\s+/g, " ");
  const capital = (text) => text[0].toUpperCase() + text.slice(1);
  const lowerSubject = (subject) =>
    subject === "I" ? subject : subject[0].toLowerCase() + subject.slice(1);
  const esc = (value) =>
    String(value).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  function be(period, number) {
    if (period === "past") return number === "plural" ? "were" : "was";
    return number === "first" ? "am" : number === "third" ? "is" : "are";
  }
  const continuous = (aspect) =>
    aspect === "continuous" || aspect === "perfectContinuous";
  function verbParts(verb, period, aspect, mode, number) {
    const perfect = aspect === "perfect" || aspect === "perfectContinuous";
    const ongoing = continuous(aspect);
    if (period === "future") {
      if (aspect === "perfectContinuous")
        return ["will", "have", "been", verb.ing];
      if (perfect) return ["will", "have", verb.participle];
      if (ongoing) return ["will", "be", verb.ing];
      return ["will", verb.base];
    }
    if (perfect) {
      const auxiliary =
        period === "past" ? "had" : number === "third" ? "has" : "have";
      return ongoing
        ? [auxiliary, "been", verb.ing]
        : [auxiliary, verb.participle];
    }
    if (ongoing) return [be(period, number), verb.ing];
    if (verb.base === "be") return [be(period, number)];
    if (mode !== "positive")
      return [
        period === "past" ? "did" : number === "third" ? "does" : "do",
        verb.base,
      ];
    return [
      period === "past"
        ? verb.past
        : number === "third"
          ? verb.third
          : verb.base,
    ];
  }
  function sentence(verb, period, aspect, mode, person, complement = "") {
    const [first, ...rest] = verbParts(
      verb,
      period,
      aspect,
      mode,
      person.number,
    );
    const words =
      mode === "question"
        ? [capital(first), lowerSubject(person.subject), ...rest]
        : mode === "negative"
          ? [person.subject, first, "not", ...rest]
          : [person.subject, first, ...rest];
    if (complement) words.push(complement);
    return words.join(" ") + (mode === "question" ? "?" : ".");
  }
  function recommended(verb, aspect) {
    if (stative.has(verb.base) && continuous(aspect))
      return aspect === "continuous" ? "simple" : "perfect";
    return aspect;
  }
  function example(verb, period, aspect, mode) {
    const number = verb.subject === "We" ? "plural" : "third";
    return sentence(
      verb,
      period,
      aspect,
      mode,
      { subject: verb.subject, number },
      verb.complement,
    );
  }
  function modeHelp(verb, period, aspect, mode) {
    if (mode === "positive") return "";
    if (period !== "future" && aspect === "simple" && verb.base !== "be") {
      if (mode === "question")
        return "Coloca do, does o did antes del sujeto y deja el verbo principal en su forma base.";
      return "Coloca do, does o did con not antes de la forma base del verbo principal.";
    }
    return mode === "question"
      ? "Para preguntar, coloca el primer auxiliar o la forma simple de be delante del sujeto."
      : "Para negar, coloca not justo después del primer auxiliar o de la forma simple de be.";
  }
  const filters = {
    all: "Todos",
    general: "Vida cotidiana",
    science: "Ciencia y estudio",
    phrases: "Verbos de varias palabras",
  };
  function valid(value, choices, defaultValue) {
    return Object.hasOwn(choices, value) ? value : defaultValue;
  }
  function choicesHTML(group, values, selected) {
    return Object.entries(values)
      .map(
        ([id, name]) =>
          `<button type="button" data-vgroup="${group}" data-value="${id}" aria-pressed="${id === selected}">${esc(name)}</button>`,
      )
      .join("");
  }
  function option(id, label, selected) {
    return `<option value="${esc(id)}"${selected === id ? " selected" : ""}>${esc(label)}</option>`;
  }
  function indexScore(verb, q) {
    const fields = [
      verb.base,
      ...verb.es.split(";"),
      verb.third,
      verb.past,
      verb.participle,
      verb.ing,
    ].map(normalization);
    if (fields.includes(q)) return 0;
    if (fields.some((v) => v.startsWith(q))) return 1;
    if (fields.some((v) => v.includes(q))) return 2;
    return 3;
  }
  let teardown = null;
  function dispose() {
    teardown?.();
    teardown = null;
  }
  function render(root, api) {
    dispose();
    const selection = api.get("verb-lab.v1", {}) || {};
    const state = {
      base: byBase.has(selection.base) ? selection.base : "measure",
      period: valid(selection.period, periods, "present"),
      aspect: valid(selection.aspect, aspects, "simple"),
      mode: valid(selection.mode, modes, "positive"),
      category: valid(selection.category, filters, "all"),
    };
    const save = () => api.set("verb-lab.v1", { ...state });
    let speaking = null,
      setNumber = 0;
    const events = new AbortController();
    function stopAudio() {
      if (speaking) {
        window.speechSynthesis?.cancel();
        speaking = null;
      }
    }
    teardown = () => {
      events.abort();
      stopAudio();
    };
    root.innerHTML = `<section class="vb-page"><header class="vb-heading"><h1>Conjugador de verbos</h1><p>Busca un verbo en español o en inglés para ver cómo cambia con el sujeto, el tiempo y la intención.</p></header>
      <div class="vb-find">
        <label>Buscar entre ${lexicon.length} verbos y expresiones<input data-vsearch autocomplete="off" type="search" placeholder="Por ejemplo, medir, went o look up"></label>
        <label>Familia<select data-vcategory>${Object.entries(filters)
          .map(([id, name]) => option(id, name, state.category))
          .join("")}</select></label>
        <label>Verbo<select data-vselect></select></label>
        <p data-vmatches role="status"></p>
      </div>
      <div data-vbody></div>
      <details class="vb-reference"><summary>Acerca de las formas y las fuentes</summary><p>Las doce combinaciones reúnen tres marcos temporales y cuatro aspectos. El futuro de este panel se construye con <i lang="en">will</i>. Las fichas incluyen infinitivo y participios, oraciones originales y traducciones de Luma. Se utiliza ortografía estadounidense como referencia.</p><p><a href="https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference/verb-phrases" target="_blank" rel="noopener noreferrer">British Council · Grupos verbales</a> · <a href="https://learnenglish.britishcouncil.org/free-resources/grammar/b1-b2/stative-verbs" target="_blank" rel="noopener noreferrer">British Council · Verbos de estado</a> · <a href="https://dictionary.cambridge.org/grammar/british-grammar/british-english" target="_blank" rel="noopener noreferrer">Cambridge · Variantes británicas y estadounidenses</a></p></details></section>`;
    const page = root.querySelector(".vb-page"),
      search = page.querySelector("[data-vsearch]"),
      select = page.querySelector("[data-vselect]"),
      body = page.querySelector("[data-vbody]"),
      matches = page.querySelector("[data-vmatches]");
    function populate(chooseBest = false) {
      const q = normalization(search.value);
      const candidates = lexicon.filter(
        (v) => state.category === "all" || v.category === state.category,
      );
      const ranked = q
        ? candidates
            .map((v) => [v, indexScore(v, q)])
            .filter(([, s]) => s < 3)
            .sort((a, b) => a[1] - b[1])
        : candidates.map((v) => [v, 0]);
      const found = ranked.find(([v]) => v.base === state.base);
      if (ranked.length && (!found || (chooseBest && found[1] > ranked[0][1])))
        state.base = ranked[0][0].base;
      select.innerHTML = ranked
        .map(([v]) => option(v.base, v.base + " · " + v.es, state.base))
        .join("");
      select.disabled = !ranked.length;
      matches.textContent = !ranked.length
        ? "Sin coincidencias. Prueba otra palabra o amplía la familia."
        : ranked.length === 1
          ? "1 coincidencia."
          : ranked.length + " entradas disponibles.";
      if (ranked.length) draw();
      else {
        stopAudio();
        body.innerHTML = "";
      }
    }
    function draw() {
      stopAudio();
      const verb = byBase.get(state.base),
        { period, aspect, mode } = state;
      const usable = recommended(verb, aspect),
        unusual = usable !== aspect;
      const [name, description] = explanations[period][aspect];
      const sample = example(verb, period, usable, mode);
      const parts = [
        ["Infinitivo", "to " + verb.base],
        ["3.ª persona", verb.third],
        ["Pasado", verb.base === "be" ? "was / were" : verb.past],
        ["Participio pasado", verb.participle],
        ["Forma en -ing", verb.ing],
      ];
      body.innerHTML = `<div class="vb-columns"><article class="vb-card vb-main">
        <div class="vb-lemma"><div><h2 lang="en">${esc(verb.base)}</h2><p>${esc(verb.es)}</p></div><button class="vb-button" type="button" data-vaudio="base">${api.icon("volume-2", 16)} Escuchar verbo</button></div>
        <dl class="vb-forms">${parts.map(([label, form]) => `<div><dt>${label}</dt><dd lang="en">${esc(form)}</dd></div>`).join("")}</dl>
        <div class="vb-tabs" role="group" aria-label="Marco temporal">${choicesHTML("period", periods, period)}</div>
        <div class="vb-pair"><label>Aspecto<select data-vaspect>${Object.entries(
          aspects,
        )
          .map(([id, label]) => option(id, label, aspect))
          .join("")}</select></label>
        <label>Tipo de oración<select data-vmode>${Object.entries(modes)
          .map(([id, label]) => option(id, label, mode))
          .join("")}</select></label></div>
        <h3 lang="en">${esc(name)}</h3><p>${esc(description)} ${esc(modeHelp(verb, period, aspect, mode))}</p>
        ${unusual ? `<div class="vb-note"><strong>Uso como verbo de estado</strong><p>En el sentido «${esc(verb.es)}», <i lang="en">${esc(verb.base)}</i> se suele emplear con el aspecto ${aspects[usable].toLowerCase()}. Esta es la opción habitual para la tabla y el ejercicio.</p><button class="vb-text" data-vgroup="aspect" data-value="${usable}">Estudiar esta alternativa</button></div>` : ""}
        <table class="vb-table"><caption>${unusual ? "Alternativa habitual · " : ""}${esc(periods[period])} · ${esc(aspects[usable])} · ${esc(modes[mode])}</caption><thead><tr><th scope="col">Persona</th><th scope="col">Forma en inglés</th></tr></thead><tbody>${people.map((p) => `<tr><th scope="row">${esc(p.meaning)}</th><td lang="en">${esc(sentence(verb, period, usable, mode, p))}</td></tr>`).join("")}</tbody></table>
        <p class="vb-small">En tercera persona singular, <i lang="en">he</i>, <i lang="en">she</i> e <i lang="en">it</i> usan la misma forma.</p>
        <div class="vb-example"><h3>Ejemplo en contexto</h3><p lang="en">${esc(sample)}</p><button class="vb-button" data-vaudio="sentence">${api.icon("volume-2", 16)} Escuchar oración</button></div><p class="vb-note-audio" data-vsound role="status"></p>
        ${notes[verb.base] ? `<p class="vb-usage">${esc(notes[verb.base])}</p>` : ""}
        </article><aside class="vb-card vb-practice" data-vexercise></aside></div>`;
      drawExercise();
    }
    function drillOptions() {
      const verb = byBase.get(state.base),
        aspect = recommended(verb, state.aspect);
      const order = [
        state.mode,
        ...Object.keys(modes).filter((x) => x !== state.mode),
      ];
      const target = example(verb, state.period, aspect, state.mode);
      const options = [target];
      for (const period of [
        ...Object.keys(periods).filter((x) => x !== state.period),
        state.period,
      ])
        for (const altMode of order) {
          const candidate = example(verb, period, aspect, altMode);
          if (!options.includes(candidate)) options.push(candidate);
        }
      const number = setNumber;
      const alternativeA = 1 + (number % (options.length - 1));
      const alternativeB = 1 + ((number + 1) % (options.length - 1));
      const picked = [target, options[alternativeA], options[alternativeB]];
      const rotation = (verb.base.length + number) % 3;
      return {
        target,
        rows: [...picked.slice(rotation), ...picked.slice(0, rotation)],
      };
    }
    function drawExercise() {
      const panel = body.querySelector("[data-vexercise]");
      if (!panel) return;
      const verb = byBase.get(state.base),
        usable = recommended(verb, state.aspect),
        { rows } = drillOptions();
      panel.innerHTML = `<h2>Practica la forma</h2><p>Elige la oración ${modes[state.mode].toLowerCase()} que emplea <strong>${periods[state.period].toLowerCase()} · ${aspects[usable].toLowerCase()}</strong> de <i lang="en">${esc(verb.base)}</i>.</p><div class="vb-answers">${rows.map((line, i) => `<button type="button" data-vanswer="${i}" lang="en">${esc(line)}</button>`).join("")}</div><p class="vb-feedback" role="status"></p><button class="vb-text" type="button" data-vnext hidden>Cambiar las opciones</button>`;
    }
    function study(key, value) {
      if (
        (key === "period" && !Object.hasOwn(periods, value)) ||
        (key === "aspect" && !Object.hasOwn(aspects, value)) ||
        (key === "mode" && !Object.hasOwn(modes, value))
      )
        return;
      state[key] = value;
      setNumber = 0;
      save();
      draw();
    }
    function speak(which) {
      const status = body.querySelector("[data-vsound]");
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
        status.textContent =
          "Este navegador no ofrece voz en inglés. Puedes usar la tabla y los ejemplos.";
        return;
      }
      const verb = byBase.get(state.base),
        text =
          which === "base"
            ? "to " + verb.base
            : example(
                verb,
                state.period,
                recommended(verb, state.aspect),
                state.mode,
              );
      stopAudio();
      const item = new SpeechSynthesisUtterance(text);
      item.lang = "en-US";
      item.rate = window.LumaPreferences?.speechRate(0.9) ?? 0.9;
      const voices = window.speechSynthesis.getVoices();
      const voice =
        voices.find((v) => v.lang === "en-US") ||
        voices.find((v) => /^en\b/i.test(v.lang));
      if (voice) item.voice = voice;
      speaking = item;
      item.onend = () => {
        if (speaking === item) {
          speaking = null;
          status.textContent = "";
        }
      };
      item.onerror = (event) => {
        if (speaking === item) {
          speaking = null;
          status.textContent =
            event.error === "canceled"
              ? ""
              : "No se pudo reproducir la voz inglesa. Puedes seguir con el ejemplo escrito.";
        }
      };
      status.textContent = "Reproduciendo en inglés…";
      try {
        window.speechSynthesis.speak(item);
      } catch {
        speaking = null;
        status.textContent = "No se pudo reproducir el audio.";
      }
    }
    search.addEventListener(
      "input",
      () => {
        populate(true);
        save();
      },
      { signal: events.signal },
    );
    page.addEventListener(
      "change",
      (event) => {
        const el = event.target;
        if (el.matches("[data-vcategory]")) {
          state.category = el.value;
          setNumber = 0;
          populate(true);
          save();
        } else if (el.matches("[data-vselect]")) {
          state.base = el.value;
          setNumber = 0;
          save();
          draw();
        } else if (el.matches("[data-vaspect]")) {
          study("aspect", el.value);
          body.querySelector("[data-vaspect]").focus({ preventScroll: true });
        } else if (el.matches("[data-vmode]")) {
          study("mode", el.value);
          body.querySelector("[data-vmode]").focus({ preventScroll: true });
        }
      },
      { signal: events.signal },
    );
    page.addEventListener(
      "click",
      (event) => {
        const b = event.target.closest("button");
        if (!b || !page.contains(b) || b.disabled) return;
        if (b.hasAttribute("data-vgroup")) {
          study(b.dataset.vgroup, b.dataset.value);
          (
            body.querySelector(
              '[data-vgroup="' +
                b.dataset.vgroup +
                '"][data-value="' +
                b.dataset.value +
                '"]',
            ) || body.querySelector("[data-vaspect]")
          )?.focus({ preventScroll: true });
        } else if (b.hasAttribute("data-vaudio")) speak(b.dataset.vaudio);
        else if (b.hasAttribute("data-vnext")) {
          setNumber++;
          drawExercise();
          body.querySelector("[data-vanswer]")?.focus({ preventScroll: true });
        } else if (b.hasAttribute("data-vanswer")) {
          const drill = drillOptions(),
            note = body.querySelector(".vb-feedback");
          const verb = byBase.get(state.base),
            aspect = recommended(verb, state.aspect);
          if (drill.rows[Number(b.dataset.vanswer)] === drill.target) {
            b.classList.add("vb-correct");
            body
              .querySelectorAll("[data-vanswer]")
              .forEach((el) => (el.disabled = true));
            note.textContent =
              "Correcto. " + explanations[state.period][aspect][1];
            body.querySelector("[data-vnext]").hidden = false;
            api.complete(
              "verbs-" +
                verb.base.replace(/ /g, "_") +
                "-" +
                state.period +
                "-" +
                aspect +
                "-" +
                state.mode,
            );
          } else {
            b.classList.add("vb-missed");
            b.disabled = true;
            note.textContent =
              "Prueba otra vez. Revisa el primer verbo o auxiliar de la columna en inglés y comprueba el orden del sujeto.";
          }
        }
      },
      { signal: events.signal },
    );
    populate();
  }
  window.LumaVerbs = Object.freeze({ render, dispose, sentence });
})();
