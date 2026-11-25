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
const TIER_LABEL = { A: "A · Hedef – bakır tel / filmaşin / çubuk", B: "B · Orta – bara, alaşım külçe, profil, döküm", C: "C · Referans – büyük / pahalı" };
const OURS_LABEL = { evet: "✔ Bizim ürünleri üretiyor", kismen: "◐ Kısmen bizim ürünler", dogrulanamadi: "? Ürünler doğrulanamadı" };
const SOURCE_LABEL = { hurda: "Hurdadan üretim", katot: "Katottan üretim", karisik: "Hurda + katot", birincil: "Birincil (cevherden)", bilinmiyor: "Kaynak bilinmiyor" };
const DAYS = { 1: "Pazar 29 Kasım", 2: "Pazartesi 30 Kasım", 3: "Salı 1 Aralık", 4: "Çarşamba 2 Aralık", 0: "Telefonla" };
const SENDER = { name: "Emirhan Durmuşkaya", company: "Valmeto İç ve Dış Ticaret Ltd. Şti.", companyEn: "Valmeto Domestic and Foreign Trade Ltd.", phone: "+90 552 433 26 53" };
function senderPhone() { return lsGet("valmeto-phone", "") || SENDER.phone; }
function signature() { return [SENDER.name, SENDER.company, senderPhone() && "Phone / WhatsApp: " + senderPhone()].filter(Boolean).join("\n"); }

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
  const h1 = document.querySelector(".top h1");
  if (h1 && !h1.querySelector(".logo")) h1.insertAdjacentHTML("afterbegin", '<a href="index.html" class="logo-link"><img src="logo-header-v2.png" class="logo" alt="Valmeto Global Trade"></a>');
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
${signature()}
`;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

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
