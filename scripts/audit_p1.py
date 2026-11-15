#!/usr/bin/env python3
"""Read-only, standard-library P1 SEO/GEO regression test.

Run: python3 scripts/audit_p1.py
Checks the live site, not GA4 or Google/Bing indexing.
"""
import re
import sys
from concurrent.futures import ThreadPoolExecutor, as_completed
from html.parser import HTMLParser
from urllib.request import Request, urlopen

ORIGIN = "https://magellanchongqing.com"
HEADERS = {"User-Agent": "MagellanP1SiteAudit/1.0"}
SOURCES = [
    "/destinations/ciqikou/",
    "/destinations/dazu/",
    "/destinations/hongyadong/",
    "/destinations/jiefangbei/",
    "/destinations/liziba/",
    "/destinations/wulong/",
    "/destinations/yangtze-cableway/",
    "/guides/best-time-to-visit-chongqing/",
    "/guides/chongqing-itinerary-3-days/",
    "/guides/chongqing-travel-guide/",
    "/guides/dazu-rock-carvings-guide/",
    "/guides/how-to-get-around-chongqing/",
    "/guides/things-to-do-in-chongqing/",
    "/guides/what-to-eat-in-chongqing/",
    "/guides/wulong-travel-guide/",
    "/guides/chongqing-photo-spots/",
]
VISA = "/guides/chongqing-240-hour-visa-free-transit-guide/"
RELATED_SOURCES = [
    "/guides/chongqing-travel-guide/",
    "/guides/chongqing-itinerary-3-days/",
    "/guides/things-to-do-in-chongqing/",
    "/guides/dazu-rock-carvings-guide/",
    "/guides/wulong-travel-guide/",
    "/about/",
    "/partner/",
    "/custom-tour/",
    "/tours/chongqing-group-tours/",
]
RELATED_TARGETS = [
    "/destinations/ciqikou/",
    "/destinations/dazu/",
    "/destinations/wulong/",
    "/guides-team/",
    "/reviews/",
]
ENQUIRY_PAGES = [
    "/partner/",
    "/tours/chongqing-group-tours/",
    "/custom-tour/",
    "/tours/chongqing-3-day-private-tour/",
]
ALL = sorted(set(SOURCES + [VISA] + RELATED_SOURCES + RELATED_TARGETS + ENQUIRY_PAGES))
ERRORS = []


class Tags(HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.ids = set()
        self.canonicals = []
        self.robots = []
        self.h1_count = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if a.get("id"):
            self.ids.add(a["id"])
        if tag == "a" and a.get("href"):
            self.links.append(a["href"])
        if tag == "link" and a.get("rel") == "canonical":
            self.canonicals.append(a.get("href", ""))
        if tag == "meta" and a.get("name", "").lower() == "robots":
            self.robots.append(a.get("content", ""))
        if tag == "h1":
            self.h1_count += 1


def get(path):
    request = Request(ORIGIN + path, headers=HEADERS)
    with urlopen(request, timeout=18) as response:
        if response.status != 200:
            raise RuntimeError(f"{path} HTTP {response.status}")
        body = response.read(1_300_000).decode("utf-8-sig")
        return body


def check(condition, message):
    if not condition:
        ERRORS.append(message)
        print("FAIL", message)
    else:
        print("PASS", message)


def main():
    pages = {}
    with ThreadPoolExecutor(max_workers=5) as executor:
        futures = {executor.submit(get, path): path for path in ALL}
        for future in as_completed(futures):
            path = futures[future]
            try:
                html = future.result()
                parsed = Tags()
                parsed.feed(html)
                pages[path] = (html, parsed)
            except Exception as exc:
                ERRORS.append(f"{path}: {exc}")
                print("FAIL", path, exc)

    check(len(pages) == len(ALL), f"{len(pages)}/{len(ALL)} live P1 URLs return HTTP 200")

    for path, (_, parsed) in pages.items():
        check(parsed.canonicals == [ORIGIN + path],
              f"canonical {path}")
        check(parsed.h1_count == 1, f"one H1 {path}")
        check(not any("noindex" in value.lower() for value in parsed.robots),
              f"indexability {path}")

    for path in SOURCES:
        if path not in pages:
            continue
        html, parsed = pages[path]
        check("magellan-p1-sources" in parsed.ids, f"source block {path}")
        check(any(ref.startswith("https://") and (
            "cq.gov.cn" in ref or "unesco.org" in ref or "weather.com.cn" in ref
        ) for ref in parsed.links), f"reputable external reference {path}")

    if VISA in pages:
        html, parsed = pages[VISA]
        check("57 countries" in html and "55+ countries" not in html,
              "visa eligible-country count updated")
        check("00:00 on the day after" in html and "from entry processing" not in html,
              "visa stay calculation corrected")
        check(any("en.nia.gov.cn" in x for x in parsed.links), "visa official NIA reference")

    for target in RELATED_TARGETS:
        if target not in pages:
            continue
        sources = [
            s for s in RELATED_SOURCES
            if s in pages and target in pages[s][1].links
        ]
        check(len(sources) >= 2, f"at least 2 unique contextual inbound sources: {target}")

    for path in ENQUIRY_PAGES:
        if path not in pages:
            continue
        html, parsed = pages[path]
        check("magellan-p1-enquiry" in parsed.ids, f"enquiry planning block {path}")
        check(any("wa.me/" in x for x in parsed.links), f"original WhatsApp quote link {path}")

    print(f"\nP1 audit: {len(ALL)} URLs checked; {len(ERRORS)} failures")
    if ERRORS:
        for error in ERRORS:
            print(" -", error, file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
