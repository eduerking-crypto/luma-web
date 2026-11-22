from pathlib import Path
root=Path('work/luma-release')
def load(name): return (root/name).read_text(encoding='utf8')
def save(name,value): (root/name).write_text(value,encoding='utf8')
p='public/library.js'
s=load(p).replace('window.LumaLibrary = {\n    dispose,','window.LumaLibrary = {\n    dispose,\n    lesson(id, level) { return books[id]?.lessons?.[level]; },')
s=s.replace('utterance.rate = level === "A1" || level === "A2" ? 0.86 : 0.96;', 'utterance.rate = window.LumaPreferences.speechRate(level === "A1" || level === "A2" ? 0.86 : 0.96);')
s=s.replace('class="lb-btn" data-translate', 'class="lb-btn" data-ask-lumi>${api.icon("sparkles", 17)} Preguntar a Lumi</button><button type="button" class="lb-btn" data-translate')
s=s.replace('    const select = root.querySelector("select");\n    select.onchange', '''    root.querySelector("[data-ask-lumi]").onclick = () => {
      const [sourceName, sourceUrl] = book.sources[0];
      api.set("lessonContext", {title:book.title,passage:lesson.en,sourceName,sourceUrl,level});
      api.go("tutor");
    };
    const select = root.querySelector("select");
    select.onchange''')
save(p,s)
p='public/app.js'
s=load(p).replace('    home: ["Inicio",','    daily: ["Sesión de hoy", "compass", "Lectura guiada, comprensión y explicación del día"],\n    home: ["Inicio",',1)
old=s[s.index('  const stories = ['):s.index('  const levels =')]
s=s.replace(old,'''  const interests = [
    ["all","Todas las ciencias","shuffle"],
    ["ocean","Biología marina","waves"], ["space","Astronomía","telescope"],
    ["plants","Botánica","leaf"], ["physics","Física","atom"],
    ["chemistry","Química","flask-conical"], ["math","Matemáticas","shapes"],
    ["earth","Ciencias de la Tierra","earth"]
  ];
''')
s=s.replace('    slide = 0,','    firstSync = null,')
s=s.replace('  const api = { level, go, complete, get, set, icon, toast };','''  const api = { level, go, complete, get, set, icon, toast };
  window.LumaPreferences = {
    speechRate(defaultRate) {
      const preferred = Number(get("speechRate", 0));
      return [0.75, 1, 1.15].includes(preferred) ? preferred : defaultRate;
    }
  };''')
s=s.replace('["home", "path", "library", "news"]','["home", "daily", "path", "library", "news"]')
i=s.index('  function sessionIds()');j=s.index('  function row(',i);s=s[:i]+s[j:]
i=s.index('  function feature()');j=s.index('  function pageIntro(',i)
s=s[:i]+'''  function feature() {
    const lesson = window.LumaDaily.info(api);
    const label = lesson.done ? "Revisar sesión" : lesson.resume ? "Continuar sesión" : "Comenzar sesión";
    const visual = lesson.image ? `<img class="feature-photo" src="assets/${escape(lesson.image)}.webp" alt="">` : "";
    return `${visual}
      <div class="feature-top">
        <span class="hero-flag">${icon("compass",14)} SESIÓN DE HOY</span>
        <button class="topic-trigger" data-action="topics">${icon("shapes",15)} Elegir tema</button>
      </div>
      <div class="hero-text"><h2 lang="en">${escape(lesson.title)}</h2><p>${escape(lesson.prompt)}</p>
        <div class="hero-meta"><span>${icon("atom",14)} ${escape(lesson.theme)}</span><i class="sep"></i><span>${icon("clock",14)} ${escape(lesson.minutes)} min</span></div>
      </div>
      <div class="feature-bottom"><button class="solid-button" data-luma-go="daily">${icon("book-open",17)} ${label}</button>
        <span class="session-indicator" aria-label="${lesson.done?"Sesión completada":"Paso "+lesson.step+" de 3"}">${[1,2,3].map(n=>`<i class="${lesson.done||n<=lesson.step?'selected':''}"></i>`).join("")}</span>
      </div>`;
  }
  function openTopics() {
    const dialog = document.getElementById("topics");
    const choice=get("interest","all");
    dialog.querySelector(".topic-options").innerHTML=interests.map(([id,name,glyph])=>
      `<button type="button" data-interest="${id}" aria-pressed="${id===choice}">${icon(glyph,19)} <span>${name}</span>${id===choice?icon("check",16):""}</button>`).join("");
    dialog.showModal();
    dialog.querySelector('[aria-pressed="true"]')?.focus();
  }
'''+s[j:]
s=s.replace('Lee ciencia en inglés y pon en práctica lo que descubres.','Lee, escucha y explica un descubrimiento con tus propias palabras.')
s=s.replace('<h2>Tu sesión de hoy</h2>','<h2>Mi plan de estudio</h2>')
a=s.index('<h3>Plan de práctica</h3>');b=s.index('</div><div class="panel"><div class="panel-header"><h3>Objetivo diario',a)
s=s[:a]+'''<h3>Continúa practicando</h3><span class="eyeline">NIVEL ${level()}</span></div>${row("vocabulary", "Repasa las palabras que ya has visto.")}${row("exams","Aplica lo aprendido en un caso nuevo.")}${row("present","Prepara tu próxima exposición en inglés.')}'''.replace("inglés.'","inglés.\"")+s[b:]
s=s.replace('["reading", "Lee sobre la luz en las profundidades."],','["daily", "Lee, comprueba tu comprensión y explica una idea científica."],\n        ["reading", "Profundiza en la unidad de bioluminiscencia."],')
s=s.replace('<label class="field full"><span>Actividades al día', '''<label class="field"><span>Disciplina preferida</span><select name="interest">${interests.map(([id,name])=>`<option value="${id}" ${get("interest","all")===id?"selected":""}>${name}</option>`).join("")}</select></label><label class="field"><span>Velocidad de la voz</span><select name="speechRate">${[[0,"Según el nivel"],[0.75,"Lenta · 0,75×"],[1,"Normal · 1×"],[1.15,"Rápida · 1,15×"]].map(([v,n])=>`<option value="${v}" ${Number(get("speechRate",0))===v?"selected":""}>${n}</option>`).join("")}</select></label><label class="field full"><span>Actividades al día''')
s=s.replace('Guardar cambios</button></form>`;','''Guardar cambios</button></form>
      <section class="panel install-panel" aria-labelledby="install-title"><div class="install-heading"><img src="assets/luma-192.png" alt=""><div><h2 id="install-title">Luma en tu dispositivo</h2><p data-install-status></p></div></div>
      <p class="status-text" data-offline-ready role="status"></p>
      <button type="button" class="outline-button" data-install-luma>${icon("download",17)} Instalar Luma</button>
      <div class="install-help" data-install-help tabindex="-1" hidden><p>En Chrome o Edge, abre el menú del navegador y busca la opción de instalar la aplicación. En Safari del iPhone o iPad, abre Compartir y elige «Añadir a pantalla de inicio».</p><p>Si estás usando el visor de Codex, abre el enlace en el navegador de tu dispositivo.</p></div></section>`;
    window.LumaInstall?.update();''')
s=s.replace('    finder.close();\n    closeMenu();','    finder.close();\n    document.getElementById("topics").close();\n    closeMenu();')
s=s.replace('    const prior = current;','''    if (firstSync && id !== "home") {
      const selected = id;
      root.innerHTML = '<div class="panel" role="status">Recuperando tu sesión…</div>';
      firstSync.then(()=>{ if (location.hash.slice(1) === selected) render(selected); });
      return;
    }
    const prior = current;''')
s=s.replace('    window.LumaLearn?.dispose?.();','    window.LumaDaily?.dispose?.();\n    window.LumaLearn?.dispose?.();')
s=s.replace('    else if (id === "path") pathPage();','    else if (id === "daily") window.LumaDaily.render(root,api);\n    else if (id === "path") pathPage();')
s=s.replace('["reading", "library", "vocabulary", "tutor", "news"]','["daily","reading", "library", "vocabulary", "tutor", "news"]')
a=s.index('    if (btn.hasAttribute("data-slide")) {');b=s.index('\n  });\n  document.addEventListener("submit"',a)
s=s[:a]+'''    if (btn.dataset.action==="topics") openTopics();
    if (btn.dataset.action==="close-topics") document.getElementById("topics").close();
    if (btn.hasAttribute("data-interest") && interests.some(([id])=>id===btn.dataset.interest)) {
      set("interest",btn.dataset.interest);
      document.getElementById("topics").close();
      home();
      root.querySelector("[data-action=topics]")?.focus();
    }
    if (btn.hasAttribute("data-install-luma")) window.LumaInstall.install();'''+s[b:]
s=s.replace('    set("goal", Number(f.get("goal")));','    set("interest", f.get("interest"));\n    set("speechRate", Number(f.get("speechRate")));\n    set("goal", Number(f.get("goal")));')
s=s.replace('  render(location.hash.slice(1) || "home");\n  syncDrawer();\n  hydrate();','''  if (!Object.keys(state).length && location.protocol !== "file:") {
    firstSync = hydrate().finally(() => { firstSync = null; });
  } else { hydrate(); }
  render(location.hash.slice(1) || "home");
  syncDrawer();''')
save(p,s)
p='public/index.html'
s=load(p).replace('    <link rel="icon"', '''    <link rel="manifest" href="manifest.webmanifest" />
    <link rel="apple-touch-icon" href="assets/luma-touch.png" />
    <link rel="icon"''')
s=s.replace('    <script defer src="app.js"', '''    <link rel="stylesheet" href="daily.css" />
    <script defer src="daily-data.js"></script>
    <script defer src="daily.js"></script>
    <script defer src="install.js"></script>
    <script defer src="app.js"''')
s=s.replace('    <dialog id="finder"', '''    <dialog id="topics" aria-labelledby="topics-title">
      <div class="finder-head"><h2 id="topics-title">Elige tu tema</h2><button class="iconbtn" type="button" data-action="close-topics" aria-label="Cerrar selección">×</button></div>
      <p>Elige la ciencia que quieres explorar en tu sesión de hoy.</p>
      <div class="topic-options"></div>
    </dialog>
    <dialog id="finder"''')
save(p,s)
p='scripts/build.mjs'
s=load(p).replace('  ".json": "application/json",','  ".json": "application/json",\n  ".webmanifest": "application/manifest+json",')
s=s.replace('const table = {};','''const { createHash } = await import("node:crypto");
const editorial = (await listFiles(publicDir)).filter(file => relative(publicDir, file) !== "sw.js" && !file.endsWith(".txt"));
const resources = editorial.map(file => relative(publicDir, file).split(sep).join("/"));
const template = await readFile(join(project,"scripts","service-worker.template.js"),"utf8");
const revision = createHash("sha256").update(template);
for (const file of editorial) { revision.update(relative(publicDir,file).split(sep).join("/")); revision.update(await readFile(file)); }
const serviceWorker = template.replace("__EDITION__",revision.digest("hex").slice(0,16)).replace("__PUBLIC_PATHS__",JSON.stringify(resources));
await writeFile(join(publicDir,"sw.js"),serviceWorker);
const table = {};''')
save(p,s)

