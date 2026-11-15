#!/usr/bin/env python3
"""P2 regression for public Magellan pages; no credentials/dependencies required.

Verifies image intrinsic dimensions, responsive hero hints, selected SERP snippets,
connected publisher entities, P0/P1 preserved content and indexability. Does not
measure real-user Core Web Vitals, GA4 reporting, search indexing or AI citations.
"""
import concurrent.futures
import html
import json
import re
import sys
from urllib.request import Request, urlopen
from urllib.parse import urlparse
from xml.etree import ElementTree as ET

SITE = "https://magellanchongqing.com"
IMG_PREFIX = "/assets/img/"
ORG_ID = SITE + "/#organization"
WEBSITE_ID = SITE + "/#website"
EXPECTED_TITLES = {
    "/partner/": "Chongqing DMC & Ground Handling for Travel Agents | Magellan",
    "/contact/": "Contact Magellan Chongqing Tours | Trip & Agency Quotes",
    "/reviews/": "Reviews & References | Magellan Chongqing Tours",
    "/guides/best-time-to-visit-chongqing/": "Best Time to Visit Chongqing: Weather & Crowds | Magellan",
    "/guides/chongqing-itinerary-3-days/": "3-Day Chongqing Itinerary: City, Wulong & Dazu | Magellan",
    "/guides/chongqing-travel-guide/": "Chongqing Travel Guide 2026: Sights & Planning | Magellan",
    "/guides/dazu-rock-carvings-guide/": "Dazu Rock Carvings Guide: Baodingshan & Beishan | Magellan",
    "/guides/how-to-get-around-chongqing/": "Getting Around Chongqing: Metro & Cableway | Magellan",
    "/guides/what-to-eat-in-chongqing/": "What to Eat in Chongqing: Hotpot & Xiaomian | Magellan",
    "/guides/wulong-travel-guide/": "Wulong Karst Travel Guide: Bridges & Caves | Magellan",
    "/guides/chongqing-240-hour-visa-free-transit-guide/": "Chongqing 240-Hour Visa-Free Transit Guide | Magellan",
    "/open-data/": "Chongqing Open Travel Data (CSV & JSON) | Magellan",
}
ERRORS = []
HEADERS = {"User-Agent": "MagellanP2PublicAudit/1.0"}


def fetch(url):
    with urlopen(Request(url, headers=HEADERS), timeout=22) as resp:
        if resp.status != 200:
            raise RuntimeError(f"HTTP {resp.status}: {url}")
        return resp.read(1_400_000).decode("utf-8-sig")


def attrs(tag):
    return {k.lower(): html.unescape(a or b)
            for k, a, b in re.findall(r'([\w:-]+)\s*=\s*(?:"([^"]*)"|\'([^\']*)\')', tag)}


def verify_page(url):
    source = fetch(url)
    path = urlparse(url).path
    title = re.search(r'<title\b[^>]*>(.*?)</title>', source, re.I | re.S)
    if not title:
        raise AssertionError("No <title>")
    real_title = html.unescape(title.group(1))
    if path in EXPECTED_TITLES and real_title != EXPECTED_TITLES[path]:
        raise AssertionError(f"Unexpected title: {real_title}")
    links = [attrs(x.group(0)) for x in re.finditer(r'<link\b[^>]*>', source, re.I)]
    canonical = [x.get("href") for x in links if x.get("rel", "").lower() == "canonical"]
    if canonical != [url]:
        raise AssertionError(f"Canonical mismatch: {canonical}")
    h1 = len(re.findall(r'<h1\b', source, re.I))
    if h1 != 1:
        raise AssertionError(f"H1 count = {h1}")
    metas = [attrs(x.group(0)) for x in re.finditer(r'<meta\b[^>]*>', source, re.I)]
    if any("noindex" in x.get("content", "").lower() for x in metas
           if x.get("name", "").lower() == "robots"):
        raise AssertionError("Unexpected noindex")

    images = [attrs(x.group(0)) for x in re.finditer(r'<img\b[^>]*>', source, re.I)]
    for img in images:
        if not img.get("src", "").startswith(IMG_PREFIX):
            continue
        w, h = img.get("width", ""), img.get("height", "")
        if not (w.isdigit() and h.isdigit() and int(w) > 0 and int(h) > 0):
            raise AssertionError(f"Missing image dimensions: {img['src']}")
        if "bg" in img.get("class", "").split():
            if img.get("fetchpriority") != "high":
                raise AssertionError(f"Hero not high priority: {img['src']}")
            if not img.get("srcset"):
                raise AssertionError(f"Hero missing responsive srcset: {img['src']}")

    scripts = [x.group(1) for x in re.finditer(
        r'<script\b[^>]*type=["\']application/ld\+json["\'][^>]*>([\s\S]*?)</script>',
        source, re.I)]
    objects = []
    for script in scripts:
        obj = json.loads(script)
        objects.extend(obj.get("@graph", [obj]))

    if path == "/open-data/":
        dataset = next((x for x in objects if x.get("@type") == "Dataset"), None)
        if not dataset:
            raise AssertionError("Dataset JSON-LD missing")
        if dataset.get("creator", {}).get("@id") != ORG_ID or dataset.get("publisher", {}).get("@id") != ORG_ID:
            raise AssertionError("Dataset creator/publisher entity ID mismatch")
        if dataset.get("spatialCoverage", {}).get("name") != "Chongqing, China":
            raise AssertionError("Dataset geographic coverage missing")
    elif path != "/":
        org = next((x for x in objects if x.get("@id") == ORG_ID), None)
        website = next((x for x in objects if x.get("@id") == WEBSITE_ID), None)
        webpage = next((x for x in objects if x.get("@type") == "WebPage"), None)
        if not org or not website or not webpage:
            raise AssertionError("Expected Organization/WebSite/WebPage graph nodes missing")
        if website.get("publisher", {}).get("@id") != ORG_ID:
            raise AssertionError("WebSite.publisher not linked")
        if webpage.get("publisher", {}).get("@id") != ORG_ID:
            raise AssertionError("WebPage.publisher not linked")
        if webpage.get("isPartOf", {}).get("@id") != WEBSITE_ID:
            raise AssertionError("WebPage.isPartOf not linked")

    if path == "/":
        if "Open Travel Data (CSV" not in source:
            raise AssertionError("Homepage Open Data discovery link missing")
        # The initial image is already in HTML with fetchpriority=high.
        # The redundant preload previously caused two hero JPEG requests on mobile.
        if 'imagesrcset="/assets/img/chaotianmen-m.jpg' in source:
            raise AssertionError("English homepage redundant hero preload returned")
    if path in ("/zh-cn/", "/zh-tw/") and 'imagesrcset="/assets/img/chaotianmen-m.jpg' not in source:
        raise AssertionError("Localized homepage hero preload missing")
    if path == "/guides/chongqing-240-hour-visa-free-transit-guide/":
        if "57 countries" not in source or "00:00 on the day after" not in source:
            raise AssertionError("P0 visa-policy content regressed")
    if path == "/partner/" and ('id="magellan-p1-enquiry"' not in source or "wa.me/" not in source):
        raise AssertionError("P1 partnership enquiry regressed")
    return {"url": url, "images": len(images), "heroes": sum("bg" in x.get("class", "").split() for x in images)}


def main():
    root = ET.fromstring(fetch(SITE + "/sitemap.xml"))
    urls = [node.text for node in root.iter()
            if node.tag.rsplit("}", 1)[-1] == "loc" and node.text and node.text.startswith(SITE)]
    if len(urls) < 60 or len(set(urls)) != len(urls):
        raise AssertionError(f"Sitemap missing pages or contains duplicates: {len(urls)}")
    found = []
    with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
        futures = {pool.submit(verify_page, url): url for url in urls}
        for future in concurrent.futures.as_completed(futures):
            url = futures[future]
            try:
                found.append(future.result())
            except Exception as exc:
                ERRORS.append(f"{url}: {exc}")
    for error in ERRORS:
        print("FAIL", error, file=sys.stderr)
    count_imgs = sum(x["images"] for x in found)
    count_heroes = sum(x["heroes"] for x in found)
    print(f"P2 audit: {len(found)}/{len(urls)} URLs OK; {count_imgs} image tags, "
          f"{count_heroes} hero images; {len(ERRORS)} failures")
    if ERRORS:
        sys.exit(1)


if __name__ == "__main__":
    main()
