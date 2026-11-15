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
