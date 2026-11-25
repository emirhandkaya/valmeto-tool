// Mısır (Kahire ve çevresi) bakır / alüminyum tedarikçileri.
// Kaynak: firma siteleri ve iş rehberleri (Kasım 2026 web araştırması).
// HEDEF ÜRÜN: hurdadan üretilmiş bakır FİLMAŞİN ve TEL (hurda doğrudan alınmayacak).
// tier: "A" = HEDEF – hurdadan filmaşin / tel üreten veya üretebilecek firmalar
//       "B" = ORTA – külçe, bara, döküm, profil, kablo (filmaşin/tel ikincil; sorulacak)
//       "C" = REFERANS – büyük kurumsal, LME + yüksek prim; sadece fiyat karşılaştırması için
// source: "hurda" | "katot" | "karisik" | "birincil" | "bilinmiyor"
// day: gezi planındaki gün (1 = Pazar 29 Kas, 2 = Pazartesi 30 Kas, 3 = Salı 1 Ara, 0 = sadece telefon)
// Koordinatlar YAKLAŞIKTIR. Yola çıkmadan önce telefonla teyit edin.
window.FACTORIES = [
  // ================= A – HEDEF (ucuz / hurda bazlı) =================
  {
    id: "emw-factory", tier: "A", source: "karisik", day: 1, order: 5, star: true,
    name: "Egyptian Metal Works (EMW) – Fabrika",
    metal: ["bakir"],
    area: "Al Tebbin, Helwan (Güney Kahire)",
    address: "El Kawmeya Lel Asmant Road, Al Tebbin, Helwan, Cairo",
    lat: 29.7800, lng: 31.3000,
    phones: ["+20 2 2543 4303", "+20 2 2543 4304"],
    emails: ["info@egyptianmetalworks.com"],
    website: "https://egyptianmetalworks.com/",
    products: ["Oksijensiz (OF) tavlı bakır tel", "Bakır filmaşin / çubuk (upcast)", "Bakır baralar (busbar)", "Bakır alaşımları (pirinç vb.)"],
    notes: "EN GÜÇLÜ ADAY: döner fırın + 3 upcast makinesi = hurdadan oksijensiz filmaşin ve tel. Kablo fabrikalarına bakır tel satıyor – EuroCable'a satacağın ürünün tam karşılığı. 1938'den beri aile şirketi, 40.000 m².",
    verified: true
  },
  {
    id: "emw-hq", tier: "A", source: "karisik", day: 1, order: 1,
    name: "Egyptian Metal Works (EMW) – Merkez Ofis",
    metal: ["bakir"],
    area: "Downtown / Ataba",
    address: "74 Al Gomhoreya Street, Cairo 11511",
    lat: 30.0530, lng: 31.2480,
    phones: ["+20 2 2593 6641", "+20 2 2591 5090", "+20 2 2589 7095"],
    emails: ["info@egyptianmetalworks.com"],
    website: "https://egyptianmetalworks.com/",
    products: ["Fiyat teklifi ve satış görüşmeleri"],
    notes: "Sabah burada fiyat konuş, öğleden sonra Helwan fabrikasını gez.",
    verified: true
  },
  {
    id: "arab-metals-office", tier: "A", source: "hurda", day: 2, order: 1, star: true,
    name: "Arab Metals Co. (AMC) – Ofis",
    metal: ["bakir", "aluminyum"],
    area: "Nasr City, Zone 6",
    address: "28 Ibrahim Nawar St., Zone 6, Nasr City, Cairo",
    lat: 30.0560, lng: 31.3520, approxOnly: true,
    phones: ["+20 2 2271 4445", "+20 122 214 7682"],
    emails: ["arabmetals@arabmetals.com.eg"],
    contact: "Mahmoud Maghawry – Sahibi / CEO",
    website: "https://arabmetals.com.eg/",
    products: ["Alüminyum alaşım külçe (ingot)", "Bakır tel ve bakır külçe", "Kurşun külçe", "Paslanmaz briket"],
    notes: "Hurda geri dönüşümcüsü, yıllık ~10.500–13.500 t; bakır TEL üretiyor. Tel çapı, iletkenlik ve filmaşin yapıp yapmadığını sor. Fabrika Anshas'ta (Şarkiye, ~40 km). Cep numarasından WhatsApp ile randevu al.",
    verified: false
  },
  {
    id: "arab-metals-factory", tier: "A", source: "hurda", day: 2, order: 3,
    name: "Arab Metals Co. (AMC) – Anshas Fabrikası",
    metal: ["bakir", "aluminyum"],
    area: "Anshas, Şarkiye (Kahire'nin ~40 km kuzeydoğusu)",
    address: "Anshas, Sharqia Governorate",
    lat: 30.3900, lng: 31.4400, approxOnly: true,
    phones: ["+20 122 214 7682"],
    emails: ["arabmetals@arabmetals.com.eg"],
    website: "https://www.arabmetals.com.eg/profile.html",
    products: ["Üretim tesisi – tüm ürünler burada yapılıyor"],
    notes: "Konum köy/bölge tahmini. Tam adresi ofisten iste; 10th of Ramadan yolu üzerinde.",
    verified: false
  },
  {
    id: "wadi-el-nile", tier: "B", source: "hurda", day: 2, order: 4,
    name: "Wadi El Nile for Metal Industries (WN Copper)",
    metal: ["bakir"],
    area: "10th of Ramadan, A1 Sanayi Bölgesi",
    address: "Saba Street, Industrial Zone A1, 10th of Ramadan City 44637",
    lat: 30.2850, lng: 31.7300,
    phones: ["+20 102 533 3361", "+20 102 533 3369"],
    emails: ["info@wncopper.com"],
    website: "https://www.facebook.com/Wadielnilemetals/",
    products: ["Elektrik bakır baraları (busbar)", "Bakır lama / profil", "Bakır fabrikasyon parçaları", "Bakır hurda alım-satımı"],
    notes: "Bara/lama üreticisi – filmaşin/tel yapıyor mu sor. Hurda alım-satımı yaptığı için hurdadan filmaşin yapan firmaları tanır: 'Kim hurdadan filmaşin yapıyor?' diye sor.",
    verified: false
  },
  {
    id: "sabaek", tier: "A", source: "bilinmiyor", day: 2, order: 5,
    name: "Sabaek (Sabayek / شركة سبائك) – Alaşım & Bakır Tel",
    metal: ["bakir", "aluminyum"],
    area: "10th of Ramadan, 3. Sanayi Bölgesi A5",
    address: "3rd Industrial Zone A5, 10th of Ramadan City",
    lat: 30.3050, lng: 31.7550, approxOnly: true,
    phones: ["+20 102 666 7811", "+20 55 449 9326"],
    emails: [],
    website: "https://yellowpages.com.eg/ar/profile/%D8%B4%D8%B1%D9%83%D8%A9-%D8%B3%D8%A8%D8%A7%D8%A6%D9%83/567749",
    products: ["Bakır tel (sanayi rehberi)", "Alaşım / külçe (adı 'sabaek' = külçeler)"],
    notes: "İki ayrı rehber kaydı birleştirildi; aynı firma olmayabilir. Arapça arayın.",
    verified: false
  },
  {
    id: "coppermelt", tier: "B", source: "hurda", day: 2, order: 6,
    name: "Coppermelt",
    metal: ["bakir"],
    area: "10th of Ramadan, 3. Sanayi Bölgesi A6 Doğu",
    address: "Plot 36, 3rd Industrial Zone A6 East, 10th of Ramadan, Sharqia",
    lat: 30.3100, lng: 31.7800,
    phones: [], emails: [],
    website: "https://yellowpages.com.eg/en/search/copper-tubes-hard-and-soft",
    products: ["Bakır boru ve tüpler (rehber kaydı)", "Adından bakır ergitme (döküm) yaptığı anlaşılıyor"],
    notes: "İletişim yok – Wadi El Nile'den sonra kapısına uğra.",
    verified: false
  },
  {
    id: "hitech-casting", tier: "B", source: "hurda", day: 1, order: 3,
    name: "HiTech Casting for Metal Industries",
    metal: ["aluminyum"],
    area: "Yeni Maadi (Güney Kahire)",
    address: "St. No. 501, New Maadi, Cairo 11391",
    lat: 29.9650, lng: 31.3050, approxOnly: true,
    phones: [], emails: [],
    website: "https://www.scrapmonster.com/company/hitech-casting-for-metal-industries/67895",
    products: ["İkincil (hurdadan) alüminyum alaşım külçe (ADC12 vb.)"],
    notes: "Alüminyum alaşım külçe (döküm sanayi için) – kablo filmaşini değil. Vakit kalırsa uğra.",
    verified: false
  },
  {
    id: "nile-copper", tier: "A", source: "hurda", day: 3, order: 1, star: true,
    name: "Nile Copper Co. (NCC) + Shubra El Kheima atölyeleri",
    metal: ["bakir"],
    area: "Shubra El Kheima (Kuzey Kahire)",
    address: "Ring Road – Nazlet Shubra El Kheima, Qalyubia",
    lat: 30.1300, lng: 31.2600, approxOnly: true,
    phones: ["+20 2 4444 3963 (bölge firması, rehber)", "+20 2 4220 5043 (bölge firması, rehber)"],
    emails: [],
    website: "https://yellowpages.com.eg/ar/search/copper",
    products: ["Kablo ve tel (NCC)", "Bölgede hurdadan bakır döküp tel çeken küçük atölyeler"],
    notes: "Mısır'ın küçük bakır dökümhanelerinin merkezi – en ucuz fiyat burada çıkar ama kalite/fatura riskli. Telefonlar eski rehberden (Shubra'daki metal firmaları). Arapça kartı kullan.",
    verified: false
  },
  {
    id: "amana-copper", tier: "B", source: "hurda", day: 3, order: 3,
    name: "Misr Copper Products – Al Amana Foundries (مسابك الأمانة)",
    metal: ["bakir", "pirinc"],
    area: "6th of October fabrika; Bulaq Abu El Ela şube",
    address: "6th of October City (fabrika) / Bulaq Abu El Ela, Cairo (şube)",
    lat: 29.9400, lng: 30.9200, approxOnly: true,
    phones: ["+20 100 062 4615", "+20 105 050 4949"],
    emails: [],
    website: "https://www.egydir.com/en/6791/",
    products: ["Bakır ve pirinç döküm parçaları", "Bakır döküm külçe (sorulacak)"],
    notes: "Dökümhane – hurda bakır/pirinç eritiyor. Pirinç alıcıların (Kaplan, Truva vb.) için de kaynak olabilir.",
    verified: false
  },
  {
    id: "egyptian-copper-works", tier: "A", source: "bilinmiyor", day: 0, star: true,
    name: "Egyptian Copper Works (İskenderiye)",
    metal: ["bakir"],
    area: "İskenderiye (telefonla / Kahire satış ofisi)",
    address: "31 Hagar El Nawateya St. / El Shohada Square, Alexandria",
    lat: 31.1960, lng: 29.9030,
    phones: ["+20 2 2590 3829 (Kahire satış)", "+20 3 500 6032 (İskenderiye)"],
    emails: [],
    website: "https://egyptiancopperworks.com/contact-us/",
    products: ["8 mm bakır filmaşin / tel", "İhracat hizmeti"],
    notes: "8 mm filmaşin + ihracat – tam hedef ürün. 1934'ten beri, İskenderiye limana yakın (FOB avantajı). Pazar sabahı Kahire satış ofisini ara; Kahire'de görüşme veya numune iste.",
    verified: false
  },
  {
    id: "al-haram-metals", tier: "B", source: "hurda", day: 0,
    name: "Al Haram Metals (الهرم للمعادن)",
    metal: ["bakir", "aluminyum"],
    area: "Kafr El Sheikh (Kahire'ye ~150 km) – Obour'da da kaydı var",
    address: "Dowaran Bay' Al-Masnoa'at, Kafr El-Sheikh",
    lat: 31.1107, lng: 30.9388, approxOnly: true,
    phones: ["+20 100 535 3453", "+20 47 325 9105"],
    emails: ["sales@alharmmetals.com"],
    website: "https://alharam-metals.com/contact-us/",
    products: ["Bakır ve alüminyum geri dönüşüm", "Alüminyum külçe", "Çinko, kurşun, kalay külçe"],
    notes: "Rehberde Obour'da 'Al Haram Metals – hurda geri dönüşüm, alüminyum külçe' kaydı da var. Telefonla sor: Kahire/Obour'da görülebilecek tesis var mı? E-posta sitede bu yazımla.",
    verified: true
  },

  // ================= B – ORTA (yarı mamul / profil / kablo) =================
  {
    id: "alumisr", tier: "B", source: "bilinmiyor", day: 1, order: 4,
    name: "Alu Misr (Egyptian Aluminium Products Co.)",
    metal: ["aluminyum"],
    area: "Wadi Houf, Helwan",
    address: "Wadi Houf Industrial Zone, Helwan, Cairo",
    lat: 29.8655, lng: 31.3270,
    phones: ["+20 2 2367 1363", "+20 2 2367 1350"],
    emails: ["sales@alumisr.com", "tech.office@alumisr.com"],
    website: "https://alumisr.com/en/",
    products: ["Alüminyum ekstrüzyon profilleri", "Eloksallı / boyalı profiller"],
    notes: "Profil üreticisi (ham alüminyum değil). Billet/hurda kaynaklarını ve profil hurdası satıp satmadığını sor. Helwan yolu üstü.",
    verified: true
  },
  {
    id: "eurotal", tier: "B", source: "bilinmiyor", day: 2, order: 2,
    name: "Eurotal for Aluminium",
    metal: ["aluminyum"],
    area: "Obour City",
    address: "B&C Industrial Zone, Obour City, Cairo",
    lat: 30.2280, lng: 31.4700,
    phones: ["+20 106 164 4444"],
    emails: ["info@eurotal-eg.com"],
    website: "https://eurotal-eg.com/",
    products: ["Alüminyum ekstrüzyon profilleri"],
    notes: "Profil üreticisi; 10th of Ramadan yolu üstü, vakit kalırsa.",
    verified: true
  },
  {
    id: "intercairo", tier: "B", source: "bilinmiyor", day: 3, order: 4,
    name: "InterCairo Aluminium Extrusion",
    metal: ["aluminyum"],
    area: "6th of October Sanayi Bölgesi",
    address: "6th of October Industrial Zone, Giza",
    lat: 29.9330, lng: 30.9050,
    phones: ["+20 2 3824 3401", "+20 100 530 0117"],
    emails: ["muhab@intercairo.com"],
    website: "https://www.intercairo.com/",
    products: ["Alüminyum ekstrüzyon profilleri"],
    notes: "Profil üreticisi. Al Amana dökümhanesiyle aynı gün.",
    verified: true
  },
  {
    id: "arab-aluminum", tier: "B", source: "bilinmiyor", day: 0,
    name: "Arab Aluminum Company S.A.E. (EGX: ALUM)",
    metal: ["aluminyum"],
    area: "Kahire merkez ofis",
    address: "3 Ahmed El Dardiry Street, Cairo",
    lat: 30.0600, lng: 31.3400, approxOnly: true,
    phones: ["+20 2 2417 8539", "+20 2 2417 8538"],
    emails: [],
    website: "https://stockanalysis.com/quote/egx/ALUM/company",
    products: ["Alüminyum ekstrüzyon profilleri"],
    notes: "Borsa şirketi, profil üreticisi. Sadece telefonla.",
    verified: false
  },
  {
    id: "cairo-cables-factory", tier: "B", source: "katot", day: 3, order: 2,
    name: "Cairo Cables Company – Fabrika",
    metal: ["bakir"],
    area: "Qalyub",
    address: "10 Cairo-Alexandria Agricultural Road, Qalyub City",
    lat: 30.1800, lng: 31.2050,
    phones: ["+20 2 4407 4509", "+20 101 515 1715", "+20 2 4405 5514"],
    emails: ["info@cairocables.com"],
    website: "https://cairocables.com/en/",
    products: ["Bakır iletkenli kablolar", "Bakır tel"],
    notes: "Kablo üreticisi: ham bakır satıcısı değil, ALICI. Bakır tel fazlası satıp satmadığını ve kimden aldığını sor (tedarikçi ipucu). Shubra'ya 10 km.",
    verified: true
  },
  {
    id: "eramco", tier: "B", source: "bilinmiyor", day: 0,
    name: "ERAMCO – Egypt Aluminum for Rolling and Container Foil",
    metal: ["aluminyum"],
    area: "Obour Sanayi Bölgesi",
    address: "Obour Industrial Area, Cairo",
    lat: 30.2200, lng: 31.4900,
    phones: [], emails: ["tarek.emam@packandroll.net"],
    contact: "Tarek Emam – Satış & İhracat Müdürü",
    website: "https://engexportdirectory.org/egypt-aluminum-for-rolling-and-container-foil/",
    products: ["Alüminyum folyo, folyo kap, bobin"],
    notes: "Folyo üreticisi – düşük öncelik.",
    verified: false
  },

  // ================= C – REFERANS (büyük / pahalı) =================
  {
    id: "umc", tier: "C", source: "katot", day: 0,
    name: "United Metals Company (UMC) – Elsewedy grubu",
    metal: ["bakir"],
    area: "10th of Ramadan City",
    address: "10th of Ramadan City, Sharqia",
    lat: 30.2950, lng: 31.7600,
    phones: ["+20 2 2759 9700 (Elsewedy santral)"],
    emails: ["info-umc@elsewedy.com"],
    website: "https://www.elsewedyelectric.com/",
    products: ["8 mm sürekli döküm bakır filmaşin (130.000 t/yıl)"],
    notes: "Katottan birinci kalite filmaşin – LME + prim, pazarlık zor. Fiyatını 'tavan referans' olarak al.",
    verified: true
  },
  {
    id: "elsewedy-hq", tier: "C", source: "katot", day: 0,
    name: "Elsewedy Electric – Genel Merkez",
    metal: ["bakir", "aluminyum"],
    area: "Cairo Festival City, Yeni Kahire",
    address: "Plot 13C03, Southern Business Park C, Cairo Festival City, New Cairo",
    lat: 30.0280, lng: 31.4080,
    phones: ["+20 2 2759 9700"],
    emails: ["info@elsewedy.com"],
    website: "https://www.elsewedyelectric.com/",
    products: ["Grup satış: kablolar, UMC filmaşin"],
    notes: "Büyük kurumsal – referans.",
    verified: true
  },
  {
    id: "egyptalum", tier: "C", source: "birincil", day: 1, order: 2,
    name: "Egyptalum (Aluminium Company of Egypt) – Kahire ofisi",
    metal: ["aluminyum"],
    area: "Downtown (tesis Nag Hammadi'de)",
    address: "48-50 Abdel Khalek Sarwat Street, Downtown, Cairo",
    lat: 30.0520, lng: 31.2440,
    phones: ["+20 96 659 0001 (Nag Hammadi tesis)"],
    emails: ["info@egyptalum.com.eg"],
    website: "http://www.egyptalum.com.eg/",
    products: ["Birincil alüminyum külçe", "Billet", "Alüminyum filmaşin (kablo için)"],
    notes: "ALÜMİNYUM İÇİN NOT: kablo kalitesi (EC) alüminyum filmaşin hurdadan pek yapılmaz; Mısır'daki gerçekçi kaynak bu devlet şirketi (LME + prim). EMW ofisine 500 m – alüminyum filmaşin fiyatını sor.",
    verified: false
  },
  {
    id: "q-bars", tier: "C", source: "bilinmiyor", day: 0,
    name: "Q-Bars Power Busbar",
    metal: ["bakir"],
    area: "Sadat City (~90 km)",
    address: "Sadat City Industrial Zone, Menoufia",
    lat: 30.3650, lng: 30.5300, approxOnly: true,
    phones: [], emails: [],
    website: "https://q-bars.com/",
    products: ["Bara kanal sistemleri (mamul)"],
    notes: "Mamul ürün – hammadde ticareti için uygun değil.",
    verified: false
  }
];

// Fiyat referansları (sayfalardaki kutulardan güncellenebilir)
window.LME_REF = { copper: 11660, aluminium: 2800, date: "25.11.2026",
  source: "https://tradingeconomics.com/commodity/copper", sourceAl: "https://www.alcircle.com/news/lme-cash-aluminium-climbs-0-77-to-2-825-t-exchange-stocks-slip-0-37-116388" };
window.FX_REF = { usdEgp: 53.8, date: "15.11.2026", source: "https://www.arabfinance.com/en/news/newdetails/usd-egp-exchange-rate-on-november-15-2026" };
// Mısır iç piyasa hurda fiyatları (EGP/kg) – pazarlık için referans
window.EG_SCRAP = {
  date: "25.11.2026",
  source: "https://www.egyin.com/article/162416/",
  items: [
    { name: "Parlak kırmızı bakır hurda (kablo – 'lamee')", min: 530, max: 550, metal: "bakir" },
    { name: "Kırmızı bakır hurda (sessiz/standart)", min: 450, max: 520, metal: "bakir" },
    { name: "Karışık bakır hurda", min: 440, max: 500, metal: "bakir" },
    { name: "Sarı (pirinç) hurda", min: 190, max: 210, metal: "pirinc" },
    { name: "Alüminyum hurda (temiz, Ağustos 2026 verisi)", min: 150, max: 250, metal: "aluminyum" }
  ]
};
