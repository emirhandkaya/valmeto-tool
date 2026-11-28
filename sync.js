// Cihazlar arası eşitleme (Supabase). Veriler önce cihazda (localStorage) tutulur,
// giriş yapılmışsa her değişiklik buluta gönderilir ve diğer cihazdaki değişiklikler alınır.
(function () {
  const URL_ = "https://jamgzbguessbwdrmohlj.supabase.co";
  const KEY = "sb_publishable_MDqvLwbnt1BhJFVkFNJDfw_9IDWZngS";
  const EMAIL = "app@valmeto.com";
  const AUTH_K = "valmeto-sync-auth", META_K = "valmeto-sync-meta";
  // Yalnızca görünüm tercihleri eşitlenmez (her cihazın kendi ayarı)
  const LOCAL_ONLY = new Set(["valmeto-mapmode", "valmeto-map-day", "valmeto-lastvisit", AUTH_K, META_K]);
  const synced = k => !LOCAL_ONLY.has(k) && (k.startsWith("valmeto-") || k === "musteri-takip-v1" || k === "kahire-fabrika-notlari-v1");

  const ls = window.localStorage;
  const rawSet = Storage.prototype.setItem, rawRemove = Storage.prototype.removeItem;
  const rget = k => { try { return ls.getItem(k); } catch (e) { return null; } };
  const rjson = (k, d) => { try { return JSON.parse(rget(k)) ?? d; } catch (e) { return d; } };
  const wjson = (k, v) => { try { rawSet.call(ls, k, JSON.stringify(v)); } catch (e) {} };
  const meta = () => Object.assign({ dirty: {}, last: null, first: true }, rjson(META_K, {}));
  const saveMeta = m => wjson(META_K, m);

  let pushTimer = null, busy = false, state = "off", lastOk = null, pendingReload = false;

  // Her yazmayı yakala: eşitlenen anahtar değişince "gönderilecek" olarak işaretle
  Storage.prototype.setItem = function (k, v) {
    rawSet.call(this, k, v);
    if (this === ls && synced(k)) markDirty(k);
  };
  Storage.prototype.removeItem = function (k) {
    rawRemove.call(this, k);
    if (this === ls && synced(k)) markDirty(k);
  };
  function markDirty(k) {
    const m = meta(); m.dirty[k] = Date.now(); saveMeta(m);
    if (auth()) { clearTimeout(pushTimer); pushTimer = setTimeout(syncNow, 1200); setState("pending"); }
  }

  // ---- Oturum ----
  const auth = () => rjson(AUTH_K, null);
  async function login(password) {
    const r = await fetch(URL_ + "/auth/v1/token?grant_type=password", {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" },
      body: JSON.stringify({ email: EMAIL, password })
    });
    const j = await r.json().catch(() => ({}));
    if (!r.ok || !j.access_token) throw new Error(r.status === 400 ? "Şifre yanlış" : "Bağlanılamadı");
    storeSession(j); const m = meta(); m.first = true; m.last = null; saveMeta(m);
  }
  function storeSession(j) { wjson(AUTH_K, { at: j.access_token, rt: j.refresh_token, exp: Date.now() + (j.expires_in || 3600) * 1000 }); }
  async function token() {
    const a = auth(); if (!a) return null;
    if (a.exp - Date.now() > 60000) return a.at;
    const r = await fetch(URL_ + "/auth/v1/token?grant_type=refresh_token", {
      method: "POST", headers: { apikey: KEY, "Content-Type": "application/json" }, body: JSON.stringify({ refresh_token: a.rt })
    });
    if (r.status === 400 || r.status === 401) { rawRemove.call(ls, AUTH_K); setState("off"); return null; }
    if (!r.ok) throw new Error("net");
    const j = await r.json(); storeSession(j); return j.access_token;
  }
  function logout() { rawRemove.call(ls, AUTH_K); setState("off"); }

  async function api(path, opt = {}) {
    const t = await token(); if (!t) throw new Error("noauth");
    const r = await fetch(URL_ + "/rest/v1/" + path, Object.assign({}, opt, {
      headers: Object.assign({ apikey: KEY, Authorization: "Bearer " + t, "Content-Type": "application/json" }, opt.headers || {})
    }));
    if (!r.ok) throw new Error("http " + r.status);
    return r.status === 204 ? null : r.json();
  }

  const isObj = x => x && typeof x === "object" && !Array.isArray(x);
  const parse = s => { if (s == null) return null; try { return JSON.parse(s); } catch (e) { return s; } };

  // ---- Eşitleme: önce buluttakini al, sonra bekleyenleri gönder ----
  async function syncNow() {
    if (busy || !auth()) return; busy = true; setState("busy");
    try {
      const m = meta();
      const q = "valmeto_kv?select=k,v,updated_at&order=updated_at.asc" + (m.last && !m.first ? "&updated_at=gt." + encodeURIComponent(m.last) : "");
      const rows = await api(q);
      let changed = false;
      for (const row of rows) {
        if (!synced(row.k)) continue;
        const localStr = rget(row.k);
        if (m.first) {
          // İlk girişte iki cihazın verisini kaybetmeden birleştir
          const lv = parse(localStr);
          let nv = row.v;
          if (isObj(lv) && isObj(row.v)) nv = Object.assign({}, row.v, lv);
          else if (localStr != null && row.v == null) nv = lv;
          const ns = nv == null ? null : JSON.stringify(nv);
          if (ns !== JSON.stringify(row.v)) m.dirty[row.k] = Date.now();
          if (ns !== localStr) { ns == null ? rawRemove.call(ls, row.k) : rawSet.call(ls, row.k, ns); changed = true; }
        } else if (!m.dirty[row.k]) {
          const ns = row.v == null ? null : JSON.stringify(row.v);
          if (ns !== localStr) { ns == null ? rawRemove.call(ls, row.k) : rawSet.call(ls, row.k, ns); changed = true; }
        }
        if (!m.last || row.updated_at > m.last) m.last = row.updated_at;
      }
      if (m.first) {
        const remoteKeys = new Set(rows.map(r => r.k));
        for (let i = 0; i < ls.length; i++) { const k = ls.key(i); if (synced(k) && !remoteKeys.has(k)) m.dirty[k] = Date.now(); }
        m.first = false;
      }
      saveMeta(m);
      // Bekleyen değişiklikleri gönder
      const keys = Object.keys(m.dirty);
      if (keys.length) {
        const stamp = Object.assign({}, m.dirty);
        const body = keys.map(k => ({ k, v: parse(rget(k)) }));
        const res = await api("valmeto_kv?on_conflict=owner,k", {
          method: "POST", headers: { Prefer: "resolution=merge-duplicates,return=representation" }, body: JSON.stringify(body)
        });
        const m2 = meta();
        for (const k of keys) if (m2.dirty[k] === stamp[k]) delete m2.dirty[k]; // gönderimden sonra yeniden değiştiyse işaret kalsın
        saveMeta(m2);
      }
      lastOk = new Date(); setState(Object.keys(meta().dirty).length ? "pending" : "ok");
      if (changed) onRemoteChange();
    } catch (e) {
      setState(e.message === "noauth" ? "off" : "err");
    } finally { busy = false; }
  }

  function editing() { const a = document.activeElement; return a && /^(INPUT|TEXTAREA|SELECT)$/.test(a.tagName) && a.type !== "checkbox"; }
  function onRemoteChange() {
    if (editing()) { pendingReload = true; setState("new"); return; }
    location.reload();
  }
  document.addEventListener("focusout", () => setTimeout(() => { if (pendingReload && !editing()) location.reload(); }, 300));

  // ---- Arayüz: menüde durum düğmesi + şifre penceresi ----
  const LABEL = { off: "🔒 Eşitleme kapalı", busy: "☁️ Eşitleniyor…", ok: "☁️ Eşitlendi", pending: "☁️ Gönderiliyor…", err: "⚠️ Çevrimdışı", new: "☁️ Yeni veri var" };
  function setState(s) { state = s; const b = document.getElementById("syncBtn"); if (b) { b.textContent = LABEL[s] || s; b.dataset.state = s; } }
  function badge() {
    const nav = document.getElementById("nav"); if (!nav || document.getElementById("syncBtn")) return;
    nav.insertAdjacentHTML("beforeend", '<a href="#" id="syncBtn" class="syncbtn"></a>');
    document.getElementById("syncBtn").onclick = e => { e.preventDefault(); openBox(); };
    setState(auth() ? (state === "off" ? "ok" : state) : "off");
  }
  function openBox() {
    let box = document.getElementById("syncBox");
    if (!box) {
      document.body.insertAdjacentHTML("beforeend", `<div id="syncBox" class="sync-ov"><div class="sync-card" role="dialog" aria-label="Eşitleme">
        <h3>☁️ Cihazlar arası eşitleme</h3><div id="syncBody"></div>
        <button type="button" class="btn" id="syncClose">Kapat</button></div></div>`);
      box = document.getElementById("syncBox");
      box.onclick = e => { if (e.target === box || e.target.id === "syncClose") box.remove(); };
    }
    const body = document.getElementById("syncBody");
    if (auth()) {
      body.innerHTML = `<p>Bu cihaz bağlı. Notlar, iletişim durumları, ziyaret tarihleri, formlar ve müşteri takibi diğer cihazlarla otomatik eşitlenir.</p>
        <p class="muted">Son eşitleme: ${lastOk ? lastOk.toLocaleTimeString("tr-TR", { hour: "2-digit", minute: "2-digit" }) : "—"}${state === "err" ? " · İnternet yok, bağlanınca gönderilecek." : ""}</p>
        <p class="muted">Ziyaret fotoğrafları yalnızca bu cihazda kalır.</p>
        <div class="sync-row"><button type="button" class="btn primary" id="syncGo">Şimdi eşitle</button><button type="button" class="btn" id="syncOut">Çıkış yap</button></div>`;
      document.getElementById("syncGo").onclick = () => { syncNow().then(openBox); };
      document.getElementById("syncOut").onclick = () => { if (confirm("Bu cihazda eşitleme kapatılsın mı? Veriler cihazda kalır.")) { logout(); openBox(); } };
    } else {
      body.innerHTML = `<p>Telefon ve iPad'de aynı verileri görmek için şifreyi gir. Her cihazda bir kez yeterli.</p>
        <form id="syncForm" class="sync-row"><input type="password" id="syncPw" placeholder="Şifre" autocomplete="current-password" required>
        <button class="btn primary">Bağlan</button></form><p id="syncErr" class="sync-err"></p>`;
      document.getElementById("syncForm").onsubmit = async e => {
        e.preventDefault(); const err = document.getElementById("syncErr"); err.textContent = "Bağlanıyor…";
        try { await login(document.getElementById("syncPw").value); err.textContent = ""; setState("busy"); await syncNow(); openBox(); }
        catch (x) { err.textContent = x.message === "Şifre yanlış" ? "Şifre yanlış." : "Bağlanılamadı. İnternet bağlantını kontrol et."; }
      };
      setTimeout(() => { const p = document.getElementById("syncPw"); p && p.focus(); }, 50);
    }
  }

  function start() {
    badge();
    if (auth()) syncNow();
    else if (!sessionStorage.getItem("valmeto-sync-asked")) { try { sessionStorage.setItem("valmeto-sync-asked", "1"); } catch (e) {} openBox(); }
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => setTimeout(start, 0)); else setTimeout(start, 0);
  document.addEventListener("visibilitychange", () => { if (document.visibilityState === "visible") syncNow(); else if (Object.keys(meta().dirty).length) syncNow(); });
  window.addEventListener("online", syncNow);
  setInterval(() => { if (document.visibilityState === "visible") syncNow(); }, 20000);
  window.valmetoSync = { syncNow, openBox };
})();
