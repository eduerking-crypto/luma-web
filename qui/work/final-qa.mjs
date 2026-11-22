import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp,readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {DatabaseSync} from 'node:sqlite';
import {chromium} from './browser-qa/node_modules/playwright-core/index.mjs';
import worker from './luma-release/dist/server/index.js';

const cwd=resolve('work/luma-release');
const storage=await mkdtemp(resolve('work/qa-profile-'));
const port=4396,base='http://127.0.0.1:'+port;
const server=spawn(process.execPath,['server.mjs'],{cwd,env:{...process.env,LUMA_PORT:String(port),LUMA_DATA_DIR:storage},windowsHide:true,stdio:'pipe'});
let browser;
try{
 await new Promise((ok,fail)=>{server.stdout.once('data',ok);server.once('error',fail);server.once('exit',()=>fail(Error('Server exited early')));});
 const db=new DatabaseSync(':memory:');db.exec(await readFile(cwd+'/drizzle/0000_perfil_de_estudio.sql','utf8'));
 const DB={prepare(sql){let q=db.prepare(sql);return {bind(...p){return {all(){return {results:q.all(...p)}},run(){return q.run(...p)}}}}}};
 let hosted=await worker.fetch(new Request('https://test.invalid/api/progress',{headers:{'oai-authenticated-user-id':'qa-user'}}),{DB});assert.equal(hosted.status,200);
 hosted=await worker.fetch(new Request('https://test.invalid/api/progress',{method:'PUT',headers:{'oai-authenticated-user-id':'qa-user','Content-Type':'application/json'},body:JSON.stringify({key:'level',value:'C1'})}),{DB});assert.equal(hosted.status,200);
 hosted=await worker.fetch(new Request('https://test.invalid/api/progress',{headers:{'oai-authenticated-user-id':'qa-user'}}),{DB});assert.equal((await hosted.json()).values.level,'C1');
 hosted=await worker.fetch(new Request('https://test.invalid/api/progress',{headers:{'oai-authenticated-user-id':'other-user'}}),{DB});assert.deepEqual((await hosted.json()).values,{});
 db.close();
 for(const path of ['/','/assets/lumi-cutout.webp','/app.js','/learn.js','/assets/dm-sans.ttf']){const r=await worker.fetch(new Request('https://test.invalid'+path),{});assert.equal(r.status,200);assert.ok((await r.arrayBuffer()).byteLength>100);}
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:930},locale:'es-CO',timezoneId:'America/Bogota'});
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base);await page.evaluate(()=>document.fonts.ready);await page.locator('.lumi-wrap img').evaluate(img=>img.decode());
 await page.screenshot({path:resolve('work/home-final.png')});
 const heading=await page.locator('.hero-text h2').boundingBox();assert.ok(heading.height<140,'Hero title should fit on two lines');
 await page.keyboard.press('Control+k');await page.locator('#query').fill('estrellas');await page.locator('#matches button').first().click();
 await page.waitForURL('**/#astro');await page.getByRole('heading',{name:'Where stars are born',exact:true}).waitFor();assert.equal(await page.locator('h1').textContent(),'Where stars are born');
 for(const id of ['home','settings','reading','writing','speaking','theory','games','exercises','exams','vocabulary','present','astro','plants','path','library','news','tutor','streak','practice']){await page.evaluate(async id=>{if(location.hash.slice(1)===id)return;await new Promise(done=>{addEventListener('hashchange',done,{once:true});location.hash=id;});},id);await page.waitForFunction(()=>!!document.querySelector('#content h1'));assert.ok(await page.locator('#content h1').isVisible());}
 await page.goto(base+'/#vocabulary');await page.locator('[data-ll=recall]').click();
 assert.ok(await page.locator('.ll-recall .ll-quiz').isVisible());const options=page.locator('.ll-recall [data-choice]');for(let i=0;i<3;i++){if(await options.nth(i).isEnabled())await options.nth(i).click();}
 assert.ok(await page.locator('.ll-recall [data-ll=continue]').isVisible());
 let state=await page.evaluate(()=>JSON.parse(localStorage.getItem('luma.learning.v1')));
 let item=Object.entries(state).find(([k,v])=>k.startsWith('word-memory.')&&v.lastAttemptAt);assert.ok(item);
 assert.ok(item[1].correct+item[1].assisted===1);assert.ok(Object.keys(state).some(k=>k.startsWith('completed.')));
 await page.reload();await page.waitForTimeout(650);
 let saved=await page.evaluate(()=>fetch('/api/progress').then(r=>r.json()));assert.ok(saved.values[item[0]]);
 await page.setViewportSize({width:390,height:844});await page.goto(base+'/#home');await page.screenshot({path:resolve('work/home-mobile-final.png')});assert.ok(await page.locator('#rail').evaluate(e=>e.inert));await page.locator('#menu-button').click();assert.ok(await page.locator('.stage').evaluate(e=>e.inert));await page.keyboard.press('Escape');assert.ok(await page.locator('#rail').evaluate(e=>e.inert));
 assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);assert.deepEqual(errors,[]);
 console.log('QA OK · 19 rutas, búsqueda, cola de vocabulario, racha, SQLite, aislamiento D1, cinco recursos del Worker y navegación móvil.');
}finally{await browser?.close();server.kill();}

