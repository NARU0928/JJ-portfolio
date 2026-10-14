/* =========================================================
   이정재 포트폴리오 v2 — 데이터 기반 렌더링
   내용은 data/*.json 만 고치면 됩니다. (README.md 참고)
   ========================================================= */
const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => [...el.querySelectorAll(s)];
const store = {
  get(k) { try { return localStorage.getItem(k); } catch { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch { /* 저장 불가 환경 */ } }
};

const state = {
  lang: new URLSearchParams(location.search).get('lang') || store.get('jj-lang') || 'ko',
  workFilter: 'all', showAll: false, credFilter: 'all',
  data: null, lightbox: { list: [], i: 0 }
};

/* ---------- helpers ---------- */
const t = (obj) => obj == null ? '' : (typeof obj === 'string' ? obj : (obj[state.lang] ?? obj.ko ?? ''));
const ui = (path, vars = {}) => {
  const v = path.split('.').reduce((o, k) => o?.[k], state.data.ui);
  return t(v).replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? '');
};
const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
/* 문장 단위 줄바꿈: 다음 문장의 첫 단어가 앞 줄 끝에 걸리지 않도록 문장을 묶어 둡니다 (데스크톱) */
const ss = (s) => {
  const parts = String(s ?? '').split(/(?<=[^\d\s][.!?])\s+/);
  return parts.length < 2 ? esc(s ?? '') : parts.map((x) => `<span class="sn">${esc(x)}</span>`).join(' ');
};
const fmtDate = (iso) => {
  const [y, m, d] = iso.split('-');
  return state.lang === 'ko' ? `${y}. ${+m}.${d ? ' ' + +d + '.' : ''}` : new Date(iso).toLocaleDateString('en-GB', d ? { day: 'numeric', month: 'short', year: 'numeric' } : { month: 'short', year: 'numeric' });
};
const fmtYM = (ym) => { const [y, m] = ym.split('-'); return state.lang === 'ko' ? `${y}.${m}` : `${y}-${m}`; };
const fileSize = (b) => b > 1048576 ? (b / 1048576).toFixed(1) + 'MB' : Math.max(1, Math.round(b / 1024)) + 'KB';
const toast = (msg) => { const el = $('#toast'); el.textContent = msg; el.classList.add('show'); setTimeout(() => el.classList.remove('show'), 1800); };

async function loadData() {
  const names = ['site', 'works', 'journey', 'credentials', 'ui'];
  const res = await Promise.all(names.map((n) => fetch(`data/${n}.json`, { cache: 'no-cache' }).then((r) => { if (!r.ok) throw new Error(n); return r.json(); })));
  return Object.fromEntries(names.map((n, i) => [n, res[i]]));
}

/* ---------- static bindings ---------- */
function bindStatic() {
  const { site } = state.data;
  document.documentElement.lang = state.lang;
  $$('[data-i18n]').forEach((el) => { if (el.tagName === 'P') el.innerHTML = ss(ui(el.dataset.i18n)); else el.textContent = ui(el.dataset.i18n); });
  $$('[data-bind]').forEach((el) => { const v = t(el.dataset.bind.split('.').reduce((o, k) => o?.[k], site)); if (el.tagName === 'P') el.innerHTML = ss(v); else el.textContent = v; });
  $$('[data-bind-html]').forEach((el) => { el.innerHTML = t(el.dataset.bindHtml.split('.').reduce((o, k) => o?.[k], site)); });
  $('#langBtn').textContent = ui('langToggle');
  $('#langBtn').lang = state.lang === 'ko' ? 'en' : 'ko';
  $('#themeBtn').setAttribute('aria-label', ui('themeToggle'));
  $('#menuBtn').setAttribute('aria-label', ui('menu'));
  $$('.modal-close').forEach((b) => b.setAttribute('aria-label', ui('dialog.close')));
  ['#updatedAt', '#updatedAt2'].forEach((s) => { const el = $(s); el.dateTime = site.updated; el.textContent = fmtDate(site.updated); });
  $('#siteVersion').textContent = site.version;
  $('#versionLinks').innerHTML = site.previousVersions.map((v) => `<a href="${esc(v.url)}">${esc(t(v.label))}</a>`).join(' · ');
  $('#mailBtn').href = `mailto:${site.person.email}`;
  $('#mailBtn').textContent = site.person.email;
  document.title = state.lang === 'ko' ? '이정재 · 느린 학습자 곁의 교육 설계자' : 'Jungjae Lee · Portfolio';
}

/* ---------- now ---------- */
function renderNow() {
  const n = state.data.site.now;
  $('#nowList').innerHTML = n.items.map((i) => `<li>${esc(t(i))}</li>`).join('');
  const r = $('#nowRoutine'); if (r) r.textContent = n.routine ? t(n.routine) : '';
}

/* ---------- recognition ---------- */
function renderRecognition() {
  const r = state.data.site.recognition;
  const c = state.data.credentials.items.find((x) => x.id === r.credential);
  $('#recognition').innerHTML = `
    <div>
      <span class="rec-label">${esc(t(r.label))}</span>
      <h2 class="rec-title" id="recTitle">${esc(t(r.title))}</h2>
      <p class="rec-issuer">${esc(t(r.issuer))}</p>
      <blockquote class="rec-quote">${ss(t(r.quote))}</blockquote>
      <p class="rec-essay">${esc(t(r.essayTitle))}</p>
      <div class="rec-actions">
        <button class="btn primary small" type="button" data-essay>${esc(ui('recognition.readEssay'))}</button>
        <button class="btn small" type="button" data-cred="${esc(c.id)}">${esc(ui('recognition.viewCert'))}</button>
      </div>
    </div>
    <button class="rec-thumb" type="button" data-cred="${esc(c.id)}" aria-label="${esc(ui('recognition.viewCert'))}">
      <img src="${esc(c.thumb)}" alt="" width="414" height="600" loading="lazy">
    </button>`;
}

/* ---------- capabilities ---------- */
function renderCaps() {
  const works = state.data.works.items;
  $('#capGrid').innerHTML = state.data.site.capabilities.map((c, i) => {
    const n = works.filter((w) => w.tags.includes(c.id)).length;
    return `<button class="cap" type="button" data-cap="${c.id}" aria-pressed="${state.workFilter === c.id}">
      <span class="cap-num">0${i + 1}</span>
      <span class="cap-name">${esc(t(c.name))}</span>
      <span class="cap-desc">${ss(t(c.desc))}</span>
      <span class="cap-count">${esc(ui('capabilities.count', { n }))}</span>
    </button>`;
  }).join('');
}

/* ---------- works ---------- */
const sortWorks = (a, b) => b.date.localeCompare(a.date);
function visibleWorks() {
  const all = [...state.data.works.items].sort(sortWorks);
  if (state.workFilter !== 'all') return all.filter((w) => w.tags.includes(state.workFilter));
  const featured = all.filter((w) => w.featured);
  return state.showAll ? [...featured, ...all.filter((w) => !w.featured)] : featured;
}
function roleLabel(w) { return w.roles.map((r) => t(state.data.works.roles[r])).join(' · '); }
function renderWorkFilters() {
  const caps = state.data.site.capabilities;
  $('#workFilters').innerHTML = [`<button class="chip-btn" type="button" data-filter="all" aria-pressed="${state.workFilter === 'all'}">${esc(ui('works.all'))}</button>`]
    .concat(caps.map((c) => `<button class="chip-btn" type="button" data-filter="${c.id}" aria-pressed="${state.workFilter === c.id}">${esc(t(c.name))}</button>`)).join('');
}
function renderWorks() {
  const list = visibleWorks();
  $('#workGrid').innerHTML = list.length ? list.map((w) => `
    <button class="work-card reveal" type="button" data-work="${w.id}">
      <div class="work-cover"><img src="${esc(w.coverSmall)}" srcset="${esc(w.coverSmall)} 600w, ${esc(w.cover)} 1200w" sizes="(max-width: 640px) 100vw, (max-width: 900px) 50vw, 380px" alt="" width="600" height="375" loading="lazy"></div>
      <div class="work-body">
        <div class="work-meta"><span>${esc(t(w.period))}</span>${w.status ? `<span class="badge status">${esc(t(w.status))}</span>` : ''}</div>
        <h3 class="work-title">${esc(t(w.title))}</h3>
        <p class="work-sum">${ss(t(w.summary))}</p>
        <p class="work-role"><b>${esc(ui('works.myRole'))}</b>${esc(roleLabel(w))}</p>
      </div>
    </button>`).join('') : `<p class="empty">${esc(ui('works.empty'))}</p>`;
  const rest = state.data.works.items.filter((w) => !w.featured).length;
  const more = $('#moreWorks');
  more.hidden = state.workFilter !== 'all' || rest === 0;
  more.textContent = state.showAll ? ui('works.less') : ui('works.more', { n: rest });
  observeReveal();
}
function setWorkFilter(f) {
  state.workFilter = state.workFilter === f && f !== 'all' ? 'all' : f;
  renderWorkFilters(); renderCaps(); renderWorks();
}

/* ---------- work dialog ---------- */
function evidenceRows(list) {
  if (!list.length) return `<p class="cred-sub">${esc(ui('works.noEvidence'))}</p>`;
  return `<div class="ev-rows">${list.map((e) => e.type === 'pdf'
    ? `<a class="ev-row" href="${esc(e.src)}" target="_blank" rel="noopener"><span>${esc(t(e.label))}</span><small>${e.note ? esc(t(e.note)) + ' · ' : ''}PDF ${fileSize(e.size)} ↗</small></a>`
    : `<a class="ev-row" href="${esc(e.url)}" target="_blank" rel="noopener"><span>${esc(t(e.label))}</span><small>${esc(new URL(e.url).hostname.replace('www.', ''))} ↗</small></a>`).join('')}</div>`;
}
function openWork(id, push = true) {
  const w = state.data.works.items.find((x) => x.id === id);
  if (!w) return;
  const g = w.gallery.length ? w.gallery : [{ src: w.cover, w: 1200, h: 750 }];
  $('#wdBody').innerHTML = `
    <div class="wd-gallery">${g.map((im, i) => `<button type="button" data-zoom="${i}"><img src="${esc(im.src)}" alt="" width="${im.w}" height="${im.h}" loading="lazy"></button>`).join('')}</div>
    <div class="wd-content">
      <div class="work-meta"><span>${esc(t(w.period))}</span>${w.status ? `<span class="badge status">${esc(t(w.status))}</span>` : ''}</div>
      <h2 id="wdTitle">${esc(t(w.title))}</h2>
      <p class="wd-sum">${ss(t(w.summary))}</p>
      <dl class="wd-facts">
        <dt>${esc(ui('works.period'))}</dt><dd>${esc(t(w.period))}</dd>
        <dt>${esc(ui('works.with'))}</dt><dd>${ss(t(w.with))}</dd>
        ${w.facts ? `<dt>${esc(ui('works.facts'))}</dt><dd>${esc(t(w.facts))}</dd>` : ''}
        <dt>${esc(ui('works.myRole'))}</dt><dd><div class="role-chips">${w.roles.map((r) => `<span class="role-chip">${esc(t(state.data.works.roles[r]))}</span>`).join('')}</div>${ss(t(w.roleText))}</dd>
      </dl>
      <h3>${esc(ui('works.context'))}</h3>
      <p class="wd-context">${ss(t(w.context))}</p>
      <h3>${esc(ui('works.evidence'))}</h3>
      ${evidenceRows(w.evidence)}
    </div>`;
  $('#wdBody').dataset.work = id;
  showDialog('#workDialog', push ? `#/work/${id}` : null);
}

/* ---------- lightbox ---------- */
function credItem(id) { return state.data.credentials.items.find((c) => c.id === id); }
function openLightbox(list, i = 0, push = null) {
  state.lightbox = { list, i };
  drawLightbox();
  showDialog('#imageDialog', push);
}
function drawLightbox() {
  const { list, i } = state.lightbox; const it = list[i];
  $('#idBody').innerHTML = `
    <figure class="lb-figure">
      <img src="${esc(it.src)}" alt="${esc(it.caption)}">
      <figcaption id="idTitle">${esc(it.caption)}${it.sub ? `<small>${esc(it.sub)}</small>` : ''}</figcaption>
      ${list.length > 1 ? `<div class="lb-nav"><button class="btn small" type="button" data-lb="-1">← ${esc(ui('dialog.prev'))}</button><button class="btn small" type="button" data-lb="1">${esc(ui('dialog.next'))} →</button></div>` : ''}
    </figure>`;
}
function openCredential(id, push = true) {
  const c = credItem(id); if (!c?.image) return;
  const list = state.data.credentials.items.filter((x) => x.image);
  const items = list.map((x) => ({ src: x.image, caption: t(x.name), sub: `${t(x.issuer)} · ${fmtYM(x.date)}` }));
  openLightbox(items, list.indexOf(c), push ? `#/credential/${id}` : null);
}

/* ---------- essay ---------- */
function openEssay(push = true) {
  const r = state.data.site.recognition;
  const paras = t(r.essay).split(/\n\n+/).map((p) => `<p>${esc(p)}</p>`).join('');
  $('#edBody').innerHTML = `<article class="essay"><span class="rec-label">${esc(t(r.label))}</span><h2 id="edTitle">${esc(t(r.essayTitle))}</h2><p class="meta">${esc(t(r.title))} · ${esc(t(r.issuer))}</p>${paras}</article>`;
  showDialog('#essayDialog', push ? '#/essay' : null);
}

/* ---------- dialogs & routing ---------- */
let lastFocus = null;
function showDialog(sel, hash) {
  const d = $(sel);
  if (!d.open) { lastFocus = document.activeElement; d.showModal(); }
  d.querySelector('.modal-inner').scrollTop = 0;
  if (hash && location.hash !== hash) history.pushState({ modal: true }, '', hash);
}
function closeAll(fromRoute = false) {
  $$('dialog[open]').forEach((d) => d.close());
  if (!fromRoute && location.hash.startsWith('#/')) {
    if (history.state?.modal) history.back(); else history.replaceState(null, '', location.pathname + location.search);
  }
  lastFocus?.focus?.();
}
function route() {
  const m = location.hash.match(/^#\/(work|credential|essay)\/?([\w-]*)/);
  if (!m) { if ($$('dialog[open]').length) closeAll(true); return; }
  if (m[1] === 'work') openWork(m[2], false);
  if (m[1] === 'credential') openCredential(m[2], false);
  if (m[1] === 'essay') openEssay(false);
}

/* ---------- journey ---------- */
function evChip(e) {
  if (e.type === 'work') { const w = state.data.works.items.find((x) => x.id === e.ref); return w ? `<button class="ev" type="button" data-work="${w.id}"><span class="k">WORK</span><span class="v">${esc(t(w.title))}</span></button>` : ''; }
  if (e.type === 'credential') { const c = credItem(e.ref); return c ? `<button class="ev" type="button" data-cred="${c.id}"><span class="k">${c.category === 'award' ? 'AWARD' : 'DOC'}</span><span class="v">${esc(t(c.name))}</span></button>` : ''; }
  if (e.type === 'image') return `<button class="ev" type="button" data-img="${esc(e.src)}" data-caption="${esc(t(e.label))}"><span class="k">IMG</span><span class="v">${esc(t(e.label))}</span></button>`;
  if (e.type === 'pdf') return `<a class="ev" href="${esc(e.src)}" target="_blank" rel="noopener"><span class="k">PDF</span><span class="v">${esc(t(e.label))}</span></a>`;
  if (e.type === 'link') return `<a class="ev" href="${esc(e.url)}" target="_blank" rel="noopener"><span class="k">LINK</span><span class="v">${esc(t(e.label))}</span></a>`;
  return '';
}
function renderJourney() {
  $('#chapters').innerHTML = state.data.journey.chapters.map((c, ci) => `
    <details class="chapter reveal" ${ci === 0 ? 'open' : ''} id="ch-${c.id}">
      <summary>
        <span class="ch-range">${esc(t(c.range))}</span>
        <span><span class="ch-title">${esc(t(c.title))}</span><span class="ch-sum" style="display:block">${ss(t(c.summary))}</span></span>
        <span class="ch-toggle" aria-hidden="true"></span>
      </summary>
      <div class="entries">${c.entries.map((e) => `
        <article class="entry" id="y${e.year}">
          <div class="entry-year">${e.year}</div>
          <div>
            <h3>${esc(t(e.title))}</h3>
            <p class="entry-text clamp">${ss(t(e.text))}</p>
            <button class="link-btn" type="button" data-more>${esc(ui('journey.readMore'))}</button>
            ${e.evidence.length ? `<div class="ev-list">${e.evidence.map(evChip).join('')}</div>` : ''}
          </div>
        </article>`).join('')}
      </div>
    </details>`).join('');
  // 3줄 안에 들어가는 글은 '더 읽기' 숨김
  requestAnimationFrame(() => $$('.entry-text.clamp').forEach((p) => { if (p.scrollHeight <= p.clientHeight + 2) p.nextElementSibling.hidden = true; }));
  observeReveal();
}

/* ---------- credentials ---------- */
function renderCredFilters() {
  const cats = state.data.credentials.categories;
  const used = [...new Set(state.data.credentials.items.map((c) => c.category))];
  $('#credFilters').innerHTML = [`<button class="chip-btn" type="button" data-cfilter="all" aria-pressed="${state.credFilter === 'all'}">${esc(ui('credentials.all'))}</button>`]
    .concat(Object.keys(cats).filter((k) => used.includes(k)).map((k) => `<button class="chip-btn" type="button" data-cfilter="${k}" aria-pressed="${state.credFilter === k}">${esc(t(cats[k]))}</button>`)).join('');
}
function renderCreds() {
  const { items, categories } = state.data.credentials;
  const list = items.filter((c) => state.credFilter === 'all' || c.category === state.credFilter)
    .sort((a, b) => b.date.localeCompare(a.date));
  const withImg = list.filter((c) => c.image), noImg = list.filter((c) => !c.image);
  $('#credGrid').innerHTML = withImg.map((c) => `
    <button class="cred reveal" type="button" data-cred="${c.id}">
      <div class="cred-img"><img src="${esc(c.thumb)}" alt="" loading="lazy" width="420" height="600"></div>
      <div class="cred-body">
        <span class="cred-cat">${esc(t(categories[c.category]))} · ${fmtYM(c.date)}</span>
        <span class="cred-name">${esc(t(c.name))}</span>
        <span class="cred-sub">${esc(t(c.issuer))}${c.note ? ' · ' + esc(t(c.note)) : ''}</span>
      </div>
    </button>`).join('') + (noImg.length ? `<p class="cred-extra" style="grid-column:1/-1">${noImg.map((c) => `<span><b>${esc(t(c.name))}</b> ${esc(t(c.issuer))} · ${fmtYM(c.date)}</span>`).join('')}</p>` : '');
  observeReveal();
}

/* ---------- about ---------- */
function renderChannels() {
  $('#channelList').innerHTML = state.data.site.channels.map((c) => `<li><a href="${esc(c.url)}" target="_blank" rel="noopener"><span>${esc(t(c.name))}</span><small>${esc(t(c.kind))} ↗</small></a></li>`).join('');
}

/* ---------- reveal ---------- */
let io;
function observeReveal() {
  if (!('IntersectionObserver' in window)) { $$('.reveal').forEach((el) => el.classList.add('in')); return; }
  io ??= new IntersectionObserver((ents) => ents.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  $$('.reveal:not(.in)').forEach((el) => io.observe(el));
}

/* ---------- print document (인쇄용 자기소개) ---------- */
function renderPrint() {
  const { site, works, journey, credentials } = state.data;
  const url = 'jj-portfolio.netlify.app';
  const ws = [...works.items].sort((a, b) => (b.featured - a.featured) || b.date.localeCompare(a.date));
  const cs = [...credentials.items].sort((a, b) => b.date.localeCompare(a.date));
  const r = site.recognition;
  $('#printDoc').innerHTML = `
  <section class="pd-page pd-cover">
    <header class="pd-head">
      <img src="assets/img/profile.webp" alt="" class="pd-avatar">
      <div>
        <h1>${esc(t(site.person.name))}</h1>
        <p class="pd-role">${esc(t(site.person.role))}</p>
        <p class="pd-contact">${esc(site.person.email)} · ${esc(url)} · ${esc(ui('updated'))} ${fmtDate(site.updated)}</p>
      </div>
    </header>
    <p class="pd-headline">${t(site.hero.headline).replace(/<br>/g, ' ')}</p>
    <p class="pd-lead">${esc(t(site.hero.lead))}</p>
    <h2>${esc(t(site.now.title))} <small>${fmtDate(site.updated)}</small></h2>
    <ul class="pd-now">${site.now.items.map((i) => `<li>${esc(t(i))}</li>`).join('')}</ul>
    ${site.now.routine ? `<p class="pd-routine">${esc(t(site.now.routine))}</p>` : ''}
    <div class="pd-award">
      <b>${esc(t(r.label))}</b> ${esc(t(r.title))} <span>· ${esc(t(r.issuer))}</span>
      <p>${esc(t(r.essayTitle))} — “${esc(t(r.quote))}”</p>
    </div>
    <h2>${esc(ui('capabilities.title'))}</h2>
    <dl class="pd-caps">${site.capabilities.map((c) => `<dt>${esc(t(c.name))}</dt><dd>${esc(t(c.desc))}</dd>`).join('')}</dl>
  </section>
  <section class="pd-page">
    <h2 class="pd-title">${esc(ui('works.title'))}</h2>
    <p class="pd-note">${esc(ui('works.lead'))}</p>
    <table class="pd-works">
      <thead><tr><th>${esc(ui('works.period'))}</th><th>${esc(ui('print.work'))}</th><th>${esc(ui('works.myRole'))}</th></tr></thead>
      <tbody>${ws.map((w) => `<tr>
        <td class="pd-when">${esc(t(w.period))}</td>
        <td><b>${esc(t(w.title))}</b><span>${esc(t(w.summary))}</span><em>${esc(ui('works.with'))}: ${esc(t(w.with))}</em></td>
        <td class="pd-roles">${esc(roleLabel(w))}</td></tr>`).join('')}</tbody>
    </table>
  </section>
  <section class="pd-page">
    <h2 class="pd-title">${esc(ui('journey.title'))}</h2>
    <div class="pd-journey">${journey.chapters.map((c) => `<div class="pd-ch">
      <h3>${esc(t(c.range))} · ${esc(t(c.title))}</h3>
      <ul>${c.entries.map((e) => `<li><b>${e.year}</b> ${esc(t(e.title))}</li>`).join('')}</ul></div>`).join('')}
    </div>
    <h2 class="pd-title pd-mt">${esc(ui('credentials.title'))}</h2>
    <table class="pd-creds"><tbody>${cs.map((c) => `<tr><td class="pd-when">${fmtYM(c.date)}</td><td>${esc(t(credentials.categories[c.category]))}</td><td><b>${esc(t(c.name))}</b></td><td>${esc(t(c.issuer))}</td></tr>`).join('')}</tbody></table>
    <p class="pd-foot">${esc(ui('print.foot'))} ${esc(url)}</p>
  </section>`;
}

/* ---------- render all ---------- */
function renderAll() {
  bindStatic(); renderNow(); renderRecognition(); renderCaps(); renderWorkFilters(); renderWorks();
  renderJourney(); renderCredFilters(); renderCreds(); renderChannels(); renderPrint();
}

/* ---------- events ---------- */
function bindEvents() {
  document.addEventListener('click', (e) => {
    const el = e.target.closest('button, a');
    if (!el) return;
    if (el.matches('[data-work]')) { openWork(el.dataset.work); }
    else if (el.matches('[data-cred]')) { openCredential(el.dataset.cred); }
    else if (el.matches('[data-essay]')) { openEssay(); }
    else if (el.matches('[data-img]')) { openLightbox([{ src: el.dataset.img, caption: el.dataset.caption }], 0); }
    else if (el.matches('[data-zoom]')) {
      const w = state.data.works.items.find((x) => x.id === $('#wdBody').dataset.work);
      const items = w.gallery.map((g, i) => ({ src: g.src, caption: `${t(w.title)} (${i + 1}/${w.gallery.length})` }));
      state.lightbox = { list: items, i: +el.dataset.zoom }; drawLightbox(); $('#imageDialog').showModal();
    }
    else if (el.matches('[data-lb]')) { const L = state.lightbox; L.i = (L.i + +el.dataset.lb + L.list.length) % L.list.length; drawLightbox(); }
    else if (el.matches('[data-close]')) { const d = el.closest('dialog'); if (d.id === 'imageDialog' && $('#workDialog').open) d.close(); else closeAll(); }
    else if (el.matches('[data-filter]')) { state.showAll = false; setWorkFilter(el.dataset.filter); }
    else if (el.matches('[data-cap]')) { state.showAll = false; setWorkFilter(el.dataset.cap); $('#works').scrollIntoView(); }
    else if (el.matches('[data-cfilter]')) { state.credFilter = el.dataset.cfilter; renderCredFilters(); renderCreds(); }
    else if (el.matches('[data-more]')) {
      const p = el.previousElementSibling; const open = p.classList.toggle('clamp');
      el.textContent = open ? ui('journey.readMore') : ui('journey.readLess');
    }
  });
  // 배경 클릭으로 닫기
  $$('dialog').forEach((d) => {
    d.addEventListener('click', (e) => { if (e.target === d) { if (d.id === 'imageDialog' && $('#workDialog').open) d.close(); else closeAll(); } });
    d.addEventListener('cancel', (e) => { e.preventDefault(); if (d.id === 'imageDialog' && $('#workDialog').open) d.close(); else closeAll(); });
  });
  document.addEventListener('keydown', (e) => {
    if (!$('#imageDialog').open || state.lightbox.list.length < 2) return;
    if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') { const L = state.lightbox; L.i = (L.i + (e.key === 'ArrowRight' ? 1 : -1) + L.list.length) % L.list.length; drawLightbox(); }
  });
  $('#moreWorks').addEventListener('click', () => { state.showAll = !state.showAll; renderWorks(); });
  $('#langBtn').addEventListener('click', () => { state.lang = state.lang === 'ko' ? 'en' : 'ko'; store.set('jj-lang', state.lang); renderAll(); });
  $('#themeBtn').addEventListener('click', () => {
    const cur = document.documentElement.dataset.theme;
    const dark = cur === 'dark' || (cur === 'auto' && matchMedia('(prefers-color-scheme: dark)').matches);
    const next = dark ? 'light' : 'dark'; document.documentElement.dataset.theme = next; store.set('jj-theme', next);
  });
  $('#menuBtn').addEventListener('click', () => { const n = $('#nav'); const o = n.classList.toggle('open'); $('#menuBtn').setAttribute('aria-expanded', o); });
  $$('#nav a').forEach((a) => a.addEventListener('click', () => { $('#nav').classList.remove('open'); $('#menuBtn').setAttribute('aria-expanded', 'false'); }));
  $('#copyBtn').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(state.data.site.person.email); toast(ui('about.copied')); } catch { location.href = 'mailto:' + state.data.site.person.email; }
  });
  $('#printBtn').addEventListener('click', () => window.print());
  window.addEventListener('beforeprint', renderPrint);
  window.addEventListener('popstate', route);
  window.addEventListener('hashchange', route);
  const header = $('#siteHeader');
  window.addEventListener('scroll', () => header.classList.toggle('scrolled', scrollY > 8), { passive: true });
  // 현재 섹션 표시
  if ('IntersectionObserver' in window) {
    const links = $$('#nav a');
    const spy = new IntersectionObserver((ents) => ents.forEach((en) => {
      if (en.isIntersecting) links.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
    }), { rootMargin: '-45% 0px -50% 0px' });
    ['now', 'works', 'journey', 'credentials', 'about'].forEach((id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
  }
}

/* ---------- start ---------- */
(async function init() {
  try {
    state.data = await loadData();
  } catch (err) {
    $('#main').insertAdjacentHTML('afterbegin', `<div class="wrap load-error">콘텐츠를 불러오지 못했습니다. 로컬에서 열었다면 웹 서버(예: VS Code Live Server)로 열어 주세요. / Could not load content.</div>`);
    console.error(err); return;
  }
  if (!['ko', 'en'].includes(state.lang)) state.lang = 'ko';
  renderAll(); bindEvents(); route();
})();
