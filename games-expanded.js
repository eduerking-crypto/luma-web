// Expanded Games Module for Luma
// Interactive vocabulary and grammar games
(() => {
  "use strict";

  const verbData = window.LumaVerbDataExtended || window.LumaVerbData;
  const vocabExtra = window.LumaVocabularyExtra;
  const features = window.LumaFeatures;

  // Game state
  let currentGame = null;
  let gameState = {};
  let score = 0;
  let streak = 0;
  let highScores = JSON.parse(localStorage.getItem("luma.gameScores") || "{}");
  let gameTimer = null;

  function schedule(fn, ms) {
    clearTimeout(gameTimer);
    gameTimer = setTimeout(fn, ms);
  }

  function finishGame(api, key, score, label) {
    api.complete("game-" + key);
    api.toast(label + ": " + score + " puntos. ¡Buen trabajo!");
  }

  function escapeHtml(text) {
    return String(text ?? "").replace(/[&<>"']/g, c => ({
      "&": "\u0026", "<": "\u003C", ">": "\u003E", '"': "\u0022", "'": "\u0027"
    })[c]);
  }

  function icon(name, size = 20) {
    return `<svg class="l-icon" aria-hidden="true" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round">${window.LUMA_ICONS[name] || window.LUMA_ICONS["circle-dot"]}</svg>`;
  }

  function speakWord(word) {
    if (!window.speechSynthesis || !window.SpeechSynthesisUtterance) return;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-US";
    utterance.rate = 0.9;
    const voices = window.speechSynthesis.getVoices();
    const voice = voices.find(v => v.lang.startsWith("en"));
    if (voice) utterance.voice = voice;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(utterance);
  }
  window.speakWord = speakWord;

  // ============ GAME 1: WORD MATCH ============
  function createWordMatchGame(root, api) {
    const allVocab = [];
    for (const [cat, words] of Object.entries(vocabExtra)) {
      words.forEach(([word, meaning, example, pos]) => {
        allVocab.push({ word, meaning, category: cat });
      });
    }

    let currentRound = null;
    let roundScore = 0;
    let roundStreak = 0;
    let totalRounds = 0;
    const maxRounds = 10;

    function newRound() {
      if (totalRounds >= maxRounds) {
        endGame();
        return;
      }
      totalRounds++;
      const shuffled = [...allVocab].sort(() => Math.random() - 0.5);
      const target = shuffled[0];
      const options = [target];
      while (options.length < 4) {
        const cand = shuffled[options.length];
        if (!options.some(o => o.word === cand.word)) options.push(cand);
      }
      options.sort(() => Math.random() - 0.5);
      currentRound = { target, options };
      renderRound();
    }

    function renderRound() {
      if (!currentRound) return;
      const { target, options } = currentRound;
      root.innerHTML = `
        <div class="game-container word-match">
          <header class="game-header">
            <h2>${icon("puzzle-piece", 22)} Word Match</h2>
            <div class="game-stats">
              <span>Puntuación: <b>${roundScore}</b></span>
              <span>Racha: <b>${roundStreak}</b></span>
              <span>Ronda: <b>${totalRounds}/${maxRounds}</b></span>
            </div>
          </header>
          <div class="game-content">
            <div class="target-word" lang="en">${escapeHtml(target.word)}</div>
            <p class="target-hint">Significado: ${escapeHtml(target.meaning)}</p>
            <button class="game-audio-btn" type="button" data-speak="${escapeHtml(target.word)}">${icon("volume-2", 20)} Escuchar</button>
            <div class="options-grid">
              ${options.map((opt, i) => `
                <button class="option-btn" data-index="${i}" data-word="${escapeHtml(opt.word)}">
                  ${escapeHtml(opt.meaning)}
                </button>
              `).join("")}
            </div>
            <p class="game-feedback" id="gm-feedback"></p>
          </div>
        </div>`;

      root.querySelectorAll(".option-btn").forEach(btn => {
        btn.onclick = () => checkAnswer(btn);
      });
      root.querySelectorAll("[data-speak]").forEach(btn => {
        btn.onclick = () => speakWord(btn.dataset.speak);
      });
    }

    function checkAnswer(btn) {
      const selectedWord = btn.dataset.word;
      const isCorrect = selectedWord === currentRound.target.word;
      const feedback = root.querySelector("#gm-feedback");
      
      root.querySelectorAll(".option-btn").forEach(b => {
        b.disabled = true;
        if (b.dataset.word === currentRound.target.word) {
          b.classList.add("correct");
        } else if (b === btn) {
          b.classList.add("incorrect");
        }
      });

      if (isCorrect) {
        roundScore += 10 + roundStreak * 2;
        roundStreak++;
        feedback.textContent = `¡Correcto! +${10 + (roundStreak-1)*2} pts. Racha: ${roundStreak}`;
        feedback.className = "game-feedback correct";
      } else {
        roundStreak = 0;
        feedback.textContent = `Incorrecto. La respuesta era: ${currentRound.target.meaning}`;
        feedback.className = "game-feedback incorrect";
      }

      schedule(() => newRound(), 1500);
    }

    function endGame() {
      finishGame(api, "wordMatch", roundScore, "Word Match");
      const previousBest = highScores.wordMatch || 0;
      if (roundScore > previousBest) {
        highScores.wordMatch = roundScore;
        localStorage.setItem("luma.gameScores", JSON.stringify(highScores));
      }
      root.innerHTML = `
        <div class="game-container word-match">
          <header class="game-header">
            <h2>${icon("trophy", 22)} Juego Terminado</h2>
          </header>
          <div class="game-end">
            <div class="final-score">${roundScore} puntos</div>
            <p>Mejor puntuación: ${Math.max(roundScore, previousBest)}</p>
            <p>Racha máxima: ${roundStreak}</p>
            <div class="game-actions">
              <button class="solid-button" onclick="restartGame()">${icon("refresh-cw", 16)} Jugar de nuevo</button>
              <button class="outline-button" onclick="goBack()">${icon("chevron-left", 16)} Volver</button>
            </div>
          </div>
        </div>`;
      window.restartGame = () => { clearTimeout(gameTimer); totalRounds = 0; roundScore = 0; roundStreak = 0; newRound(); };
      window.goBack = () => { clearTimeout(gameTimer); currentGame = null; renderGameMenu(root, api); };
    }

    newRound();
  }

  // ============ GAME 2: VERB CONJUGATION CHALLENGE ============
  function createVerbChallengeGame(root, api) {
    const verbs = verbData.filter(v => v.category === "science" || v.category === "general").sort(() => Math.random() - 0.5).slice(0, 140);
    let currentRound = null;
    let roundScore = 0;
    let roundStreak = 0;
    let totalRounds = 0;
    const maxRounds = 10;

    const tenses = [
      { key: "present_simple", label: "Presente Simple", form: v => v.base },
      { key: "present_continuous", label: "Presente Continuo", form: v => "is " + v.ing },
      { key: "past_simple", label: "Pasado Simple", form: v => v.past },
      { key: "present_perfect", label: "Presente Perfecto", form: v => "has " + v.participle },
      { key: "future", label: "Futuro (will)", form: v => "will " + v.base }
    ];

    function newRound() {
      if (totalRounds >= maxRounds) { endGame(); return; }
      totalRounds++;
      const verb = verbs[Math.floor(Math.random() * verbs.length)];
      const tense = tenses[Math.floor(Math.random() * tenses.length)];
      const correctForm = tense.form(verb);
      const pronouns = ["I", "You", "She", "We", "They"];
      const pronoun = pronouns[Math.floor(Math.random() * pronouns.length)];
      
      // Generate distractors
      const forms = [
        verb.base,
        verb.third,
        verb.past,
        verb.participle,
        verb.ing,
        "is " + verb.ing,
        "has " + verb.participle,
        "will " + verb.base
      ].filter(f => f !== correctForm);
      
      const options = [correctForm];
      while (options.length < 4) {
        const f = forms[Math.floor(Math.random() * forms.length)];
        if (!options.includes(f)) options.push(f);
      }
      options.sort(() => Math.random() - 0.5);

      currentRound = { verb, tense, pronoun, correctForm, options };
      renderRound();
    }

    function renderRound() {
      if (!currentRound) return;
      const { verb, tense, pronoun, options } = currentRound;
      root.innerHTML = `
        <div class="game-container verb-challenge">
          <header class="game-header">
            <h2>${icon("git-branch", 22)} Verb Challenge</h2>
            <div class="game-stats">
              <span>Puntuación: <b>${roundScore}</b></span>
              <span>Racha: <b>${roundStreak}</b></span>
              <span>Ronda: <b>${totalRounds}/${maxRounds}</b></span>
            </div>
          </header>
          <div class="game-content">
            <div class="verb-prompt">
              <span class="pronoun">${pronoun}</span>
              <span class="tense-label">${tense.label}</span>
              <span class="verb-base" lang="en">(${verb.base} / ${verb.es})</span>
            </div>
            <p class="prompt-text">Conjugación correcta:</p>
            <div class="options-grid">
              ${options.map((opt, i) => `
                <button class="option-btn" data-value="${escapeHtml(opt)}">${escapeHtml(opt)}</button>
              `).join("")}
            </div>
            <p class="game-feedback" id="gm-feedback"></p>
          </div>
        </div>`;

      root.querySelectorAll(".option-btn").forEach(btn => {
        btn.onclick = () => checkAnswer(btn);
      });
    }

    function checkAnswer(btn) {
      const isCorrect = btn.dataset.value === currentRound.correctForm;
      const feedback = root.querySelector("#gm-feedback");
      
      root.querySelectorAll(".option-btn").forEach(b => {
        b.disabled = true;
        if (b.dataset.value === currentRound.correctForm) b.classList.add("correct");
        else if (b === btn) b.classList.add("incorrect");
      });

      if (isCorrect) {
        roundScore += 15 + roundStreak * 3;
        roundStreak++;
        feedback.textContent = `¡Correcto! ${currentRound.pronoun} ${currentRound.correctForm}`;
        feedback.className = "game-feedback correct";
      } else {
        roundStreak = 0;
        feedback.textContent = `Incorrecto. Correcto: ${currentRound.pronoun} ${currentRound.correctForm}`;
        feedback.className = "game-feedback incorrect";
      }

      schedule(newRound, 1500);
    }

    function endGame() {
      finishGame(api, "verbChallenge", roundScore, "Verb Challenge");
      const previousBest = highScores.verbChallenge || 0;
      if (roundScore > previousBest) {
        highScores.verbChallenge = roundScore;
        localStorage.setItem("luma.gameScores", JSON.stringify(highScores));
      }
      root.innerHTML = `
        <div class="game-container verb-challenge">
          <header class="game-header"><h2>${icon("trophy", 22)} Juego Terminado</h2></header>
          <div class="game-end">
            <div class="final-score">${roundScore} puntos</div>
            <p>Mejor puntuación: ${Math.max(roundScore, previousBest)}</p>
            <div class="game-actions">
              <button class="solid-button" onclick="restartGame()">${icon("refresh-cw", 16)} Jugar de nuevo</button>
              <button class="outline-button" onclick="goBack()">${icon("chevron-left", 16)} Volver</button>
            </div>
          </div>
        </div>`;
      window.restartGame = () => { clearTimeout(gameTimer); totalRounds = 0; roundScore = 0; roundStreak = 0; newRound(); };
      window.goBack = () => { clearTimeout(gameTimer); currentGame = null; renderGameMenu(root, api); };
    }

    newRound();
  }

  // ============ GAME 3: SCIENCE QUIZ ============
  function createScienceQuizGame(root, api) {
    const questions = [
      { q: "What process do plants use to convert sunlight into energy?", opts: ["Photosynthesis", "Respiration", "Fermentation", "Digestion"], a: 0, level: "A1" },
      { q: "What is the chemical symbol for gold?", opts: ["Go", "Gd", "Au", "Ag"], a: 2, level: "A2" },
      { q: "Which planet is known as the Red Planet?", opts: ["Venus", "Mars", "Jupiter", "Saturn"], a: 1, level: "A1" },
      { q: "What is the powerhouse of the cell?", opts: ["Nucleus", "Mitochondria", "Ribosome", "Golgi apparatus"], a: 1, level: "A2" },
      { q: "What force keeps planets in orbit around the sun?", opts: ["Gravity", "Magnetism", "Friction", "Electricity"], a: 0, level: "A1" },
      { q: "What is the most abundant gas in Earth's atmosphere?", opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Argon"], a: 2, level: "A2" },
      { q: "Which scientist developed the theory of general relativity?", opts: ["Newton", "Einstein", "Galileo", "Kepler"], a: 1, level: "B1" },
      { q: "What is the speed of light in vacuum?", opts: ["300,000 km/s", "150,000 km/s", "1,000,000 km/s", "30,000 km/s"], a: 0, level: "B1" },
      { q: "What particle has a positive charge?", opts: ["Electron", "Neutron", "Proton", "Photon"], a: 2, level: "A2" },
      { q: "What is the process of cell division called?", opts: ["Meiosis", "Mitosis", "Fusion", "Fission"], a: 1, level: "B1" },
      { q: "Which element has atomic number 6?", opts: ["Nitrogen", "Oxygen", "Carbon", "Boron"], a: 2, level: "A2" },
      { q: "What is the hardest natural substance on Earth?", opts: ["Gold", "Diamond", "Iron", "Quartz"], a: 1, level: "A1" },
      { q: "What is the unit of electric current?", opts: ["Volt", "Watt", "Ampere", "Ohm"], a: 2, level: "B1" },
      { q: "What type of bond involves sharing electrons?", opts: ["Ionic", "Covalent", "Metallic", "Hydrogen"], a: 1, level: "B1" },
      { q: "What is the largest organ in the human body?", opts: ["Liver", "Brain", "Skin", "Heart"], a: 2, level: "A2" },
      { q: "What gas do plants absorb during photosynthesis?", opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Hydrogen"], a: 1, level: "A1" },
      { q: "What is the chemical formula for water?", opts: ["CO2", "H2O", "O2", "CH4"], a: 1, level: "A1" },
      { q: "What is the study of earthquakes called?", opts: ["Seismology", "Volcanology", "Geology", "Geography"], a: 0, level: "B1" },
      { q: "Which blood cells carry oxygen?", opts: ["White blood cells", "Platelets", "Red blood cells", "Plasma"], a: 2, level: "A2" },
      { q: "What is the freezing point of water in Celsius?", opts: ["0°C", "100°C", "-10°C", "32°C"], a: 0, level: "A1" },
      { q: "What is the name of our galaxy?", opts: ["Andromeda", "Milky Way", "Sombrero", "Whirlpool"], a: 1, level: "A2" },
      { q: "What is the process of liquid becoming gas?", opts: ["Condensation", "Evaporation", "Freezing", "Melting"], a: 1, level: "A2" },
      { q: "What is the center of an atom called?", opts: ["Electron cloud", "Nucleus", "Orbit", "Shell"], a: 1, level: "A2" },
      { q: "Which vitamin is produced by skin exposure to sunlight?", opts: ["Vitamin A", "Vitamin C", "Vitamin D", "Vitamin K"], a: 2, level: "B1" },
      { q: "What is the pH of pure water?", opts: ["0", "7", "14", "10"], a: 1, level: "B1" },
      { q: "What force opposes motion between surfaces?", opts: ["Gravity", "Friction", "Magnetism", "Tension"], a: 1, level: "A2" },
      { q: "What is the most common element in the universe?", opts: ["Helium", "Oxygen", "Hydrogen", "Carbon"], a: 2, level: "B1" },
      { q: "What organ pumps blood through the body?", opts: ["Lungs", "Liver", "Heart", "Kidneys"], a: 2, level: "A1" },
    ];

    let currentQ = 0;
    let score = 0;
    let streak = 0;

    function renderQuestion() {
      if (currentQ >= questions.length) { endGame(); return; }
      const q = questions[currentQ];
      const shuffled = q.opts.map((opt, i) => ({ opt, i })).sort(() => Math.random() - 0.5);
      const correctNewIndex = shuffled.findIndex(x => x.i === q.a);

      root.innerHTML = `
        <div class="game-container science-quiz">
          <header class="game-header">
            <h2>${icon("flask-conical", 22)} Science Quiz</h2>
            <div class="game-stats">
              <span>Puntuación: <b>${score}</b></span>
              <span>Racha: <b>${streak}</b></span>
              <span>Pregunta: <b>${currentQ + 1}/${questions.length}</b></span>
            </div>
          </header>
          <div class="game-content">
            <p class="quiz-question">${escapeHtml(q.q)}</p>
            <div class="options-grid">
              ${shuffled.map((x, i) => `
                <button class="option-btn" data-index="${i}" data-correct="${i === correctNewIndex}">
                  ${escapeHtml(x.opt)}
                </button>
              `).join("")}
            </div>
            <p class="game-feedback" id="gm-feedback"></p>
          </div>
        </div>`;

      root.querySelectorAll(".option-btn").forEach(btn => {
        btn.onclick = () => checkAnswer(btn, q, correctNewIndex);
      });
    }

    function checkAnswer(btn, q, correctIdx) {
      const selected = parseInt(btn.dataset.index, 10);
      const isCorrect = selected === correctIdx;
      const feedback = root.querySelector("#gm-feedback");
      
      root.querySelectorAll(".option-btn").forEach(b => {
        b.disabled = true;
        if (parseInt(b.dataset.index, 10) === correctIdx) b.classList.add("correct");
        else if (b === btn) b.classList.add("incorrect");
      });

      if (isCorrect) {
        score += 20 + streak * 5;
        streak++;
        feedback.textContent = `¡Correcto! +${20 + (streak-1)*5} pts`;
        feedback.className = "game-feedback correct";
      } else {
        streak = 0;
        feedback.textContent = `Incorrecto. La respuesta era: ${q.opts[q.a]}`;
        feedback.className = "game-feedback incorrect";
      }

      schedule(() => { currentQ++; renderQuestion(); }, 1500);
    }

    function endGame() {
      finishGame(api, "scienceQuiz", score, "Science Quiz");
      const previousBest = highScores.scienceQuiz || 0;
      if (score > previousBest) {
        highScores.scienceQuiz = score;
        localStorage.setItem("luma.gameScores", JSON.stringify(highScores));
      }
      root.innerHTML = `
        <div class="game-container science-quiz">
          <header class="game-header"><h2>${icon("trophy", 22)} Quiz Terminado</h2></header>
          <div class="game-end">
            <div class="final-score">${score} puntos</div>
            <p>Mejor puntuación: ${Math.max(score, previousBest)}</p>
            <p>Preguntas respondidas: ${questions.length}</p>
            <div class="game-actions">
              <button class="solid-button" onclick="restartGame()">${icon("refresh-cw", 16)} Jugar de nuevo</button>
              <button class="outline-button" onclick="goBack()">${icon("chevron-left", 16)} Volver</button>
            </div>
          </div>
        </div>`;
      window.restartGame = () => { clearTimeout(gameTimer); currentQ = 0; score = 0; streak = 0; renderQuestion(); };
      window.goBack = () => { clearTimeout(gameTimer); currentGame = null; renderGameMenu(root, api); };
    }

    renderQuestion();
  }

  // ============ GAME 4: SPELLING BEE ============
  function createSpellingBeeGame(root, api) {
    const words = [
      ...verbData.map(v => v.base),
      ...Object.values(vocabExtra).flatMap(arr => arr.map(([w]) => w))
    ].filter(w => w.length >= 3 && w.length <= 12 && /^[a-z]+$/i.test(w));

    let currentWord = null;
    let score = 0;
    let streak = 0;
    let round = 0;
    const maxRounds = 10;

    function newRound() {
      if (round >= maxRounds) { endGame(); return; }
      round++;
      currentWord = words[Math.floor(Math.random() * words.length)];
      
      // Play audio immediately (only if this round is still active)
      const spoken = currentWord;
      setTimeout(() => { if (currentWord === spoken) speakWord(spoken); }, 300);
      
      root.innerHTML = `
        <div class="game-container spelling-bee">
          <header class="game-header">
            <h2>${icon("mic", 22)} Spelling Bee</h2>
            <div class="game-stats">
              <span>Puntuación: <b>${score}</b></span>
              <span>Racha: <b>${streak}</b></span>
              <span>Ronda: <b>${round}/${maxRounds}</b></span>
            </div>
          </header>
          <div class="game-content">
            <p class="spelling-instruction">Escribe la palabra que escuchas:</p>
            <button class="game-audio-btn large" type="button" data-speak="${escapeHtml(currentWord)}">
              ${icon("volume-2", 28)} Escuchar de nuevo
            </button>
            <input type="text" class="spelling-input" id="spelling-input" autocomplete="off" autocorrect="off" autocapitalize="off" spellcheck="false" placeholder="Escribe aquí...">
            <div class="spelling-hint" hidden>Longitud: ${currentWord.length} letras</div>
            <button class="solid-button" id="spelling-submit">${icon("check", 16)} Comprobar</button>
            <p class="game-feedback" id="gm-feedback"></p>
          </div>
        </div>`;

      const input = root.querySelector("#spelling-input");
      input.focus();
      input.addEventListener("keydown", e => { if (e.key === "Enter") checkSpelling(); });
      root.querySelector("#spelling-submit").onclick = checkSpelling;
      root.querySelectorAll("[data-speak]").forEach(btn => {
        btn.onclick = () => speakWord(btn.dataset.speak);
      });

      function checkSpelling() {
        const userInput = input.value.trim().toLowerCase();
        const isCorrect = userInput === currentWord.toLowerCase();
        const feedback = root.querySelector("#gm-feedback");
        
        if (isCorrect) {
          score += 25 + streak * 5;
          streak++;
          feedback.textContent = `¡Correcto! La palabra era "${currentWord}"`;
          feedback.className = "game-feedback correct";
        } else {
          streak = 0;
          feedback.textContent = `Incorrecto. La palabra era "${currentWord}"`;
          feedback.className = "game-feedback incorrect";
        }
        
        schedule(newRound, 2000);
      }
    }

    function endGame() {
      finishGame(api, "spellingBee", score, "Spelling Bee");
      const previousBest = highScores.spellingBee || 0;
      if (score > previousBest) {
        highScores.spellingBee = score;
        localStorage.setItem("luma.gameScores", JSON.stringify(highScores));
      }
      root.innerHTML = `
        <div class="game-container spelling-bee">
          <header class="game-header"><h2>${icon("trophy", 22)} Juego Terminado</h2></header>
          <div class="game-end">
            <div class="final-score">${score} puntos</div>
            <p>Mejor puntuación: ${Math.max(score, previousBest)}</p>
            <div class="game-actions">
              <button class="solid-button" onclick="restartGame()">${icon("refresh-cw", 16)} Jugar de nuevo</button>
              <button class="outline-button" onclick="goBack()">${icon("chevron-left", 16)} Volver</button>
            </div>
          </div>
        </div>`;
      window.restartGame = () => { clearTimeout(gameTimer); round = 0; score = 0; streak = 0; newRound(); };
      window.goBack = () => { clearTimeout(gameTimer); currentGame = null; renderGameMenu(root, api); };
    }

    newRound();
  }

  // ============ GAME MENU ============
  function renderGameMenu(root, api) {
    const games = [
      {
        id: "wordMatch",
        title: "Word Match",
        icon: "puzzle-piece",
        desc: "Empareja palabras en inglés con su significado en español",
        highScore: highScores.wordMatch || 0
      },
      {
        id: "verbChallenge",
        title: "Verb Challenge",
        icon: "git-branch",
        desc: "Conjuga verbos en diferentes tiempos y personas",
        highScore: highScores.verbChallenge || 0
      },
      {
        id: "scienceQuiz",
        title: "Science Quiz",
        icon: "flask-conical",
        desc: "Preguntas de ciencia: biología, física, química, astronomía",
        highScore: highScores.scienceQuiz || 0
      },
      {
        id: "spellingBee",
        title: "Spelling Bee",
        icon: "mic",
        desc: "Escucha y escribe la palabra correctamente",
        highScore: highScores.spellingBee || 0
      }
    ];

    root.innerHTML = `
      <section class="games-panel">
        <header class="games-header">
          <h1>${icon("gamepad-2", 24)} Juegos</h1>
          <p>Practica vocabulario, verbos y ciencia jugando. ¡Compite contra tu mejor puntuación!</p>
        </header>
        <div class="games-grid">
          ${games.map(g => `
            <article class="game-card" data-game="${g.id}">
              <div class="game-card-icon">${icon(g.icon, 32)}</div>
              <h3>${g.title}</h3>
              <p>${g.desc}</p>
              <div class="game-card-score">${icon("star", 14)} Record: ${g.highScore}</div>
              <button class="game-play-btn" type="button">${icon("play", 16)} Jugar</button>
            </article>
          `).join("")}
        </div>
      </section>`;

    root.querySelectorAll(".game-play-btn").forEach(btn => {
      btn.onclick = () => {
        const card = btn.closest(".game-card");
        const gameId = card.dataset.game;
        currentGame = gameId;
        clearTimeout(gameTimer);
        window.goBack = () => {
          clearTimeout(gameTimer);
          currentGame = null;
          renderGameMenu(root, api);
        };
        window.restartGame = null;
        root.innerHTML = "";
        switch (gameId) {
          case "wordMatch": createWordMatchGame(root, api); break;
          case "verbChallenge": createVerbChallengeGame(root, api); break;
          case "scienceQuiz": createScienceQuizGame(root, api); break;
          case "spellingBee": createSpellingBeeGame(root, api); break;
        }
      };
    });
  }

  function dispose() {
    clearTimeout(gameTimer);
    currentGame = null;
    gameState = {};
    window.speechSynthesis?.cancel();
  }

  window.LumaGames = Object.freeze({
    render: renderGameMenu,
    dispose,
    getHighScores: () => ({ ...highScores })
  });
})();