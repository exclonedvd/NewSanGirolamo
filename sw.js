
const CACHE='csg-envy-v1';
const CORE=['index.html','galleria.html','camere.html','colazione-ristoro.html','esperienze.html','itinerari.html','scopri-mantova.html',
'styles.css','ui-envy.js','snap-slider.js','itinerari-envy.js','mantova-envy.js','photos.json','manifest.webmanifest',
'assets/img/logo.jpg','assets/img/home.jpg','assets/img/home2.jpg'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(CORE))); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))); });
self.addEventListener('fetch',e=>{ const url=new URL(e.request.url); if(url.origin===location.origin){ e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request))); } });
