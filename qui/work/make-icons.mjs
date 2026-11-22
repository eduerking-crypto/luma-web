import { chromium } from "./browser-qa/node_modules/playwright-core/index.mjs";
import {readFile} from 'node:fs/promises';
const path="work/luma-release/public/assets/";
const svg=await readFile(path+"luma.svg","utf8");
const browser=await chromium.launch({executablePath:"C:/Program Files/Google/Chrome/Application/chrome.exe",headless:true});
try {
 for(const [name,size,scaled] of [["luma-192",192,.96],["luma-512",512,.96],["luma-maskable",512,.75],["luma-touch",180,.90]]){
   const page=await browser.newPage({viewport:{width:size,height:size},deviceScaleFactor:1});
   await page.setContent('<style>*{box-sizing:border-box}body{margin:0;background:#6455ca;display:grid;height:100vh;place-items:center}svg{width:'+Math.round(scaled*size)+'px}</style>'+svg);
   await page.screenshot({path:path+name+'.png'});await page.close();
 }
}finally{await browser.close()}

