import {createServer} from 'node:http';
import {DatabaseSync} from 'node:sqlite';
import {mkdir,readFile,stat} from 'node:fs/promises';
import {dirname,extname,join,resolve,sep} from 'node:path';
import {fileURLToPath} from 'node:url';
import worker from './dist/server/index.js';

const root=dirname(fileURLToPath(import.meta.url));
const assets=join(root,'dist');
const storage=resolve(process.env.LUMA_DATA_DIR || join(root,'.luma-local'));
await mkdir(storage,{recursive:true});
const sqlite=new DatabaseSync(join(storage,'luma.sqlite'));
sqlite.exec('PRAGMA journal_mode=WAL; PRAGMA busy_timeout=3000; CREATE TABLE IF NOT EXISTS learner_values (profile TEXT NOT NULL, key TEXT NOT NULL, value TEXT NOT NULL, PRIMARY KEY (profile, key)) WITHOUT ROWID;');
const DB={prepare(sql){
  const statement=sqlite.prepare(sql);
  return {bind(...args){return {all(){return {results:statement.all(...args)};},run(){return statement.run(...args);}};}};
}};
let model=null, checkedAt=0, modelLookup=null;
async function discoverModel(){
  if(modelLookup)return modelLookup;
  if(Date.now()-checkedAt<60000) return model;
  modelLookup=readModels();
  try{return await modelLookup;}finally{checkedAt=Date.now();modelLookup=null;}
}
async function readModels(){
  try{
    const res=await fetch('http://127.0.0.1:11434/api/tags',{signal:AbortSignal.timeout(1500)});
    if(!res.ok)throw new Error('ollama');
    const tags=await res.json();
    const local=tags.models.filter(m=>m.size>1000000 && !/cloud|embed|moondream|coder|bakllava/i.test(m.name)).map(m=>m.name);
    model=process.env.LUMA_OLLAMA_MODEL ? local.find(x=>x===process.env.LUMA_OLLAMA_MODEL) : local.find(x=>x==='qwen3.5:4b') || local.find(x=>/gemma|llama|qwen|mistral/i.test(x));
  }catch{model=null;}
  return model;
}
async function localModel(messages){
  const res=await fetch('http://127.0.0.1:11434/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({model,messages,stream:false,think:false,options:{temperature:0.4,num_predict:240,num_ctx:4096}}),signal:AbortSignal.timeout(105000)});
  if(!res.ok)throw new Error('model');
  return (await res.json()).message?.content;
}
const contentTypes={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.mjs':'text/javascript; charset=utf-8','.json':'application/json','.png':'image/png','.webp':'image/webp','.jpg':'image/jpeg','.jpeg':'image/jpeg','.avif':'image/avif','.ico':'image/x-icon','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.ttf':'font/ttf','.mp3':'audio/mpeg','.webmanifest':'application/manifest+json'};
const port=Number(process.env.LUMA_PORT || 4173);
if(!Number.isInteger(port) || port<1 || port>65535)throw new Error('LUMA_PORT fuera de rango');
const server=createServer(async(req,res)=>{
  try{
    const host=req.headers.host || '';
    if(!new Set(['localhost:'+port,'127.0.0.1:'+port]).has(host)){res.writeHead(403).end(); return;}
    const base='http://'+host;
    const url=new URL(req.url,base);
    if(url.origin!==base){res.writeHead(400).end();return;}
    if(url.pathname.startsWith('/api/')){
      let size=0; const chunks=[];
      for await(const chunk of req){
        size+=chunk.length;
        if(size>192000){res.writeHead(413).end();return;}
        chunks.push(chunk);
      }
      const env={DB,YOUTUBE_API_KEY:process.env.YOUTUBE_API_KEY};
      if(['/api/status','/api/tutor'].includes(url.pathname) && await discoverModel())env.LOCAL_MODEL=localModel;
      const options={method:req.method,headers:req.headers};
      if(!['GET','HEAD'].includes(req.method))options.body=Buffer.concat(chunks);
      const output=await worker.fetch(new Request(url,options),env);
      res.writeHead(output.status,Object.fromEntries(output.headers));
      res.end(Buffer.from(await output.arrayBuffer()));
      return;
    }
    if(!['GET','HEAD'].includes(req.method)){res.writeHead(405).end();return;}
    const requestPath=decodeURIComponent(url.pathname);
    if(requestPath.split(/[\\/]/).some(p=>p.startsWith('.') || p==='server') || requestPath.includes('\0')){res.writeHead(404).end();return;}
    const file=resolve(assets,'.'+(requestPath==='/' ? '/index.html': requestPath));
    if(!file.startsWith(assets+sep)){res.writeHead(404).end();return;}
    let info;try{info=await stat(file);}catch{res.writeHead(404).end();return;}
    if(!info.isFile()){res.writeHead(404).end();return;}
    res.writeHead(200,{'Content-Type':contentTypes[extname(file).toLowerCase()] || 'application/octet-stream','Content-Length':String(info.size),'X-Content-Type-Options':'nosniff','Cache-Control':'no-cache'});
    if(req.method==='HEAD'){res.end();return;}
    res.end(await readFile(file));
  }catch{if(!res.headersSent)res.writeHead(500);res.end();}
});
server.listen(port,'127.0.0.1',()=>console.log('Luma · http://127.0.0.1:'+port));
server.on('close',()=>sqlite.close());
