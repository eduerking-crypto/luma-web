from pathlib import Path
p=Path('work/luma-release/backend/api.mjs')
s=p.read_text('utf8')
a=s.index('async function cached(');b=s.index('async function news(',a)
s=s[:a]+'''async function cached(key, read) {
  const entry = memo.get(key);
  if (entry && entry.expires > Date.now()) return entry.result;
  const result=Promise.resolve().then(read);
  if(memo.size>=128) memo.delete(memo.keys().next().value);
  memo.set(key, { result, expires:Date.now()+900000 });
  try { return await result; }
  catch(error) { if(memo.get(key)?.result === result) memo.delete(key); throw error; }
}
'''+Path('work/literature-backend.mjs').read_text('utf8')+'\n'+s[b:]
s=s.replace('async function news(issn) {','async function news(issn, rawTopic = "") {\n  const topic=rawTopic.trim().replace(/\\s+/g," ");\n  if (topic.length > 160 || /[\\u0000-\\u001f]/.test(topic)) return json({error:"Busca un tema de hasta 160 caracteres."},400);\n  const cacheKey = "journal:" + issn + ":" + topic;\n  if (issn === "pubmed") return json(await cached(cacheKey,()=>pubmed(topic)));')
s=s.replace('await cached("journal:" + issn, async () => {','await cached(cacheKey, async () => {')
s=s.replace('      sort: "published",\n      order: "desc",','      ...(topic ? {"query.title":topic} : {sort:"published",order:"desc"}),',1)
s=s.replace('    if (!items.length) throw new Error("empty");\n    return { items, fetched:','    if (!Array.isArray(data?.message?.items)) throw new Error("records");\n    return { items, fetched:',1)
s=s.replace('return await news(url.searchParams.get("journal") || "0028-0836");','return await news(url.searchParams.get("journal") || "0028-0836", url.searchParams.get("q") || "");')
p.write_text(s,'utf8')

