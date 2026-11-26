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
function mapQ(f) { return f.mapQuery || (f.name.split(" – ")[0].split(" (")[0] + ", " + f.address); }
// Google Maps'te firma adı + adresle aranır (koordinatlarımız yaklaşık olduğu için)
function mapsHref(f) { return "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(mapQ(f)); }
const METAL_LABEL = { aluminyum: "Alüminyum", bakir: "Bakır", pirinc: "Pirinç" };
const STATUS_LABEL = { "": "Planlanmadı", plan: "Ziyaret planlandı", randevu: "Randevu alındı", gidildi: "Ziyaret edildi", teklif: "Teklif alındı", elendi: "Uygun değil" };
const TIER_LABEL = { A: "A · Hedef – bakır tel / filmaşin / çubuk", B: "B · Orta – bara, alaşım külçe, profil, döküm", C: "C · Referans – büyük / pahalı" };
const OURS_LABEL = { evet: "✔ Bizim ürünleri üretiyor", kismen: "◐ Kısmen bizim ürünler", dogrulanamadi: "? Ürünler doğrulanamadı" };
const SOURCE_LABEL = { hurda: "Hurdadan üretim", katot: "Katottan üretim", karisik: "Hurda + katot", birincil: "Birincil (cevherden)", bilinmiyor: "Kaynak bilinmiyor" };
const DAYS = { 5: "İskenderiye (Kahire'den önce)", 1: "Pazar 29 Kasım", 2: "Pazartesi 30 Kasım", 3: "Salı 1 Aralık", 4: "Çarşamba 2 Aralık", 0: "Telefonla" };
const SENDER = { name: "Emirhan Durmuşkaya", company: "Valmeto İç ve Dış Ticaret Limited Şirketi", email: "info@valmeto.com", companyEn: "Valmeto Domestic and Foreign Trade Ltd.", phone: "+90 552 433 26 53" };
function senderPhone() { return lsGet("valmeto-phone", "") || SENDER.phone; }
function signature() { return [SENDER.name, SENDER.company].join("\n"); }  // e-postada telefon/WhatsApp yok

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
  ["hesap.html", "Fiyat Hesabı"], ["arapca.html", "Arapça Kart"], ["lojistik.html", "Lojistik"], ["musteriler.html", "Müşteriler"], ["harita.html", "Harita"]
];
function renderNav() {
  const h1 = document.querySelector(".top h1");
  if (h1 && !h1.querySelector(".logo")) h1.insertAdjacentHTML("afterbegin", '<img src="logo-header-v2.png" class="logo" alt="Valmeto Global Trade">');
  const el = document.getElementById("nav"); if (!el) return;
  const here = location.pathname.split("/").pop() || "index.html";
  el.innerHTML = NAV.map(([h, l]) => `<a href="${h}"${h === here ? ' class="active"' : ""}>${l}</a>`).join("");
}
document.addEventListener("DOMContentLoaded", renderNav);

// Çevrimdışı kullanım (Mısır'da internet zayıfsa)
if ("serviceWorker" in navigator && location.protocol.startsWith("http")) {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}

function rfq(f) {
  const subject = "Request for quotation & factory visit – copper and aluminium products";
  const body = `Dear ${f.name.split(" – ")[0]} team,

My name is ${SENDER.name} from ${SENDER.company} (${SENDER.companyEn}), Türkiye. I will be in Cairo from Sunday 29 November to Wednesday 2 December. We supply copper and aluminium products to cable and metal manufacturers in Türkiye and the Balkans, and we are looking for reliable producers in Egypt.

We are interested in a wide range of copper and aluminium products, for example:
- Copper: wire rod (8 mm), drawn and annealed wire, stranded / bunched wire, busbars and flat bars, ingots
- Aluminium: wire rod, wire, ingots and billets, profiles
- Brass rods and brass products
Products made from recycled material are also welcome.

Could you please send me:
- Your product list with specifications (purity, conductivity, dimensions, packaging)
- Price per ton (EXW / FOB Alexandria), minimum order quantity and lead time
- Payment terms and whether you can issue an EUR.1 certificate of origin

I would also like to visit your factory during my stay. Please let me know a suitable date and time.

Best regards,
`;  // imza yok: Outlook'taki info@valmeto.com imzası kullanılır
  return { to: f.emails[0] || "", subject, body };
}
// Outlook mobil/masaüstü uygulaması (iPhone, iPad, Android) – gönderen: uygulamadaki info@valmeto.com hesabı
function outlookAppHref(f) { const r = rfq(f); return `ms-outlook://compose?to=${encodeURIComponent(r.to)}&subject=${encodeURIComponent(r.subject)}&body=${encodeURIComponent(r.body)}`; }
// Outlook Web (Microsoft 365) – info@valmeto.com ile giriş yapılmış tarayıcıda açılır
function outlookWebHref(f) { const r = rfq(f); return `https://outlook.office.com/mail/deeplink/compose?to=${encodeURIComponent(r.to)}&subject=${encodeURIComponent(r.subject)}&body=${encodeURIComponent(r.body)}`; }
function mailtoRFQ(f) { const r = rfq(f); return `mailto:${r.to}?subject=${encodeURIComponent(r.subject)}&body=${encodeURIComponent(r.body)}`; }

// "Ana ekrana ekle" (Android/Chrome) – iOS'ta Safari > Paylaş > Ana Ekrana Ekle
let installEvt = null;
window.addEventListener("beforeinstallprompt", e => {
  e.preventDefault(); installEvt = e;
  const nav = document.getElementById("nav"); if (!nav || document.getElementById("installBtn")) return;
  nav.insertAdjacentHTML("beforeend", '<a href="#" id="installBtn" class="install">📲 Uygulamayı yükle</a>');
  document.getElementById("installBtn").onclick = async ev => { ev.preventDefault(); installEvt.prompt(); await installEvt.userChoice; installEvt = null; ev.target.remove(); };
});

// iPhone / iPad: Safari'de yükleme düğmesi yok; bir kez ipucu göster
(function () {
  const ios = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const standalone = window.navigator.standalone || (window.matchMedia && matchMedia("(display-mode: standalone)").matches);
  if (!ios || standalone || lsGet("valmeto-ios-hint", false)) return;
  document.addEventListener("DOMContentLoaded", () => {
    const main = document.querySelector("main"); if (!main) return;
    main.insertAdjacentHTML("afterbegin", '<div class="warning" id="iosHint" style="border-left-color:var(--accent)">📲 <b>Uygulama olarak ekle:</b> Safari\'de adres çubuğundaki <b>Paylaş</b> (⬆️) düğmesine dokun → <b>Ana Ekrana Ekle</b>. Notlar her cihazda ayrı saklanır; cihazlar arası aktarım için Ziyaret Formu\'ndaki “Yedek indir / yükle”yi kullan. <a href="#" id="iosHintX">Kapat</a></div>');
    document.getElementById("iosHintX").onclick = e => { e.preventDefault(); lsSet("valmeto-ios-hint", true); document.getElementById("iosHint").remove(); };
  });
})();

// ---- İletişim takibi (e-posta, telefon, WhatsApp). Anahtar: firmanın e-postası; yoksa firma kimliği.
const MAIL_KEY = "valmeto-mail";
const MAIL_STATUS = { "": "Henüz iletişim yok", atildi: "📤 Mail atıldı", tel: "📞 Telefonla arandı", wa: "💬 WhatsApp yazıldı",
  cevap: "📥 Cevap geldi", gorusme: "🤝 Görüşülüyor", teklif: "💰 Teklif alındı", olumsuz: "✖ Olumsuz / cevap yok" };
function contactKey(f) { return f.emails && f.emails[0] ? f.emails[0] : "firma:" + f.id; }
function mailState(key) { return (lsGet(MAIL_KEY, {})[key]) || {}; }
function setMailState(key, patch) { const all = lsGet(MAIL_KEY, {}); all[key] = { ...(all[key] || {}), ...patch }; lsSet(MAIL_KEY, all); }
function daysSince(d) { return d ? Math.floor((Date.now() - new Date(d).getTime()) / 864e5) : null; }
function trackerHtml(key) {
  const m = mailState(key), d = daysSince(m.date);
  const warn = ["atildi", "tel", "wa"].includes(m.status) && d >= 3 ? `<span class="tag unv">⏰ ${d} gündür cevap yok – tekrar ulaş</span>` : "";
  return `<div class="mailtrack" data-mail="${esc(key)}">
    <label>İletişim durumu <select data-mk="status">${Object.entries(MAIL_STATUS).map(([k, v]) => `<option value="${k}" ${(m.status || "") === k ? "selected" : ""}>${v}</option>`).join("")}</select></label>
    <label>Tarih <input type="date" data-mk="date" value="${esc(m.date || "")}"></label>
    <label class="wide">Not (kiminle konuşuldu, ne dediler) <input data-mk="note" value="${esc(m.note || "")}"></label>
    ${warn}
  </div>`;
}
function mailTracker(f) { return trackerHtml(contactKey(f)); }
function refreshTrackers(key, except) {
  document.querySelectorAll(`[data-mail="${CSS.escape(key)}"]`).forEach(o => { if (o !== except) o.outerHTML = trackerHtml(key); });
  if (typeof onMailChange === "function") onMailChange();
}
document.addEventListener("change", e => {
  const box = e.target.closest("[data-mail]"); const k = e.target.dataset.mk; if (!box || !k) return;
  const key = box.dataset.mail, patch = { [k]: e.target.value };
  if (k === "status" && e.target.value && !box.querySelector('[data-mk="date"]').value) patch.date = new Date().toISOString().slice(0, 10);
  setMailState(key, patch);
  refreshTrackers(key, k === "note" ? box : null);
});
// Outlook / telefon / WhatsApp düğmesine basınca: dönüşte "yaptın mı?" diye sor
let pendingAct = null;
document.addEventListener("click", e => {
  const a = e.target.closest("a[data-send], a[data-call], a[data-wa]"); if (!a) return;
  pendingAct = a.dataset.send ? { key: a.dataset.send, st: "atildi", q: "maili gönderdin mi" } : a.dataset.call ? { key: a.dataset.call, st: "tel", q: "telefonla görüştün mü" } : { key: a.dataset.wa, st: "wa", q: "WhatsApp'tan yazdın mı" };
});
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState !== "visible" || !pendingAct) return;
  const p = pendingAct; pendingAct = null;
  if (mailState(p.key).status) return;
  setTimeout(() => { if (confirm(`Bu firmaya ${p.q}? “${MAIL_STATUS[p.st]}” olarak işaretleyeyim mi?`)) {
    setMailState(p.key, { status: p.st, date: new Date().toISOString().slice(0, 10) }); refreshTrackers(p.key, null);
  } }, 400);
});

// ---- Gidilecek fabrikalar (🚩). Kayıtlı seçim yoksa data.js'teki go:true varsayılanı geçerli.
const GO_KEY = "valmeto-go";
function isGo(f) { const g = lsGet(GO_KEY, {}); return f.id in g ? !!g[f.id] : !!f.go; }
function setGo(id, v) { const g = lsGet(GO_KEY, {}); g[id] = !!v; lsSet(GO_KEY, g); }
function goToggle(f) { return `<label class="gochk"><input type="checkbox" data-go="${f.id}" ${isGo(f) ? "checked" : ""}> 🚩 Gidilecek</label>`; }
document.addEventListener("change", e => {
  const id = e.target.dataset && e.target.dataset.go; if (!id) return;
  setGo(id, e.target.checked);
  document.querySelectorAll(`[data-go="${id}"]`).forEach(c => { if (c !== e.target) c.checked = e.target.checked; });
  if (typeof onGoChange === "function") onGoChange();
});
