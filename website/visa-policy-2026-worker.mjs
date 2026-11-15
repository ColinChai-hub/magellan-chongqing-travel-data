// Narrow read-only origin-response patch for China's 240-hour visa-free transit guide.
// This Worker does not replace the main Magellan website Worker and does not edit the origin.
const GUIDE_PATH = "/guides/chongqing-240-hour-visa-free-transit-guide/";
const PATCH_DATE = "2026-11-15";
const RULES = [
  [
    "55+ countries",
    "57 countries"
  ],
  [
    "since June 2025 — Indonesia",
    "Indonesia (added in 2025), Kyrgyzstan and Vietnam (added August 20, 2026)"
  ],
  [
    "<p>Official source for the current lists: National Immigration Administration (nia.gov.cn) — the lists have expanded repeatedly, so check your passport there before booking. <em>Last checked by us: October 2026.</em></p>",
    "<p><strong>Official 240-hour transit references:</strong> <a href=\"https://en.nia.gov.cn/n147418/n147463/c183412/content.html\" rel=\"noopener noreferrer\">National Immigration Administration — eligible countries, ports and permitted areas (August 20, 2026)</a>; <a href=\"https://en.nia.gov.cn/n147418/n147468/c217849/content.html\" rel=\"noopener noreferrer\">official notice adding Kyrgyzstan and Vietnam</a>; and <a href=\"https://en.nia.gov.cn/n147413/c187308/content.html\" rel=\"noopener noreferrer\">official explanation of the stay calculation</a>. Travel eligibility and temporary entry permits are subject to immigration inspection at the port. <em>Policy verified: November 15, 2026.</em></p>"
  ],
  [
    "<li><strong>Ticket:</strong> confirmed seat, departure within 240 hours of arrival, destination = third country/region (not where you flew in from).</li>",
    "<li><strong>Ticket:</strong> an onward interline ticket with confirmed seat, itinerary and departure date for a third country or region, within the authorized transit stay. For this policy, the stay is counted from 00:00 on the day after entry; confirm your permitted departure deadline with immigration officers.</li>"
  ],
  [
    "<li><strong>Round trip tickets.</strong> A ticket back to your origin country is not a transit. Book onward to a third place — even a cheap hop to Hong Kong fixes it.</li>",
    "<li><strong>Same-origin round trips.</strong> The 240-hour transit exemption requires a genuine onward journey to a third country or region. A separate onward ticket alone never guarantees eligibility or admission; check the entire itinerary and applicable policy before booking.</li>"
  ],
  [
    "<li><strong>Counting hours wrong.</strong> The 240 hours run from entry processing; tight connections plus a \"quick look at the city\" is how overstays happen.</li>",
    "<li><strong>Counting hours wrong.</strong> The 240-hour permitted stay is counted from 00:00 on the day after arrival in China, not from the moment you pass immigration. Confirm your exact permitted exit date and time with the border inspection officer; do not overstay.</li>"
  ],
  [
    "<li><strong>Wrong port fantasies.</strong> Land borders and non-designated ports don't count; fly in and out of designated ones.</li>",
    "<li><strong>Using the wrong entry or exit port.</strong> Only the designated ports and permitted areas qualify for this policy. Some designated ports handle rail or ferry arrivals; flying is not a universal requirement. Check your specific ports against the current official list.</li>"
  ],
  [
    "<li><strong>Can I leave the airport on a 10-hour layover without a visa?</strong> If you're eligible for the 240-hour policy or 30-day visa-free: yes, with onward ticket in hand. If only the 24-hour airside rule covers you: generally no.</li>",
    "<li><strong>Can I leave the airport on a 10-hour layover without a visa?</strong> Only when you satisfy an applicable visa-free entry policy and immigration authorities permit entry or grant a temporary entry permit. A confirmed onward ticket alone is not permission to leave the airport. Under the standard 24-hour airside transit arrangement, leaving the restricted transit area requires separate authorization.</li>"
  ],
  [
    "<li><strong>None of the above</strong> — apply for a tourist (L) visa before you travel.</li>",
    "<li><strong>None of the above</strong> — check with a Chinese embassy or consulate which visa or entry arrangement is appropriate before traveling.</li>"
  ]
];
export default {
  async fetch(request) {
    const url = new URL(request.url);
    if (url.hostname !== "magellanchongqing.com" || url.pathname !== GUIDE_PATH || request.method !== "GET") {
      return fetch(request);
    }
    const upstream = await fetch(request);
    if (!upstream.ok || !(upstream.headers.get("content-type") || "").includes("text/html")) return upstream;
    const original = await upstream.text();
    // Fail open if the original is updated independently: do not replace unknown or mixed markup.
    if (!RULES.every(([from]) => original.includes(from))) {
      const headers = cleanHeaders(upstream.headers);
      headers.set("x-magellan-visa-patch", "unapplied-source-changed");
      return new Response(original, {status: upstream.status, headers});
    }
    let html = original;
    for (const [from, to] of RULES) html = html.replaceAll(from, to);
    html=p2OptimizeMetadata(p2OptimizeImages(html),url.pathname);
    const headers = cleanHeaders(upstream.headers);
    headers.set("x-magellan-visa-patch", PATCH_DATE);
    return new Response(html, {status: upstream.status, headers});
  }
};
function cleanHeaders(h) {
  const next = new Headers(h);
  for (const name of ["content-length","content-encoding","etag","last-modified"]) next.delete(name);
  return next;
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

// Magellan P2: evidence-limited title/meta and graph relationships.
// Uses existing page topics and website-controlled contact details only.
// Does NOT create reviews, staff identities, credentials, a logo URL or external profiles.
const P2_META={
 "/partner/":{
   old:"Chongqing Ground Handling & DMC Services for Travel Agents | Magellan",
   title:"Chongqing DMC & Ground Handling for Travel Agents | Magellan",
   description:"Chongqing DMC and ground handling for overseas travel agencies. Group routes, English-speaking guides, transport and hotels. Request a tailored quote."
 },
 "/contact/":{
   old:"Contact Chongqing DMC & Private Tour Team | Magellan Chongqing Tours",
   title:"Contact Magellan Chongqing Tours | Trip & Agency Quotes",
   description:"Contact Magellan Chongqing Tours for travel-agency ground handling or private Chongqing trips. Request a quotation by WhatsApp or email."
 },
 "/reviews/":{
   old:"Travel Agency References & Guest Feedback | Magellan Chongqing Tours",
   title:"Reviews & References | Magellan Chongqing Tours"
 },
 "/guides/best-time-to-visit-chongqing/":{
   old:"Best Time to Visit Chongqing — Month-by-Month Weather, Crowds & Events",
   title:"Best Time to Visit Chongqing: Weather & Crowds | Magellan",
   description:"Compare Chongqing weather and crowds month by month, with spring and autumn travel tips and practical local trip-planning advice."
 },
 "/guides/chongqing-itinerary-3-days/":{
   old:"Chongqing Itinerary: The Perfect 3 Days (Local Guide's Plan) — Magellan",
   title:"3-Day Chongqing Itinerary: City, Wulong & Dazu | Magellan",
   description:"Plan three days in Chongqing with city highlights, Ciqikou and an optional Wulong or Dazu day trip. Route, timing and transport tips."
 },
 "/guides/chongqing-travel-guide/":{
   old:"Chongqing Travel Guide 2026 — What to See, How Long to Stay, How It Works",
   title:"Chongqing Travel Guide 2026: Sights & Planning | Magellan",
   description:"Plan your Chongqing visit: landmarks, food, metro, 1–4 day itineraries and Wulong or Dazu day trips. Practical local advice and sources."
 },
 "/guides/dazu-rock-carvings-guide/":{
   old:"Dazu Rock Carvings Guide — Baodingshan, Beishan & the Black Myth Connection",
   title:"Dazu Rock Carvings Guide: Baodingshan & Beishan | Magellan"
 },
 "/guides/how-to-get-around-chongqing/":{
   old:"How to Get Around Chongqing — Metro, Taxis, Cableway & the 3D City Problem",
   title:"Getting Around Chongqing: Metro & Cableway | Magellan",
   description:"Use Chongqing metro, taxis and Yangtze Cableway with practical navigation tips for the city's hills, transfers and vertical streets."
 },
 "/guides/what-to-eat-in-chongqing/":{
   old:"What to Eat in Chongqing — Hotpot Rules, Xiaomian & the Mala Survival Guide",
   title:"What to Eat in Chongqing: Hotpot & Xiaomian | Magellan",
   description:"Discover Chongqing hotpot, xiaomian, jianghu dishes and street snacks. Learn ordering tips, spice levels and dining customs."
 },
 "/guides/wulong-travel-guide/":{
   old:"Wulong Karst Travel Guide — Three Natural Bridges, Furong Cave & How to Visit",
   title:"Wulong Karst Travel Guide: Bridges & Caves | Magellan",
   description:"Plan a Wulong Karst trip from Chongqing: Three Natural Bridges, gorges, caves, transport, time needed and day trip versus overnight options."
 },
 "/guides/chongqing-240-hour-visa-free-transit-guide/":{
   old:"Chongqing 240-Hour Visa-Free Transit — Who Qualifies, How to Use Your 10 Days",
   title:"Chongqing 240-Hour Visa-Free Transit Guide | Magellan",
   description:"Check Chongqing's 240-hour visa-free transit rules, 57 eligible countries, permitted ports and travel areas, with links to official immigration guidance."
 }
};
const P2_ORG_ID="https://magellanchongqing.com/#organization";
const P2_SITE_ID="https://magellanchongqing.com/#website";
function p2HtmlEscape(value){return String(value).replace(/&/g,"&amp;").replace(/"/g,"&quot;").replace(/</g,"&lt;").replace(/>/g,"&gt;");}
function p2HtmlDecodeTitle(value){return value.replace(/&amp;/g,"&").replace(/&quot;/g,'"').replace(/&#39;/g,"'");}
function p2OptimizeMetadata(html,path){
  const meta=P2_META[path];
  let active=null;
  if(meta){
    const curr=html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
    if(curr&&[meta.old,meta.title].includes(p2HtmlDecodeTitle(curr[1]))){
      active=meta;
      html=html.replace(/(<title\b[^>]*>)[\s\S]*?(<\/title>)/i,(x,a,b)=>a+p2HtmlEscape(meta.title)+b);
      html=html.replace(/<meta\b[^>]*>/gi,tag=>{
        const name=tag.match(/\bname\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
        const prop=tag.match(/\bproperty\s*=\s*["']([^"']+)["']/i)?.[1]?.toLowerCase();
        const field=(name==="description"||prop==="og:description")?"description":(prop==="og:title"?"title":null);
        if(!field||!meta[field])return tag;
        return tag.replace(/(\bcontent\s*=\s*)(["'])(.*?)\2/i,(_,pre,quote)=>pre+quote+p2HtmlEscape(meta[field])+quote);
      });
    }
  }
  // Link existing verified TravelAgency, WebSite and WebPage entities without inventing new profiles.
  return html.replace(/(<script\b[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,(whole,start,raw,end)=>{
    try {
      const j=JSON.parse(raw),nodes=Array.isArray(j["@graph"])?j["@graph"]:[j];
      if(!nodes.some(n=>n?.["@id"]===P2_ORG_ID))return whole;
      let dirty=false;
      // Localized origin HTML contains WebPage and TravelAgency, but omits WebSite.
      // Supply the already-used canonical WebSite identity instead of a new entity.
      if(Array.isArray(j["@graph"]) && !nodes.some(n=>n?.["@id"]===P2_SITE_ID)){
        nodes.splice(1,0,{"@type":"WebSite","@id":P2_SITE_ID,"url":"https://magellanchongqing.com/","name":"Magellan Chongqing Tours","publisher":{"@id":P2_ORG_ID}});
        dirty=true;
      }
      for(const n of nodes){
        if(n?.["@id"]===P2_ORG_ID && n["@type"]==="TravelAgency"){
          if(!n.contactPoint&&n.email){n.contactPoint={"@type":"ContactPoint","contactType":"travel enquiries","email":n.email,"url":"https://magellanchongqing.com/contact/"};dirty=true;}
        }
        if(n?.["@id"]===P2_SITE_ID && n["@type"]==="WebSite"&&!n.publisher){n.publisher={"@id":P2_ORG_ID};dirty=true;}
        if(n?.["@type"]==="WebPage"){
          if(!n.publisher){n.publisher={"@id":P2_ORG_ID};dirty=true;}
          if(!n.isPartOf){n.isPartOf={"@id":P2_SITE_ID};dirty=true;}
          if(active&&n.url==="https://magellanchongqing.com"+path){
            if(n.name!==active.title){n.name=active.title;dirty=true;}
            if(active.description && n.description!==active.description){n.description=active.description;dirty=true;}
          }
        }
      }
      return dirty?start+JSON.stringify(j)+end:whole;
    }catch(e){return whole;}
  });
}
