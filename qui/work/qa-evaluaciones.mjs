import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp} from 'node:fs/promises';
import {resolve} from 'node:path';
import {chromium} from './browser-qa/node_modules/playwright-core/index.mjs';
const root=resolve('work/luma-release'), base='http://127.0.0.1:4521';
const storage=await mkdtemp(resolve('work/exam-qa-'));
const server=spawn(process.execPath,['server.mjs'],{cwd:root,windowsHide:true,env:{...process.env,LUMA_PORT:'4521',LUMA_DATA_DIR:storage},stdio:'pipe'});
let browser;
try {
 await new Promise((res,rej)=>{server.once('error',rej);server.stdout.once('data',res);server.once('exit',()=>rej(Error('no server')));});
 browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
 const page=await browser.newPage({viewport:{width:980,height:850}}), errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(base+'/#exams');await page.locator('.ll-exam-layout').waitFor();
 const ids=['A1','A2','B1','B2','C1'];
 const correct=[[1,0,1,2],[2,0,1,2],[0,1,2,1],[2,1,0,2],[1,2,0,1]];
 for (const [i,id] of ids.entries()){
  await page.locator('.ll-level select').selectOption(id);
  if(i===1)await page.setViewportSize({width:360,height:820});
  assert.equal(await page.locator('.ll-exam-main input[type=radio]').count(),3);
  await page.locator('[data-ll=next]').click();assert.match(await page.locator('.ll-exam-main .ll-feedback').innerText(),/Elige/);
  for(let j=0;j<4;j++){
   await page.locator('.ll-exam-main input[type=radio]').nth(correct[i][j]).check();
   if(j===1){await page.reload();await page.locator('.ll-exam-main input[type=radio]:checked').waitFor();}
   await page.locator('[data-ll=next]').click();
  }
  const draft=page.locator('[data-exam-draft]');const answer='The observations describe the school project in detail and establish a useful comparison with uncertainties that could be addressed by repeated observations at matching times.';
  await draft.fill(answer);await page.reload();assert.equal(await draft.inputValue(),answer);
  if(i===2){await page.locator('[data-exam-mode]').selectOption('speaking');await page.locator('[data-ll=record]').click();await page.locator('.ll-recorder .ll-feedback:not([hidden])').waitFor();await page.locator('[data-exam-rehearsed]').check();}
  await page.locator('[data-exam-rating="0"]').selectOption(i===2?'0':'2');
  await page.locator('[data-exam-rating="1"]').selectOption('2');await page.locator('[data-ll=finish]').click();
  assert.deepEqual(await page.locator('.ll-score-grid b').allTextContents(),['2/2','2/2']);assert.equal(await page.locator('.ll-exam-main h2').textContent(),'Resultados de la práctica');
  const getCount=()=>page.evaluate(()=>Object.keys(JSON.parse(localStorage.getItem('luma.learning.v1'))).filter(k=>k.startsWith('completed.')).length);
  const prevCount=await getCount();await page.reload();await page.locator('.ll-score-grid').waitFor();assert.equal(await getCount(),prevCount);
  await page.locator('[data-ll=again]').click();await page.locator('.ll-exam-main details').first().locator('summary').click();assert.match(await page.locator('.ll-exam-main details').first().innerText(),/4\/4/);
  assert.ok(await page.evaluate(()=>innerWidth>=document.documentElement.scrollWidth));
 }
 await page.goto(base+'/#vocabulary');await page.locator('[data-ll=topic]').waitFor();assert.equal(await page.locator('[data-ll=topic] option').count(),18);for(const topic of ['Hogar','Alimentos','Clima y tiempo atmosférico','Tiempo','Movimiento','Laboratorio','Datos']){await page.locator('[data-ll=topic]').selectOption(topic);assert.equal(await page.locator('[data-en]').count(),6);}
 await page.goto(base+'/#reading');await page.locator('[data-ll=ask-lumi]').click();await page.waitForURL('**/#tutor');const ctx=await page.evaluate(()=>JSON.parse(localStorage.getItem('luma.learning.v1')).lessonContext);assert.ok(ctx.passage.length>20 && ctx.sourceUrl.startsWith('https://doi.org/'));
 assert.deepEqual(errors,[]);console.log('5 niveles, 20 preguntas de transferencia, 5 tareas productivas, reanudación, micrófono denegado, rúbricas por destreza, historial sin duplicados, 42 palabras, tutor con cita y viewport de 360 px: OK.');
}finally {await browser?.close();server.kill();}
