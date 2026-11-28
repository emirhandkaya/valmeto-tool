// Çevrimdışı önbellek. Her zaman önce ağdan TAZE dosya istenir (HTTP önbelleği atlanır);
// ağ yoksa son kaydedilen sürüm kullanılır. Sürüm değişince eski önbellekler silinir.
const CACHE = "valmeto-v40";
const CORE = ["./", "index.html", "gezi.html", "ziyaret.html", "hesap.html", "arapca.html", "musteriler.html", "harita.html",
  "style.css?v=40", "common.js?v=40", "data.js?v=40", "musteriler.js?v=40", "lojistik.js?v=40", "lojistik.html",
  "manifest.webmanifest?v=2", "icon-192-v2.png", "icon-512-v2.png", "icon-maskable-512-v2.png", "apple-touch-icon-v2.png", "favicon-32-v2.png", "logo-header-v2.png",
  "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css", "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"];
self.addEventListener("install", e => e.waitUntil(caches.open(CACHE).then(c => Promise.allSettled(CORE.map(u => c.add(new Request(u, { cache: "reload" }))))).then(() => self.skipWaiting())));
self.addEventListener("activate", e => e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())));
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  const sameOrigin = new URL(e.request.url).origin === self.location.origin;
  e.respondWith(fetch(sameOrigin ? new Request(e.request, { cache: "no-store" }) : e.request).then(r => {
    if (r.ok && (r.type === "basic" || r.type === "cors")) { const c = r.clone(); caches.open(CACHE).then(cc => cc.put(e.request, c)); }
    return r;
  }).catch(() => caches.match(e.request, { ignoreSearch: false }).then(m => m || caches.match(e.request, { ignoreSearch: true }))));
});
