// Magellan P1: reversible, scoped supplementary site links and source notes.
// The production magellan-tours Worker is neither replaced nor edited.
// Every page not explicitly mapped is forwarded unchanged.
const ENQUIRY_SECTIONS={
  "/partner/": {
    "heading": "Prepare a travel-agency ground-handling enquiry",
    "intro": "For an agency quotation, share your company and market, expected group size, travel dates and flight information, hotel standard, guide language, dining needs and preferred destinations. Final inclusions and trade terms are confirmed in the written quotation.",
    "links": [
      [
        "/tours/chongqing-group-tours/",
        "Compare 3–5 day group route examples"
      ],
      [
        "/contact/",
        "Contact the Chongqing ground-handling team"
      ]
    ]
  },
  "/tours/chongqing-group-tours/": {
    "heading": "From sample route to group quotation",
    "intro": "Our three-to-five-day combinations are illustrative. Provide your agency market, arrival/departure transport, group size, hotel category, guide language and any special requirements for a tailored ground-handling proposal.",
    "links": [
      [
        "/partner/",
        "Overseas agency cooperation details"
      ],
      [
        "/contact/",
        "Send your group enquiry"
      ]
    ]
  },
  "/custom-tour/": {
    "heading": "What to include in a private-tour request",
    "intro": "To plan a realistic Chongqing trip, share your travel dates, passenger count, age or mobility considerations, hotel area, pace and preferred attractions. We will confirm specific services and terms before any booking.",
    "links": [
      [
        "/tours/chongqing-3-day-private-tour/",
        "Explore a flexible three-day plan"
      ],
      [
        "/contact/",
        "Contact the private-tour team"
      ]
    ]
  },
  "/tours/chongqing-3-day-private-tour/": {
    "heading": "Make this sample itinerary your own",
    "intro": "The three-day route is a planning example, not a confirmed departure. Tell us your dates, hotel location, travel pace and whether you prefer Wulong nature or Dazu cultural heritage.",
    "links": [
      [
        "/custom-tour/",
        "See private-tour customization options"
      ],
      [
        "/contact/",
        "Ask about a tailored itinerary"
      ]
    ]
  }
};
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
const SOURCE_SECTIONS={
  "/destinations/ciqikou/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912574.html",
        "Chongqing Municipal Government — Ciqikou Ancient Town",
        "heritage area and access context"
      ]
    ]
  },
  "/destinations/dazu/": {
    "items": [
      [
        "https://whc.unesco.org/en/list/912",
        "UNESCO World Heritage Centre — Dazu Rock Carvings",
        "inscription and heritage significance"
      ]
    ]
  },
  "/destinations/hongyadong/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912600.html",
        "Chongqing Municipal Government — Hongyadong",
        "location, architecture and visitor orientation"
      ]
    ]
  },
  "/destinations/jiefangbei/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912652.html",
        "Chongqing Municipal Government — Jiefangbei",
        "monument and central district background"
      ]
    ]
  },
  "/destinations/liziba/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912642.html",
        "Chongqing Municipal Government — Liziba Station",
        "monorail station and visitor viewing area"
      ]
    ]
  },
  "/destinations/wulong/": {
    "items": [
      [
        "https://whc.unesco.org/en/list/1248/",
        "UNESCO World Heritage Centre — South China Karst",
        "Wulong heritage inscription and geology"
      ],
      [
        "https://english.cq.gov.cn/aboutchongqing/culture/NaturalHeritage/202606/t20260612_15751145.html",
        "Chongqing Municipal Government — Wulong",
        "the main karst tourism areas"
      ]
    ]
  },
  "/destinations/yangtze-cableway/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912630.html",
        "Chongqing Municipal Government — Yangtze Cableway",
        "location and historical transport context; recheck operating hours"
      ]
    ]
  },
  "/guides/best-time-to-visit-chongqing/": {
    "items": [
      [
        "https://www.weather.com.cn/html/cityintro_en/101040100.shtml",
        "China Weather / Public Weather Service Center — Chongqing climate",
        "long-term seasonal climate patterns, not a live weather forecast"
      ]
    ]
  },
  "/guides/chongqing-itinerary-3-days/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912574.html",
        "Chongqing Municipal Government — Ciqikou",
        "city heritage stop"
      ],
      [
        "https://whc.unesco.org/en/list/1248/",
        "UNESCO World Heritage Centre — South China Karst",
        "Wulong nature-trip option"
      ],
      [
        "https://whc.unesco.org/en/list/912",
        "UNESCO World Heritage Centre — Dazu Rock Carvings",
        "Dazu culture-trip option"
      ]
    ]
  },
  "/guides/chongqing-travel-guide/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/",
        "Chongqing Municipal Government — Explore",
        "official destination and attraction directory"
      ],
      [
        "https://english.cq.gov.cn/services/entryandexit/",
        "Chongqing Municipal Government — Entry & Exit",
        "official immigration information; check policy before travel"
      ]
    ]
  },
  "/guides/dazu-rock-carvings-guide/": {
    "items": [
      [
        "https://whc.unesco.org/en/list/912",
        "UNESCO World Heritage Centre — Dazu Rock Carvings",
        "date range and historical importance of carved sites"
      ]
    ]
  },
  "/guides/how-to-get-around-chongqing/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912642.html",
        "Chongqing Municipal Government — Liziba Station",
        "Line 2 monorail station context"
      ],
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912630.html",
        "Chongqing Municipal Government — Yangtze Cableway",
        "cross-river transport landmark; verify live service notices"
      ]
    ]
  },
  "/guides/things-to-do-in-chongqing/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/",
        "Chongqing Municipal Government — Explore",
        "official city sights directory"
      ],
      [
        "https://whc.unesco.org/en/list/912",
        "UNESCO World Heritage Centre — Dazu",
        "heritage visit option"
      ],
      [
        "https://whc.unesco.org/en/list/1248/",
        "UNESCO World Heritage Centre — Wulong",
        "nature visit option"
      ]
    ]
  },
  "/guides/what-to-eat-in-chongqing/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/Eat/DiscoverLocalFood/202608/t20260818_15947625.html",
        "Chongqing Municipal Government — Chongqing hot pot",
        "culinary background and local food culture"
      ]
    ]
  },
  "/guides/wulong-travel-guide/": {
    "items": [
      [
        "https://whc.unesco.org/en/list/1248/",
        "UNESCO World Heritage Centre — South China Karst",
        "Wulong landscape and world heritage inscription"
      ],
      [
        "https://english.cq.gov.cn/specials/explore/ARatedTouristAttractions/202608/t20260818_15948246.html",
        "Chongqing Municipal Government — Wulong tourism area",
        "Three Natural Bridges, Fairy Mountain and Furong Cave"
      ]
    ]
  },
  "/guides/chongqing-photo-spots/": {
    "items": [
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912642.html",
        "Chongqing Municipal Government — Liziba viewpoint",
        "photo viewing platform"
      ],
      [
        "https://english.cq.gov.cn/specials/explore/PhotoPerfectSpots/202608/t20260810_15912600.html",
        "Chongqing Municipal Government — Hongyadong",
        "cliffside architecture and location"
      ]
    ]
  }
};
export default {
  async fetch(request) {
    const url=new URL(request.url);
    if(request.method!=="GET"||url.hostname!=="magellanchongqing.com")return fetch(request);
    const path=url.pathname, links=LINK_SECTIONS[path], sources=SOURCE_SECTIONS[path], enquiry=ENQUIRY_SECTIONS[path];
    if(!links && !sources && !enquiry)return fetch(request);
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
    if(enquiry && !original.includes('id="magellan-p1-enquiry"'))blocks.push(renderEnquiry(enquiry));
    if(sources && !original.includes('id="magellan-p1-sources"'))blocks.push(renderSources(sources));
    if(!blocks.length)return new Response(original,{status:upstream.status,headers});
    const target=original.includes('<div class="ctaband">')?'<div class="ctaband">':'</main>';
    const page=p2OptimizeImages(original.replace(target,blocks.join("\n")+target));
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

function renderEnquiry(data){
  const nav=data.links.map(([href,label])=>'<li style="margin-bottom:.45rem"><a href="'+escapeText(href)+'">'+escapeText(label)+'</a></li>').join('');
  return '<section id="magellan-p1-enquiry" aria-label="Tour enquiry planning" style="margin:2rem 0;padding:1.25rem 1.5rem;border-left:4px solid #0b5941;background:#f5f8f6"><h2 style="margin:0 0 .6rem;font-size:1.25rem">'+escapeText(data.heading)+'</h2><p>'+escapeText(data.intro)+'</p><ul style="padding-left:1.5rem;margin:.75rem 0 0">'+nav+'</ul></section>';
}

// Magellan P2 image optimization (pixel sizes measured on live assets, 2026-11-15).
// Keep these maps in sync with the actual /assets/img/ files.
const P2_IMAGE_DIMS={
  "/assets/img/chaotianmen.jpg":[1672,941],
  "/assets/img/skyline.jpg":[1600,1066],
  "/assets/img/wulong-gorge.jpg":[1504,1000],
  "/assets/img/dazu.jpg":[1600,1029],
  "/assets/img/home-hero.jpg":[1672,941],
  "/assets/img/ciqikou.jpg":[1600,1201],
  "/assets/img/jiefangbei.jpg":[1600,1066],
  "/assets/img/liziba.jpg":[1600,1068],
  "/assets/img/cableway.jpg":[1600,1075],
  "/assets/img/hero-hongyadong.jpg":[1600,1200],
  "/assets/img/hotpot.jpg":[1600,1066]
};
const P2_VERIFIED_MOBILE=new Set([
  "chaotianmen.jpg","skyline.jpg","wulong-gorge.jpg","dazu.jpg",
  "home-hero.jpg","ciqikou.jpg","jiefangbei.jpg","liziba.jpg",
  "cableway.jpg","hero-hongyadong.jpg"
]);
function p2ImageData(src){
  if(!src)return null;
  try{
    const u=new URL(src,"https://magellanchongqing.com");
    if(u.host!=="magellanchongqing.com")return null;
    return {path:u.pathname,size:P2_IMAGE_DIMS[u.pathname]};
  }catch(e){return null;}
}
function p2IsBgClass(classes){return classes.split(/\s+/).includes("bg");}
function p2ImgExtra(src,attributes){
  const data=p2ImageData(src);
  if(!data?.size)return {};
  const out={};
  if(!attributes.width)out.width=String(data.size[0]);
  if(!attributes.height)out.height=String(data.size[1]);
  if(p2IsBgClass(attributes.class||"")){
    if(!attributes.fetchpriority)out.fetchpriority="high";
    if(!attributes.loading)out.loading="eager";
    const base=data.path.split("/").pop();
    if(!attributes.srcset&&P2_VERIFIED_MOBILE.has(base)){
      const small=data.path.replace(/\.jpg$/i,"-m.jpg");
      out.srcset=small+" 960w, "+data.path+" "+data.size[0]+"w";
      if(!attributes.sizes)out.sizes="100vw";
    }
  }
  return out;
}
function p2RewriteImgTag(tag){
  const attrs={};
  for(const m of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)')/g)){
    attrs[m[1].toLowerCase()]=m[2]??m[3]??"";
  }
  if(!attrs.src)return tag;
  const extra=p2ImgExtra(attrs.src,attrs);
  if(!Object.keys(extra).length)return tag;
  return tag.replace(/\/?>$/,end=>Object.entries(extra).map(([k,v])=>" "+k+'="'+v+'"').join("")+end);
}
function p2OptimizeImages(html){
  return html.replace(/<img\b[^>]*>/gi,p2RewriteImgTag);
}
function p2RewriteImageElement(el){
  const keys=["src","width","height","class","loading","fetchpriority","srcset","sizes"];
  const attrs=Object.fromEntries(keys.map(k=>[k,el.getAttribute(k)||""]));
  const extra=p2ImgExtra(attrs.src,attrs);
  for(const [key,value] of Object.entries(extra))el.setAttribute(key,value);
}
function p2HomepagePreload(){
  return '<link rel="preload" as="image" imagesrcset="/assets/img/chaotianmen-m.jpg 960w, /assets/img/chaotianmen.jpg 1672w" imagesizes="100vw" fetchpriority="high">';
}
function p2AddPreload(html,path){
  if((path!=="/zh-cn/"&&path!=="/zh-tw/")||html.includes('imagesrcset="/assets/img/chaotianmen-m.jpg'))return html;
  return html.replace(/<\/head>/i,p2HomepagePreload()+"</head>");
}
