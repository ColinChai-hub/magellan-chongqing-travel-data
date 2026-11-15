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
