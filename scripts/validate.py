#!/usr/bin/env python3
"""Validate the initial Magellan Chongqing travel datasets using stdlib only."""
import csv, json, re, sys
from pathlib import Path
from datetime import date
from urllib.parse import urlparse
ROOT=Path(__file__).resolve().parents[1]
errors=[]
def err(s):errors.append(s)
def loadj(path):
    with (ROOT/path).open(encoding='utf-8') as f:return json.load(f)
def loadcsv(path):
    with (ROOT/path).open(encoding='utf-8',newline='') as f:return list(csv.DictReader(f))
def check_url(value,where):
    u=urlparse(value)
    if u.scheme!='https' or not u.netloc:err(f'{where}: invalid HTTPS source URL: {value}')
def check_date(value,where):
    try:date.fromisoformat(value)
    except Exception:err(f'{where}: invalid ISO date {value}')
def unique(records,where):
    ids=[r.get('id') for r in records]
    if len(ids)!=len(set(ids)):err(f'{where}: duplicate IDs')
    for id_ in ids:
        if not re.fullmatch(r'[a-z][a-z0-9_]*',id_ or ''):err(f'{where}: invalid id {id_}')

a=loadj('data/attractions.json'); ac=loadcsv('data/attractions.csv')
if len(a)!=len(ac):err('Attraction CSV/JSON counts differ')
unique(a,'attractions'); unique(ac,'attractions CSV')
if {x['id'] for x in a}!={x['id'] for x in ac}:err('Attraction CSV/JSON IDs differ')
for rec in a:
    row=next((x for x in ac if x['id']==rec['id']),None)
    if row:
        for k,v in rec.items():
            if str(v).lower()!=str(row.get(k,'')).lower():err(f'CSV/JSON mismatch {rec["id"]}.{k}')
    check_url(rec['source_url'],rec['id']);check_date(rec['last_source_checked'],rec['id'])
    if rec['live_hours_or_prices_included'] is not False:err(f'{rec["id"]}: live data flag must be false')
ids={x['id'] for x in a}
its=loadj('data/itineraries.json');unique(its,'itineraries')
for rec in its:
    if rec['duration_days']!=len(rec['days']):err(f'{rec["id"]}: duration mismatch')
    if rec['is_commercial_tour'] is not False:err(f'{rec["id"]}: illustrative tour must not be commercial')
    for day in rec['days']:
        for stop in day['stops']:
            if stop not in ids:err(f'{rec["id"]}: unknown stop {stop}')
tr=loadcsv('data/transport.csv');unique(tr,'transport')
for rec in tr:check_url(rec['source_url'],rec['id']);check_date(rec['last_source_checked'],rec['id'])
faq=loadj('data/travel-faq.json');unique(faq,'faq')
for rec in faq:check_url(rec['source_url'],rec['id']);check_date(rec['last_source_checked'],rec['id'])
if errors:
    for e in errors:print('ERROR:',e)
    sys.exit(1)
print(f'PASS: {len(a)} attractions, {len(its)} itineraries, {len(tr)} transport records, {len(faq)} FAQs')
