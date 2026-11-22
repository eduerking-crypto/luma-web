(() => {
  "use strict";
  const steps = ["Leer", "Comprender", "Explicar"];
  const instructions = {
    A1: [
      "Escribe o di una frase sencilla sobre lo que has leído.",
      "He nombrado qué pasó o qué observé.",
      "He usado un sujeto y un verbo.",
    ],
    A2: [
      "Describe el fenómeno con dos frases. Puedes empezar con el ejemplo.",
      "He descrito una característica y un cambio.",
      "Mis dos frases tienen un orden claro.",
    ],
    B1: [
      "Explica el fenómeno y enlaza dos ideas con because, when o then.",
      "He explicado un proceso o una causa.",
      "He unido dos ideas con un conector adecuado.",
    ],
    B2: [
      "Expón el resultado y explica qué observación o comparación lo respalda.",
      "He relacionado una conclusión con la evidencia del texto.",
      "He distinguido el resultado de su explicación.",
    ],
    C1: [
      "Formula una conclusión, indica su fundamento y matiza lo que sigue siendo incierto.",
      "He señalado una condición o un límite del razonamiento.",
      "He matizado la certeza con una expresión precisa.",
    ],
  };
  const escape = (value) =>
    String(value ?? "").replace(
      /[&<>"']/g,
      (ch) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[ch],
    );
  const formatDate = (value) =>
    new Intl.DateTimeFormat("es", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(value + "T12:00:00"));
  function localDate(offset = 0) {
    const now = new Date();
    now.setDate(now.getDate() + offset);
    return [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, "0"),
      String(now.getDate()).padStart(2, "0"),
    ].join("-");
  }
  function ordinal(date) {
    const [y, m, d] = date.split("-").map(Number);
    return Math.floor(Date.UTC(y, m - 1, d) / 86400000);
  }
  function selection(api) {
    const data = window.LumaDailyData;
    const date = localDate(),
      ids = Object.keys(data.topics),
      interest =
        api.get("daily.selection." + date, null) || api.get("interest", "all");
    const id = Object.hasOwn(data.topics, interest)
      ? interest
      : ids[((ordinal(date) % ids.length) + ids.length) % ids.length];
    const level = data.levels.includes(api.level()) ? api.level() : "A1";
    const key = ["daily.v1", date, id, level].join(".");
    const state = api.get(key, null);
    return {
      date,
      id,
      level,
      key,
      state: state && typeof state === "object" ? state : {},
      topic: data.topics[id],
    };
  }
  function info(api) {
    const s = selection(api),
      progress = s.state;
    return {
      title: s.topic.title,
      prompt: s.topic.prompt,
      theme: s.topic.theme,
      image: s.topic.image,
      minutes: [5, 6, 7, 9, 10][window.LumaDailyData.levels.indexOf(s.level)],
      level: s.level,
      resume: !!progress.started && !progress.done,
      done: !!progress.done,
      step: [1, 2, 3].includes(progress.step) ? progress.step : 1,
      lessonId: s.id,
      sourceName: s.topic.sourceName,
      sourceUrl: s.topic.sourceUrl,
    };
  }

  let active = null;
  function stopPlayback(session) {
    if (session.utterance && window.speechSynthesis)
      window.speechSynthesis.cancel();
    session.utterance = null;
    session.root.querySelector("audio")?.pause();
  }
  function closeRecording(session) {
    session.generation++;
    clearTimeout(session.limitTimer);
    const recorder = session.recorder;
    session.recorder = null;
    if (recorder && recorder.state !== "inactive") {
      recorder.onstop = null;
      recorder.stop();
    }
    session.stream?.getTracks().forEach((track) => track.stop());
    session.stream = null;
  }
  function dispose() {
    if (!active) return;
    const session = active;
    active = null;
    stopPlayback(session);
    closeRecording(session);
    if (session.clip) URL.revokeObjectURL(session.clip);
    session.controller.abort();
  }
  function button(action, label, primary = false, attrs = "") {
    return (
      '<button type="button" class="' +
      (primary ? "dl-primary" : "dl-secondary") +
      '" data-dl="' +
      action +
      '" ' +
      attrs +
      ">" +
      label +
      "</button>"
    );
  }
  function paragraphs(value, lang) {
    return String(value)
      .split(/\n\s*\n/)
      .filter(Boolean)
      .map((p) => '<p lang="' + lang + '">' + escape(p) + "</p>")
      .join("");
  }
  function choices(lesson, seed) {
    const all = [lesson.answer, ...lesson.alternatives];
    const r = seed % all.length;
    return [...all.slice(r), ...all.slice(0, r)];
  }
  function previousRecord(api, date) {
    const records = api.get("daily.v1.completedDays", []);
    return Array.isArray(records)
      ? records
          .filter(
            (r) =>
              r &&
              r.date < date &&
              r.date >= localDate(-31) &&
              Object.hasOwn(window.LumaDailyData.topics, r.id) &&
              window.LumaDailyData.levels.includes(r.level),
          )
          .sort((a, b) => b.date.localeCompare(a.date))[0]
      : null;
  }
  function persist(session, changes) {
    Object.assign(session.state, changes);
    session.api.set(session.key, { ...session.state });
  }
  function reviewBox(s) {
    const prev = previousRecord(s.api, s.date);
    if (!prev) return "";
    const earlier = window.LumaDailyData.getReading(prev.id, prev.level);
    const words = earlier.words;
    const [term, translation] = words[0];
    const completed = s.state.reviewed === prev.date + "." + prev.id;
    const answers = [translation, ...words.slice(1, 3).map((word) => word[1])];
    const labels =
      answers.length > 1 ? [...answers.slice(1), answers[0]] : answers;
    const description =
      prev.date === localDate(-1)
        ? "De la sesión de ayer"
        : "De tu sesión del " + formatDate(prev.date);
    return (
      '<section class="dl-recall"><div class="dl-kicker">' +
      escape(description) +
      '</div><h3>Recupera una palabra</h3><p>¿Qué significa <strong lang="en">' +
      escape(term) +
      '</strong> en la lectura <em lang="en">' +
      escape(window.LumaDailyData.topics[prev.id].title) +
      "</em>?</p>" +
      (completed
        ? '<p class="dl-good">Repasada · ' + escape(translation) + "</p>"
        : '<div class="dl-line">' +
          labels
            .map((label, i) =>
              button("recall", escape(label), false, 'data-pick="' + i + '"'),
            )
            .join("") +
          "</div>") +
      '<p class="dl-live" data-review-feedback role="status"></p></section>'
    );
  }
  function sourceBox(s) {
    const t = s.topic;
    return (
      '<aside class="dl-aside"><section class="dl-card"><h3>Fuente de la lectura</h3><p>Adaptación educativa de Luma a partir de la fuente original.</p><a href="' +
      escape(t.sourceUrl) +
      '" target="_blank" rel="noopener noreferrer">' +
      escape(t.sourceName) +
      '</a><dl class="dl-dates"><div><dt>Publicación de la fuente</dt><dd>' +
      escape(t.sourceDate) +
      "</dd></div><div><dt>Tu fecha de estudio</dt><dd>" +
      escape(formatDate(s.date)) +
      "</dd></div></dl>" +
      (t.extra
        ? "<details><summary>Más contexto</summary>" +
          t.extra
            .map(
              ([label, url]) =>
                '<a href="' +
                escape(url) +
                '" target="_blank" rel="noopener noreferrer">' +
                escape(label) +
                "</a>",
            )
            .join("") +
          "</details>"
        : "") +
      '</section><section class="dl-help"><h3>Consulta a Lumi</h3><p>Pregunta sobre este pasaje con la lectura y tu nivel como contexto.</p>' +
      button("tutor", s.api.icon("message-circle", 16) + "Abrir tutor") +
      "</section></aside>"
    );
  }
  function showReading(s) {
    return (
      '<section class="dl-card"><div class="dl-row"><h2 data-stage-title tabindex="-1">Lee el pasaje</h2>' +
      button("listen", s.api.icon("volume-2", 16) + "Escuchar texto") +
      '</div><div class="dl-passage">' +
      paragraphs(s.lesson.en, "en") +
      '</div><p class="dl-live" data-audio-feedback role="status"></p><details><summary>Traducción al español</summary>' +
      paragraphs(s.lesson.es, "es") +
      '</details><h3 class="dl-subhead">Palabras del pasaje</h3><div class="dl-words">' +
      s.lesson.words
        .map(
          ([word, definition]) =>
            '<details><summary lang="en">' +
            escape(word) +
            "</summary><span>" +
            escape(definition) +
            "</span></details>",
        )
        .join("") +
      '</div><div class="dl-controls">' +
      button("next", "Ir a la pregunta", true) +
      "</div></section>" +
      reviewBox(s)
    );
  }
  function showQuestion(s) {
    const options = choices(s.lesson, ordinal(s.date)),
      attempts = s.state.misses || [];
    return (
      '<section class="dl-card"><p class="dl-kicker">Comprensión de lectura</p><h2 data-stage-title tabindex="-1" lang="en">' +
      escape(s.lesson.question) +
      '</h2><div class="dl-options">' +
      options
        .map((label, i) => {
          const wrong = attempts.includes(i),
            right = s.state.correct && label === s.lesson.answer;
          return (
            '<button type="button" class="dl-option ' +
            (right ? "is-right" : wrong ? "is-wrong" : "") +
            '" data-answer="' +
            i +
            '" ' +
            (s.state.correct || wrong ? "disabled" : "") +
            '><span class="dl-letter" aria-hidden="true">' +
            String.fromCharCode(65 + i) +
            '</span><span lang="en">' +
            escape(label) +
            "</span>" +
            (right
              ? '<span class="dl-result-tag">Correcta</span>'
              : wrong
                ? '<span class="dl-result-tag">Revisar</span>'
                : "") +
            "</button>"
          );
        })
        .join("") +
      '</div><p class="dl-live" data-answer-feedback role="status">' +
      (s.state.correct
        ? "Respuesta correcta. " + escape(s.lesson.note)
        : attempts.length
          ? "Prueba de nuevo. " + escape(s.lesson.note)
          : "") +
      "</p><details><summary>Consultar el pasaje</summary>" +
      paragraphs(s.lesson.en, "en") +
      '</details><div class="dl-controls">' +
      button("back", "Volver a la lectura") +
      (s.state.correct ? button("next", "Preparar mi explicación", true) : "") +
      "</div></section>"
    );
  }
  function showOutput(s) {
    const st = s.state,
      mode = st.mode === "voice" ? "voice" : "write",
      criteria = instructions[s.level];
    const inputLabel =
      mode === "voice"
        ? "Guion o transcripción en inglés"
        : "Mi explicación en inglés";
    const review = st.review
      ? '<div class="dl-compare"><h3>Compara y ajusta</h3><p>Este es un ejemplo de Luma. Puedes expresarlo con tus propias palabras.</p><blockquote lang="en">' +
        escape(s.lesson.model) +
        '</blockquote><label><input type="checkbox" data-check="science" ' +
        (st.science ? "checked" : "") +
        ">" +
        escape(criteria[1]) +
        '</label><label><input type="checkbox" data-check="language" ' +
        (st.language ? "checked" : "") +
        ">" +
        escape(criteria[2]) +
        "</label></div>"
      : "";
    const voice =
      mode === "voice"
        ? '<div class="dl-voice"><div class="dl-line">' +
          button("record", s.api.icon("mic", 15) + "Grabar mi voz") +
          button("stop", "Detener", false, "hidden") +
          "</div><audio controls " +
          (s.clip ? 'src="' + escape(s.clip) + '"' : "hidden") +
          ' aria-label="Escuchar mi grabación"></audio><p>La toma se conserva en esta pantalla. Guarda el guion o una transcripción para volver a tus palabras más adelante.</p><p class="dl-live" data-rec-feedback role="status"></p></div>'
        : "";
    return (
      '<section class="dl-card"><h2 data-stage-title tabindex="-1">Explica lo que descubriste</h2><p>' +
      escape(criteria[0]) +
      '</p><div class="dl-tabs" aria-label="Modo de respuesta">' +
      ["write", "voice"]
        .map(
          (id, i) =>
            '<button type="button" data-mode="' +
            id +
            '" aria-pressed="' +
            (mode === id) +
            '">' +
            s.api.icon(i ? "mic" : "pencil-line", 16) +
            (i ? "Hablar" : "Escribir") +
            "</button>",
        )
        .join("") +
      "</div>" +
      voice +
      '<label class="dl-label" for="dl-draft">' +
      inputLabel +
      '</label><textarea id="dl-draft" rows="4" lang="en" maxlength="4000" placeholder="In my own words…">' +
      escape(st.draft || "") +
      '</textarea><small>El borrador se guarda mientras escribes.</small><details><summary>Ver un ejemplo resuelto</summary><p lang="en">' +
      escape(s.lesson.model) +
      "</p>" +
      button("model", s.api.icon("volume-2", 15) + "Escuchar el ejemplo") +
      '</details><p class="dl-live" data-audio-feedback role="status"></p>' +
      review +
      '<p class="dl-live" data-output-feedback role="status"></p><div class="dl-controls">' +
      button("back", "Volver a la pregunta") +
      button(
        st.review ? "finish" : "compare",
        st.review ? "Completar sesión" : "Revisar mi explicación",
        true,
      ) +
      "</div></section>"
    );
  }
  function summary(s) {
    return (
      '<section class="dl-card dl-summary"><span class="dl-check-icon">' +
      s.api.icon("circle-check", 30) +
      '</span><h2 data-stage-title tabindex="-1">Sesión completada</h2><p>Comprendiste el pasaje y revisaste tu explicación en inglés.</p>' +
      (s.state.draft
        ? '<h3>Mi explicación</h3><blockquote lang="en">' +
          escape(s.state.draft) +
          "</blockquote>"
        : "<p>Completaste la explicación en voz alta y su autoevaluación.</p>") +
      '<p>Mañana encontrarás una palabra de esta lectura para volver a practicarla.</p><div class="dl-controls">' +
      button("revisit", "Volver a la lectura") +
      button("home", "Ir a inicio", true) +
      "</div></section>"
    );
  }
  function draw(s, focus = false) {
    if (active !== s) return;
    const { state: st, topic: t, api } = s;
    const step = st.step || 1,
      done = st.done && !s.revisiting;
    const dates =
      "<span>" +
      escape(t.theme) +
      "</span><span>Nivel " +
      s.level +
      "</span><span>" +
      info(api).minutes +
      " min</span>";
    s.root.innerHTML =
      '<div class="lumadaily"><header class="dl-hero" style="--dl-art:url(assets/' +
      escape(t.image) +
      '.webp)"><div><p class="dl-kicker">Sesión del día</p><h1 lang="en">' +
      escape(t.title) +
      "</h1><p>" +
      escape(t.prompt) +
      '</p><div class="dl-meta">' +
      dates +
      '</div></div></header><nav class="dl-steps" aria-label="Pasos de la sesión">' +
      steps
        .map((name, i) => {
          const n = i + 1,
            completed = st.done || n < step;
          return (
            '<button type="button" data-step="' +
            n +
            '" ' +
            (n > (st.unlocked || 1) ? "disabled" : "") +
            " " +
            (n === step && !done ? 'aria-current="step"' : "") +
            "><span>" +
            (completed ? api.icon("check", 13) : n) +
            "</span>" +
            name +
            "</button>"
          );
        })
        .join("") +
      '</nav><div class="dl-layout"><div class="dl-main">' +
      (done
        ? summary(s)
        : step === 1
          ? showReading(s)
          : step === 2
            ? showQuestion(s)
            : showOutput(s)) +
      "</div>" +
      sourceBox(s) +
      "</div></div>";
    if (focus)
      s.root
        .querySelector("[data-stage-title]")
        ?.focus({ preventScroll: true });
  }
  function speak(s, text) {
    const output = s.root.querySelector("[data-audio-feedback]");
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) {
      output.textContent =
        "La voz del dispositivo no está disponible. Puedes seguir con el texto y la traducción.";
      return;
    }
    if (s.utterance) {
      stopPlayback(s);
      output.textContent = "Reproducción detenida.";
      return;
    }
    const u = new window.SpeechSynthesisUtterance(text);
    u.lang = "en-US";
    const pref = Number(s.api.get("speechRate", 0));
    u.rate = pref > 0 ? pref : s.level === "A1" ? 0.8 : 0.94;
    const voice = window.speechSynthesis
      .getVoices()
      .find((v) => /^en(?:-|_)/i.test(v.lang));
    if (voice) u.voice = voice;
    s.utterance = u;
    const reset = () => {
      if (active === s && s.utterance === u) {
        s.utterance = null;
        const btn = s.root.querySelector(
          '[data-dl="listen"],[data-dl="model"]',
        );
        if (btn)
          btn.innerHTML =
            s.api.icon("volume-2", 16) +
            (btn.dataset.dl === "model"
              ? "Escuchar el ejemplo"
              : "Escuchar texto");
      }
    };
    u.onend = () => {
      reset();
      if (output.isConnected) output.textContent = "";
    };
    u.onerror = () => {
      reset();
      if (output.isConnected)
        output.textContent =
          "La voz no pudo reproducirse. Puedes continuar leyendo.";
    };
    try {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(u);
      output.textContent = "Reproduciendo en inglés.";
      const btn = s.root.querySelector('[data-dl="listen"],[data-dl="model"]');
      if (btn) btn.textContent = "Detener audio";
    } catch {
      reset();
      output.textContent =
        "La voz no pudo reproducirse. Puedes continuar leyendo.";
    }
  }
  async function startRecording(s) {
    const note = s.root.querySelector("[data-rec-feedback]"),
      start = s.root.querySelector('[data-dl="record"]'),
      stop = s.root.querySelector('[data-dl="stop"]');
    if (!window.MediaRecorder || !navigator.mediaDevices?.getUserMedia) {
      note.textContent =
        "Este navegador no ofrece grabación. Ensaya en voz alta y escribe tu guion para completar la actividad.";
      return;
    }
    if (start.disabled) return;
    start.disabled = true;
    const requestId = ++s.generation;
    note.textContent = "Esperando permiso para usar el micrófono…";
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      if (active !== s || requestId !== s.generation || !note.isConnected) {
        stream.getTracks().forEach((t) => t.stop());
        return;
      }
      s.stream = stream;
      const recorder = new MediaRecorder(stream),
        chunks = [];
      s.recorder = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data.size) chunks.push(e.data);
      };
      recorder.onstop = () => {
        stream.getTracks().forEach((t) => t.stop());
        clearTimeout(s.limitTimer);
        if (active !== s || s.recorder !== recorder || !note.isConnected)
          return;
        s.recorder = null;
        s.stream = null;
        stop.hidden = true;
        start.disabled = false;
        start.textContent = "Volver a grabar";
        if (!chunks.length) {
          note.textContent =
            "La toma no tiene audio. Puedes intentarlo de nuevo o usar el guion.";
          return;
        }
        if (s.clip) URL.revokeObjectURL(s.clip);
        s.clip = URL.createObjectURL(
          new Blob(chunks, { type: recorder.mimeType || chunks[0].type }),
        );
        const audio = s.root.querySelector("audio");
        audio.src = s.clip;
        audio.hidden = false;
        note.textContent =
          "Escucha la toma y compara las palabras con el ejemplo.";
      };
      recorder.onerror = () => {
        if (active !== s) return;
        closeRecording(s);
        start.disabled = false;
        stop.hidden = true;
        note.textContent =
          "La grabación se interrumpió. Puedes volver a intentarlo o usar el guion.";
      };
      recorder.start();
      stop.hidden = false;
      note.textContent = "Grabando. Puedes hablar hasta un minuto.";
      s.limitTimer = setTimeout(() => {
        if (recorder.state === "recording") recorder.stop();
      }, 60000);
    } catch {
      if (active !== s || requestId !== s.generation) return;
      closeRecording(s);
      start.disabled = false;
      stop.hidden = true;
      note.textContent =
        "El micrófono no está disponible. Puedes ensayar en voz alta y escribir tu guion aquí.";
    }
  }
  function switchStep(s, n) {
    if (n < 1 || n > 3) return;
    stopPlayback(s);
    closeRecording(s);
    persist(s, { step: n, unlocked: Math.max(n, s.state.unlocked || 1) });
    draw(s, true);
  }
  function finish(s) {
    const event = "daily-" + s.date + "-" + s.id;
    const record = { date: s.date, level: s.level, id: s.id };
    const recent = s.api.get("daily.v1.completedDays", []);
    const list = (Array.isArray(recent) ? recent : []).filter(
      (r) => r && r.date !== s.date && r.date >= localDate(-31),
    );
    s.api.set("daily.v1.completedDays", [record, ...list].slice(0, 32));
    if (!s.state.done) s.api.complete(event);
    persist(s, { done: true, step: 3, unlocked: 3 });
    s.revisiting = false;
    stopPlayback(s);
    closeRecording(s);
    draw(s, true);
  }
  function onClick(s, event) {
    const b = event.target.closest("button");
    if (!b || !s.root.contains(b) || b.disabled) return;
    if (b.hasAttribute("data-step")) {
      const n = Number(b.dataset.step);
      if (n <= s.state.unlocked) {
        s.revisiting = !!s.state.done;
        switchStep(s, n);
      }
      return;
    }
    if (b.hasAttribute("data-answer")) {
      const i = Number(b.dataset.answer),
        right = choices(s.lesson, ordinal(s.date))[i] === s.lesson.answer;
      persist(
        s,
        right
          ? { correct: true, unlocked: 3 }
          : { misses: [...new Set([...(s.state.misses || []), i])] },
      );
      draw(s);
      s.root
        .querySelector(right ? '[data-dl="next"]' : ".dl-option:not(:disabled)")
        ?.focus({ preventScroll: true });
      return;
    }
    if (b.hasAttribute("data-mode")) {
      const mode = b.dataset.mode;
      if (mode === s.state.mode) return;
      closeRecording(s);
      stopPlayback(s);
      persist(s, { mode });
      draw(s);
      return;
    }
    const action = b.dataset.dl;
    if (action === "next") {
      switchStep(s, (s.state.step || 1) + 1);
      return;
    }
    if (action === "back") {
      switchStep(s, s.state.step - 1);
      return;
    }
    if (action === "listen" || action === "model") {
      speak(s, action === "listen" ? s.lesson.en : s.lesson.model);
      return;
    }
    if (action === "record") {
      startRecording(s);
      return;
    }
    if (action === "stop") {
      if (s.recorder?.state === "recording") s.recorder.stop();
      return;
    }
    if (action === "tutor") {
      s.api.set("lessonContext", {
        title: s.topic.title,
        passage: s.lesson.en,
        sourceUrl: s.topic.sourceUrl,
        sourceName: s.topic.sourceName,
        level: s.level,
      });
      s.api.go("tutor");
      return;
    }
    if (action === "recall") {
      const prev = previousRecord(s.api, s.date);
      if (!prev) return;
      const [term, translation] = window.LumaDailyData.getReading(
        prev.id,
        prev.level,
      ).words[0];
      if (b.textContent === translation) {
        persist(s, { reviewed: prev.date + "." + prev.id });
        draw(s);
        s.root.querySelector("[data-review-feedback]").textContent =
          "Has recuperado el significado de " + term + ".";
      } else {
        b.disabled = true;
        s.root.querySelector("[data-review-feedback]").textContent =
          "Inténtalo de nuevo. Recuerda el contexto de la lectura anterior.";
      }
      return;
    }
    if (action === "compare" || action === "finish") {
      const note = s.root.querySelector("[data-output-feedback]");
      if (s.recorder?.state === "recording") {
        note.textContent =
          "Detén la grabación para poder escucharla y revisarla.";
        return;
      }
      const count =
        (s.state.draft || "").match(/[A-Za-z]+(?:['’-][A-Za-z]+)*/g)?.length ||
        0;
      const min = [2, 3, 5, 6, 8][window.LumaDailyData.levels.indexOf(s.level)];
      if (!(s.state.mode === "voice" && s.clip) && count < min) {
        note.textContent =
          "Añade una explicación en inglés de al menos " +
          min +
          " palabras o graba una respuesta.";
        s.root.querySelector("#dl-draft").focus();
        return;
      }
      if (action === "compare") {
        persist(s, { review: true });
        draw(s);
        s.root.querySelector("[data-check]")?.focus({ preventScroll: true });
        return;
      }
      if (!s.state.science || !s.state.language) {
        note.textContent =
          "Revisa la idea científica y la expresión en inglés antes de guardar.";
        return;
      }
      finish(s);
      return;
    }
    if (action === "revisit") {
      s.revisiting = true;
      switchStep(s, 1);
      return;
    }
    if (action === "home") s.api.go("home");
  }
  function render(root, api) {
    dispose();
    const selected = selection(api);
    const s = {
      ...selected,
      root,
      api,
      lesson: window.LumaDailyData.getReading(selected.id, selected.level),
      generation: 0,
      controller: new AbortController(),
      utterance: null,
      recorder: null,
      clip: null,
      stream: null,
      revisiting: false,
    };
    active = s;
    if (!s.state.started) persist(s, { started: true, step: 1, unlocked: 1 });
    const options = { signal: s.controller.signal };
    root.addEventListener("click", (event) => onClick(s, event), options);
    root.addEventListener(
      "input",
      (event) => {
        if (event.target.id === "dl-draft")
          persist(s, { draft: event.target.value });
      },
      options,
    );
    root.addEventListener(
      "change",
      (event) => {
        if (event.target.matches("[data-check]"))
          persist(s, { [event.target.dataset.check]: event.target.checked });
      },
      options,
    );
    draw(s);
  }
  window.LumaDaily = Object.freeze({ info, render, dispose });
})();
