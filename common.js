// Ortak yardımcılar: ziyaret notları tarayıcıda (localStorage) saklanır.
const STORE_KEY = "kahire-fabrika-notlari-v1";
function loadNotes() { try { return JSON.parse(localStorage.getItem(STORE_KEY)) || {}; } catch (e) { return {}; } }
function saveNotes(n) { try { localStorage.setItem(STORE_KEY, JSON.stringify(n)); } catch (e) {} }
function esc(s) { return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])); }
function telHref(p) { return "tel:" + p.replace(/\(.*?\)/g, "").replace(/[^\d+]/g, ""); }
function isMobile(p) { return /^\+20\s?1[0125]/.test(p); }
function waHref(p) { return "https://wa.me/" + p.replace(/\(.*?\)/g, "").replace(/\D/g, ""); }
function mapsHref(f) {
  if (f.lat != null && !f.approxOnly) return `https://www.google.com/maps/search/?api=1&query=${f.lat},${f.lng}`;
  return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(f.name.split("–")[0] + " " + f.address);
}
const METAL_LABEL = { aluminyum: "Alüminyum", bakir: "Bakır" };
const STATUS_LABEL = { "": "Planlanmadı", plan: "Ziyaret planlandı", randevu: "Randevu alındı", gidildi: "Ziyaret edildi", teklif: "Teklif alındı", elendi: "Uygun değil" };

function mailtoRFQ(f, email) {
  const metal = f.metal.map(m => m === "bakir" ? "copper" : "aluminium").join(" / ");
  const subject = `Request for quotation & factory visit – ${metal} products`;
  const body = `Dear ${f.name} team,

I am a buyer from Türkiye and will be in Cairo on a business trip. I am interested in purchasing ${metal} products from your company.

Could you please send me:
- Your current product list and specifications
- Price per ton (FOB / EXW), minimum order quantity and lead time
- Payment terms

I would also like to visit your factory during my stay. Please let me know a suitable date and time.

Best regards,
`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
