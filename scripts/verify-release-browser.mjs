import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {createRequire} from 'node:module';
import {preview} from 'vite';
const require=createRequire(import.meta.url);
const {chromium}=require(path.join(process.env.APPDATA,'npm/node_modules/@playwright/cli/node_modules/playwright'));
const out=path.resolve('output/release-20261023');fs.mkdirSync(out,{recursive:true});
const live=process.env.RELEASE_BASE_URL;
const server=live?null:await preview({preview:{host:'127.0.0.1',port:0},logLevel:'error'});
const origin=(live??server.resolvedUrls.local[0]).replace(/\/$/,'');
const shells=fs.readdirSync(path.join(process.env.LOCALAPPDATA,'ms-playwright')).sort().reverse();
const executablePath=shells.map(d=>path.join(process.env.LOCALAPPDATA,'ms-playwright',d,'chrome-headless-shell-win64/chrome-headless-shell.exe')).find(fs.existsSync);
const browser=await chromium.launch({headless:true,executablePath});
const results=[],errors=[],adRequests=[];
async function context(options={}){
 const c=await browser.newContext({...options,reducedMotion:'reduce'});
 await c.route('**/*',r=>{const url=r.request().url();if(/googlesyndication|doubleclick/.test(url))adRequests.push(url);return url.startsWith(origin)&&['GET','HEAD'].includes(r.request().method())?r.continue():r.abort();});
 return c;
}
try{
 for(let run=1;run<=3;run++){
  const c=await context({viewport:{width:390,height:844},isMobile:true,hasTouch:true});const p=await c.newPage();const cdp=await c.newCDPSession(p);
  await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
  await cdp.send('Network.emulateNetworkConditions',{offline:false,latency:150,downloadThroughput:1600000/8,uploadThroughput:750000/8});
  await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
  await p.addInitScript(()=>{window.__perf={lcp:0,cls:0,longTasks:[]};new PerformanceObserver(list=>{for(const e of list.getEntries())window.__perf.lcp=e.startTime;}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())if(!e.hadRecentInput)window.__perf.cls+=e.value;}).observe({type:'layout-shift',buffered:true});new PerformanceObserver(list=>{for(const e of list.getEntries())window.__perf.longTasks.push(e.duration);}).observe({type:'longtask',buffered:true});});
  await p.goto(origin);await p.getByRole('button',{name:'1명 추첨하기',exact:true}).waitFor();await p.waitForLoadState('networkidle');await p.waitForTimeout(1000);
  const perf=await p.evaluate(()=>({...window.__perf,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime,transferredBytes:performance.getEntriesByType('resource').reduce((s,r)=>s+r.transferSize,0)}));
  results.push({type:'lab-mobile',run,cpuSlowdown:4,latencyMs:150,downloadMbps:1.6,...perf});await c.close();
 }
 const c=await context({viewport:{width:390,height:844},isMobile:true,hasTouch:true,permissions:['clipboard-read','clipboard-write']});const p=await c.newPage();p.on('pageerror',e=>errors.push(e.message));
 await p.goto(origin);await p.getByRole('button',{name:'명단 수정',exact:true}).tap();await p.locator('#home-mobile-list').fill('출시점검 A\n출시점검 B\n출시점검 C');await p.getByRole('button',{name:'명단 저장',exact:true}).tap();await p.locator('#home-count-mobile').fill('2');await p.getByRole('button',{name:'2명 추첨하기',exact:true}).tap();await p.getByRole('region',{name:'현재 추첨 결과'}).waitFor();await p.getByRole('button',{name:'결과와 조건 복사',exact:true}).tap();
 const clipboard=await p.evaluate(()=>navigator.clipboard.readText());assert.match(clipboard,/2명 추첨/);assert.match(clipboard,/추첨 시작 후보 3명/);results.push({type:'touch-and-real-browser-clipboard',pass:true});
 await p.getByRole('button',{name:'발표 모드',exact:true}).tap();const dialog=p.getByRole('dialog');await p.keyboard.press('Tab');assert.equal(await dialog.evaluate(e=>e.contains(document.activeElement)),true);await p.keyboard.press('Escape');await p.screenshot({path:path.join(out,live?'live-mobile.png':'built-mobile.png')});
 const cdp=await c.newCDPSession(p);await cdp.send('Accessibility.enable');const ax=await cdp.send('Accessibility.getFullAXTree');const unnamed=ax.nodes.filter(n=>!n.ignored&&['button','link','textbox','spinbutton','checkbox','combobox'].includes(n.role?.value)&&!n.name?.value?.trim());assert.equal(unnamed.length,0,JSON.stringify(unnamed));results.push({type:'home-accessibility-tree',unnamedInteractive:unnamed.length,nodes:ax.nodes.length});
 for(const route of ['/','/blog','/blog/random-choice-log','/tools','/tools/net-salary','/tools/severance-pay','/tools/random-team','/tools/random-password','/privacy','/faq','/spinflow/lunch']){
  const response=await p.goto(origin+route);await p.locator('h1').waitFor();assert.equal(response.status(),200,route);assert.equal(await p.locator('h1').count(),1,route);assert.equal(await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false,route);
  const canonical=await p.locator('link[rel=canonical]').getAttribute('href');results.push({type:'route',route,status:response.status(),h1:1,canonical});
 }
 if(live){const r=await p.goto(origin+'/spinflow/release-nonexistent-example');assert.equal(r.status(),404);results.push({type:'unknown-route',status:r.status()});}
 await c.close();assert.equal(errors.length,0);assert.equal(adRequests.length,0);
 const report={origin,physicalDevice:'unavailable: adb list empty',screenReader:'not exercised; Chromium AX tree only',results,errors,adRequests};fs.writeFileSync(path.join(out,live?'live.json':'local.json'),JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
}finally{await browser.close();await server?.httpServer.close();}
