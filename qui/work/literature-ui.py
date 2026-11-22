from pathlib import Path
p=Path('work/luma-release/public/science.js')
s=p.read_text('utf8').replace('date: "2016-06-08",','date: "2016-06-08",\n      pmid:"27276229", pmcid:"PMC4898709", fullTextInPmc:true, openAccess:true,',1)
s=s.replace('  const social = [','''  editorial.push({
    title:"Photosynthesis: basics, history and modelling.", journal:"Annals of Botany", date:"2020-09-14",
    pmid:"31641747",pmcid:"PMC7489092",doi:"10.1093/aob/mcz171",author:"A. Stirbet, D. Lazár, Y. Guo y G. Govindjee",
    note:"Una revisión sobre cómo se representa la fotosíntesis con modelos.", term:"light", fullTextInPmc:true
  });
  const social = [''')
s=s.replace('function crossrefUrl(issn, day = new Date().toISOString().slice(0, 10))', 'function crossrefUrl(issn, topic, day = new Date().toISOString().slice(0, 10))')
s=s.replace('      sort: "published",\n      order: "desc",','      ...(topic ? {"query.title":topic} : {sort:"published",order:"desc"}),',1)
s=s.replace('  function uniqueByDoi(items) {','''  const validPmid=id=>/^[1-9]\\d{0,8}$/.test(id || "");
  const validPmcid=id=>/^PMC[1-9]\\d*$/.test(id || "");
  const paperKey=article=>article?.doi ? String(article.doi).toLowerCase() : validPmid(article?.pmid) ? "pmid:"+article.pmid : "";
  const pubmedLink=pmid=>"https://pubmed.ncbi.nlm.nih.gov/"+pmid+"/";
  function uniqueByDoi(items) {''').replace('const key = String(item.doi || "").toLowerCase();','const key = paperKey(item);')
s=s.replace('    let license = null;', '''    const pubmedNotices = {"Retracted Publication":"Publicación retractada", "Retraction of Publication":"Aviso de retractación", "Expression of Concern":"Expresión de preocupación", "Published Erratum":"Fe de erratas publicada"};
    for(const type of (Array.isArray(record.types)?record.types:[])) if(Object.hasOwn(pubmedNotices,type)) messages.push({label:pubmedNotices[type],doi:""});
    let license = null;''',1)
s=s.replace('      input.items.length &&\n','')
s=s.replace('typeof item.doi === "string" &&\n          /^10\\.\\d{4,9}\\/\\S+$/i.test(item.doi),','(doiPattern.test(item.doi) || validPmid(item.pmid)),')
s=s.replace('html(dateLabel(item.date))','html(item.date ? dateLabel(item.date) : item.dateText || "Fecha sin indicar")',1)
s=s.replace('(item.author ? "<small>" + html(item.author) + "</small>" : "") +','''(item.author ? "<small>" + html(item.author) + "</small>" : "") +
      '<p class="sci-identifiers">'+[validPmid(item.pmid)?'<a href="'+pubmedLink(item.pmid)+'" rel="noopener noreferrer" target="_blank">PMID '+html(item.pmid)+'</a>':"", doiPattern.test(item.doi)?'<a href="'+html(linkFor(item.doi))+'" rel="noopener noreferrer" target="_blank">DOI '+html(item.doi)+'</a>':""].filter(Boolean).join(" · ")+'</p>' +''',1)
s=s.replace('html(linkFor(item.doi)) +\n      \'">\' +\n      (license ? "Leer en acceso abierto" : "Leer en la revista")', '''html(validPmid(item.pmid)?pubmedLink(item.pmid):linkFor(item.doi)) +
      '">' +
      (validPmid(item.pmid)?"Ver en PubMed":license?"Leer en acceso abierto":"Leer en la revista")''',1)
s=s.replace('\'</a><button type="button" data-discuss="\' +', ''''</a>' +
      (validPmcid(item.pmcid)&&item.fullTextInPmc ? '<a href="https://pmc.ncbi.nlm.nih.gov/articles/'+html(item.pmcid)+'/" target="_blank" rel="noopener noreferrer">'+(item.openAccess?'Texto abierto en PMC':'Texto completo en PMC')+'</a>' : '') +
      (validPmcid(item.pmcid) ? '<button type="button" data-abstract="'+index+'">Consultar resumen</button>' : '') +
      '<button type="button" data-discuss="' +''',1)
s=s.replace('\'">Practicar el título</button></div></article>\'', '\'">Practicar el título</button></div><div class="sci-abstract" aria-live="polite"></div></article>\'',1)
s=s.replace('>Revistas</button>', '>Revistas y PubMed</button>',1)
s=s.replace('if (!journals.some((j) => j[0] === selected)) selected = journals[0][0];','''if (selected!=="pubmed"&&!journals.some((j) => j[0] === selected)) selected = journals[0][0];
    let query=String(api.get("newsTopic","")||"").slice(0,160);''')
s=s.replace('function presentRecords(items, collection) {','function presentRecords(items, collection, allowDaily = true) {')
s=s.replace('const eligible = unique.filter(', 'const eligible = allowDaily ? unique.filter(',1).replace('(item) => !publicationInfo(item).messages.length,\n      );','(item) => !publicationInfo(item).messages.length,\n      ) : [];',1)
s=s.replace('item.doi.toLowerCase() === daily.item?.doi?.toLowerCase()','paperKey(item) === paperKey(daily.item)')
a=s.index('    async function feed(force = false)');b=s.index('    async function videos()',a)
s=s[:a]+Path('work/literature-feed.js').read_text('utf8')+'\n'+s[b:]
s=s.replace('area.onclick = (e) => {','area.onclick = async (e) => {')
s=s.replace('e.target.closest("[data-discuss],[data-video]")','e.target.closest("[data-discuss],[data-video],[data-abstract],[data-study-summary]")')
s=s.replace('      if (btn.hasAttribute("data-video")) {','''      if(btn.hasAttribute("data-abstract") || btn.hasAttribute("data-study-summary")) {
        const item=current[Number(btn.dataset.abstract??btn.dataset.studySummary)];
        if(!item || !validPmcid(item.pmcid))return;
        const box=btn.closest("article").querySelector(".sci-abstract");
        await openAbstract(item, btn, box, api);
        return;
      }
      if (btn.hasAttribute("data-video")) {''',1)
s=s.replace('        doi: article.doi,','        doi: article.doi,\n        pmid: article.pmid,',1)
s=s.replace('    if (doiPattern.test(item.doi))','    if (doiPattern.test(item.doi) || validPmid(item.pmid))').replace('sourceUrl: linkFor(item.doi),','sourceUrl: validPmid(item.pmid)?pubmedLink(item.pmid):linkFor(item.doi),')
s=s.replace('kind: "passage",\n        title: selected.title', 'kind: "passage",\n        publishedAbstract:selected.kind === "published-abstract",\n        title: selected.title')
s=s.replace('"En la adaptación de Luma aparece «" +','(context.publishedAbstract ? "En el resumen publicado aparece «" : "En la adaptación de Luma aparece «") +')
p.write_text(s,'utf8')

