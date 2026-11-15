// Magellan P1: reversible, scoped supplementary site links and source notes.
// The production magellan-tours Worker is neither replaced nor edited.
// Every page not explicitly mapped is forwarded unchanged.
const LINK_SECTIONS={
  "/guides/chongqing-travel-guide/": {
    "heading": "Go deeper on Chongqing's places",
    "intro": "Compare city neighborhoods with the two World Heritage day-trip options before choosing your travel days.",
    "items": [
      [
        "/destinations/ciqikou/",
        "Ciqikou Old Town",
        "historic riverside streets"
      ],
      [
        "/destinations/dazu/",
        "Dazu Rock Carvings",
        "heritage and religious art"
      ],
      [
        "/destinations/wulong/",
        "Wulong Karst",
        "natural bridges and caves"
      ]
    ]
  },
  "/guides/chongqing-itinerary-3-days/": {
    "heading": "Check the sights behind this route",
    "intro": "These place guides explain what each stop involves, helping you decide whether a city day or a longer excursion fits.",
    "items": [
      [
        "/destinations/ciqikou/",
        "Ciqikou Old Town",
        "old streets and teahouses"
      ],
      [
        "/destinations/wulong/",
        "Wulong Karst",
        "the nature-focused option"
      ],
      [
        "/destinations/dazu/",
        "Dazu Rock Carvings",
        "the culture-focused option"
      ]
    ]
  },
  "/guides/things-to-do-in-chongqing/": {
    "heading": "Planning more than a photo stop?",
    "intro": "For a slower-paced visit, see the separate guide to Ciqikou before adding it to your city itinerary.",
    "items": [
      [
        "/destinations/ciqikou/",
        "Ciqikou Old Town",
        "traditional streets and local culture"
      ]
    ]
  },
  "/guides/wulong-travel-guide/": {
    "heading": "Wulong quick reference",
    "intro": "For a shorter introduction to the geology and location, start with the destination overview.",
    "items": [
      [
        "/destinations/wulong/",
        "Wulong Karst destination overview",
        "natural bridges and karst terrain"
      ]
    ]
  },
  "/guides/dazu-rock-carvings-guide/": {
    "heading": "Dazu quick reference",
    "intro": "Read the compact destination overview if you are comparing the carvings with other Chongqing excursions.",
    "items": [
      [
        "/destinations/dazu/",
        "Dazu Rock Carvings destination overview",
        "UNESCO-listed carved heritage"
      ]
    ]
  },
  "/about/": {
    "heading": "Verify the people and service behind a tour",
    "intro": "Review guide-language arrangements and how to request verifiable company or guest references before engaging us.",
    "items": [
      [
        "/guides-team/",
        "Local guide arrangements",
        "languages and availability"
      ],
      [
        "/reviews/",
        "Company references and guest feedback",
        "verification process"
      ]
    ]
  },
  "/partner/": {
    "heading": "Due diligence for travel agency partners",
    "intro": "Before requesting group quotations, check the local guiding arrangements and the process for verifying company references.",
    "items": [
      [
        "/guides-team/",
        "Local guide arrangements",
        "guide-language requests"
      ],
      [
        "/reviews/",
        "References and feedback",
        "how to verify our service"
      ]
    ]
  },
  "/custom-tour/": {
    "heading": "Plan a tour with verified service details",
    "intro": "Explore guide arrangements and how to request references when comparing private tour operators.",
    "items": [
      [
        "/guides-team/",
        "English-speaking local guides",
        "guide-language arrangements"
      ],
      [
        "/reviews/",
        "References and guest feedback",
        "verify operator information"
      ]
    ]
  },
  "/tours/chongqing-group-tours/": {
    "heading": "What overseas agencies can verify",
    "intro": "Review the local guide arrangements and discuss the full ground-handling scope with our agency team.",
    "items": [
      [
        "/guides-team/",
        "Local guides",
        "guiding for agency groups"
      ],
      [
        "/partner/",
        "B2B ground-handling services",
        "agency quotation process"
      ]
    ]
  }
};
const SOURCE_SECTIONS={};
export default {
  async fetch(request) {
    const url=new URL(request.url);
    if(request.method!=="GET"||url.hostname!=="magellanchongqing.com")return fetch(request);
    const path=url.pathname, links=LINK_SECTIONS[path], sources=SOURCE_SECTIONS[path];
    if(!links && !sources)return fetch(request);
    const upstream=await fetch(request);
    if(!upstream.ok||!/(?:text\/html)/i.test(upstream.headers.get("content-type")||""))return upstream;
    const original=await upstream.text(), headers=new Headers(upstream.headers);
    for(const h of ["content-length","content-encoding","etag","last-modified"])headers.delete(h);
    if(!original.includes("<main")||!original.includes("</main>")){
      headers.set("x-magellan-p1","skipped-main-not-found");
      return new Response(original,{status:upstream.status,headers});
    }
    const blocks=[];
    if(links && !original.includes('id="magellan-p1-related"'))blocks.push(renderLinks(links));
    if(sources && !original.includes('id="magellan-p1-sources"'))blocks.push(renderSources(sources));
    if(!blocks.length)return new Response(original,{status:upstream.status,headers});
    const target=original.includes('<div class="ctaband">')?'<div class="ctaband">':'</main>';
    const page=original.replace(target,blocks.join("\n")+target);
    headers.set("x-magellan-p1","links-and-sources");
    return new Response(page,{status:upstream.status,headers});
  }
};
function escapeText(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function renderLinks(data){
  const items=data.items.map(([path,label,note])=>'<li style="margin:0 0 .5rem"><a href="'+escapeText(path)+'">'+escapeText(label)+'</a> — '+escapeText(note)+'</li>').join('');
  return '<section id="magellan-p1-related" aria-label="Related local travel resources" style="margin:2rem 0;padding:1.25rem 1.5rem;border:1px solid #d8e2db;border-radius:8px;background:#f4f8f5"><h2 style="margin:0 0 .6rem;font-size:1.25rem">'+escapeText(data.heading)+'</h2><p>'+escapeText(data.intro)+'</p><ul style="margin:.75rem 0 0;padding-left:1.5rem">'+items+'</ul></section>';
}
function renderSources(data){
  const items=data.items.map(([url,label,note])=>'<li style="margin:0 0 .5rem"><a href="'+escapeText(url)+'" rel="noopener noreferrer" target="_blank">'+escapeText(label)+'</a> — '+escapeText(note)+'</li>').join('');
  return '<aside id="magellan-p1-sources" aria-label="Source references" style="margin:2rem 0;padding:1.25rem 1.5rem;border:1px solid #d8e2db;border-radius:8px;background:#f8faf8"><h2 style="margin:0 0 .6rem;font-size:1.25rem">Official references and editorial notes</h2><p>References checked on 15 November 2026 by Magellan Chongqing Tours. These sources support the listed heritage, place or planning context; they do not verify every price, timetable, opening hour or personal observation in this independent guide.</p><ul style="margin:.75rem 0;padding-left:1.5rem">'+items+'</ul><p style="font-size:.92rem">Check current details with the official attraction or transport operator before booking.</p></aside>';
}
