/* =========================================================
   Jayashree Mondal — Portfolio
   ========================================================= */
(function () {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // localStorage can throw in private mode / when blocked, so wrap it
  const store = {
    get (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set (k, v) { try { localStorage.setItem(k, v); } catch (e) { /* ignore */ } }
  };

  /* ---------------- Certificates ---------------- */
  const CERTS = [
    { img:'certificate/pic8.jpeg', title:'Java Full Stack — TalentNext Program',
      issuer:'Wipro TalentNext', date:'Jul – Oct 2026', cat:'certification',
      skills:['Java','Full Stack','Spring Boot','SQL','Web Development'] },
    { img:'certificate/pic5.jpeg', title:'OCI 2025 Certified AI Foundations Associate',
      issuer:'Oracle University', date:'Oct 2025', cat:'certification',
      skills:['Oracle Cloud','Generative AI','Cloud AI'] },
    { img:'certificate/pic4.jpeg', title:'AI Fundamentals with Capstone Project',
      issuer:'IBM SkillsBuild', date:'Oct 2025', cat:'certification',
      skills:['Artificial Intelligence','Capstone','ML'] },
    { img:'certificate/pic6.jpeg', title:'Microsoft Certified: Azure Fundamentals',
      issuer:'Microsoft', date:'Dec 2024', cat:'certification',
      skills:['Azure','Cloud Computing'] },
    { img:'certificate/pic7.jpeg', title:'Google Gen AI Study Jam — Cohort 2',
      issuer:'Google Developer Groups • BCET', date:'2024', cat:'certification',
      skills:['Google Cloud','Vertex AI','Gen AI','16 Badges'] },
    { img:'certificate/pic3.jpeg', title:'Python Coder — Badge',
      issuer:'Kaggle', date:'Nov 2025', cat:'badge',
      skills:['Python','Coding'] },
    { img:'certificate/pic2.jpeg', title:'Artificial Intelligence — Internship',
      issuer:'EDU TANTR', date:'Aug – Oct 2025', cat:'internship',
      skills:['AI/ML','Practical Training','Professional Work'] },
    { img:'certificate/pic1.jpeg', title:'Artificial Intelligence — Course Completion',
      issuer:'EDU TANTR', date:'2025', cat:'certification',
      skills:['AI Fundamentals','ML'] }
  ];

  const esc = (s) => String(s).replace(/[&<>"']/g, ch =>
    ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[ch]));

  /* ---------------- Toast ---------------- */
  let toastT;
  function toast (msg) {
    const el = $('#toast'); if (!el) return;
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------------- Preloader ---------------- */
  // hide on load, but never keep the page blocked for more than ~3.5s (slow fonts / images)
  (function preloader () {
    const pre = $('#preloader'); if (!pre) return;
    let done = false;
    const hide = () => { if (done) return; done = true; pre.classList.add('hide'); };
    if (document.readyState === 'complete') setTimeout(hide, 300);
    else window.addEventListener('load', () => setTimeout(hide, 450));
    setTimeout(hide, 3500);
  })();

  /* ---------------- Year ---------------- */
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- Live clock ---------------- */
  (function clock () {
    const t = $('#clockTime'), d = $('#clockDate');
    if (!t || !d) return;
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const mon  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const pad = (n) => String(n).padStart(2, '0');
    function tick () {
      const n = new Date();
      t.textContent = `${pad(n.getHours())}:${pad(n.getMinutes())}:${pad(n.getSeconds())}`;
      d.textContent = `${days[n.getDay()]}, ${n.getDate()} ${mon[n.getMonth()]} ${n.getFullYear()}`;
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------------- Theme toggle ---------------- */
  // the saved theme is already applied by the inline script in <head>
  const themeListeners = [];
  (function theme () {
    const btn = $('#themeToggle');
    if (!btn) return;
    btn.addEventListener('click', () => {
      const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      store.set('jm-theme', next);
      toast(next === 'dark' ? '🌙 Dark mode' : '☀️ Light mode');
      themeListeners.forEach(fn => fn(next));
    });
  })();

  /* ---------------- Header, scrollspy, progress ---------------- */
  const header = $('#header');
  const progress = $('#scrollProgress');
  const toTop = $('#toTop');
  const navLinks = $$('.nav__link');
  const sections = navLinks.map(l => $(l.getAttribute('href'))).filter(Boolean);

  let scrollQueued = false;
  function onScroll () {
    scrollQueued = false;
    const y = window.scrollY;
    if (header) header.classList.toggle('scrolled', y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? Math.min(100, (y / h) * 100) : 0) + '%';
    if (toTop) toTop.classList.toggle('show', y > 500);

    let cur = sections[0] ? sections[0].id : 'home';
    for (const s of sections) if (s.getBoundingClientRect().top <= 140) cur = s.id;
    // at the very bottom, the last section (contact) may be too short to reach the top
    if (h > 0 && y >= h - 4 && sections.length) cur = sections[sections.length - 1].id;
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }
  window.addEventListener('scroll', () => {
    if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(onScroll); }
  }, { passive:true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------------- Mobile nav ---------------- */
  const burger = $('#hamburger'), nav = $('#nav');
  function setNav (open) {
    if (!nav || !burger) return;
    nav.classList.toggle('open', open);
    burger.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  if (burger && nav) {
    burger.addEventListener('click', (e) => { e.stopPropagation(); setNav(!nav.classList.contains('open')); });
    navLinks.forEach(l => l.addEventListener('click', () => setNav(false)));
    document.addEventListener('click', (e) => {
      if (nav.classList.contains('open') && !nav.contains(e.target)) setNav(false);
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setNav(false); });
    window.addEventListener('resize', () => { if (window.innerWidth > 860) setNav(false); });
  }

  /* ---------------- Back to top ---------------- */
  if (toTop) toTop.addEventListener('click', () =>
    window.scrollTo({ top:0, behavior: reduceMotion ? 'auto' : 'smooth' }));

  /* ---------------- Typed headline ---------------- */
  (function typed () {
    const el = $('#typed'); if (!el) return;
    const words = ['AI / ML Enthusiast','Software Developer','Full-Stack Developer',
                   'B.Tech IT Student','Problem Solver'];
    if (reduceMotion) { el.textContent = words[0]; return; }
    let wi = 0, ci = 0, del = false;
    (function loop () {
      const w = words[wi];
      ci += del ? -1 : 1;
      el.textContent = w.slice(0, ci);
      let wait = del ? 45 : 90;
      if (!del && ci === w.length) { wait = 1600; del = true; }
      else if (del && ci === 0) { del = false; wi = (wi + 1) % words.length; wait = 350; }
      setTimeout(loop, wait);
    })();
  })();

  /* ---------------- Stats (kept in sync with the page content) ---------------- */
  (function stats () {
    const counts = {
      certs: CERTS.length,
      projects: $$('#projects .project').length,
      tools: $$('#skills .tech-chip:not(.tech-chip--soft)').length
    };
    $$('.stat__num[data-stat]').forEach(el => {
      const n = counts[el.dataset.stat];
      if (n) { el.dataset.count = n; el.textContent = n + (el.dataset.suffix || ''); }
    });
  })();

  /* ---------------- Reveal on scroll, skill bars, counters ---------------- */
  const fillBars = (root) => $$('.bar', root).forEach(b => {
    const i = $('i', b); if (i) i.style.width = (b.dataset.level || 0) + '%';
  });

  let io = null;
  if ('IntersectionObserver' in window) {
    io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        e.target.classList.add('in');
        fillBars(e.target);
        io.unobserve(e.target);
      });
    }, { threshold:0.12, rootMargin:'0px 0px -40px 0px' });
    $$('.reveal').forEach(el => io.observe(el));
  } else {
    $$('.reveal').forEach(el => el.classList.add('in'));
    fillBars(document);
  }

  function countUp (el) {
    const target = +el.dataset.count || 0, suf = el.dataset.suffix || '';
    if (reduceMotion || !target) { el.textContent = target + suf; return; }
    let n = 0; const step = Math.max(1, Math.round(target / 40));
    el.textContent = '0' + suf;
    const t = setInterval(() => {
      n += step; if (n >= target) { n = target; clearInterval(t); }
      el.textContent = n + suf;
    }, 32);
  }
  if ('IntersectionObserver' in window) {
    const countIO = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        countUp(e.target);
        countIO.unobserve(e.target);
      });
    }, { threshold:0.5 });
    $$('.stat__num').forEach(el => countIO.observe(el));
  }

  /* ---------------- Certificate cards ---------------- */
  const grid = $('#certGrid');
  const eyeSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  const calSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  if (grid) {
    grid.innerHTML = CERTS.map((c, i) => `
      <article class="cert reveal" data-cat="${esc(c.cat)}">
        <div class="cert__thumb" role="button" tabindex="0" aria-label="View ${esc(c.title)} certificate" data-i="${i}">
          <span class="cert__badge">${esc(c.cat)}</span>
          <img src="${esc(c.img)}" alt="${esc(c.title)} certificate" loading="lazy" />
          <div class="cert__overlay"><span class="cert__eye">${eyeSVG}</span></div>
        </div>
        <div class="cert__body">
          <span class="cert__issuer">${esc(c.issuer)}</span>
          <h3 class="cert__title">${esc(c.title)}</h3>
          <span class="cert__date">${calSVG}${esc(c.date)}</span>
          <div class="cert__skills">${c.skills.map(s => `<span>${esc(s)}</span>`).join('')}</div>
          <button type="button" class="cert__view" data-i="${i}">${eyeSVG} View certificate</button>
        </div>
      </article>`).join('');
    if (io) $$('.cert.reveal', grid).forEach(el => io.observe(el));
    else $$('.cert.reveal', grid).forEach(el => el.classList.add('in'));
  }

  /* ---------------- Certificate filters ---------------- */
  $$('.cert-filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.cert-filter').forEach(b => { b.classList.remove('active'); b.setAttribute('aria-pressed', 'false'); });
    btn.classList.add('active'); btn.setAttribute('aria-pressed', 'true');
    const f = btn.dataset.filter;
    $$('.cert').forEach(c => {
      const show = f === 'all' || c.dataset.cat === f;
      c.classList.toggle('is-hidden', !show);
      if (show) c.classList.add('in');   // cards revealed by filtering shouldn't stay invisible
    });
  }));

  /* ---------------- Lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbTitle = $('#lbTitle'),
        lbSub = $('#lbSub'), lbDl = $('#lbDownload'), lbClose = $('#lbClose');
  let lbIndex = 0, lastFocus = null;
  const lbOpen = () => lb && lb.classList.contains('open');

  function visibleCerts () {
    return $$('.cert').filter(c => !c.classList.contains('is-hidden'))
      .map(c => +$('.cert__thumb', c).dataset.i);
  }
  function openLB (i) {
    const c = CERTS[i]; if (!c || !lb) return;
    if (!lbOpen()) lastFocus = document.activeElement;
    lbIndex = i;
    lbImg.src = c.img; lbImg.alt = c.title + ' certificate';
    lbTitle.textContent = c.title;
    lbSub.textContent = `${c.issuer} • ${c.date}`;
    lbDl.href = c.img;
    lb.classList.add('open'); lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (lbClose) lbClose.focus({ preventScroll:true });
  }
  function closeLB () {
    if (!lbOpen()) return;
    lb.classList.remove('open'); lb.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll:true });
  }
  function stepLB (dir) {
    const vis = visibleCerts(); if (!vis.length) return;
    let pos = vis.indexOf(lbIndex);
    if (pos === -1) pos = 0;
    pos = (pos + dir + vis.length) % vis.length;
    openLB(vis[pos]);
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('.cert__thumb, .cert__view');
    if (t) openLB(+t.dataset.i);
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target.closest && e.target.closest('.cert__thumb');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openLB(+t.dataset.i); }
  });
  if (lb) {
    lbClose.addEventListener('click', closeLB);
    $('#lbBackdrop').addEventListener('click', closeLB);
    $('#lbPrev').addEventListener('click', () => stepLB(-1));
    $('#lbNext').addEventListener('click', () => stepLB(1));
    window.addEventListener('keydown', (e) => {
      if (!lbOpen()) return;
      if (e.key === 'Escape') closeLB();
      else if (e.key === 'ArrowLeft') stepLB(-1);
      else if (e.key === 'ArrowRight') stepLB(1);
      else if (e.key === 'Tab') {
        // keep keyboard focus inside the viewer while it is open
        const f = $$('button, a[href]', lb).filter(el => el.offsetParent !== null);
        if (!f.length) return;
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    // basic swipe support on phones
    let sx = null;
    lb.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive:true });
    lb.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 50) stepLB(dx < 0 ? 1 : -1);
    });
  }

  /* ---------------- Contact form ---------------- */
  (function contact () {
    const form = $('#contactForm');
    if (!form) return;
    const nameEl = $('#cName'), mailEl = $('#cEmail'), msgEl = $('#cMsg');
    const statusEl = $('#emailStatus'), note = $('#formNote'), sendBtn = $('#sendBtn');
    const TO = 'jayashreemondal2005@gmail.com';

    let emailState = 'idle';   // idle | checking | valid | invalid
    let checkToken = 0, debounce;
    const fmtOk = (m) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(m);

    function setStatus (state, text) {
      emailState = state;
      if (!statusEl) return;
      statusEl.textContent = text || '';
      statusEl.className = 'field__status' +
        (state === 'valid' ? ' ok' : state === 'invalid' ? ' err' : state === 'checking' ? ' checking' : '');
    }
    function setNote (text, cls) {
      note.textContent = text;
      note.className = 'form-note' + (cls ? ' ' + cls : '');
    }

    // Checks that the email's domain exists and accepts mail (MX record) using
    // Google's public DNS-over-HTTPS. Returns true / false, or null if it can't tell.
    async function verifyDomain (email) {
      const domain = (email.split('@')[1] || '').toLowerCase();
      if (!domain || !domain.includes('.')) return false;
      const ask = async (type) => {
        const ctrl = 'AbortController' in window ? new AbortController() : null;
        const timer = ctrl && setTimeout(() => ctrl.abort(), 4000);
        try {
          const r = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=${type}`,
            ctrl ? { signal: ctrl.signal } : undefined);
          return await r.json();
        } finally { if (timer) clearTimeout(timer); }
      };
      try {
        const mx = await ask('MX');
        if (mx.Status === 0 && Array.isArray(mx.Answer) && mx.Answer.some(a => a.type === 15)) return true;
        if (mx.Status === 3) return false;               // NXDOMAIN — domain doesn't exist
        const a = await ask('A');
        return a.Status === 0 && Array.isArray(a.Answer) && a.Answer.length > 0;
      } catch (e) {
        return null; // offline / blocked — can't verify
      }
    }

    async function runCheck () {
      const mail = mailEl.value.trim();
      if (!mail) { setStatus('idle', ''); return; }
      if (!fmtOk(mail)) { setStatus('invalid', "✗ That doesn't look like a valid email"); return; }
      setStatus('checking', 'Checking email…');
      const token = ++checkToken;
      const exists = await verifyDomain(mail);
      if (token !== checkToken) return;            // a newer check replaced this one
      if (exists === false) setStatus('invalid', "✗ This email domain doesn't seem to exist");
      else                  setStatus('valid', '✓ Looks good');
    }

    mailEl.addEventListener('input', () => { setStatus('idle', ''); clearTimeout(debounce); debounce = setTimeout(runCheck, 600); });
    mailEl.addEventListener('blur', () => { clearTimeout(debounce); if (emailState === 'idle') runCheck(); });

    function resetBtn () { sendBtn.disabled = false; sendBtn.classList.remove('is-loading'); }

    function showSuccess () {
      note.innerHTML = '✅ Thanks for reaching out! Your message has been sent — I will get back to you soon.';
      note.className = 'form-note ok';
      toast('✅ Message sent — thank you!');
      form.reset(); setStatus('idle', '');
      resetBtn();
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (sendBtn.disabled) return;
      const name = nameEl.value.trim(), mail = mailEl.value.trim(), msg = msgEl.value.trim();

      if (!name) { setNote('Please enter your name.', 'err'); nameEl.focus(); return; }
      if (!fmtOk(mail)) {
        setStatus('invalid', "✗ That doesn't look like a valid email");
        setNote('Please enter a valid email address.', 'err'); mailEl.focus(); return;
      }
      if (!msg) { setNote('Please write a message before sending.', 'err'); msgEl.focus(); return; }

      if (emailState !== 'valid') {
        setNote('Checking your email…');
        await runCheck();
        if (emailState !== 'valid') {
          setNote('Please use a real email address so I can reply.', 'err');
          mailEl.focus(); return;
        }
      }

      // honeypot: bots fill the hidden field — pretend it worked and drop it
      const honey = $('#cHoney');
      if (honey && honey.value) { showSuccess(); return; }

      sendBtn.disabled = true; sendBtn.classList.add('is-loading');
      setNote('Sending your message…');

      // FormSubmit forwards the message to my inbox (no backend needed)
      const data = {
        name: name,
        email: mail,
        message: msg,
        _subject: `New portfolio message from ${name}`,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        const r = await fetch(`https://formsubmit.co/ajax/${TO}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
        const j = await r.json().catch(() => ({}));
        if (r.ok && (j.success === true || j.success === 'true')) { showSuccess(); return; }
        throw new Error(j.message || ('status ' + r.status));
      } catch (err) {
        // service unreachable — hand the message over to the visitor's mail app instead
        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(`${msg}\n\n— ${name}\n${mail}`);
        window.location.href = `mailto:${TO}?subject=${subject}&body=${body}`;
        note.innerHTML = `Couldn't send from here, so your email app was opened with the message ready — just hit send. ` +
          `You can also write to <a href="mailto:${TO}"><b>${TO}</b></a>.`;
        note.className = 'form-note';
        resetBtn();
      }
    });
  })();

  /* ---------------- Custom cursor ---------------- */
  (function cursor () {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const dot = $('#cursorDot'), ring = $('#cursorRing');
    if (!dot || !ring) return;
    const HOVER = 'a,button,.cert__thumb,.tech-chip,.info-card';
    let rx = 0, ry = 0, dx = 0, dy = 0, running = false;
    function follow () {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      // stop the loop once the ring has caught up, restart on the next mouse move
      if (Math.abs(dx - rx) > 0.3 || Math.abs(dy - ry) > 0.3) requestAnimationFrame(follow);
      else running = false;
    }
    window.addEventListener('mousemove', (e) => {
      dx = e.clientX; dy = e.clientY;
      dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
      if (!running) { running = true; requestAnimationFrame(follow); }
    }, { passive:true });
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest && e.target.closest(HOVER)) ring.classList.add('grow');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest && e.target.closest(HOVER)) ring.classList.remove('grow');
    });
  })();

  /* ============================================================
     Background — rotating 3D point cloud drawn on a 2D canvas
     ============================================================ */
  (function bg () {
    const cv = $('#bg-canvas'); if (!cv || !cv.getContext) return;
    const ctx = cv.getContext('2d');
    let W, H, DPR, pts = [], mx = 0, my = 0, tmx = 0, tmy = 0, raf = 0, ang = 0;
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    function build () {
      const area = innerWidth * innerHeight;
      const n = Math.max(40, Math.min(110, Math.round(area / 15000)));
      const R = Math.min(W, H) * 0.46;
      pts = [];
      for (let i = 0; i < n; i++) {
        // random point inside a sphere
        const th = Math.random() * Math.PI * 2;
        const ph = Math.acos(2 * Math.random() - 1);
        const r = R * Math.cbrt(Math.random());
        pts.push({
          x: r * Math.sin(ph) * Math.cos(th),
          y: r * Math.sin(ph) * Math.sin(th),
          z: r * Math.cos(ph),
          s: 0.6 + Math.random() * 1.5
        });
      }
    }
    function size () {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = Math.round(innerWidth * DPR);
      H = cv.height = Math.round(innerHeight * DPR);
      cv.style.width = innerWidth + 'px';
      cv.style.height = innerHeight + 'px';
      build();
    }

    if (!reduceMotion) {
      window.addEventListener('mousemove', (e) => {
        tmx = (e.clientX / innerWidth - 0.5);
        tmy = (e.clientY / innerHeight - 0.5);
      }, { passive:true });
    }

    const V = [124,58,237], C = [6,182,212];  // violet -> cyan
    const mix = (t) => [
      Math.round(V[0] + (C[0]-V[0])*t),
      Math.round(V[1] + (C[1]-V[1])*t),
      Math.round(V[2] + (C[2]-V[2])*t)
    ];

    function draw () {
      ctx.clearRect(0, 0, W, H);
      const cx = W / 2, cy = H / 2;
      const focal = Math.min(W, H) * 0.9;
      const ay = ang + mx * 0.8, ax = my * 0.5;
      const cosY = Math.cos(ay), sinY = Math.sin(ay);
      const cosX = Math.cos(ax), sinX = Math.sin(ax);

      const proj = pts.map(p => {
        // rotate around Y, then X, then perspective-project
        const x = p.x * cosY - p.z * sinY;
        let z = p.x * sinY + p.z * cosY;
        const y = p.y * cosX - z * sinX;
        z = p.y * sinX + z * cosX;
        const sc = focal / (focal + z + Math.min(W, H) * 0.5);
        return { sx: cx + x * sc, sy: cy + y * sc, sc, s: p.s };
      });

      const dark = isDark();
      const maxDist = Math.min(W, H) * 0.20;
      ctx.lineWidth = DPR * 0.7;
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const a = proj[i], b = proj[j];
          const d = Math.hypot(a.sx - b.sx, a.sy - b.sy);
          if (d > maxDist) continue;
          const depth = Math.max(0, Math.min(1, ((a.sc + b.sc) / 2 - 0.7) / 0.6));
          const [r, g, bl] = mix(1 - depth);
          const alpha = (1 - d / maxDist) * (dark ? 0.28 : 0.20) * (0.5 + depth);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
      }
      for (const p of proj) {
        const depth = Math.max(0, Math.min(1, (p.sc - 0.7) / 0.6));
        const [r, g, bl] = mix(1 - depth);
        const rad = p.s * p.sc * DPR * 1.3;
        const alpha = (dark ? 0.55 : 0.75) * (0.35 + depth);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${bl},${alpha})`;
        ctx.shadowColor = ctx.fillStyle;
        ctx.shadowBlur = rad * 2.4;
        ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
    }

    function frame () {
      ang += 0.0016;
      mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
      draw();
      raf = requestAnimationFrame(frame);
    }
    const start = () => { cancelAnimationFrame(raf); if (reduceMotion) { ang = 0.6; draw(); } else frame(); };

    size();
    start();

    let rT;
    window.addEventListener('resize', () => {
      clearTimeout(rT);
      rT = setTimeout(() => { size(); start(); }, 150);
    });
    // pause while the tab is in the background
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) cancelAnimationFrame(raf); else start();
    });
    // static frame needs a redraw so the colours match the new theme
    themeListeners.push(() => { if (reduceMotion) draw(); });
  })();

  /* ============================================================
     Guided tour
     ============================================================ */
  (function tour () {
    const overlay = $('#tour'), spot = $('#tourSpot'), pop = $('#tourPop');
    const elStep = $('#tourStep'), elTitle = $('#tourTitle'), elText = $('#tourText');
    const btnNext = $('#tourNext'), btnPrev = $('#tourPrev'), btnSkip = $('#tourSkip');
    const tourBtn = $('#tourBtn');
    if (!overlay || !spot || !pop) return;

    const STEPS = [
      { sel:'.brand', title:'Welcome! 👋', text:"Hi, I'm Jayashree. Click my photo or name anytime to jump back to the top." },
      { sel:'.nav',   title:'Navigation', text:'Jump to any section: Home, About, Journey, Skills, Projects, Certificates and Contact.' },
      { sel:'.socials', title:'Connect', text:'Open my LinkedIn or GitHub, or send me an email directly.' },
      { sel:'.clock', title:'Live date & time', text:'A small live clock, ticking in real time.' },
      { sel:'#about .section__head', title:'About', text:'A quick intro, education, focus areas and soft skills — plus my résumé to download.' },
      { sel:'#skills .section__head', title:'Skills', text:'Skill levels and the languages, frameworks and platforms I use.' },
      { sel:'#projects .section__head', title:'Projects', text:'My AI/ML and full-stack projects, with live demos and source code on GitHub.' },
      { sel:'#certificates .section__head', title:'Certificates 👁️', text:'Tap the eye icon on any certificate to view it full-size right here.' },
      { sel:'#contact .section__head', title:'Get in touch', text:'Send me a message using the form, or reach out through the links. Thanks for visiting!' }
    ];
    let idx = 0, active = [], placeT, settleT;

    function isOpen () { return overlay.classList.contains('open'); }

    function measure () {
      const step = active[idx]; if (!step) return;
      const el = $(step.sel); if (!el) return;
      const r = el.getBoundingClientRect();
      const pad = 8;
      spot.style.top    = (r.top - pad) + 'px';
      spot.style.left   = (r.left - pad) + 'px';
      spot.style.width  = (r.width + pad * 2) + 'px';
      spot.style.height = (r.height + pad * 2) + 'px';

      const pw = pop.offsetWidth, ph = pop.offsetHeight;
      let top = r.bottom + 14;
      if (top + ph > innerHeight - 12) top = r.top - ph - 14;
      top = Math.min(Math.max(12, top), innerHeight - ph - 12);
      const left = Math.min(Math.max(12, r.left), innerWidth - pw - 12);
      pop.style.top = top + 'px';
      pop.style.left = left + 'px';
    }

    function place () {
      const step = active[idx];
      const el = step && $(step.sel);
      if (!el) { next(); return; }
      elStep.textContent = `${idx + 1} / ${active.length}`;
      elTitle.textContent = step.title;
      elText.textContent = step.text;
      btnPrev.style.visibility = idx === 0 ? 'hidden' : 'visible';
      btnNext.textContent = idx === active.length - 1 ? 'Finish' : 'Next';

      // header items are always on screen; sections need scrolling into view first
      if (!el.closest('.header')) el.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block:'center' });
      measure();
      clearTimeout(placeT); placeT = setTimeout(measure, 450);
      btnNext.focus({ preventScroll:true });
    }

    function onMove () {
      if (!isOpen()) return;
      measure();
      clearTimeout(settleT); settleT = setTimeout(measure, 120);
    }

    function start () {
      active = STEPS.filter(s => {
        // the collapsed mobile menu is off-screen, so leave it out on small screens
        if (s.sel === '.nav' && window.innerWidth <= 860) return false;
        const e = $(s.sel);
        if (!e) return false;
        const r = e.getBoundingClientRect();
        return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden';
      });
      if (!active.length) return;
      setNav(false);
      idx = 0; overlay.classList.add('open'); overlay.setAttribute('aria-hidden', 'false');
      place();
    }
    function end () {
      clearTimeout(placeT);
      overlay.classList.remove('open'); overlay.setAttribute('aria-hidden', 'true');
      store.set('jm-tour', '1');
      if (tourBtn) tourBtn.focus({ preventScroll:true });
    }
    function next () { if (idx < active.length - 1) { idx++; place(); } else end(); }
    function prev () { if (idx > 0) { idx--; place(); } }

    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);
    btnSkip.addEventListener('click', end);
    if (tourBtn) tourBtn.addEventListener('click', start);
    window.addEventListener('scroll', onMove, { passive:true });
    window.addEventListener('resize', onMove);
    window.addEventListener('keydown', (e) => {
      if (!isOpen()) return;
      if (e.key === 'Escape') end();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    });

    // show the tour once to first-time visitors (only if they start at the top of the page)
    if (!store.get('jm-tour')) {
      const auto = () => setTimeout(() => {
        if (!isOpen() && !lbOpen() && window.scrollY < 80 && !location.hash) start();
      }, 1400);
      if (document.readyState === 'complete') auto();
      else window.addEventListener('load', auto);
    }
  })();

})();
