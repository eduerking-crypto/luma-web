import assert from 'node:assert/strict';
import {chromium} from './browser-qa/node_modules/playwright-core/index.mjs';
const browser=await chromium.launch({executablePath:'C:/Program Files/Google/Chrome/Application/chrome.exe',headless:true});
try {
 const ctx=await browser.newContext({serviceWorkers:'block',viewport:{width:390,height:844}});
 const page=await ctx.newPage();
 const errors=[];
 page.on('pageerror',e=>{errors.push(e.stack||e.message); console.error('PAGE',e.stack||e.message);});
 await page.goto('http://127.0.0.1:4559/#news');
 const source=page.locator('.sci-journal'), query=page.locator('.sci-query'), status=page.locator('.sci-state').first();
 const find=async (value)=>{await query.fill(value);await page.getByRole('button',{name:'Buscar',exact:true}).click();};
 await query.fill('27276229[uid]');await source.selectOption('pubmed');
 await page.waitForFunction(()=>/resultado(s)? mostrado/.test(document.querySelector('.sci-state')?.textContent),{},{timeout:45000});
 assert.equal(await page.locator('.sci-record').count(),1);
 const title=await page.locator('.sci-record h3').innerText();
 assert.ok(title.includes('Bioluminescence'));
 assert.equal(await page.getByRole('link',{name:'PMID 27276229'}).getAttribute('href'),'https://pubmed.ncbi.nlm.nih.gov/27276229/');
 const widthOk=await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1);
 assert.equal(widthOk,true,'news mobile width');
 console.log('Búsqueda y ficha móvil:',await status.innerText(),title);
 await page.getByRole('button',{name:'Consultar resumen'}).click();
 await page.getByRole('heading',{name:'Resumen original en inglés'}).waitFor({timeout:25000});
 assert.equal(await page.getByRole('link',{name:'CC BY 4.0',exact:true}).getAttribute('href'),'https://creativecommons.org/licenses/by/4.0/');
 const text=await page.locator('.sci-abstract p[lang=en]').allInnerTexts();
 assert.ok(text.join(' ').length>900);
 await page.getByRole('button',{name:'Practicar este resumen con Lumi'}).click();
 await page.locator('.sci-context').waitFor();
 assert.ok((await page.locator('.sci-context blockquote').textContent()).includes(text[0].slice(0,40)));
 console.log('Resumen y tutor: licencia, atribución y',text.join(' ').length,'caracteres leídos.');
 await page.evaluate(()=>{location.hash='news';});
 await page.waitForFunction(()=>document.querySelector('.sci-state')?.textContent.includes('Consulta guardada'),{},{timeout:10000});
 await page.route('**/api/news?**',route=>route.abort());
 await find('27276229[uid]');
 await page.waitForFunction(()=>document.querySelector('.sci-state')?.textContent.includes('no respondió'));
 assert.equal(await page.locator('.sci-record').count(),1);
 console.log('Actualización sin red:',await status.innerText());
 await find('123abcqwertylostnetwork');
 await page.waitForFunction(()=>document.querySelector('.sci-state')?.textContent.includes('selección editorial'));
 assert.ok(await page.locator('.sci-record').count()>=2);
 console.log('Sin caché ni red:',await status.innerText());
 await page.unroute('**/api/news?**');
 await find('xyzqvnlumaunmatched349876');
 await page.getByRole('heading',{name:'Sin resultados'}).waitFor({timeout:45000});
 assert.equal(await page.locator('.sci-record').count(),0);
 console.log('Búsqueda sin coincidencias:',await status.innerText());
 await page.setViewportSize({width:1320,height:800});
 for (const [id,name,topic] of [['0028-0836','Nature','photosynthesis'],['0036-8075','Science','climate']]) {
   await query.fill(topic);await source.selectOption(id);
   await page.waitForFunction(()=>document.querySelector('.sci-state')?.textContent.includes('resultados mostrados'),{},{timeout:55000});
   assert.equal(await page.locator('.sci-record').count(),8);
   assert.ok((await page.locator('.sci-record .sci-meta').first().innerText()).includes(name));
   console.log('Búsqueda de revista en escritorio:',await status.innerText());
 }
 const hasOutput=await page.evaluate(()=>document.documentElement.scrollWidth<=window.innerWidth+1);
 assert.ok(hasOutput);
 console.log('Errores de aplicación',errors);
 assert.deepEqual(errors,[]);
} finally {await browser.close();}

