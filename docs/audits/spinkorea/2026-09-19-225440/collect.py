import csv,json,re,time,datetime,urllib.request,urllib.error,urllib.parse,xml.etree.ElementTree as ET
from pathlib import Path
from html.parser import HTMLParser
ROOT=Path(__file__).resolve().parents[4]; OUT=Path(__file__).parent
class Parse(HTMLParser):
 def __init__(self):
  super().__init__(); self.links=[];self.meta={};self.canonical='UNKNOWN';self.title='';self.text=[];self.skip=0;self.intitle=False
 def handle_starttag(self,t,a):
  a=dict(a)
  if t in ['script','style']:self.skip+=1
  if t=='title':self.intitle=True
  if t=='a' and 'href' in a:self.links.append(a['href'])
  if t=='meta':self.meta[a.get('name','')]=a.get('content','')
  if t=='link' and a.get('rel')=='canonical':self.canonical=a.get('href','UNKNOWN')
 def handle_endtag(self,t):
  if t in ['script','style']:self.skip=max(0,self.skip-1)
  if t=='title':self.intitle=False
 def handle_data(self,d):
  if self.intitle:self.title+=d
  if not self.skip and d.strip():self.text.append(d.strip())
records={}; evidence=[]; incoming={};hub=set();sitemap=set()
cols='url normalized_key discovered_from content_type title source_file source_publish_state local_route_state http_status final_url redirect_chain canonical meta_robots x_robots_tag robots_access sitemap_included hub_linked incoming_internal_links_in_sample rendered_content_status ad_observation reviewed_at proposed_action evidence notes'.split()
def add(u,origin,**kw):
 if not u.startswith('http'):u='https://spinkorea.kr'+u
 if u not in records:records[u]={k:'UNKNOWN' for k in cols}|{'url':u,'normalized_key':u.split('#')[0],'discovered_from':origin,'proposed_action':'REVIEW','content_type':'blog' if '/blog/' in u else 'tool' if '/tools/' in u else 'page'}
 elif origin not in records[u]['discovered_from']:records[u]['discovered_from']+=';'+origin
 records[u].update(kw)
for f,key in [('site-pages.json','path'),('post-metadata.generated.json','slug'),('post-metadata.runtime.generated.json','slug'),('content-plan.generated.json','slug')]:
 for x in json.loads((ROOT/'src/data'/f).read_text(encoding='utf-8-sig')):
  route=x[key] if key=='path' else '/blog/'+x[key]
  add(route,f,title=x.get('title','UNKNOWN'),source_file='src/data/'+f,source_publish_state=x.get('status',x.get('source','static'))+';date='+x.get('publishAt',x.get('date','UNKNOWN')))
for p in (ROOT/'dist').rglob('index.html'):
 route='/'+p.parent.relative_to(ROOT/'dist').as_posix().strip('.')
 add(route,'existing-dist-unverified-build',local_route_state='EXISTING_ARTIFACT_NOT_FRESH')
class Redirect(urllib.request.HTTPRedirectHandler):
 def redirect_request(self,req,fp,code,msg,headers,newurl):
  self.chain.append({'status':code,'url':req.full_url,'destination':newurl});return super().redirect_request(req,fp,code,msg,headers,newurl)
def fetch(u):
 handler=Redirect();handler.chain=[]
 try:
  try:r=urllib.request.build_opener(handler).open(urllib.request.Request(u,headers={'User-Agent':'SpinKorea-ReadOnly-Audit/1.0'}),timeout=20)
  except urllib.error.HTTPError as e:r=e
  data=r.read().decode('utf-8','replace');p=Parse();p.feed(data)
  ev={'url':u,'at':datetime.datetime.now().astimezone().isoformat(),'status':r.code,'final_url':r.url,'redirect_chain':handler.chain,'canonical':p.canonical,'robots':p.meta.get('robots','ABSENT'),'x_robots_tag':r.headers.get('X-Robots-Tag','ABSENT'),'title':p.title,'links':p.links,'text':'\n'.join(p.text),'ad_script':'adsbygoogle.js' in data,'content_length':len(data)}
  if not u.endswith(('.txt','.xml')):ev['h1_count']=len(re.findall(r'<h1\b',data,re.I))
  evidence.append(ev);add(u,'LIVE_HTTP',http_status=r.code,final_url=r.url,redirect_chain=json.dumps(handler.chain),canonical=p.canonical,meta_robots=ev['robots'],x_robots_tag=ev['x_robots_tag'],title=p.title or 'NON_HTML',ad_observation='SCRIPT_PRESENT;DISPLAY_UNKNOWN' if ev['ad_script'] else 'NO_SCRIPT_IN_HTTP;DISPLAY_UNKNOWN',reviewed_at=ev['at'],evidence='http-evidence.json')
  for l in p.links:
   v=urllib.parse.urljoin(r.url,l)
   if urllib.parse.urlsplit(v).netloc=='spinkorea.kr' and not v.split('?')[0].endswith(('.png','.jpg')):
    add(v,'link:'+u);incoming[v]=incoming.get(v,0)+1
    if u in ['https://spinkorea.kr/','https://spinkorea.kr/tools','https://spinkorea.kr/blog']:hub.add(v)
  print(r.code,u,flush=True)
  if r.code==429:raise SystemExit('429 STOP')
  return data
 except (urllib.error.URLError,TimeoutError) as e:
  evidence.append({'url':u,'error':type(e).__name__});print('FETCH_ERROR',u,flush=True);return ''
 finally:time.sleep(.45)
for path in ['/robots.txt','/sitemap.xml','/rss.xml','/ads.txt','/','/tools','/blog']:
 data=fetch('https://spinkorea.kr'+path)
 if path=='/sitemap.xml':
  sitemap=set(re.findall(r'<loc>(.*?)</loc>',data))
  for u in sitemap:add(u,'LIVE_SITEMAP')
 if path=='/rss.xml':
  for u in re.findall(r'<link>(https://spinkorea.kr[^<]*)</link>',data):add(u,'LIVE_RSS')
paths=['/blog/'+s for s in ['random-choice-log','sleep-optimization','password-strength','css-shadow-design','css-shadow-guide','css-shadow-states','yes-no-oracle-guide','yes-no-reversible-choice','exercise-brain','bmi-limitations','ai-era-skills','boundaries-relationship']]+['/tools/'+s for s in ['text-counter','random-team','random-password','loan-calculator','date-calculator','percentage-calculator','json-formatter','qr-code-generator','sleep-calculator','bmi-calculator','hourly-wage','lotto-generator']]+['/contact','/privacy','/privacy/','/faq','/audit-nonexistent-20260919']
for path in paths:fetch('https://spinkorea.kr'+path)
for u in ['http://spinkorea.kr/','https://www.spinkorea.kr/']:fetch(u)
for u,r in records.items():
 r.update(sitemap_included=str(u in sitemap),hub_linked=str(u in hub),incoming_internal_links_in_sample=incoming.get(u,0))
with (OUT/'url_inventory.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=cols);w.writeheader();w.writerows(sorted(records.values(),key=lambda x:x['url']))
(OUT/'http-evidence.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2),encoding='utf8')
print(json.dumps({'inventory':len(records),'http':len(evidence),'sitemap':len(sitemap),'blog_hub':len([u for u in hub if '/blog/' in u]),'tools_hub':len([u for u in hub if '/tools/' in u])}))
