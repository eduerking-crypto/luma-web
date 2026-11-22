import assert from "node:assert/strict";
import {createServer} from "node:http";
import {readFile} from "node:fs/promises";
import {resolve} from "node:path";
import vm from "node:vm";
import {chromium} from "./browser-qa/node_modules/playwright-core/index.mjs";

const pub=resolve("work/luma-release/public");
const world={window:{}};vm.createContext(world);
for (const file of ["verbs-data.js","verbs.js"]) vm.runInContext(await readFile(pub+"/"+file,"utf8"),world);
const all=world.window.LumaVerbData;
const verbs=Object.fromEntries(all.map(v=>[v.base,v]));
const sentence=world.window.LumaVerbs.sentence;
assert.equal(all.length,521);assert.equal(Object.keys(verbs).length,521);
const pronouns=[{subject:"I",number:"first"},{subject:"You",number:"plural"},{subject:"She",number:"third"},{subject:"We",number:"plural"},{subject:"You",number:"plural"},{subject:"They",number:"plural"}];
let tested=0;
for (const v of all){
 assert.ok(v.base && v.third && v.past && v.participle && v.ing && v.es && v.complement);
 for(const period of ["present","past","future"])for(const aspect of ["simple","continuous","perfect","perfectContinuous"])for(const mode of ["positive","negative","question"])for(const person of pronouns){
  const line=sentence(v,period,aspect,mode,person);
  assert.ok(!/undefined|\bnull\b|  /.test(line));assert.equal(line.endsWith("?"),mode==="question");assert.equal(/\bnot\b/.test(line),mode==="negative");tested++;
 }
}
const W=(lemma,p,a,m,person)=>sentence(verbs[lemma],p,a,m,pronouns[person]);
for(const [args,expected] of [
 [["be","present","simple","positive",0],"I am."],[["be","past","simple","question",4],"Were you?"],
 [["be","present","simple","negative",2],"She is not."],[["do","past","simple","question",5],"Did they do?"],
 [["have","present","simple","question",2],"Does she have?"],[["have","present","perfect","positive",2],"She has had."],
 [["go","past","simple","positive",0],"I went."],[["go","past","perfect","negative",1],"You had not gone."],
 [["look up","past","continuous","question",0],"Was I looking up?"],[["get up","future","perfect","positive",3],"We will have gotten up."],
 [["study","future","perfectContinuous","question",5],"Will they have been studying?"],[["lie","present","continuous","positive",2],"She is lying."],
 [["analyze","future","simple","negative",0],"I will not analyze."],[["emit","past","simple","positive",3],"We emitted."],
 [["be","past","continuous","positive",2],"She was being."],[["write","present","perfect","question",2],"Has she written?"]])assert.equal(W(...args),expected);
const html=`<!doctype html><html lang="es"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="styles.css"><link rel="stylesheet" href="verbs.css"><main id="main" style="padding:12px"></main><script src="verbs-data.js"></script><script src="verbs.js"></script><script>window.completed=[];window.demo={level:()=>"A1",get:(k,d)=>JSON.parse(localStorage.getItem(k)||"null")||d,set:(k,v)=>localStorage.setItem(k,JSON.stringify(v)),icon:()=>"",complete:id=>{if(!completed.includes(id))completed.push(id)}};LumaVerbs.render(document.querySelector("main"),demo);</script></html>`;
const server=createServer(async(req,res)=>{const f=req.url.slice(1);if(!f){res.writeHead(200,{"content-type":"text/html"}).end(html);return}if(!['verbs.js','verbs-data.js','verbs.css','styles.css','assets/dm-sans.ttf'].includes(f)){res.writeHead(404).end();return}res.writeHead(200,{"content-type":f.endsWith('.js')?'text/javascript':f.endsWith('.css')?'text/css':'font/ttf'}).end(await readFile(pub+'/'+f));});
await new Promise(r=>server.listen(0,"127.0.0.1",r));
let browser;
try{
 browser=await chromium.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
 const page=await browser.newPage({viewport:{width:360,height:820}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto('http://127.0.0.1:'+server.address().port);
 const search=page.locator('[data-vsearch]');await search.fill('diseñar');assert.equal(await page.locator('[data-vselect]').inputValue(),'design');
 await search.fill('disenar');assert.equal(await page.locator('[data-vselect]').inputValue(),'design');
 await search.fill('went');assert.equal(await page.locator('[data-vselect]').inputValue(),'go');
 await search.fill('look up');assert.equal(await page.locator('[data-vselect]').inputValue(),'look up');
 await page.locator('[data-vgroup=period][data-value=future]').click();await page.locator('[data-vaspect]').selectOption('perfectContinuous');await page.locator('[data-vmode]').selectOption('question');
 assert.match(await page.locator('.vb-table tbody').innerText(),/Will she have been looking up\?/);
 assert.ok(await page.evaluate(()=>innerWidth>=document.documentElement.scrollWidth));
 const good=page.locator('[data-vanswer]').filter({hasText:'Will she have been looking up the word?'});
 const bad=page.locator('[data-vanswer]').filter({hasNotText:'Will she have been looking up the word?'}).first();await bad.click();assert.ok(await bad.isDisabled());
 await good.click();assert.match(await page.locator('.vb-feedback').textContent(),/Correcto/);assert.equal(await page.evaluate(()=>completed.length),1);
 await page.reload();assert.equal(await page.locator('[data-vselect]').inputValue(),'look up');assert.equal(await page.locator('[data-vmode]').inputValue(),'question');
 await search.fill('saber');assert.equal(await page.locator('[data-vselect]').inputValue(),'know');assert.ok(await page.locator('.vb-note').isVisible());assert.ok(!(await page.locator('.vb-table').innerText()).includes('knowing'));await page.locator('.vb-note button').click();assert.equal(await page.locator('[data-vaspect]').inputValue(),'perfect');
 await search.fill('#arg');assert.equal(await page.locator('[data-vselect]').isDisabled(),true);assert.match(await page.locator('[data-vmatches]').innerText(),/Sin coincidencias/);
 await search.fill('');await page.locator('[data-vcategory]').selectOption('science');assert.equal(await page.locator('[data-vselect] option').count(),89);
 await page.locator('[data-vcategory]').selectOption('phrases');assert.equal(await page.locator('[data-vselect] option').count(),56);
 assert.deepEqual(errors,[]);console.log(tested+" formas, 16 casos gramaticales, búsqueda bilingüe, filtros, excepciones de estado, repaso, persistencia y móvil a 360 px: OK.");
}finally {await browser?.close();await new Promise(r=>server.close(r))}

