// Ortak yardımcılar. Notlar tarayıcıda (localStorage / IndexedDB) saklanır.
const STORE_KEY = "kahire-fabrika-notlari-v1";
function loadNotes() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } }
function saveNotes(n) { try { localStorage.setItem(STORE_KEY, JSON.stringify(n)); } catch (e) {} }
function lsGet(k, d) { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch (e) { return d; } }
function lsSet(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function telHref(p) { return "tel:" + p.replace(/\(.*?\)/g, "").replace(/[^\d+]/g, ""); }
function isMobile(p) { return /^\+20\s?1[0125]/.test(p); }
function waHref(p, text) { return "https://wa.me/" + p.replace(/\(.*?\)/g, "").replace(/\D/g, "") + (text ? "?text=" + encodeURIComponent(text) : ""); }
function mapsHref(f) {
  if (f.lat != null && !f.approxOnly) return `https://www.google.com/maps/search/?api=1&query=${f.lat},${f.lng}`;
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(f.name.split("–")[0] + " " + f.address);
}
const METAL_LABEL = { aluminyum: "Alüminyum", bakir: "Bakır", pirinc: "Pirinç" };
const STATUS_LABEL = { "": "Planlanmadı", plan: "Ziyaret planlandı", randevu: "Randevu alındı", gidildi: "Ziyaret edildi", teklif: "Teklif alındı", elendi: "Uygun değil" };
const TIER_LABEL = { A: "A · Hedef – ucuz / hurda bazlı", B: "B · Orta – yarı mamul / profil", C: "C · Referans – büyük / pahalı" };
const SOURCE_LABEL = { hurda: "Hurdadan üretim", katot: "Katottan üretim", karisik: "Hurda + katot", birincil: "Birincil (cevherden)", bilinmiyor: "Kaynak bilinmiyor" };
const DAYS = { 1: "Pazar 29 Kasım", 2: "Pazartesi 30 Kasım", 3: "Salı 1 Aralık", 0: "Telefonla" };

// Güncel referans fiyatlar (kullanıcının girdiği değer > data.js varsayılanı)
function refs() {
  const r = lsGet("valmeto-refs", {});
  return {
    cu: +r.cu || (window.LME_REF ? LME_REF.copper : 11660),
    al: +r.al || (window.LME_REF ? LME_REF.aluminium : 2800),
    fx: +r.fx || (window.FX_REF ? FX_REF.usdEgp : 53.8)
  };
}
function saveRefs(r) { lsSet("valmeto-refs", r); }

// Ortak menü
const NAV = [
  ["index.html", "Mısır Üreticileri"], ["gezi.html", "Gezi Planı"], ["ziyaret.html", "Ziyaret Formu"],
  ["hesap.html", "Fiyat Hesabı"], ["arapca.html", "Arapça Kart"], ["musteriler.html", "Müşteriler"], ["harita.html", "Harita"]
];
function renderNav() {
  const el = document.getElementById("nav"); if (!el) return;
  const here = location.pathname.split("/").pop() || "index.html";
  el.innerHTML = NAV.map(([h, l]) => `<a href="${h}"${h === here ? ' class="active"' : ""}>${l}</a>`).join("");
}
document.addEventListener("DOMContentLoaded", renderNav);

// Çevrimdışı kullanım (Mısır'da internet zayıfsa)
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

function mailtoRFQ(f, email) {
  const metal = f.metal.map(m => ({ bakir: "copper", aluminyum: "aluminium", pirinc: "brass" }[m])).join(" / ");
  const subject = `Request for quotation & factory visit – ${metal} products`;
  const body = `Dear ${f.name} team,

I am a buyer from Türkiye and will be in Cairo between 29 November and 1 December. We supply copper and aluminium to cable manufacturers in the Balkans and Türkiye, and we are interested in purchasing ${metal} products (wire rod, wire, ingots) from your company.

Could you please send me:
- Your product list and specifications (purity, diameter)
- Price per ton (EXW / FOB Alexandria), minimum order quantity and lead time
- Payment terms and whether you can issue EUR.1 certificate of origin

I would also like to visit your factory during my stay. Please let me know a suitable date and time.

Best regards,
`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
