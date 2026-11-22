from pathlib import Path
d=Path('work/luma-release/public')
p=d/'index.html';s=p.read_text('utf8')
s=s.replace('    <script defer src="learn.js"></script>', '''    <link rel="stylesheet" href="verbs.css" />
    <link rel="stylesheet" href="theory.css" />
    <link rel="stylesheet" href="features.css" />
    <script defer src="verbs-data.js"></script>
    <script defer src="verbs.js"></script>
    <script defer src="vocab-extra.js"></script>
    <script defer src="theory-data.js"></script>
    <script defer src="features-data.js"></script>
    <script defer src="features.js"></script>
    <script defer src="learn.js"></script>''')
p.write_text(s,'utf8')
p=d/'app.js';s=p.read_text('utf8')
s=s.replace('  const skills =', '''  routes.verbs = ["Conjugador", "languages", "Verbos, tiempos y formas del inglés"];
  routes.longreads = ["Lecturas de fondo", "book-open-text", "Artículos bilingües completos por capítulos"];
  for (const story of window.LumaFeatures) {
    routes["fondo-" + story.id] = [story.title, "book-open-text", story.description];
  }
  const skills =''')
s=s.replace('["APRENDIZAJE", ["practice", "games", "exams", "tutor"]]','["APRENDIZAJE", ["practice", "vocabulary", "verbs", "theory", "games", "exams", "tutor"]]')
s=s.replace('[...skills, "theory", "present"','[...skills, "verbs", "theory", "present"')
s=s.replace('    window.LumaLearn?.dispose?.();','    window.LumaVerbs?.dispose?.();\n    window.LumaFieldReader?.dispose?.();\n    window.LumaLearn?.dispose?.();')
s=s.replace('    else if (id === "daily")', '''    else if (id === "verbs") window.LumaVerbs.render(root,api);
    else if (id.startsWith("fondo-")) window.LumaFieldReader.render(id,root,api);
    else if (id === "daily")''')
s=s.replace('["library", "astro", "plants"].includes(id)','["library", "longreads", "astro", "plants"].includes(id)')
s=s.replace('  function home() {','''  function featuredReads() {
    const selected=["sonar","icecore","ink"].map(id=>window.LumaFeatures.find(s=>s.id===id));
    return `<section class="section"><div class="section-title"><h2>Lecturas de fondo</h2><button class="text-button" data-luma-go="longreads">Ver las siete lecturas ${icon("chevron-right",14)}</button></div><div class="featured-reads">${selected.map(s=>`<button class="featured-read" data-luma-go="fondo-${s.id}"><img loading="lazy" src="assets/${s.image}.webp" alt=""><span>${s.theme} · 5 capítulos</span><b lang="en">${s.title}</b></button>`).join("")}</div></section>`;
  }
  function home() {''')
s=s.replace(' <section class="section"><div class="section-title"><h2>Mi plan de estudio</h2>', ' ${featuredReads()}\n <section class="section"><div class="section-title"><h2>Mi plan de estudio</h2>')
s=s.replace('["reading", "Profundiza en la unidad de bioluminiscencia."],','["longreads", "Elige una lectura completa y trabaja un capítulo a la vez."],\n        ["verbs","Explora el tiempo y el aspecto de los verbos que has leído."],')
s=s.replace('if (id === "home") home();','if (id === "home") home();',1)
p.write_text(s,'utf8')
p=d/'library.js';s=p.read_text('utf8')
s=s.replace('return { ...books, ...Object.fromEntries(extra) };','''const long = Object.fromEntries(window.LumaFeatures.map(story=>["fondo-"+story.id,{...story, isLong:true}]));
    return { ...books, ...Object.fromEntries(extra), ...long };''')
s=s.replace('([id]) => filter === "all" || saved.includes(id),', '([id,book]) => filter === "all" || (filter === "saved" && saved.includes(id)) || (filter === "long" && book.isLong) || (filter === "guided" && !book.isLong),')
s=s.replace('<header class="lb-heading"><h1>Biblioteca</h1><p>Elige una lectura y explora la ciencia en inglés a tu nivel.</p></header>', '<header class="lb-heading"><h1>${filter==="long"?"Lecturas de fondo":"Biblioteca"}</h1><p>${filter==="long"?"Sigue una investigación en cinco capítulos bilingües, desde la primera observación hasta los límites de la evidencia.":"Elige una sesión breve o profundiza en un artículo bilingüe por capítulos."}</p></header>')
s=s.replace('<button type="button" data-filter="saved"', '''<button type="button" data-filter="guided" aria-pressed="${filter === "guided"}">Lecturas guiadas</button>
        <button type="button" data-filter="long" aria-pressed="${filter === "long"}">Lecturas de fondo</button>
        <button type="button" data-filter="saved"''')
s=s.replace('<span class="lb-subject">${book.theme}</span>', '<span class="lb-subject">${book.theme}${book.isLong?" · 5 capítulos":""}</span>')
s=s.replace('if (route === "library") library(root, api);','if (route === "library" || route === "longreads") library(root, api, route === "longreads" ? "long" : "all");')
p.write_text(s,'utf8')

