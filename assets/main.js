/* ======================================================
   פרטי העסק – לעדכן כאן בלבד, והאתר מתעדכן בכל העמודים
   ====================================================== */
const SITE = {
  phone:     "050-842-2649",        // טלפון ראשי לתצוגה
  phoneIntl: "+972508422649",       // טלפון ראשי בפורמט בינלאומי לחיוג
  phone2:    "050-901-0517",        // טלפון נוסף
  phone2Intl:"+972509010517",
  whatsapp:  "972508422649",        // מספר וואטסאפ בלי + ובלי 0 בהתחלה
  email:     "nabeel33@walla.co.il",
  facebook:  "https://www.facebook.com/%D7%A0%D7%91%D7%99%D7%9C-%D7%A1%D7%99%D7%99%D7%93-%D7%A0%D7%99%D7%94%D7%95%D7%9C-%D7%95%D7%A2%D7%91%D7%95%D7%93%D7%95%D7%AA-%D7%A7%D7%91%D7%9C%D7%A0%D7%95%D7%AA-%D7%91%D7%A2%D7%9E-118340010002879",
  area:      "כל רחבי הארץ",
  hours:     ""                     // שעות פעילות – ריק = השורה לא מוצגת
};

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

$$("[data-phone2]").forEach(el => el.textContent = SITE.phone2);
$$("[data-phone2-link]").forEach(el => el.href = "tel:" + SITE.phone2Intl);
$$("[data-facebook-link]").forEach(el => el.href = SITE.facebook);
if (!SITE.hours) $$("[data-hours]").forEach(el => (el.closest("li") || el).remove());
$$("[data-phone]").forEach(el => el.textContent = SITE.phone);
$$("[data-email]").forEach(el => el.textContent = SITE.email);
$$("[data-area]").forEach(el => el.textContent = SITE.area);
$$("[data-hours]").forEach(el => el.textContent = SITE.hours);
$$("[data-phone-link]").forEach(el => el.href = "tel:" + SITE.phoneIntl);
$$("[data-mail-link]").forEach(el => el.href = "mailto:" + SITE.email);
const waBase = "https://wa.me/" + SITE.whatsapp;
$$("[data-wa-link]").forEach(el =>
  el.href = waBase + "?text=" + encodeURIComponent("שלום, אשמח לקבל פרטים על שירותי נביל סייד ניהול פרויקטים"));
$$("[data-year]").forEach(el => el.textContent = new Date().getFullYear());

/* active page in the menu */
(function(){
  // works for both "about.html" and clean URLs like "/about" (Vercel)
  const clean = s => (s.split("#")[0].split("?")[0].replace(/\.html$/, "") || "index");
  const page = clean(location.pathname.split("/").pop());
  $$(".nav a[href]").forEach(a => {
    const href = a.getAttribute("href");
    if (!href.includes("#") && clean(href) === page) a.setAttribute("aria-current", "page");
  });
})();

/* roof ribs in the hero illustration (converging lines for perspective) */
(function(){
  const gNew = $("#ribsNew"), gNewS = $("#ribsNewShade"), gOld = $("#ribsOld");
  if (!gNew) return;
  const NS = "http://www.w3.org/2000/svg";
  const add = (g, x1, y1, x2, y2) => {
    const l = document.createElementNS(NS, "line");
    l.setAttribute("x1", x1); l.setAttribute("y1", y1);
    l.setAttribute("x2", x2); l.setAttribute("y2", y2);
    g.appendChild(l);
  };
  const N = 24, bx0 = 60, bw = 480, tx0 = 120, tw = 360;
  for (let i = 0; i <= N; i++) {
    const xb = bx0 + i * bw / N, xt = tx0 + i * tw / N;
    add(gNew, xb, 240, xt, 110);
    add(gNewS, xb + 6, 240, xt + 4.5, 110);
    add(gOld, xb, 240, xt, 110);
  }
})();

/* header + mobile menu */
const topbar = $(".topbar"), nav = $("#nav"), menuBtn = $("#menuBtn");
const onScroll = () => topbar.classList.toggle("scrolled", window.scrollY > 30);
window.addEventListener("scroll", onScroll, {passive:true}); onScroll();
const closeMenu = () => { nav.classList.remove("open"); topbar.classList.remove("menu-open"); menuBtn.setAttribute("aria-expanded", false); };
menuBtn.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  topbar.classList.toggle("menu-open", open);
  menuBtn.setAttribute("aria-expanded", open);
});
$$("a", nav).forEach(a => a.addEventListener("click", closeMenu));
document.addEventListener("keydown", e => { if (e.key === "Escape") closeMenu(); });

/* service buttons pre-select the form (same page, or via ?service= on contact.html) */
const serviceSelect = $("#fService");
$$("[data-service]").forEach(btn => btn.addEventListener("click", () => {
  if (serviceSelect) serviceSelect.value = btn.dataset.service;
}));
if (serviceSelect) {
  const s = new URLSearchParams(location.search).get("service");
  if (s && [...serviceSelect.options].some(o => o.value === s)) serviceSelect.value = s;
}

/* reveal on scroll + counters */
const reduceMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const io = new IntersectionObserver(entries => entries.forEach(e => {
  if (!e.isIntersecting) return;
  e.target.classList.add("in");
  const num = e.target.querySelector("[data-count]");
  if (num && !reduceMotion) {
    const end = +num.dataset.count, suf = num.dataset.suffix || "", t0 = performance.now();
    const tick = t => { const p = Math.min((t - t0) / 1400, 1); num.textContent = Math.round(end * (1 - Math.pow(1 - p, 3))) + suf; if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }
  io.unobserve(e.target);
}), {threshold:.12});
$$(".reveal").forEach(el => io.observe(el));

/* projects filter */
(function(){
  const bar = $("#filters");
  if (!bar) return;
  const tiles = $$("[data-cat]");
  bar.addEventListener("click", e => {
    const btn = e.target.closest("button[data-filter]");
    if (!btn) return;
    $$("button", bar).forEach(b => b.setAttribute("aria-pressed", b === btn));
    const f = btn.dataset.filter;
    tiles.forEach(t => t.hidden = !(f === "all" || t.dataset.cat.split(" ").includes(f)));
  });
})();

/* photo lightbox: any .tile[data-full] opens enlarged; arrows move within the same gallery */
(function(){
  const tiles = $$(".tile[data-full]");
  if (!tiles.length || !window.HTMLDialogElement) return;
  const dlg = document.createElement("dialog");
  dlg.className = "lightbox";
  dlg.setAttribute("aria-label", "תצוגת תמונה מוגדלת");
  dlg.innerHTML = '<figure><img alt=""><figcaption></figcaption></figure>' +
    '<button class="lb-btn lb-close" type="button" aria-label="סגירה">✕</button>' +
    '<button class="lb-btn lb-prev" type="button" aria-label="התמונה הקודמת">›</button>' +
    '<button class="lb-btn lb-next" type="button" aria-label="התמונה הבאה">‹</button>';
  document.body.appendChild(dlg);
  const img = $("img", dlg), cap = $("figcaption", dlg);
  let list = [], idx = 0;
  const show = i => {
    idx = (i + list.length) % list.length;
    const t = list[idx], src = $("img", t);
    img.src = t.dataset.full;
    img.alt = src ? src.alt : "";
    cap.innerHTML = $("figcaption", t) ? $("figcaption", t).innerHTML : "";
  };
  tiles.forEach(t => {
    t.tabIndex = 0;
    t.setAttribute("role", "button");
    const open = () => {
      list = $$(".tile[data-full]", t.parentElement).filter(x => !x.hidden);
      show(list.indexOf(t));
      dlg.showModal();
    };
    t.addEventListener("click", open);
    t.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  $(".lb-close", dlg).addEventListener("click", () => dlg.close());
  $(".lb-prev", dlg).addEventListener("click", () => show(idx - 1));
  $(".lb-next", dlg).addEventListener("click", () => show(idx + 1));
  dlg.addEventListener("click", e => { if (e.target === dlg) dlg.close(); });
  dlg.addEventListener("keydown", e => {
    if (e.key === "ArrowLeft") show(idx + 1);   // RTL: left = next
    if (e.key === "ArrowRight") show(idx - 1);
  });
})();

/* lead form -> WhatsApp */
const form = $("#leadForm");
if (form) form.addEventListener("submit", e => {
  e.preventDefault();
  const note = $("#formNote");
  const name = form.name.value.trim(), phone = form.phone.value.trim();
  if (!name || phone.replace(/\D/g, "").length < 9) {
    note.textContent = "נא למלא שם ומספר טלפון תקין.";
    note.style.color = "#c0392b";
    (!name ? form.name : form.phone).focus();
    return;
  }
  note.textContent = "הפרטים משמשים רק לחזרה אליכם."; note.style.color = "";
  const lines = [
    "פנייה חדשה מהאתר – נביל סייד ניהול פרויקטים",
    "שם: " + name,
    "טלפון: " + phone,
    "שירות: " + form.service.value,
    form.city.value.trim() && "יישוב: " + form.city.value.trim(),
    form.message.value.trim() && "פרטים: " + form.message.value.trim()
  ].filter(Boolean);
  window.open(waBase + "?text=" + encodeURIComponent(lines.join("\n")), "_blank", "noopener");
});

/* safe localStorage (may be blocked in private mode) */
const store = {
  get(k) { try { return JSON.parse(localStorage.getItem(k)); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
};

/* ======================================================
   תפריט נגישות
   ====================================================== */
(function(){
  const KEY = "ns-a11y";
  const ZOOMS = [1, 1.1, 1.2, 1.35];
  const TOGGLES = [
    ["contrast", "ניגודיות גבוהה", '<circle cx="12" cy="12" r="9"/><path d="M12 3v18a9 9 0 0 0 0-18z" fill="currentColor"/>'],
    ["gray",     "גווני אפור",     '<circle cx="12" cy="12" r="9"/><path d="M12 3a9 9 0 0 1 0 18" stroke-dasharray="2 2"/>'],
    ["links",    "הדגשת קישורים",  '<path d="M10 13a5 5 0 0 0 7.5.5l3-3a5 5 0 0 0-7-7l-1.7 1.7"/><path d="M14 11a5 5 0 0 0-7.5-.5l-3 3a5 5 0 0 0 7 7l1.7-1.7"/>'],
    ["font",     "גופן קריא",      '<path d="M4 20 10 4h1l6 16M6.5 14h8"/>'],
    ["spacing",  "ריווח שורות",    '<path d="M8 6h13M8 12h13M8 18h13M3 4v16M1.5 6 3 4l1.5 2M1.5 18 3 20l1.5-2"/>'],
    ["noanim",   "עצירת אנימציות", '<circle cx="12" cy="12" r="9"/><path d="M10 9v6M14 9v6"/>'],
    ["cursor",   "סמן גדול",       '<path d="M5 3l13 9-6 1.5 3.5 6.5-2.6 1.4-3.5-6.6L5 19z"/>']
  ];
  const ZOOM_TARGETS = ".topbar, main, footer";
  let state = Object.assign({ zoom: 0 }, store.get(KEY) || {});

  const apply = () => {
    const root = document.documentElement;
    TOGGLES.forEach(([k]) => root.classList.toggle("a11y-" + k, !!state[k]));
    $$(ZOOM_TARGETS).forEach(el => el.style.zoom = ZOOMS[state.zoom] === 1 ? "" : ZOOMS[state.zoom]);
    if (state.noanim) $$(".reveal").forEach(el => el.classList.add("in"));
    store.set(KEY, state);
    if (panel) {
      $$("[data-a11y]", panel).forEach(b => b.setAttribute("aria-pressed", !!state[b.dataset.a11y]));
      $(".a11y-zoom-val", panel).textContent = Math.round(ZOOMS[state.zoom] * 100) + "%";
    }
  };

  const wrap = document.createElement("div");
  wrap.className = "a11y-root";
  wrap.innerHTML =
    '<button type="button" class="a11y-btn" aria-label="פתיחת תפריט נגישות" aria-expanded="false" aria-controls="a11yPanel">' +
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="12" cy="4" r="2.2"/><path d="M19.5 8.4a1 1 0 0 1-.9 1.1l-4.1.6v3.4l2 6.3a1.1 1.1 0 0 1-2.1.7L12.6 15h-1.2l-1.8 5.5a1.1 1.1 0 0 1-2.1-.7l2-6.3v-3.4l-4.1-.6a1 1 0 0 1 .3-2.1l4.6.6h3.4l4.6-.6a1 1 0 0 1 1.2 1z"/></svg>' +
    '</button>' +
    '<div class="a11y-panel" id="a11yPanel" role="dialog" aria-modal="false" aria-labelledby="a11yTitle" hidden>' +
      '<div class="a11y-head"><h2 id="a11yTitle">תפריט נגישות</h2>' +
        '<button type="button" class="a11y-close" aria-label="סגירת תפריט נגישות">✕</button></div>' +
      '<div class="a11y-zoom" role="group" aria-label="גודל טקסט">' +
        '<span>גודל טקסט</span>' +
        '<button type="button" data-zoom="-1" aria-label="הקטנת טקסט">א−</button>' +
        '<output class="a11y-zoom-val" aria-live="polite">100%</output>' +
        '<button type="button" data-zoom="1" aria-label="הגדלת טקסט">א+</button>' +
      '</div>' +
      '<div class="a11y-grid">' +
        TOGGLES.map(([k, label, icon]) =>
          '<button type="button" data-a11y="' + k + '" aria-pressed="false">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + icon + '</svg>' +
          '<span>' + label + '</span></button>').join("") +
      '</div>' +
      '<div class="a11y-foot">' +
        '<button type="button" class="a11y-reset">איפוס הגדרות</button>' +
        '<a href="accessibility.html">הצהרת נגישות</a>' +
      '</div>' +
    '</div>';
  document.body.appendChild(wrap);

  const btn = $(".a11y-btn", wrap);
  var panel = $(".a11y-panel", wrap);
  const open = show => {
    panel.hidden = !show;
    btn.setAttribute("aria-expanded", show);
    if (show) $("button", panel).focus(); else btn.focus();
  };
  btn.addEventListener("click", () => open(panel.hidden));
  $(".a11y-close", panel).addEventListener("click", () => open(false));
  panel.addEventListener("keydown", e => { if (e.key === "Escape") open(false); });
  document.addEventListener("click", e => { if (!panel.hidden && !wrap.contains(e.target)) { panel.hidden = true; btn.setAttribute("aria-expanded", false); } });
  $$("[data-a11y]", panel).forEach(b => b.addEventListener("click", () => { state[b.dataset.a11y] = !state[b.dataset.a11y]; apply(); }));
  $$("[data-zoom]", panel).forEach(b => b.addEventListener("click", () => {
    state.zoom = Math.max(0, Math.min(ZOOMS.length - 1, state.zoom + +b.dataset.zoom)); apply();
  }));
  $(".a11y-reset", panel).addEventListener("click", () => { state = { zoom: 0 }; apply(); });
  apply();
})();

/* ======================================================
   הודעת עוגיות
   ====================================================== */
(function(){
  const KEY = "ns-cookie-notice";
  if (store.get(KEY)) return;
  const bar = document.createElement("div");
  bar.className = "cookie-bar";
  bar.setAttribute("role", "region");
  bar.setAttribute("aria-label", "הודעה על שימוש בעוגיות");
  bar.innerHTML =
    '<p><b>האתר משתמש בעוגיות ובאחסון מקומי הכרחיים בלבד</b> – לשמירת העדפות הנגישות ולתפקוד תקין של האתר. ' +
    'איננו משתמשים בעוגיות פרסום או מעקב. <a href="privacy.html">למדיניות הפרטיות</a></p>' +
    '<button type="button" class="btn btn-primary">הבנתי</button>';
  document.body.appendChild(bar);
  document.documentElement.classList.add("has-cookie-bar");
  const fit = () => document.documentElement.style.setProperty("--cookie-h", bar.offsetHeight + 16 + "px");
  fit(); window.addEventListener("resize", fit);
  $("button", bar).addEventListener("click", () => {
    store.set(KEY, { accepted: new Date().toISOString() });
    bar.remove();
    document.documentElement.classList.remove("has-cookie-bar");
    window.removeEventListener("resize", fit);
  });
})();
