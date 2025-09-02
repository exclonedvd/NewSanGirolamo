/* Corte San Girolamo SW – v:csg-v2-2025-09-01 */
const VERSION="csg-v2-2025-09-01";
const STATIC_CACHE="static-"+VERSION;
const RUNTIME_CACHE="runtime-"+VERSION;
const IMAGE_CACHE="images-"+VERSION;
const OFFLINE_URL="./offline.html";

self.addEventListener("install",(event)=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(STATIC_CACHE);
    await cache.addAll([OFFLINE_URL]);
  })());
  self.skipWaiting();
});

self.addEventListener("activate",(event)=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>![STATIC_CACHE,RUNTIME_CACHE,IMAGE_CACHE].includes(k)).map(k=>caches.delete(k)));
  })());
  self.clients.claim();
});

self.addEventListener("fetch",(event)=>{
  const req=event.request;
  const url=new URL(req.url);
  if(req.method!=="GET") return;

  if(req.mode==="navigate" || (req.headers.get("accept")||"").includes("text/html")) {
    event.respondWith((async()=>{
      try {
        const fresh=await fetch(req);
        const cache=await caches.open(RUNTIME_CACHE);
        cache.put(req,fresh.clone());
        return fresh;
      } catch(err) {
        const cache=await caches.open(RUNTIME_CACHE);
        const cached=await cache.match(req);
        return cached || (await caches.match(OFFLINE_URL));
      }
    })());
    return;
  }

  const dest=req.destination;
  if(dest==="style" || dest==="script" || dest==="worker") {
    event.respondWith((async()=>{
      const cache=await caches.open(RUNTIME_CACHE);
      const cached=await cache.match(req);
      const network=fetch(req).then(res=>{cache.put(req,res.clone()); return res;}).catch(()=>null);
      return cached || network || fetch(req);
    })());
    return;
  }

  if(dest==="image" || /\.(?:png|jpg|jpeg|gif|webp|avif|svg)$/i.test(url.pathname)) {
    event.respondWith((async()=>{
      const cache=await caches.open(IMAGE_CACHE);
      const cached=await cache.match(req);
      if(cached) return cached;
      try {
        const fresh=await fetch(req);
        cache.put(req,fresh.clone());
        return fresh;
      } catch(e) {
        return caches.match(OFFLINE_URL);
      }
    })());
    return;
  }

  event.respondWith(fetch(req).catch(()=>caches.match(OFFLINE_URL)));
});
