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
await run('T04-recheck',async()=>{await visit('/tools/json-formatter');await page.locator('#json-formatter-1').fill('{"x":1,}');await page.getByRole('button',{name:/정렬.*2|포맷.*2/}).first().click();await page.waitForTimeout(250);const error=await page.locator('.text-red-400.text-xs').innerText();record('T04-recheck',error.length?'PASS':'FAIL','Parser error displayed; initial test looked for wrong localized toast',error);});
await run('T09-recheck',async()=>{await visit('/tools/date-calculator');await page.locator('input[type=date]').nth(0).fill('2024-02-28');await page.locator('input[type=date]').nth(1).fill('2024-02-28');const t=await body();record('T09-recheck',t.includes('시작일과 종료일이 같습니다.')?'PASS':'FAIL','Same-day message (initial matcher was wrong)',t.includes('시작일과 종료일이 같습니다.'));});
await run('T12-recheck',async()=>{await visit('/tools/random-password');const values=[];for(const n of [4,50]){await page.locator('input[type=range]').fill(''+n);await page.waitForTimeout(100);values.push({requested:n,actual:(await page.locator('span.font-mono').innerText()).length});}for(let i=0;i<3;i++)await page.locator('input[type=checkbox]').nth(i).uncheck({force:true});await page.locator('input[type=checkbox]').nth(3).uncheck({force:true}).catch(()=>{});record('T12-recheck',values.every(x=>x.requested===x.actual)&&await page.locator('input[type=checkbox]:checked').count()===1?'PASS':'FAIL','Length bounds and last character group retained',{values,checked:await page.locator('input[type=checkbox]:checked').count()});});
await run('T15-percentage',async()=>{await visit('/tools/percentage-calculator');const n=page.locator('input[type=number]');await n.nth(4).fill('100');await n.nth(5).fill('110');await page.waitForTimeout(80);const before=(await body()).match(/변화율\s*[^\n]+/)?.[0];await n.nth(4).fill('0');await page.waitForTimeout(80);const after=(await body()).match(/변화율\s*[^\n]+/)?.[0];record('T15',before===after?'FAIL':'PASS','Changing denominator to zero invalidates old result',{before,after});await n.nth(2).fill('10');await n.nth(3).fill('0');record('T16',/∞|Infinity/.test(await body())?'FAIL':'PASS','Division by zero has explicit unsupported-input state',{infinite:/∞|Infinity/.test(await body())});});
await run('T17-copy-success',async()=>{await visit('/tools/text-counter');await page.locator('textarea').fill('SPK_AUDIT_DUMMY');await page.evaluate(()=>Object.defineProperty(navigator,'clipboard',{configurable:true,value:{writeText:async(t)=>{window.auditClipboard=t;}}}));await page.getByTitle('전체 복사').click();record('T17',await page.evaluate(()=>window.auditClipboard==='SPK_AUDIT_DUMMY')?'PASS':'FAIL','Mock clipboard resolves and receives identical dummy',{mock:true});});
await run('LIVE-random-complete',async()=>{await page.goto('https://spinkorea.kr/blog/random-choice-log');await page.getByText('글 본문을 불러오고 있습니다.').waitFor({state:'hidden',timeout:20000});await page.waitForTimeout(300);const t=await body();record('LIVE-random-complete','OBSERVED','Wait generated article chunk before judging',{text:t,hasParticles:['목록와','설정를','기록가'].map(s=>[s,t.includes(s)])});});
}finally{fs.writeFileSync(path.join(out,'browser-followup.json'),JSON.stringify({at:new Date().toISOString(),results,blocked,errors},null,2));await browser.close();await server.close();}
