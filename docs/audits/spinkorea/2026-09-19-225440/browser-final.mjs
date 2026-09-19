import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createRequire} from 'node:module';
import {createServer} from '../../../../node_modules/vite/dist/node/index.js';
import react from '../../../../node_modules/@vitejs/plugin-react/dist/index.js';
const out=path.dirname(fileURLToPath(import.meta.url));
const root=path.resolve(out,'../../../..');
const require=createRequire(import.meta.url);
const {chromium}=require('C:/Users/dlatj/AppData/Roaming/npm/node_modules/@playwright/cli/node_modules/playwright');
const results=[], blocked=[], errors=[];
const server=await createServer({root,configFile:false,envDir:out,envPrefix:'__AUDIT_UNUSED_',cacheDir:path.join(out,'vite-cache'),plugins:[react()],resolve:{alias:{'@':path.join(root,'src')}},server:{host:'127.0.0.1',port:0,strictPort:false},logLevel:'error'});
await server.listen();const origin=server.resolvedUrls.local[0].replace(/\/$/,'');
const browser=await chromium.launch({headless:true});
const context=await browser.newContext({viewport:{width:1280,height:900},timezoneId:'Asia/Seoul'});
await context.route('**/*',async route=>{const req=route.request();const u=new URL(req.url());if(!['127.0.0.1','spinkorea.kr'].includes(u.hostname)){blocked.push({host:u.hostname,path:u.pathname,hasDummy:(req.url()+(req.postData()||'')).includes('SPK_AUDIT_DUMMY')});await route.abort();}else if(u.pathname.startsWith('/api/')||!['GET','HEAD'].includes(req.method())){blocked.push({host:u.hostname,path:u.pathname,method:req.method()});await route.abort();}else await route.continue();});
const page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));
const body=()=>page.locator('body').innerText();
const visit=async p=>{await page.goto(origin+p);await page.locator('h1').first().waitFor();await page.waitForTimeout(250);};
const record=(id,status,expected,actual)=>{results.push({id,status,expected,actual,at:new Date().toISOString()});console.log(id,status,JSON.stringify(actual).slice(0,300));};
const run=async(id,fn)=>{try{await fn();}catch(e){record(id,'BLOCKED','test completes',e.message.slice(0,450));}};


try {
await run('T12-final',async()=>{await visit('/tools/random-password');const values=[];for(const n of [4,50]){await page.locator('input[type=range]').fill(''+n);await page.waitForTimeout(120);values.push({requested:n,actual:(await page.locator('span.font-mono').innerText()).length});}for(let i=0;i<3;i++)await page.locator('label').filter({has:page.locator('input[type=checkbox]')}).nth(i).click();await page.locator('label').filter({has:page.locator('input[type=checkbox]')}).nth(3).click();record('T12-final',values.every(x=>x.requested===x.actual)&&await page.locator('input[type=checkbox]:checked').count()===1?'PASS':'FAIL','Length bounds; last group cannot be deselected',{values,checked:await page.locator('input[type=checkbox]:checked').count()});});
await run('T16-final',async()=>{await visit('/tools/percentage-calculator');const n=page.locator('input[type=number]');await n.nth(2).fill('10');await n.nth(3).fill('0');await page.waitForTimeout(250);record('T16-final','OBSERVED','Zero denominator behavior',(await body()).slice(0,1150));});
await run('LIVE-random-final',async()=>{await page.goto('https://spinkorea.kr/blog/random-choice-log');await page.waitForFunction(()=>document.body.innerText.includes('참가자 목록와'),{},{timeout:20000});record('LIVE-random-final','OBSERVED','Await real article text',{text:await body()});});
}finally{fs.writeFileSync(path.join(out,'browser-final.json'),JSON.stringify({at:new Date().toISOString(),results,blocked,errors},null,2));await browser.close();await server.close();}
