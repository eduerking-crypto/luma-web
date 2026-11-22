// NCBI's anonymous E-utilities allowance is three requests per second per IP.
// Reserve slots per isolate and coalesce duplicate searches in the shared cache.
let nextNcbiSlot = 0;
async function ncbi(name, fields) {
  const now = Date.now(), slot = Math.max(now, nextNcbiSlot);
  if (slot - now > 4000) throw new Error("busy");
  nextNcbiSlot = slot + 400;
  if (slot > now) await new Promise(resolve => setTimeout(resolve, slot - now));
  const url = new URL(name + ".fcgi", "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/");
  url.search = new URLSearchParams({db:"pubmed", retmode:"json", tool:"luma_science_reader", ...fields});
  return upstream(url, {headers:{Accept:"application/json"}}, 11000);
}
const pmidPattern = /^[1-9]\d{0,8}$/;
const pmcPattern = /^PMC[1-9]\d*$/;
function yearMonthDay(raw) {
  const s = String(raw || "").trim();
  const match = s.match(/^(\d{4})(?:\s+([A-Za-z]{3}))(?:\s+(\d{1,2}))?$/);
  if (!match) return /^\d{4}$/.test(s) ? s : "";
  const month = ["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"].indexOf(match[2].toLowerCase())+1;
  if (!month) return "";
  return match[1]+"-"+String(month).padStart(2,"0")+(match[3]?"-"+match[3].padStart(2,"0"):"");
}
async function accessFromEuropePmc(items) {
  const ids = items.filter(x=>x.pmcid).map(x=>x.pmid);
  if (!ids.length) return;
  const url = new URL("https://www.ebi.ac.uk/europepmc/webservices/rest/search");
  url.search = new URLSearchParams({query:"SRC:MED AND ("+ids.map(id=>"EXT_ID:"+id).join(" OR ")+")",format:"json",resultType:"lite",pageSize:String(ids.length)});
  try {
    const response = await upstream(url,{},5000);
    const verified = new Map((response?.resultList?.result || []).map(x=>[x.id,x]));
    for(const item of items) {
      const hit=verified.get(item.pmid);
      if(hit?.inPMC==="Y" && hit.pmcid===item.pmcid) {
        item.fullTextInPmc=true;
        item.openAccess=hit.isOpenAccess==="Y";
      }
    }
  } catch { /* Bibliographic results remain usable if the access service is unavailable. */ }
}
async function pubmed(topic) {
  const search = await ncbi("esearch", {
    term:topic ? "("+topic+") AND english[lang]" : "english[lang] AND journal article[pt]",
    sort:topic ? "relevance" : "pub_date", retmax:"8", datetype:"pdat",
    mindate:"1000/01/01", maxdate:new Date().toISOString().slice(0,10).replaceAll("-","/"),
  });
  if (!Array.isArray(search.esearchresult?.idlist) || search.esearchresult.error) throw new Error("search");
  const ids=[...new Set(search.esearchresult.idlist.filter(id=>pmidPattern.test(id)))];
  let items=[];
  if(ids.length) {
    const summaries = await ncbi("esummary", {id:ids.join(",")});
    if(!summaries.result?.uids) throw new Error("summary");
    items=ids.map(id=>summaries.result[id]).filter(row=>row?.title && pmidPattern.test(row.uid)).map(row=>{
      const identifiers=Array.isArray(row.articleids)?row.articleids:[];
      const find=type=>identifiers.find(a=>a.idtype===type)?.value || "";
      const doi=find("doi"), pmcid=find("pmc");
      const authors=(row.authors || []).map(a=>a.name).filter(Boolean);
      return {pmid:row.uid, doi:/^10\.\d{4,9}\/\S+$/i.test(doi)?doi:"", pmcid:pmcPattern.test(pmcid)?pmcid:"",
        title:textTitle(row.title),journal:textTitle(row.fulljournalname||row.source),
        author:authors.slice(0,3).join(", ")+(authors.length>3?" y colaboradores":""),
        date:yearMonthDay(row.pubdate),dateText:String(row.pubdate || "").slice(0,60),
        types:(row.pubtype || []).slice(0,8).map(textTitle),
      };
    });
    if(!items.length) throw new Error("missing summaries");
    await accessFromEuropePmc(items);
  }
  return {items,source:"PubMed",fetched:new Date().toISOString()};
}

