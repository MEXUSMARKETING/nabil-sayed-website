/* ======================================================
   פרטי העסק – לעדכן כאן בלבד, והאתר מתעדכן בכל העמודים
   ====================================================== */
const SITE = {
  phone:    "050-000-0000",        // טלפון לתצוגה
  phoneIntl:"+972500000000",       // טלפון בפורמט בינלאומי לחיוג
  whatsapp: "972500000000",        // מספר וואטסאפ בלי + ובלי 0 בהתחלה
  email:    "info@example.co.il",
  area:     "כל רחבי הארץ",
  hours:    "א׳–ה׳ 07:00–18:00 · ו׳ 07:00–13:00"
};

const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

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
