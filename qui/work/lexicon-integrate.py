from pathlib import Path
import json,re
root=Path('work/luma-release/public')
texts='\n'.join(Path('work/'+n).read_text('utf8') for n in ['grammar-catalog.txt','grammar-advanced.txt'])
texts=texts.replace('En el simple, remember la terminación','En el simple, recuerda la terminación').replace('Verbs such as suggest, indicate and establish expresan','Verbos como suggest, indicate y establish expresan').replace('Brown describe el color','brown describe el color').replace('How many cups contamos recipientes. How much water preguntamos por el agua que contienen.','Con How many cups? contamos recipientes. Con How much water? preguntamos por el agua que contienen.').replace('uno cercano; these','uno cercano y these').replace('otro más alejado; those','otro más alejado y those').replace('uno más alejado; those','uno más alejado y those').replace('hay variación regional.','hay variación regional.').replace('periodo que llega hasta ahora.','periodo que llega hasta ahora.')
lessons=[]
for section in re.split(r'^@',texts,flags=re.M)[1:]:
    lines=[l.strip() for l in section.strip().splitlines() if l.strip()]
    assert len(lines)==8,lines
    level,id,title=lines[0].split('|')
    question,a,b,c,pos,why=lines[6].split('|')
    lessons.append(dict(level=level,id=id,title=title,concept=lines[1],use=lines[2],examples=[lines[3].split('|'),lines[4].split('|')],error=lines[5],question=question,options=[a,b,c],answer=int(pos),why=why,apply=lines[7]))
assert len(lessons)==25
(root/'theory-data.js').write_text('// Original lessons and classroom situations written for Luma.\nwindow.LumaTheoryData = '+json.dumps(lessons,indent=2,ensure_ascii=False)+';\n','utf8')
p=root/'learn.js'
s=p.read_text('utf8')
s=s.replace('  // These small, invented observations', '''  // The first three fields retain the original flashcard and saved-word format.
  for (const [topic, rows] of Object.entries(window.LumaVocabularyExtra)) {
    (vocabulary[topic] ??= []).push(...rows);
  }
  const wordClassDefaults = { Colores:"Adjetivo", Movimiento:"Verbo", Números:"Numeral" };
  const wordClassExceptions = { before:"Preposición", after:"Preposición", glow:"Verbo", half:"Sustantivo" };
  const wordInfo = new Map();
  for (const [topic, rows] of Object.entries(vocabulary)) {
    for (const word of rows) {
      const kind = word[3] || wordClassExceptions[word[0]] || wordClassDefaults[topic] || "Sustantivo";
      wordInfo.set(word[0], {topic,kind});
    }
  }

  // These small, invented observations''')
s=s.replace('theory: u.goal,','theory: "Estudia cómo se construye una explicación científica en inglés. Elige un capítulo de tu nivel y aplica la regla a un ejemplo nuevo.",')
s=s.replace('let topic = api.get("word-topic", categories[0]);\n    if (!categories.includes(topic) && topic !== "Guardadas")\n      topic = categories[0];','''const allTopics = "Todos los temas";
    let topic = api.get("word-topic", allTopics);
    if (![allTopics,"Guardadas",...categories].includes(topic)) topic = allTopics;
    const kinds = [...new Set([...wordInfo.values()].map(item=>item.kind))].sort((a,b)=>a.localeCompare(b,"es"));
    let kind=api.get("word-kind","Todas");
    if(!kinds.includes(kind)) kind="Todas";
    let page=0;
    const pageSize=24;''')
s=s.replace('''[...categories, "Guardadas"].map''','''[allTopics,...categories, "Guardadas"].map''',1)
s=s.replace('></select></label><label class="ll-field">Buscar una palabra','></select></label><label class="ll-field">Clase de palabra<select data-ll="kind">${["Todas",...kinds].map(item=>`<option ${kind===item?"selected":""}>${item}</option>`).join("")}</select></label><label class="ll-field">Buscar una palabra',1) if False else s
marker='</select></label><label class="ll-field">Buscar una palabra'
assert marker in s
s=s.replace(marker,'</select></label><label class="ll-field">Clase de palabra<select data-ll="kind">${["Todas",...kinds].map(item=>`<option ${kind===item?"selected":""}>${item}</option>`).join("")}</select></label><label class="ll-field">Buscar una palabra',1)
s=s.replace('<div class="ll-bank"></div>`;','<div class="ll-bank"></div><div class="ll-page-controls" data-ll="pages"></div>`;',1)
a=s.index('      const all =\n',s.index('  function wordBank('));b=s.index('      recall.hidden = true;',a)
s=s[:a]+'''      const all = topic === allTopics ? allWords : topic === "Guardadas" ? allWords.filter(word=>saved.includes(word[0])) : vocabulary[topic];
      const matches = all.filter(word => (kind==="Todas"||wordInfo.get(word[0]).kind===kind) && normalized(word[0]+" "+word[1]).includes(query));
      const pages=Math.max(1,Math.ceil(matches.length/pageSize));
      page=Math.max(0,Math.min(page,pages-1));
      const words=matches.slice(page*pageSize,(page+1)*pageSize);
      const pager=body.querySelector('[data-ll="pages"]');
      pager.hidden=pages===1;
      pager.innerHTML=`<button type="button" class="ll-button" data-page="previous" ${!page?"disabled":""}>Anterior</button><span>Página ${page+1} de ${pages}</span><button type="button" class="ll-button" data-page="next" ${page===pages-1?"disabled":""}>Siguiente</button>`;
      pager.querySelectorAll("[data-page]").forEach(btn=>btn.onclick=()=>{
        page+=btn.dataset.page==="next"?1:-1;draw();
        const first=grid.querySelector("h2");
        if(first){first.tabIndex=-1;first.focus();}
      });
'''+s[b:]
s=s.replace('grid.hidden = true;\n        results.hidden = true;','grid.hidden = true;\n        pager.hidden=true;\n        results.hidden = true;',1)
s=s.replace('`${words.length} ${words.length === 1 ? "palabra" : "palabras"} · ${topic}`','`${matches.length} ${matches.length === 1 ? "entrada" : "entradas"} · ${topic}`',1)
s=s.replace('<div class="ll-row ll-between"><h2 lang="en">${en}</h2>','<p class="ll-word-class">${wordInfo.get(en).topic} · ${wordInfo.get(en).kind}</p><div class="ll-row ll-between"><h2 lang="en">${en}</h2>',1)
s=s.replace('filter.oninput = draw;','''filter.oninput = () => {page=0;draw();};
    body.querySelector('[data-ll="kind"]').onchange=e=>{
      page=0;kind=e.target.value;api.set("word-kind",kind);draw();
    };''',1)
s=s.replace('      topic = e.target.value;\n      api.set("word-topic", topic);','      topic = e.target.value;\n      page=0;\n      api.set("word-topic", topic);',1)
a=s.index('  function theory(');b=s.index('  function exercises(',a)
s=s[:a]+'''  function theory({ body, u, level, api, completed }) {
    const chapters=window.LumaTheoryData.filter(chapter=>chapter.level===level);
    const key="theory-chapter."+level;
    let selected=chapters.find(chapter=>chapter.id===api.get(key,""))||chapters[0];
    const reviewed=chapter=>api.get("theory-reviewed."+chapter.id,false);
    function draw() {
      const c=selected;
      const index=chapters.indexOf(c);
      body.innerHTML=`<div class="lt-layout"><nav class="ll-card lt-menu" aria-label="Capítulos de teoría"><h2>Capítulos de ${level}</h2>
        <p class="ll-meta">${chapters.filter(reviewed).length} de ${chapters.length} practicados</p>
        <div class="lt-chapters">${chapters.map(ch=>`<button type="button" data-chapter="${ch.id}" ${ch===c?'aria-current="true"':""}><span>${escape(ch.title)}</span>${reviewed(ch)?'<span class="lt-check" aria-label="Practicado">✓</span>':""}</button>`).join("")}</div>${nextButton("verbs","Consultar conjugador")}</nav>
        <div class="ll-stack lt-text"><article class="ll-card"><p class="ll-overline">Gramática y ciencia · ${level}</p><h2 tabindex="-1" data-theory-title>${escape(c.title)}</h2><p>${escape(c.concept)}</p><h3>Cómo se usa</h3><p>${escape(c.use)}</p>
        <div class="ll-examples">${c.examples.map(([en,es])=>`<blockquote><strong lang="en">${escape(en)}</strong><span>${escape(es)}</span></blockquote>`).join("")}</div><h3>Error frecuente</h3><p>${escape(c.error)}</p></article>
        <section class="ll-card"><div class="ll-overline">Comprueba la idea</div><div class="ll-quiz"></div><div class="lt-transfer"><h3>Usa la regla en otro caso</h3><p>${escape(c.apply)}</p><label class="ll-field">Mi ejemplo en inglés<textarea data-theory-draft lang="en" rows="3" maxlength="1800"></textarea></label><small class="ll-meta">Tu ejemplo se guarda al escribir.</small></div>
        ${index<chapters.length-1?action("next-chapter","Siguiente capítulo"):""}</section>
        <details class="ll-card"><summary>Teoría en la unidad de bioluminiscencia</summary><h3>${escape(u.grammar)}</h3><p>${escape(u.rule)}</p><blockquote lang="en">${escape(u.en[0])}</blockquote>${nextButton("exercises","Ejercicios de la unidad")}</details>
        <p class="ll-source">Explicaciones y situaciones educativas de Luma. <a href="https://learnenglish.britishcouncil.org/free-resources/grammar/english-grammar-reference" target="_blank" rel="noopener noreferrer">Referencia gramatical del British Council</a></p></div></div>`;
      function select(ch){selected=ch;api.set(key,ch.id);draw();body.querySelector("[data-theory-title]").focus();}
      body.querySelectorAll("[data-chapter]").forEach(btn=>btn.onclick=()=>select(chapters.find(ch=>ch.id===btn.dataset.chapter)));
      const next=body.querySelector('[data-ll="next-chapter"]');
      if(next) next.onclick=()=>select(chapters[index+1]);
      const draft=body.querySelector("[data-theory-draft]"),draftKey="theory-example."+c.id;
      draft.value=api.get(draftKey,"");draft.oninput=()=>api.set(draftKey,draft.value);
      quizCard(body.querySelector(".ll-quiz"),q(c.question,c.options,c.answer,c.why),()=>{
        api.set("theory-reviewed."+c.id,true);completed("theory-"+c.id);
        body.querySelector(".lt-menu .ll-meta").textContent=chapters.filter(reviewed).length+" de "+chapters.length+" practicados";
        const active=body.querySelector('[aria-current="true"]');
        if(!active.querySelector(".lt-check")) active.insertAdjacentHTML("beforeend",'<span class="lt-check" aria-label="Practicado">✓</span>');
      });
    }
    draw();
  }
'''+s[b:]
p.write_text(s,'utf8')
