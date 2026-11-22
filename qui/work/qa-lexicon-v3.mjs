import assert from "node:assert/strict";
import vm from "node:vm";
import {readFile, mkdtemp} from "node:fs/promises";
import {spawn} from "node:child_process";
import {resolve} from "node:path";
import {chromium} from "./browser-qa/node_modules/playwright-core/index.mjs";
const dir=resolve("work/luma-release"), win={};const sandbox=vm.createContext({window:win});
for(const file of ["vocab-extra","theory-data","learn"]){
  let src=await readFile(dir+"/public/"+file+".js","utf8");
  if(file==="learn")src=src.replace("window.LumaLearn = Object.freeze({","window.testWords = vocabulary; window.testTypes=wordInfo; window.LumaLearn = Object.freeze({");
  vm.runInContext(src,sandbox);
}
const entries=Object.values(win.testWords).flat(),names=entries.map(w=>w[0].toLowerCase()),unique=new Set(names);
const duplicates=names.filter((w,i)=>names.indexOf(w)!==i);assert.deepEqual(duplicates,[]);
assert.ok(names.length>=500);assert.ok(Object.entries(win.testWords).every(([key,rows])=>rows.length>=4));
for(const r of entries){assert.ok(r[0]&&r[1]&&r[2].split(/\s+/).length>=3);}
assert.equal(win.LumaTheoryData.length,25);assert.ok(win.LumaTheoryData.every(ch=>ch.why&&ch.apply&&ch.examples.length===2&&ch.use&&ch.concept));
const db=await mkdtemp(resolve('work/word-check-')),port=4547,base='http://127.0.0.1:'+port;
const server=spawn(process.execPath,['server.mjs'],{cwd:dir,env:{...process.env,LUMA_PORT:String(port),LUMA_DATA_DIR:db},stdio:'pipe',windowsHide:true});let browser;
try{
 await new Promise((ok,no)=>{server.stdout.once('data',ok);server.once('error',no);server.once('exit',()=>no(Error("Early exit")));});
 browser=await chromium.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
 const page=await browser.newPage({viewport:{width:360,height:830},serviceWorkers:'block'}),errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.route(base+'/', async route=>{
   const res=await route.fetch();let html=await res.text();if(!html.includes('src="vocab-extra.js"')) html=html.replace('<script defer src="learn.js">','<link rel="stylesheet" href="theory.css"><script defer src="vocab-extra.js"></script><script defer src="theory-data.js"></script><script defer src="learn.js">');await route.fulfill({response:res,body:html});
 });
 await page.goto(base+'/#vocabulary');const filter=page.locator('[data-ll=filter]'),topic=page.locator('[data-ll=topic]'),kind=page.locator('[data-ll=kind]');await filter.waitFor();assert.match(await page.locator('.ll-results').innerText(),new RegExp('^'+names.length));
 assert.equal(await page.locator('[data-en]').count(),24);const first=await page.locator('[data-en]').first().getAttribute('data-en');await page.locator('[data-page=next]').click();assert.notEqual(await page.locator('[data-en]').first().getAttribute('data-en'),first);
 await filter.fill('impermeable');assert.equal(await page.locator('[data-en=raincoat]').count(),1);await page.locator('[data-en=raincoat] [data-save]').click();await filter.fill('');
 await topic.selectOption('Guardadas');assert.equal(await page.locator('[data-en=raincoat]').count(),1);await topic.selectOption('Todos los temas');await kind.selectOption('Verbo frasal');assert.equal(await page.locator('.ll-results').innerText(),'60 entradas · Todos los temas');await filter.fill('averiguar');assert.equal(await page.locator('[data-en="find out"]').count(),1);
 await kind.selectOption('Todas');await filter.fill('decimo');assert.equal(await page.locator('[data-en=tenth]').count(),1);
 await page.locator('[data-ll=recall]').click();assert.ok(await page.locator('.ll-recall [data-choice]').first().isVisible());assert.ok(await page.evaluate(()=>innerWidth>=document.documentElement.scrollWidth));
 await page.goto(base+'/#games');await page.locator('[data-ll=topic]').selectOption('Verbos frasales');assert.equal(await page.locator('[data-side="0"]').count(),4);
 await page.goto(base+'/#theory');
 for(const level of ['A1','A2','B1','B2','C1']){
   await page.locator('.ll-level select').selectOption(level);const chapters=win.LumaTheoryData.filter(c=>c.level===level);assert.equal(await page.locator('[data-chapter]').count(),5);
   for(const c of chapters){
     await page.locator('[data-chapter="'+c.id+'"]').click();assert.equal(await page.locator('[data-theory-title]').textContent(),c.title);
     await page.locator('[data-choice]').nth((c.answer+1)%3).click();assert.match(await page.locator('.ll-quiz .ll-feedback').innerText(),/Revisa/);await page.locator('[data-choice]').nth(c.answer).click();assert.match(await page.locator('.ll-quiz .ll-feedback').innerText(),/Correcto/);
     assert.ok(await page.locator('[data-chapter="'+c.id+'"] .lt-check').isVisible());
   }
 }
 await page.locator('[data-theory-draft]').fill('The comparison leaves open another explanation.');await page.reload();await page.locator('[data-theory-draft]').waitFor();assert.match(await page.locator('[data-theory-draft]').inputValue(),/comparison/);assert.match(await page.locator('.lt-menu .ll-meta').innerText(),/5 de 5/);
 assert.ok(await page.evaluate(()=>innerWidth>=document.documentElement.scrollWidth));assert.deepEqual(errors,[]);
 console.log(JSON.stringify({entries:unique.size,categories:Object.keys(win.testWords).length,phrasal:win.testWords['Verbos frasales'].length,theory:win.LumaTheoryData.length,levels:5,qa:'Búsqueda global y por clase, acentos, marcadores, paginación, 25 capítulos y ejercicios con explicación, borrador tras reiniciar, juegos y repaso espaciado; móvil 360 px, sin excepciones.'}));
} finally {await browser?.close();server.kill();}
