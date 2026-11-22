  async function openAbstract(item,btn,box,api) {
    const key="scienceOpenSummary."+item.pmcid;
    const valid=value=>typeof value?.passage==="string" && value.passage.length>20 && /^https:\/\/creativecommons\.org\/(licenses\/by|publicdomain\/zero)\/\d\.\d\/$/.test(value.licenseUrl||"");
    // Keep a small device-local shelf so reading an abstract works again offline.
    const history=api.get("scienceOpenSummaryShelf",[]);
    const shelf=Array.isArray(history)?history:[];
    let packet=shelf.find(row=>row.id===key)?.packet;
    const pmcUrl="https://pmc.ncbi.nlm.nih.gov/articles/"+item.pmcid+"/";
    if(btn.hasAttribute("data-study-summary")){
      if(!valid(packet))return;
      api.set("lessonContext",{kind:"published-abstract",title:item.title,passage:packet.passage,sourceName:item.journal+" · "+(item.author||"Autores del artículo"),sourceUrl:pmcUrl,level:api.level()});
      api.go("tutor");return;
    }
    if(btn.getAttribute("aria-expanded")==="true"){box.hidden=true;btn.setAttribute("aria-expanded","false");btn.textContent="Consultar resumen";return;}
    box.hidden=false;btn.disabled=true;box.textContent="Consultando el resumen y su licencia en PubMed Central…";
    try {
      if(!valid(packet)) {
        if(!cloudProtocol())throw new Error("offline");
        packet=await fetchJSON("/api/abstract?pmcid="+encodeURIComponent(item.pmcid),{},19000);
        if(!box.isConnected)return;
        if(valid(packet)){
          const existing=api.get("scienceOpenSummaryShelf",[]);
          api.set("scienceOpenSummaryShelf",[{id:key,packet},...(Array.isArray(existing)?existing:[]).filter(row=>row.id!==key)].slice(0,6));
        }
      }
      if(!box.isConnected)return;
      if(!valid(packet)){
        box.innerHTML='<p>La fuente no ofrece aquí un resumen con licencia de reutilización CC BY o CC0. Puedes consultar la publicación en <a href="'+pmcUrl+'" target="_blank" rel="noopener noreferrer">PubMed Central</a>.</p>';
      }else{
        box.innerHTML='<h4>'+(packet.excerpt?'Fragmento del resumen original':'Resumen original en inglés')+'</h4>'+
          packet.passage.split(/\n+/).filter(Boolean).map(p=>'<p lang="en">'+html(p)+'</p>').join("")+
          '<p class="sci-source">'+html(packet.attribution||item.author||item.journal)+' · <a href="'+pmcUrl+'" target="_blank" rel="noopener noreferrer">PubMed Central</a> · <a href="'+html(packet.licenseUrl)+'" target="_blank" rel="noopener noreferrer">'+html(packet.licenseName)+'</a>. Formato de lectura adaptado.</p>'+
          '<button type="button" class="sci-refresh" data-study-summary="'+btn.dataset.abstract+'">Practicar este resumen con Lumi</button>';
      }
      btn.setAttribute("aria-expanded","true");btn.textContent="Ocultar resumen";
    } catch {
      if(box.isConnected)box.innerHTML='<p>El resumen no está disponible en este momento. <a href="'+pmcUrl+'" target="_blank" rel="noopener noreferrer">Abrir la publicación en PMC</a>.</p>';
    } finally {btn.disabled=false;}
  }

