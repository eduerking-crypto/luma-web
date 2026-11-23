(() => {
  "use strict";
  const levels=["A1","A2","B1","B2","C1"];
  const safe = value => String(value ?? "").replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  let active;
  function dispose() {
    if(!active)return;
    active.controller.abort();
    if(active.speaking)window.speechSynthesis?.cancel();
    active=null;
  }
  function render(id,root,api) {
    dispose();
    const entry=window.LumaFeatures.find(book=>"fondo-"+book.id===id);
    if(!entry)return;
    const key="fieldreader.v1."+entry.id;
    const old=api.get(key,{});
    const state={...old,correct:Array.isArray(old?.correct)?[...old.correct]:[]};
    const words=entry.chapters.reduce((n,c)=>n+c.en.split(/\s+/).length,0);
    const session={controller:new AbortController(),speaking:null};
    active=session;
    const save=()=>api.set(key,{...state,correct:[...state.correct]});
    const count=()=>state.correct.filter(i=>Number.isInteger(i)&&i>=0&&i<5).length;
    const isSaved=()=>api.get("saved",[]).includes(id);
    const saveLabel=()=>isSaved()?"Quitar de guardados":"Guardar lectura";
    const buttons=(chapter,i)=>{
      const list=i%2?[chapter.other,chapter.answer]:[chapter.answer,chapter.other];
      return list.map((label,j)=>`<button class="fr-answer" type="button" data-answer="${j}" lang="en" ${state.correct.includes(i)?"disabled":""}>${safe(label)}</button>`).join("");
    };
    root.innerHTML=`<article class="fr-reader">
      <button class="lb-return" data-luma-go="longreads" type="button">${api.icon("chevron-left",16)} Lecturas de fondo</button>
      <header class="fr-cover" style="--fr-cover:url(assets/${entry.image}.webp)">
        <div class="fr-top"><span>${safe(entry.theme)}</span><button type="button" data-fr="bookmark" aria-pressed="${isSaved()}" aria-label="${saveLabel()}" title="${saveLabel()}">${api.icon(isSaved()?"bookmark-check":"bookmark",19)}</button></div>
        <h1 lang="en">${safe(entry.title)}</h1><p>${safe(entry.description)}</p>
        <div class="fr-cover-meta">${api.icon("book-open",15)} 5 capítulos <span>·</span> ${words} palabras en inglés</div>
      </header>
      <div class="fr-layout"><aside class="fr-index"><h2>En esta lectura</h2>
        <p>Los capítulos avanzan de A1 a C1. Puedes leerlos en orden o elegir tu nivel.</p>
        <nav aria-label="Índice de capítulos">${entry.chapters.map((chapter,i)=>`<button type="button" data-jump="${i}"><b>${levels[i]}</b><span lang="en">${safe(chapter.title)}</span></button>`).join("")}</nav>
        <p class="fr-progress" role="status">${count()} de 5 preguntas resueltas</p>
        ${Number.isInteger(state.last)&&state.last>=0&&state.last<5?`<button type="button" class="lb-btn" data-jump="${state.last}">Retomar en ${levels[state.last]}</button>`:""}
        <button type="button" class="lb-text-btn" data-fr="sources">${api.icon("library-big",16)} Fuentes</button></aside>
      <div class="fr-paper">${entry.chapters.map((ch,i)=>`<section class="fr-chapter" data-section="${i}" aria-labelledby="fr-title-${i}">
          <div class="fr-chapter-top"><span class="fr-level">${levels[i]}</span><button type="button" class="fr-audio" data-fr="audio">${api.icon("volume-2",16)} Escuchar capítulo</button></div>
          <h2 id="fr-title-${i}" tabindex="-1" lang="en">${safe(ch.title)}</h2><p class="fr-text" lang="en">${safe(ch.en)}</p>
          <details><summary>Leer en español</summary><p>${safe(ch.es)}</p></details>
          <p class="fr-term"><strong lang="en">${safe(ch.term)}</strong><span>${safe(ch.meaning)}</span></p>
          <details class="fr-question"><summary>Comprueba lo que entendiste</summary><p lang="en">${safe(ch.question)}</p>
            <div class="fr-choices">${buttons(ch,i)}</div><p data-answer-note role="status">${state.correct.includes(i)?safe(ch.why):""}</p>
          </details>
          <div class="fr-chapter-actions"><button type="button" class="lb-text-btn" data-fr="tutor">${api.icon("sparkles",15)} Preguntar a Lumi</button><span data-audio-note role="status"></span></div>
        </section>`).join("")}
        <footer class="fr-sources" tabindex="-1"><h2>Fuentes de la lectura</h2><p>Texto bilingüe original de Luma. Las situaciones de clase y los cálculos ilustrativos sirven para practicar. Las portadas son ilustraciones.</p>
        ${entry.sources.map(([name,url])=>`<a href="${safe(url)}" target="_blank" rel="noopener noreferrer">${safe(name)} ${api.icon("external-link",14)}</a>`).join("")}</footer></div></div></article>`;
    const signal=session.controller.signal;
    function stopAudio(){if(session.speaking){const previous=session.speaking;session.speaking=null;window.speechSynthesis?.cancel();previous.btn.innerHTML=api.icon("volume-2",16)+" Escuchar capítulo";}}
    root.addEventListener("click",event=>{
      const btn=event.target.closest("button");if(!btn||!root.contains(btn))return;
      if(btn.hasAttribute("data-jump")){const n=Number(btn.dataset.jump);const heading=root.querySelector("#fr-title-"+n);
        state.last=n;save();heading.focus({preventScroll:true});heading.scrollIntoView({block:"start"});return;}
      if(btn.dataset.fr==="sources"){const footer=root.querySelector(".fr-sources");footer.focus({preventScroll:true});footer.scrollIntoView();return;}
      if(btn.dataset.fr==="bookmark"){const saved=api.get("saved",[]);api.set("saved",isSaved()?saved.filter(x=>x!==id):[...saved,id]);btn.innerHTML=api.icon(isSaved()?"bookmark-check":"bookmark",19);btn.setAttribute("aria-pressed",String(isSaved()));btn.setAttribute("aria-label",saveLabel());btn.title=saveLabel();api.toast(isSaved()?"Lectura guardada.":"Lectura retirada de guardados.");return;}
      const section=btn.closest("[data-section]");if(!section)return;
      const n=Number(section.dataset.section),chapter=entry.chapters[n];state.last=n;save();
      if(btn.hasAttribute("data-answer")){
        const correct=n%2?1:0, note=section.querySelector("[data-answer-note]");
        if(Number(btn.dataset.answer)!==correct){btn.disabled=true;note.textContent="Vuelve al pasaje. "+chapter.why;return;}
        if(!state.correct.includes(n)){state.correct.push(n);save();if(count()===5)api.complete("longreads-"+entry.id);}
        section.querySelectorAll("[data-answer]").forEach(b=>b.disabled=true);note.textContent="Correcto. "+chapter.why;
        root.querySelector(".fr-progress").textContent=count()+" de 5 preguntas resueltas";return;
      }
      if(btn.dataset.fr==="tutor"){const [sourceName,sourceUrl]=entry.sources[0];api.set("lessonContext",{title:entry.title+" · "+chapter.title,passage:chapter.en,sourceName,sourceUrl,level:levels[n]});api.go("tutor");return;}
      if(btn.dataset.fr==="audio"){
        const output=section.querySelector("[data-audio-note]");const wasPlaying=session.speaking?.btn===btn;
        stopAudio();if(wasPlaying)return;
        if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){output.textContent="La voz del dispositivo no está disponible.";return;}
        const u=new SpeechSynthesisUtterance(chapter.en);u.lang="en-US";u.rate=window.LumaPreferences.speechRate(n<2?.82:.96);
        session.speaking={u,btn};btn.textContent="Detener audio";output.textContent="";
        const ended=()=>{if(session.speaking?.u===u){session.speaking=null;btn.innerHTML=api.icon("volume-2",16)+" Escuchar capítulo";}};
        u.onend=ended;u.onerror=e=>{ended();if(!["interrupted","canceled"].includes(e.error))output.textContent="La voz no pudo reproducirse.";};
        window.speechSynthesis.speak(u);
      }
    },{signal});
  }
  window.LumaFieldReader={render,dispose};
})();
