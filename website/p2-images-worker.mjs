// Magellan P2: dimensions and responsive images for pages without more-specific Workers.
// Do not overwrite the production magellan-tours or existing P0/P1 routes.
export default {
  async fetch(request) {
    const url=new URL(request.url);
    if(request.method!=="GET"||url.hostname!=="magellanchongqing.com")return fetch(request);
    const originalResponse=await fetch(request);
    if(!originalResponse.ok||!/text\/html/i.test(originalResponse.headers.get("content-type")||""))return originalResponse;
    const original=await originalResponse.text();
    const html=p2OptimizeMetadata(p2AddPreload(p2OptimizeImages(original),url.pathname),url.pathname);
    const headers=new Headers(originalResponse.headers);
    for(const name of ["content-length","content-encoding","etag","last-modified"])headers.delete(name);
    if(html!==original)headers.set("x-magellan-p2","image-dimensions");
    return new Response(html,{status:originalResponse.status,headers});
  }
};

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
