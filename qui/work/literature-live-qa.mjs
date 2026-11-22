import assert from 'node:assert/strict';
import worker from './luma-release/backend/api.mjs';
const get=async path=>{const start=Date.now(); const r=await worker.fetch(new Request('http://localhost'+path),{});return {status:r.status,data:await r.json(),seconds:(Date.now()-start)/1000};};
const tests=[
  ['Nature','/api/news?journal=0028-0836&q=photosynthesis','list'],
  ['Science','/api/news?journal=0036-8075&q=climate','list'],
  ['PubMed','/api/news?journal=pubmed&q=photosynthesis%5BTitle%5D','list'],
  ['Resumen CC BY','/api/abstract?pmcid=PMC4898709','abstract'],
  ['PubMed sin resultados','/api/news?journal=pubmed&q=xyzqvnlumaunmatched349876','empty'],
  ['Entrada no válida','/api/abstract?pmcid=ZZ','bad']
];
const results=await Promise.allSettled(tests.map(async ([label,path,kind])=>{
  const {status,data,seconds}=await get(path), first=data?.items?.[0];
  console.log(JSON.stringify({label,status,seconds,count:data?.items?.length,source:data?.source,title:first?.title,doi:first?.doi,pmid:first?.pmid,pmcid:first?.pmcid,author:first?.author,journal:first?.journal,full:first?.fullTextInPmc,license:data?.licenseName,characters:data?.passage?.length,available:data?.available,error:data?.error}));
  if(kind==='bad')assert.equal(status,400);
  else{
    assert.equal(status,200,label);
    if(kind==='empty')assert.deepEqual(data.items,[]);
    if(kind==='abstract'){assert.ok(data.available);assert.ok(data.passage.length>300);assert.equal(data.licenseName,'CC BY 4.0');}
    if(kind==='list'){
      assert.ok(data.items.length>0);assert.ok(first.journal&&first.date);assert.ok(data.items.some(row=>row.author));
      if(label==='PubMed')assert.ok(first.pmid);
      else assert.equal(first.journal.toLowerCase(),label.toLowerCase());
      const readAgain=await get(path);assert.equal(readAgain.data.fetched,data.fetched);
    }
  }
}));
const fetchOriginal=globalThis.fetch;
globalThis.fetch=async()=>{throw new Error('red de prueba desconectada');};
const down=await get('/api/news?journal=pubmed&q=simulatedconnectionfailure');globalThis.fetch=fetchOriginal;
console.log('offline',down);assert.equal(down.status,502);
for(const r of results)if(r.status==='rejected'){console.error(r.reason?.stack||r.reason);process.exitCode=1;}

