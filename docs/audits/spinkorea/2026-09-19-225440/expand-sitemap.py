from pathlib import Path
import csv,json
exec(Path(__file__).with_name('collect.py').read_text(encoding='utf8').split("for path in ['/robots.txt'")[0])
records={x['url']:x for x in csv.DictReader((OUT/'url_inventory.csv').open(encoding='utf-8-sig'))}
evidence=json.loads((OUT/'http-evidence.json').read_text(encoding='utf8'))
known={x['url'] for x in evidence}
targets=[u for u,x in records.items() if x['sitemap_included']=='True' and u not in known]
for u in targets:
 fetch(u)
for u,r in records.items():
 if r['sitemap_included']=='UNKNOWN':r['sitemap_included']='False'
 if r['hub_linked']=='UNKNOWN':r['hub_linked']='UNKNOWN'
with (OUT/'url_inventory.csv').open('w',encoding='utf-8-sig',newline='') as f:
 w=csv.DictWriter(f,fieldnames=cols);w.writeheader();w.writerows(sorted(records.values(),key=lambda x:x['url']))
(OUT/'http-evidence.json').write_text(json.dumps(evidence,ensure_ascii=False,indent=2),encoding='utf8')
print('HTTP TOTAL',len(evidence),'INVENTORY',len(records))
