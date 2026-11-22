    async function feed(force=false) {
      const ticket=++version;
      const provider=selected==="pubmed"?"PubMed":"Crossref";
      const options=[["pubmed","PubMed","Ciencias de la vida"],...journals].map(([id,name,field])=>
        `<option value="${id}" ${selected===id?"selected":""}>${html(name)} · ${html(field)}</option>`).join("");
      area.innerHTML=`<form class="sci-toolbar sci-search"><label>Fuente<select class="sci-journal">${options}</select></label>
        <label>Tema en inglés<input type="search" class="sci-query" maxlength="160" autocomplete="off" placeholder="Ej. photosynthesis" value="${html(query)}"></label>
        <button class="sci-refresh" type="submit">Buscar</button></form>
        <p class="sci-filter-note">${selected==="pubmed"?"PubMed reúne referencias de revistas de ciencias de la vida.":"Busca palabras del título en la revista seleccionada."} Deja el tema vacío para ver publicaciones recientes.</p>
        <p class="sci-state" role="status"></p><div class="sci-grid"></div>`;
      const status=area.querySelector(".sci-state");
      const sourceId=selected, topic=query, key="scienceCache."+sourceId, searchKey="scienceSearchCache."+sourceId;
      const history=api.get(searchKey,[]), recentSearches=Array.isArray(history)?history:[];
      const cached=topic ? recentSearches.find(r=>r.query===topic)?.data : api.get(key,null);
      const hasCache=validSnapshot(cached);
      const recent=hasCache && Date.now()-Date.parse(cached.fetched)<3600000;
      const when=stamp=>new Date(stamp).toLocaleString("es",{dateStyle:"short",timeStyle:"short"});
      const sourceLabel=sourceId==="pubmed"?"PubMed":journals.find(r=>r[0]===sourceId)[1];
      const subject=sourceLabel+(topic?' · «'+topic+'»':"");
      const cachedLabel=()=>subject+" · Consulta guardada del "+when(cached.fetched)+".";
      function showResults(payload) {
        if(payload.items.length)presentRecords(payload.items,sourceId,!topic);
        else {current=[];area.querySelector(".sci-grid").innerHTML='<div class="sci-empty"><h3>Sin resultados</h3><p>Prueba con otra palabra en inglés o cambia la fuente.</p></div>';}
      }
      if(hasCache) {showResults(cached);status.textContent=cachedLabel();}
      else {current=[];status.textContent="Consultando "+subject+"…";}
      area.querySelector(".sci-journal").onchange=e=>{
        selected=e.target.value;query=area.querySelector(".sci-query").value.trim();api.set("newsJournal",selected);api.set("newsTopic",query);feed();
      };
      area.querySelector("form").onsubmit=e=>{e.preventDefault();query=area.querySelector(".sci-query").value.trim().replace(/\s+/g," ");api.set("newsTopic",query);feed(true);};
      if(recent&&!force) return;
      try {
        let payload;
        if(cloudProtocol()) {
          try {
            payload=await fetchJSON("/api/news?"+new URLSearchParams({journal:sourceId,q:topic}),{},35000);
          }catch(error){if(sourceId==="pubmed")throw error;}
        }
        if(!validSnapshot(payload) && sourceId!=="pubmed") {
          const data=await fetchJSON(crossrefUrl(sourceId,topic),{},18000);
          if(!Array.isArray(data.message?.items))throw new Error("records");
          payload={items:readCrossref(data,sourceLabel),fetched:new Date().toISOString(),source:"Crossref"};
        }
        if(!validSnapshot(payload))throw new Error("upstream");
        if(!area.isConnected||version!==ticket) return;
        if(topic) api.set(searchKey,[{query:topic,data:payload},...recentSearches.filter(r=>r.query!==topic)].slice(0,3));
        else api.set(key,payload);
        showResults(payload);
        status.textContent=subject+" · "+(payload.source||provider)+" · "+payload.items.length+" resultados mostrados · "+when(payload.fetched)+".";
      } catch {
        if(!area.isConnected||version!==ticket)return;
        if(hasCache) {status.textContent=cachedLabel()+" La fuente no respondió a la actualización.";return;}
        const sample=sourceId==="pubmed"?editorial.filter(item=>item.pmid):editorial;
        presentRecords(sample,"archivo",false);
        status.textContent=subject+" · No se pudo consultar la fuente. A continuación se muestra la selección editorial de archivo.";
      }
    }
