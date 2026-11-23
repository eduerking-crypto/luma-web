// Práctica de escritura de Luma · se abre desde cada portada de la Biblioteca.
// Corrección gramatical local (sin servidor): ortografía, tercera persona,
// artículos, puntuación, repeticiones y consejos de estilo por nivel.
(() => {
  "use strict";

  const FOCUS = [
    ["present", "Present simple · 3.ª persona"],
    ["past", "Past simple"],
    ["connectors", "Conectores"],
    ["free", "Escritura libre"],
  ];
  const GOAL = { A1: 25, A2: 40, B1: 60, B2: 90, C1: 120 };
  const THIRD = {
    work: "works", live: "lives", like: "likes", love: "loves", go: "goes",
    do: "does", have: "has", study: "studies", read: "reads", write: "writes",
    open: "opens", play: "plays", watch: "watches", teach: "teaches",
    make: "makes", take: "takes", come: "comes", help: "helps", use: "uses",
    find: "finds", give: "gives", tell: "tells", need: "needs", grow: "grows",
    ask: "asks", want: "wants", seem: "seems", become: "becomes", carry: "carries",
    keep: "keeps", show: "shows", begin: "begins", learn: "learns",
  };
  const THIRD_SUBJECTS =
    "\\b(he|she|it|my sister|my brother|my mother|my father|a student|the student|a child|the child|a boy|a girl|my friend|the teacher|the scientist|lumi)\\b";
  const THIRD_VERBS = "(work|live|like|love|go|do|have|study|read|write|open|play|watch|teach|make|take|come|help|use|find|give|tell|need|grow|ask|want|seem|become|carry|keep|show|begin|learn)\\b";

  const esc = (v) =>
    String(v ?? "").replace(
      /[&<>"']/g,
      (c) =>
        ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c],
    );
  const icon = (api, name, size = 17) => api.icon(name, size);
  const accountKey = () => {
    const session = window.LumaAuth?.session?.();
    return String(session?.user?.email || "").toLowerCase() || "local";
  };
  const draftsKey = (id) => "writing.drafts." + id + "." + accountKey();

  function drafts(id) {
    try {
      const value = JSON.parse(localStorage.getItem(draftsKey(id)) || "[]");
      return Array.isArray(value) ? value : [];
    } catch {
      return [];
    }
  }
  function saveDraft(id, entry) {
    const list = [entry, ...drafts(id)].slice(0, 20);
    try {
      localStorage.setItem(draftsKey(id), JSON.stringify(list));
    } catch {}
    return list;
  }

  function wordCount(text) {
    const words = String(text).trim().match(/[A-Za-zÁÉÍÓÚáéíóúñÑ']+/g);
    return words ? words.length : 0;
  }

  function keepCase(original, replacement) {
    if (!original) return replacement;
    return original[0] === original[0].toUpperCase()
      ? replacement.charAt(0).toUpperCase() + replacement.slice(1)
      : replacement;
  }

  function review(text, focus, level) {
    let out = String(text).replace(/\r\n/g, "\n").trim();
    const tips = [];
    const good = [];
    const add = (tip) => {
      if (!tips.includes(tip)) tips.push(tip);
    };

    const spelling = [
      [/\bteh\b/gi, "the", "«teh» se escribe «the»."],
      [/\brecieve[ds]?\b/gi, "receive", "«recieve» se escribe «receive»."],
      [/\bwierd\b/gi, "weird", "«wierd» se escribe «weird»."],
      [/\bbecuase\b/gi, "because", "«becuase» se escribe «because»."],
      [/\bwich\b/gi, "which", "«wich» se escribe «which»."],
      [/\bthier\b/gi, "their", "«thier» se escribe «their»."],
      [/\balot\b/gi, "a lot", "«alot» se escribe separado: «a lot»."],
      [/\bdont\b/gi, "don't", "«dont» necesita apóstrofo: «don't»."],
      [/\bdoesnt\b/gi, "doesn't", "«doesnt» necesita apóstrofo: «doesn't»."],
      [/\bcant\b/gi, "can't", "«cant» necesita apóstrofo: «can't»."],
      [/\bwont\b/gi, "won't", "«wont» necesita apóstrofo: «won't»."],
      [/\bisnt\b/gi, "isn't", "«isnt» necesita apóstrofo: «isn't»."],
    ];
    for (const [re, to, tip] of spelling) {
      if (re.test(out)) {
        out = out.replace(re, (m) => keepCase(m, to));
        add(tip);
      }
    }

    const thirdRe = new RegExp(THIRD_SUBJECTS + "\\s+(" + THIRD_VERBS + ")", "gi");
    let thirdCount = 0;
    out = out.replace(thirdRe, (match, subject, verb) => {
      const fixed = THIRD[verb.toLowerCase()];
      if (!fixed) return match;
      thirdCount++;
      add(
        "Con he/she/it el verbo del presente lleva -s: «" +
          subject +
          " " +
          fixed +
          "».",
      );
      return subject + " " + fixed;
    });
    const dontRe = new RegExp(THIRD_SUBJECTS + "\\s+don't\\b", "gi");
    out = out.replace(dontRe, (match, subject) => {
      add("Con he/she/it se usa «doesn't», no «don't».");
      return subject + " doesn't";
    });

    if (/\b(?:a)\s+(apple|egg|ice|orange|umbrella|old|interesting|important|animal|engineer|hour)\b/i.test(out)) {
      out = out.replace(
        /\b(a)\s+(apple|egg|ice|orange|umbrella|old|interesting|important|animal|engineer|hour)\b/gi,
        (m, _a, word) => "an " + word,
      );
      add("Antes de una palabra que empieza por vocal se usa «an».");
    }
    if (/\bmore\s+(better|easier|faster|higher|shorter)\b/i.test(out)) {
      out = out.replace(/\bmore\s+(better|easier|faster|higher|shorter)\b/gi, "$1");
      add("Los comparativos cortos no llevan «more»: «better», no «more better».");
    }

    const repeatRe = /\b([A-Za-zÁÉÍÓÚáéíóúñÑ]+)\s+\1\b/gi;
    if (repeatRe.test(out)) {
      out = out.replace(repeatRe, "$1");
      add("Hay una palabra repetida seguida; revisa esa frase.");
    }
    if (/\s{2,}/.test(out)) {
      out = out.replace(/[ \t]{2,}/g, " ");
      add("Se eliminaron espacios dobles.");
    }

    const parts = out.split(/(?<=[.!?])\s+/).filter(Boolean);
    out = parts
      .map((part) => {
        let sentence = part.trim();
        if (!sentence) return sentence;
        if (sentence[0] === sentence[0].toLowerCase()) {
          sentence = sentence[0].toUpperCase() + sentence.slice(1);
          add("Cada frase debe empezar con mayúscula.");
        }
        if (!/[.!?]$/.test(sentence)) {
          sentence += ".";
          add("Añade un punto al final de cada frase.");
        }
        return sentence;
      })
      .join(" ");
    if (/\s+.{1}\s+[a-z]/.test(out) && /\bi\b/.test(out)) {
      out = out.replace(/\bi\b/g, "I");
      add("El pronombre «I» siempre va en mayúscula.");
    }

    const words = wordCount(out);
    const goal = GOAL[level] || GOAL.B1;
    if (words < goal) add("Escribe al menos " + goal + " palabras para este nivel (llevas " + words + ").");
    else good.push("Alcanzaste la meta de " + goal + " palabras.");
    if (parts.length >= 3) good.push("Construiste " + parts.length + " frases: buen ritmo.");
    if (thirdCount) good.push("Usaste correctamente la tercera persona del presente.");
    if (/\b(because|and|but|however|then|so)\b/i.test(out)) good.push("Conectaste ideas con «because», «and» o «but».");
    if (focus === "present" && !thirdCount)
      add("Prueba a incluir una frase con he/she/it: «She works…», «He lives…».");
    if (focus === "past" && !/\b(was|were|went|saw|found|did|had|took|made|worked|lived|opened)\b/i.test(out))
      add("Para el pasado, usa formas como «went», «found» o «was».");
    if (focus === "connectors" && !/\b(because|but|however|then|so|although)\b/i.test(out))
      add("Añade un conector: «because», «but», «then» o «however».");
    if (parts.some((p) => wordCount(p) > 28)) add("Una frase es muy larga; divídela para ganar claridad.");

    const score = Math.max(40, Math.min(100, 100 - tips.length * 7));
    return { corrected: out, tips, good, words, sentences: parts.length, goal, score };
  }

  const FALLBACK_WORDS = {
    ocean: ["light", "animal", "water", "deep"],
    nebula: ["star", "cloud", "space", "light"],
    plant: ["leaf", "carbon", "light", "grow"],
    physics: ["force", "energy", "measure", "model"],
    chemistry: ["reaction", "sample", "change", "evidence"],
    math: ["pattern", "number", "shape", "result"],
    ink: ["sequence", "cell", "code", "change"],
    sample: ["sample", "microbe", "observe", "result"],
    transit: ["signal", "data", "pattern", "group"],
  };

  function promptFor(book, level, focus) {
    const lesson = book.lessons?.[level];
    const words =
      lesson?.words?.slice(0, 4).map(([w]) => w) ||
      FALLBACK_WORDS[book.image] ||
      ["observe", "evidence", "change", "result"];
    const base =
      "Mira la portada y escribe sobre «" +
      book.title +
      "». Describe lo que ves y explica la idea principal con tus palabras.";
    const extra =
      focus === "present"
        ? " Usa presente simple y al menos una frase con he/she/it."
        : focus === "past"
          ? " Cuenta qué pasó usando pasado simple."
          : focus === "connectors"
            ? " Conecta tus ideas con because, but y then."
            : " Organiza tu texto en varias frases claras.";
    return { text: base + extra, words };
  }

  function historyMarkup(id, api) {
    const list = drafts(id);
    if (!list.length) return "";
    return `<section class="lw-history"><h3>Tus borradores guardados</h3><div class="lw-history-list">${list
      .slice(0, 5)
      .map(
        (d, i) =>
          `<button type="button" data-lw-draft="${i}"><b>${esc(d.date)}</b><span>${esc(d.words)} palabras · ${esc(d.level || "")}</span></button>`,
      )
      .join("")}</div></section>`;
  }

  function render(id, book, root, api, back) {
    const level = api.level();
    const focus = "present";
    const prompt = promptFor(book, level, focus);
    root.innerHTML = `<section class="lb-panel lw-panel">
      <button type="button" class="lb-return" data-lw-back>${icon(api, "chevron-left", 16)} Biblioteca</button>
      <header class="lw-head">
        <img src="assets/${esc(book.image)}.webp" alt="">
        <div><span class="lw-overline">ESCRITURA · Fragmento 1/1</span>
          <h1 lang="en">${esc(book.title)}</h1>
          <p>${esc(book.theme)} · Nivel ${esc(level)}</p>
        </div>
      </header>
      <div class="lw-card">
        <h2>Escribe para mejorar tu inglés</h2>
        <p class="lw-prompt" lang="en">${esc(prompt.text)}</p>
        ${prompt.words.length ? `<div class="lw-words"><b>Palabras de la lectura</b><div>${prompt.words.map((w) => `<span lang="en">${esc(w)}</span>`).join("")}</div></div>` : ""}
        <div class="lw-fields">
          <label><span>Objetivo gramatical</span><select data-lw-focus>${FOCUS.map(([v, l]) => `<option value="${v}" ${v === focus ? "selected" : ""}>${l}</option>`).join("")}</select></label>
          <label><span>Nivel</span><select data-lw-level>${["A1", "A2", "B1", "B2", "C1"].map((l) => `<option ${l === level ? "selected" : ""}>${l}</option>`).join("")}</select></label>
        </div>
        <label class="lw-writer"><span>Tu texto en inglés</span>
          <textarea data-lw-text lang="en" rows="9" maxlength="3000" placeholder="Write here. She opens the door at nine…"></textarea>
        </label>
        <div class="lw-row"><span class="lw-count" data-lw-count>0 palabras · meta ${GOAL[level]}</span>
          <div class="lw-actions">
            <button type="button" class="lb-btn" data-lw-audio>${icon(api, "volume-2", 17)} Escuchar</button>
            <button type="button" class="lb-btn" data-lw-save>${icon(api, "bookmark", 17)} Guardar borrador</button>
            <button type="button" class="solid-button" data-lw-check>${icon(api, "sparkles", 16)} Revisar mi texto</button>
          </div>
        </div>
      </div>
      <section class="lw-result" data-lw-result hidden></section>
      ${historyMarkup(id, api)}
    </section>`;

    const textarea = root.querySelector("[data-lw-text]");
    const count = root.querySelector("[data-lw-count]");
    const focusSel = root.querySelector("[data-lw-focus]");
    const levelSel = root.querySelector("[data-lw-level]");
    const result = root.querySelector("[data-lw-result]");
    let selectedLevel = level;

    const updateCount = () => {
      const n = wordCount(textarea.value);
      count.textContent = n + " palabras · meta " + GOAL[selectedLevel];
    };
    textarea.addEventListener("input", updateCount);
    levelSel.onchange = () => {
      selectedLevel = levelSel.value;
      updateCount();
    };
    focusSel.onchange = () => {
      const info = promptFor(book, selectedLevel, focusSel.value);
      root.querySelector(".lw-prompt").textContent = info.text;
    };
    root.querySelector("[data-lw-back]").onclick = back;

    root.querySelector("[data-lw-audio]").onclick = () => {
      if (!textarea.value.trim()) return api.toast("Escribe algo antes de escucharlo.");
      if (!window.speechSynthesis || !window.SpeechSynthesisUtterance)
        return api.toast("Este navegador no ofrece lectura en voz alta.");
      const utterance = new window.SpeechSynthesisUtterance(textarea.value);
      utterance.lang = "en-US";
      const voice = window.speechSynthesis
        .getVoices()
        .find((item) => /^en[-_]/i.test(item.lang));
      if (voice) utterance.voice = voice;
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    };

    root.querySelector("[data-lw-save]").onclick = () => {
      if (wordCount(textarea.value) < 3) return api.toast("Escribe unas palabras antes de guardar.");
      const entry = {
        date: new Date().toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" }),
        text: textarea.value.trim(),
        level: selectedLevel,
        words: wordCount(textarea.value),
      };
      saveDraft(id, entry);
      const box = root.querySelector(".lw-history") || document.createElement("section");
      box.className = "lw-history";
      box.innerHTML = historyMarkup(id, api).replace(/^<section[^>]*>|<\/section>$/g, "");
      if (!box.parentElement) root.querySelector(".lw-panel").append(box);
      bindHistory();
      api.toast("Borrador guardado en este dispositivo.");
    };

    function bindHistory() {
      root.querySelectorAll("[data-lw-draft]").forEach((btn) => {
        btn.onclick = () => {
          const item = drafts(id)[Number(btn.dataset.lwDraft)];
          if (!item) return;
          textarea.value = item.text;
          selectedLevel = item.level || level;
          levelSel.value = selectedLevel;
          updateCount();
          textarea.focus();
          textarea.scrollIntoView({ behavior: "smooth", block: "center" });
        };
      });
    }
    bindHistory();

    root.querySelector("[data-lw-check]").onclick = () => {
      if (wordCount(textarea.value) < 5)
        return api.toast("Escribe al menos 5 palabras para poder revisar tu texto.");
      const resultObj = review(textarea.value, focusSel.value, selectedLevel);
      result.hidden = false;
      result.innerHTML = `<h2>Revisión de Lumi</h2>
        <div class="lw-score"><b>${resultObj.score}/100</b><span>${resultObj.words} palabras · ${resultObj.sentences} frases · meta ${resultObj.goal}</span></div>
        ${resultObj.tips.length ? `<h3>Para mejorar</h3><ul class="lw-tips">${resultObj.tips.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : `<h3>¡Excelente!</h3><p>No encontramos cambios necesarios.</p>`}
        ${resultObj.good.length ? `<h3>Lo que hiciste bien</h3><ul class="lw-good">${resultObj.good.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>` : ""}
        <details class="lw-corrected"><summary>Ver versión sugerida</summary><p lang="en">${esc(resultObj.corrected)}</p></details>
        <button type="button" class="outline-button" data-lw-tutor>${icon(api, "sparkles", 16)} Preguntar a Lumi sobre mi texto</button>`;
      result.querySelector("[data-lw-tutor]").onclick = () => {
        api.set("lessonContext", {
          title: book.title,
          passage: textarea.value,
          sourceName: "Ejercicio de escritura · " + book.theme,
          sourceUrl: "",
          level: selectedLevel,
          focus: FOCUS.find(([v]) => v === focusSel.value)?.[1],
          feedback: resultObj.tips,
        });
        api.go("tutor");
      };
      if (resultObj.words >= 10) api.complete("writing-" + id);
      result.scrollIntoView({ behavior: "smooth", block: "nearest" });
    };
  }

  window.LumaWriting = Object.freeze({ render, review, wordCount });
})();
