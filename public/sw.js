const VERSION='wml-time-machine-v6-1';
const SHELL=`${VERSION}-shell`;
const MEDIA=`${VERSION}-media`;
const PACKS=`${VERSION}-packs`;
const swBase=new URL('./',self.location.href);
const base=swBase.pathname;
const shellUrls=[
 `${base}manifest.webmanifest`,
 `${base}assets/world/raster/brand-orbit.webp`,
 `${base}assets/world/raster/portal-grid.webp`,
 `${base}assets/world/raster/rumah-90.webp`,
 `${base}assets/world/raster/kampung-90.webp`,
 `${base}assets/world/raster/sekolah-90.webp`,
 `${base}assets/world/raster/kota-90.webp`,
 `${base}assets/world/raster/digital-90.webp`,
 `${base}assets/brand-seal.webp`
];

function shellAssetUrls(html){
 const refs=[...html.matchAll(/(?:src|href)=["']([^"']+\.(?:js|css))["']/gi)].map(match=>match[1]);
 return [...new Set(refs.map(ref=>new URL(ref,swBase)).filter(url=>url.origin===self.location.origin&&url.pathname.startsWith(base)).map(url=>url.href))];
}

async function installShell(){
 const cache=await caches.open(SHELL);
 const response=await fetch(base,{cache:'reload'});
 if(!response.ok)throw Error(`shell HTML ${response.status}`);
 const html=await response.clone().text();
 const discovered=shellAssetUrls(html);
 if(!discovered.some(url=>url.endsWith('.js')))throw Error('production JS bundle not discoverable');
 await cache.put(base,response);
 await Promise.all(discovered.map(url=>cache.add(url)));
 const optional=await Promise.allSettled(shellUrls.map(url=>cache.add(url)));
 const failed=optional.filter(result=>result.status==='rejected').length;
 if(failed)console.warn(`Offline shell installed with ${failed} optional asset cache failures.`);
}

self.addEventListener('install',event=>{
 event.waitUntil(installShell().then(()=>self.skipWaiting()));
});

self.addEventListener('activate',event=>{
 event.waitUntil((async()=>{
  const keys=await caches.keys();
  await Promise.all(keys.filter(key=>key.startsWith('wml-time-machine-')&&!key.startsWith(VERSION)).map(key=>caches.delete(key)));
  await self.clients.claim();
 })());
});

function sameOrigin(request){return new URL(request.url).origin===self.location.origin}
function isStatic(request){return ['style','script','font','image'].includes(request.destination)}

self.addEventListener('fetch',event=>{
 const {request}=event;
 if(request.method!=='GET'||!sameOrigin(request))return;
 const url=new URL(request.url);
 if(!url.pathname.startsWith(base))return;

 if(request.mode==='navigate'){
  event.respondWith((async()=>{
   try{
    const fresh=await fetch(request);
    const cache=await caches.open(SHELL);
    if(url.pathname===base)cache.put(base,fresh.clone());
    return fresh;
   }catch{
    return (await caches.match(base))||Response.error();
   }
  })());
  return;
 }

 if(isStatic(request)){
  event.respondWith((async()=>{
   const cached=await caches.match(request);
   const refresh=fetch(request).then(async response=>{
    if(response.ok){const cache=await caches.open(MEDIA);await cache.put(request,response.clone())}
    return response;
   }).catch(()=>null);
   if(cached){event.waitUntil(refresh);return cached}
   return (await refresh)||Response.error();
  })());
 }
});

self.addEventListener('message',event=>{
 const data=event.data||{};
 if(data.type==='SKIP_WAITING'){self.skipWaiting();return}
 if(data.type==='CLEAR_MEMORY_PACKS'){
  event.waitUntil((async()=>{
   await caches.delete(PACKS);
   event.source?.postMessage?.({type:'MEMORY_PACKS_CLEARED'});
  })());
  return;
 }
 if(data.type==='CACHE_MEMORY_PACK'&&Array.isArray(data.urls)){
  event.waitUntil((async()=>{
   const urls=data.urls
    .filter(value=>typeof value==='string')
    .map(value=>new URL(value,swBase))
    .filter(url=>url.origin===self.location.origin&&url.pathname.startsWith(base))
    .map(url=>url.href);
   const cache=await caches.open(PACKS);
   const results=await Promise.allSettled(urls.map(url=>cache.add(url)));
   const ready=results.filter(result=>result.status==='fulfilled').length;
   event.source?.postMessage?.({type:'MEMORY_PACK_READY',count:ready,requested:urls.length});
  })());
 }
});