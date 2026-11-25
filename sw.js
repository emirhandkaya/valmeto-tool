// Basit çevrimdışı önbellek: önce ağ, ağ yoksa önbellek.
const CACHE = "valmeto-v15";
const CORE = ["./", "index.html", "gezi.html", "ziyaret.html", "hesap.html", "arapca.html", "musteriler.html", "harita.html",
  "style.css", "common.js", "data.js", "musteriler.js",
  "manifest.webmanifest", "logo-header-v2.png", "logo-full.png", "icon-192-v2.png", "icon-512-v2.png", "icon-maskable-512-v2.png", "apple-touch-icon-v2.png", "favicon-32-v2.png",
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
