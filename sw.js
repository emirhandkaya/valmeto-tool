// Basit çevrimdışı önbellek: önce ağ, ağ yoksa önbellek.
const CACHE = "valmeto-v1";
const CORE = ["./", "index.html", "gezi.html", "ziyaret.html", "hesap.html", "arapca.html", "musteriler.html", "harita.html",
  "style.css", "common.js", "data.js", "musteriler.js",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(u)))).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => {
    if (r.ok && (r.type === "basic" || r.type === "cors")) { const c = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: true })));
});
