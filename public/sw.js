const VERSION='wml-time-machine-v3-4';
const SHELL=`${VERSION}-shell`;
const MEDIA=`${VERSION}-media`;
const swBase=new URL('./',self.location.href);
const base=swBase.pathname;
const shellUrls=[
 base,
 `${base}manifest.webmanifest`,
 `${base}assets/world/brand-orbit.svg`,
 `${base}assets/world/portal-grid.svg`,
 `${base}assets/world/scenes/rumah-90.svg`,
 `${base}assets/world/scenes/kampung-90.svg`,
 `${base}assets/world/scenes/sekolah-90.svg`,
 `${base}assets/world/scenes/kota-90.svg`,
 `${base}assets/world/scenes/digital-90.svg`,
 `${base}assets/brand-seal.svg`
];

self.addEventListener('install',event=>{
 event.waitUntil(caches.open(SHELL).then(cache=>cache.addAll(shellUrls)).then(()=>self.skipWaiting()));
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
    cache.put(base,fresh.clone());
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
 if(data.type==='CACHE_MEMORY_PACK'&&Array.isArray(data.urls)){
  event.waitUntil((async()=>{
   const urls=data.urls
    .filter(value=>typeof value==='string')
    .map(value=>new URL(value,swBase))
    .filter(url=>url.origin===self.location.origin&&url.pathname.startsWith(base))
    .map(url=>url.href);
   const cache=await caches.open(MEDIA);
   const results=await Promise.allSettled(urls.map(url=>cache.add(url)));
   const ready=results.filter(result=>result.status==='fulfilled').length;
   event.source?.postMessage?.({type:'MEMORY_PACK_READY',count:ready,requested:urls.length});
  })());
 }
});
