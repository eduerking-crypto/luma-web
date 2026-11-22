function plainJats(markup) {
  const entities={amp:"&",lt:"<",gt:">",quot:'"',apos:"'",nbsp:" "};
  return String(markup || "").replace(/<xref\b[^>]*>[\s\S]*?<\/xref>/gi,"")
    .replace(/<\/?(?:title|p|sec)\b[^>]*>/gi,"\n").replace(/<[^>]+>/g,"")
    .replace(/&(amp|lt|gt|quot|apos|nbsp|#\d+|#x[a-f\d]+);/gi,(full,key)=>{
      if (Object.hasOwn(entities,key)) return entities[key];
      const n=key[1]?.toLowerCase()==="x"?parseInt(key.slice(2),16):Number(key.slice(1));
      return Number.isInteger(n)&&n>0&&n<=0x10ffff?String.fromCodePoint(n):full;
    }).replace(/[^\S\n]+/g," ").replace(/ *\n */g,"\n").replace(/\n+/g,"\n\n").trim();
}
async function licensedSummary(pmcid) {
  if (!pmcPattern.test(pmcid) || pmcid.length>13) return json({error:"PMCID no válido."},400);
  const packet=await cached("abstract:"+pmcid,async()=>{
    await ncbiSlot();
    const url=new URL("https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi");
    url.search=new URLSearchParams({db:"pmc",id:pmcid.slice(3),retmode:"xml",tool:"luma_science_reader"});
    const response=await fetch(url,{signal:AbortSignal.timeout(13000),headers:{Accept:"application/xml"}});
    if(!response.ok) throw new Error("pubmed");
    const reader=response.body.getReader(), decoder=new TextDecoder();
    let front="",size=0;
    try {
      while(size<700000 && !front.includes("</front>")){
        const chunk=await reader.read();
        if(chunk.done) break;
        size+=chunk.value.byteLength;
        front+=decoder.decode(chunk.value,{stream:true});
      }
    }finally{await reader.cancel().catch(()=>{});}
    const pmcUrl="https://pmc.ncbi.nlm.nih.gov/articles/"+pmcid+"/";
    const unavailable={available:false,pmcUrl};
    if(!front.includes("</front>"))return unavailable;
    const header=front.split("</front>")[0].match(/<article-meta\b[^>]*>([\s\S]*?)<\/article-meta>/i)?.[1] || "";
    const encodedId=header.match(/<article-id\b[^>]*pub-id-type=["']pmcid["'][^>]*>([^<]+)</i)?.[1];
    if(encodedId!==pmcid)return unavailable;
    const permissions=(header.match(/<permissions\b[^>]*>[\s\S]*?<\/permissions>/i)?.[0] || "")
      .replace(/<(?:[\w-]+:)?license_ref\b[^>]*specific-use=["']textmining["'][^>]*>[\s\S]*?<\/(?:[\w-]+:)?license_ref>/gi,"");
    // Reuse only an article-level CC BY or CC0 grant; a mining-only licence is insufficient.
    const grant=permissions.match(/https?:\/\/(?:www\.)?creativecommons\.org\/(licenses\/by|publicdomain\/zero)\/(\d\.\d)\/(?=["'\s<])/i);
    if(!grant)return unavailable;
    const abstracts=[...header.matchAll(/<abstract\b([^>]*)>([\s\S]*?)<\/abstract>/gi)];
    const chosen=abstracts.find(([,attrs])=>!/(?:graphical|summary|teaser|toc|plain-language|translated)/i.test(attrs) && (!/xml:lang=/i.test(attrs)||/xml:lang=["']en(?:[-_][\w-]+)?["']/i.test(attrs)));
    if(!chosen)return unavailable;
    let passage=plainJats(chosen[2].replace(/<(fig|table-wrap|supplementary-material)\b[^>]*>[\s\S]*?<\/\1>/gi,""));
    if(passage.length<30)return unavailable;
    const excerpt=passage.length>6000;
    if(excerpt)passage=passage.slice(0,6000).replace(/\s+\S*$/,"")+"…";
    return {available:true,passage,excerpt,pmcUrl,licenseName:(grant[1]==="licenses/by"?"CC BY ":"CC0 ")+grant[2],
      licenseUrl:"https://creativecommons.org/"+grant[1]+"/"+grant[2]+"/",
      attribution:plainJats(permissions.match(/<copyright-statement\b[^>]*>([\s\S]*?)<\/copyright-statement>/i)?.[1])};
  });
  return json(packet);
}

