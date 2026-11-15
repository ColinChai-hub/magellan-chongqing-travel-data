#!/usr/bin/env python3
"""Public reachability and metadata checks for the Magellan Open Data release.

Read-only checks. No credentials or external Python dependencies required.
Run locally: python3 scripts/audit_public_site.py
"""
import csv
import io
import json
import re
import sys
from urllib.request import Request, urlopen
from xml.etree import ElementTree as ET

SITE = "https://magellanchongqing.com"
PAGE = SITE + "/open-data/"
REPO = "https://github.com/ColinChai-hub/magellan-chongqing-travel-data"
RAW = "https://raw.githubusercontent.com/ColinChai-hub/magellan-chongqing-travel-data/main/"
HEADERS = {"User-Agent": "MagellanOpenDataAudit/1.0 (+https://github.com/ColinChai-hub/magellan-chongqing-travel-data)"}
ERRORS = []


def fetch(url, limit=1_500_000):
    request = Request(url, headers=HEADERS)
    with urlopen(request, timeout=20) as response:
        if response.status != 200:
            raise RuntimeError(f"HTTP {response.status}")
        body = response.read(limit + 1)
        if len(body) > limit:
            raise RuntimeError(f"Response exceeds {limit} bytes")
        return body.decode("utf-8-sig")


def check(name, action):
    try:
        result = action()
        print(f"PASS {name}" + (f" — {result}" if result else ""))
    except Exception as exc:
        ERRORS.append((name, str(exc)))
        print(f"FAIL {name}: {exc}")


def ensure(condition, message):
    if not condition:
        raise AssertionError(message)


def audit_home():
    html = fetch(SITE + "/")
    ensure('href="/open-data/"' in html or "href='" + "/open-data/" + "'" in html,
           "Homepage lacks a visible link to /open-data/")
    return "home page links to Open Data"


def audit_open_data():
    html = fetch(PAGE)
    ensure("<h1>Chongqing Open Travel Data</h1>" in html, "Landing page H1 missing")
    ensure('href="https://magellanchongqing.com/open-data/"' in html,
           "Canonical URL missing")
    ensure("noindex" not in html.lower(), "Noindex detected")
    match = re.search(r'<script type="application/ld\+json">\s*(.*?)\s*</script>', html, re.S)
    ensure(match is not None, "Dataset JSON-LD missing")
    graph = json.loads(match.group(1)).get("@graph", [])
    datasets = [item for item in graph if item.get("@type") == "Dataset"]
    ensure(len(datasets) == 1, "Expected exactly one Dataset JSON-LD entity")
    item = datasets[0]
    ensure(item.get("url") == PAGE, "Dataset URL does not match canonical")
    ensure(item.get("license") == "https://creativecommons.org/licenses/by/4.0/",
           "Dataset licence unexpected")
    downloads = item.get("distribution", [])
    ensure(len(downloads) == 5, f"Expected five DataDownload entries, got {len(downloads)}")
    ensure(all(d.get("contentUrl", "").startswith(RAW + "data/") for d in downloads),
           "Dataset distribution contains an unexpected download URL")
    return f"Dataset JSON-LD OK; {len(downloads)} downloads"


def audit_sitemap():
    xml = fetch(SITE + "/sitemap.xml")
    root = ET.fromstring(xml)
    urls = [el.text for el in root.iter() if el.tag.rsplit("}", 1)[-1] == "loc"]
    ensure(PAGE in urls, "Open Data page missing from sitemap")
    return f"{len(urls)} URLs, Open Data included"


def audit_robots():
    robots = fetch(SITE + "/robots.txt")
    ensure("Sitemap: " + SITE + "/sitemap.xml" in robots, "Sitemap directive missing")
    ensure("Disallow: /" not in robots, "Global Disallow rule found")


def audit_llms():
    text = fetch(SITE + "/llms.txt")
    ensure(PAGE in text, "Open Data page missing from llms.txt")
    ensure(REPO in text, "GitHub repository missing from llms.txt")


def audit_download(path, kind):
    text = fetch(RAW + path)
    if kind == "json":
        data = json.loads(text)
        ensure(isinstance(data, list) and len(data) > 0, "JSON array is empty or invalid")
        return f"{len(data)} JSON records"
    rows = list(csv.DictReader(io.StringIO(text)))
    ensure(len(rows) > 0, "CSV rows missing or invalid")
    return f"{len(rows)} CSV rows"


def main():
    check("Homepage internal link", audit_home)
    check("Open Data page and Dataset JSON-LD", audit_open_data)
    check("XML sitemap", audit_sitemap)
    check("robots.txt", audit_robots)
    check("llms.txt", audit_llms)
    for path, kind in [
        ("data/attractions.csv", "csv"),
        ("data/attractions.json", "json"),
        ("data/itineraries.json", "json"),
        ("data/transport.csv", "csv"),
        ("data/travel-faq.json", "json"),
    ]:
        check("Public download: " + path, lambda p=path, k=kind: audit_download(p, k))
    print(f"\nResult: {10 - len(ERRORS)}/10 passed")
    if ERRORS:
        for name, message in ERRORS:
            print(f" - {name}: {message}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
