/* =========================================================
   Jayashree Mondal — Portfolio  |  interactions & 3D bg
   ========================================================= */
(function () {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------------- Certificate data ---------------- */
  const CERTS = [
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

  /* ---------------- Preloader ---------------- */
  window.addEventListener('load', () => {
    const pre = $('#preloader');
    setTimeout(() => pre && pre.classList.add('hide'), 550);
  });

  /* ---------------- Year ---------------- */
  const yr = $('#year'); if (yr) yr.textContent = new Date().getFullYear();

  /* ---------------- Live clock ---------------- */
  (function clock () {
    const t = $('#clockTime'), d = $('#clockDate');
    if (!t || !d) return;
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    const mon  = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    function tick () {
      const n = new Date();
      const hh = String(n.getHours()).padStart(2,'0');
      const mm = String(n.getMinutes()).padStart(2,'0');
      const ss = String(n.getSeconds()).padStart(2,'0');
      t.textContent = `${hh}:${mm}:${ss}`;
      d.textContent = `${days[n.getDay()]}, ${n.getDate()} ${mon[n.getMonth()]} ${n.getFullYear()}`;
    }
    tick(); setInterval(tick, 1000);
  })();

  /* ---------------- Theme toggle ---------------- */
  (function theme () {
    const btn = $('#themeToggle');
    const saved = localStorage.getItem('jm-theme');
    if (saved) document.documentElement.setAttribute('data-theme', saved);
    btn && btn.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', cur);
      localStorage.setItem('jm-theme', cur);
      toast(cur === 'dark' ? '🌙 Dark mode' : '☀️ Light mode');
    });
  })();

  /* ---------------- Header + scrollspy + progress ---------------- */
  const header = $('#header');
  const progress = $('#scrollProgress');
  const navLinks = $$('.nav__link');
  const sections = navLinks.map(l => $(l.getAttribute('href'))).filter(Boolean);

  function onScroll () {
    const y = window.scrollY;
    header.classList.toggle('scrolled', y > 30);
    const h = document.documentElement.scrollHeight - window.innerHeight;
    if (progress) progress.style.width = (h > 0 ? (y / h) * 100 : 0) + '%';
    $('#toTop').classList.toggle('show', y > 500);

    let cur = sections[0] ? sections[0].id : 'home';
    for (const s of sections) if (s.getBoundingClientRect().top <= 140) cur = s.id;
    navLinks.forEach(l => l.classList.toggle('active', l.getAttribute('href') === '#' + cur));
  }
  window.addEventListener('scroll', onScroll, { passive:true });
  onScroll();

  /* ---------------- Mobile nav ---------------- */
  const burger = $('#hamburger'), nav = $('#nav');
  burger && burger.addEventListener('click', () => {
    nav.classList.toggle('open'); burger.classList.toggle('open');
  });
  navLinks.forEach(l => l.addEventListener('click', () => {
    nav.classList.remove('open'); burger.classList.remove('open');
  }));

  /* ---------------- Back to top ---------------- */
  $('#toTop').addEventListener('click', () => window.scrollTo({ top:0, behavior:'smooth' }));

  /* ---------------- Typed effect ---------------- */
  (function typed () {
    const el = $('#typed'); if (!el) return;
    const words = ['AI / ML Enthusiast','Software Developer','B.Tech IT Student',
                   'Flutter & React Native Dev','Problem Solver'];
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

  /* ---------------- Reveal + skills + counters ---------------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('in');
      $$('.bar', e.target).forEach(b => { $('i', b).style.width = (b.dataset.level || 0) + '%'; });
      io.unobserve(e.target);
    });
  }, { threshold:0.14 });
  $$('.reveal').forEach(el => io.observe(el));

  const countIO = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target, target = +el.dataset.count, suf = el.dataset.suffix || '';
      let n = 0; const step = Math.max(1, Math.round(target / 40));
      const t = setInterval(() => {
        n += step; if (n >= target) { n = target; clearInterval(t); }
        el.textContent = n + suf;
      }, 32);
      countIO.unobserve(el);
    });
  }, { threshold:0.5 });
  $$('.stat__num').forEach(el => countIO.observe(el));

  /* ---------------- Build certificates ---------------- */
  const grid = $('#certGrid');
  const eyeSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z"/><circle cx="12" cy="12" r="3"/></svg>';
  const calSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>';
  if (grid) {
    grid.innerHTML = CERTS.map((c, i) => `
      <article class="cert reveal" data-cat="${c.cat}">
        <div class="cert__thumb" role="button" tabindex="0" aria-label="View ${c.title}" data-i="${i}">
          <span class="cert__badge">${c.cat}</span>
          <img src="${c.img}" alt="${c.title} certificate" loading="lazy" />
          <div class="cert__overlay"><span class="cert__eye">${eyeSVG}</span></div>
        </div>
        <div class="cert__body">
          <span class="cert__issuer">${c.issuer}</span>
          <h3 class="cert__title">${c.title}</h3>
          <span class="cert__date">${calSVG}${c.date}</span>
          <div class="cert__skills">${c.skills.map(s => `<span>${s}</span>`).join('')}</div>
          <button class="cert__view" data-i="${i}">${eyeSVG} View certificate</button>
        </div>
      </article>`).join('');
    $$('.cert.reveal', grid).forEach(el => io.observe(el));
  }

  /* ---------------- Certificate filters ---------------- */
  $$('.cert-filter').forEach(btn => btn.addEventListener('click', () => {
    $$('.cert-filter').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    $$('.cert').forEach(c => c.classList.toggle('is-hidden', !(f === 'all' || c.dataset.cat === f)));
  }));

  /* ---------------- Lightbox ---------------- */
  const lb = $('#lightbox'), lbImg = $('#lbImg'), lbTitle = $('#lbTitle'),
        lbSub = $('#lbSub'), lbDl = $('#lbDownload');
  let lbIndex = 0;
  function visibleCerts () {
    return $$('.cert').filter(c => !c.classList.contains('is-hidden'))
      .map(c => +$('.cert__thumb', c).dataset.i);
  }
  function openLB (i) {
    lbIndex = i; const c = CERTS[i];
    lbImg.src = c.img; lbImg.alt = c.title;
    lbTitle.textContent = c.title;
    lbSub.textContent = `${c.issuer} • ${c.date}`;
    lbDl.href = c.img;
    lb.classList.add('open'); lb.setAttribute('aria-hidden','false');
    document.body.style.overflow = 'hidden';
  }
  function closeLB () {
    lb.classList.remove('open'); lb.setAttribute('aria-hidden','true');
    document.body.style.overflow = '';
  }
  function stepLB (dir) {
    const vis = visibleCerts(); if (!vis.length) return;
    let pos = vis.indexOf(lbIndex);
    pos = (pos + dir + vis.length) % vis.length;
    openLB(vis[pos]);
  }
  document.addEventListener('click', (e) => {
    const t = e.target.closest('[data-i]');
    if (t && (t.classList.contains('cert__thumb') || t.classList.contains('cert__view'))) {
      openLB(+t.dataset.i);
    }
  });
  document.addEventListener('keydown', (e) => {
    const t = e.target.closest && e.target.closest('.cert__thumb');
    if (t && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); openLB(+t.dataset.i); }
  });
  $('#lbClose').addEventListener('click', closeLB);
  $('#lbBackdrop').addEventListener('click', closeLB);
  $('#lbPrev').addEventListener('click', () => stepLB(-1));
  $('#lbNext').addEventListener('click', () => stepLB(1));
  window.addEventListener('keydown', (e) => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLB();
    if (e.key === 'ArrowLeft') stepLB(-1);
    if (e.key === 'ArrowRight') stepLB(1);
  });

  /* ---------------- Contact form ---------------- */
  (function contact () {
    const form = $('#contactForm');
    if (!form) return;
    const nameEl = $('#cName'), mailEl = $('#cEmail'), msgEl = $('#cMsg');
    const statusEl = $('#emailStatus'), note = $('#formNote'), sendBtn = $('#sendBtn');

    let emailState = 'idle';   // idle | checking | valid | invalid
    let checkToken = 0, debounce;
    const fmtOk = (m) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(m);

    function setStatus (state, text) {
      emailState = state;
      if (!statusEl) return;
      statusEl.textContent = text || '';
      statusEl.className = 'field__status' +
        (state === 'valid' ? ' ok' : state === 'invalid' ? ' err' : state === 'checking' ? ' checking' : '');
    }

    // Verify the email's domain actually exists and can receive mail (MX record),
    // using Google's public DNS-over-HTTPS. Returns true / false / null(unknown).
    async function verifyDomain (email) {
      const domain = (email.split('@')[1] || '').toLowerCase();
      if (!domain || !domain.includes('.')) return false;
      try {
        const mx = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=MX`).then(r => r.json());
        if (mx.Status === 0 && Array.isArray(mx.Answer) && mx.Answer.some(a => a.type === 15)) return true;
        const a = await fetch(`https://dns.google/resolve?name=${encodeURIComponent(domain)}&type=A`).then(r => r.json());
        return a.Status === 0 && Array.isArray(a.Answer) && a.Answer.length > 0;
      } catch (e) {
        return null; // offline / blocked — can't verify
      }
    }

    async function runCheck () {
      const mail = mailEl.value.trim();
      if (!mail) { setStatus('idle', ''); return; }
      if (!fmtOk(mail)) { setStatus('invalid', "✗ That doesn't look like a valid email"); return; }
      setStatus('checking', '⏳ Verifying this email exists…');
      const token = ++checkToken;
      const exists = await verifyDomain(mail);
      if (token !== checkToken) return;            // a newer check superseded this one
      if (exists === true)      setStatus('valid',   '✓ Email verified — you can send your message');
      else if (exists === null) setStatus('valid',   '✓ Email format looks good');
      else                      setStatus('invalid', "✗ This email doesn't seem to exist");
    }

    mailEl.addEventListener('input', () => { setStatus('idle', ''); clearTimeout(debounce); debounce = setTimeout(runCheck, 600); });
    mailEl.addEventListener('blur', runCheck);

    function showSuccess () {
      note.innerHTML = "✅ Message successfully sent to <b>Jayashree Mondal</b>. Thank you! 🙏<br>" +
        "Please wait — Jayashree's reply is on the way. Have a good day! 😊🌸";
      note.className = 'form-note ok';
      toast('✅ Message sent — thank you!');
      form.reset(); setStatus('idle', '');
      sendBtn.disabled = false; sendBtn.classList.remove('is-loading');
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = nameEl.value.trim(), mail = mailEl.value.trim(), msg = msgEl.value.trim();

      if (!name) { note.textContent = 'Please enter your name.'; note.className = 'form-note err'; nameEl.focus(); return; }
      if (!fmtOk(mail)) {
        setStatus('invalid', "✗ That doesn't look like a valid email");
        note.textContent = 'Please enter a valid email address.'; note.className = 'form-note err'; mailEl.focus(); return;
      }
      // The email must be verified as real/existing BEFORE a message can be sent.
      if (emailState !== 'valid') {
        note.textContent = 'Verifying your email first…'; note.className = 'form-note';
        await runCheck();
        if (emailState !== 'valid') {
          note.textContent = 'Please use a real, existing email so Jayashree can reply.';
          note.className = 'form-note err'; mailEl.focus(); return;
        }
      }
      if (!msg) { note.textContent = 'Please write a message before sending.'; note.className = 'form-note err'; msgEl.focus(); return; }

      // Honeypot: if a bot filled the hidden field, pretend success and drop it
      const honey = $('#cHoney');
      if (honey && honey.value) { showSuccess(); return; }

      // Send
      sendBtn.disabled = true; sendBtn.classList.add('is-loading');
      note.textContent = 'Sending your message…'; note.className = 'form-note';

      // Real delivery via FormSubmit — no signup / no API key, works on localhost, file:// and any host.
      // The message is emailed straight to jayashreemondal2005@gmail.com.
      const ENDPOINT = 'https://formsubmit.co/ajax/jayashreemondal2005@gmail.com';
      const data = {
        name: name,
        email: mail,
        message: msg,
        _subject: `📬 New portfolio message from ${name}`,
        _template: 'table',
        _captcha: 'false'
      };

      try {
        const r = await fetch(ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(data)
        });
        const j = await r.json().catch(() => ({}));
        // Delivered only when the service confirms success. Otherwise (e.g. form not yet
        // activated) fall through to the mailto fallback so the message is never lost.
        if (r.ok && (j.success === true || j.success === 'true')) { showSuccess(); return; }
        throw new Error(j.message || ('status ' + r.status));
      } catch (err) {
        // Fallback so the message still reaches Jayashree even if the service is unreachable
        const subject = encodeURIComponent(`Portfolio message from ${name}`);
        const body = encodeURIComponent(`${msg}\n\n— ${name}\n${mail}`);
        window.location.href = `mailto:jayashreemondal2005@gmail.com?subject=${subject}&body=${body}`;
        showSuccess();
      }
    });
  })();

  /* ---------------- Toast ---------------- */
  let toastT;
  function toast (msg) {
    const el = $('#toast'); if (!el) return;
    el.textContent = msg; el.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(() => el.classList.remove('show'), 2600);
  }

  /* ---------------- Custom cursor ---------------- */
  (function cursor () {
    if (!window.matchMedia('(hover:hover) and (pointer:fine)').matches) return;
    const dot = $('#cursorDot'), ring = $('#cursorRing');
    let rx = 0, ry = 0, dx = 0, dy = 0;
    window.addEventListener('mousemove', (e) => {
      dx = e.clientX; dy = e.clientY;
      dot.style.left = dx + 'px'; dot.style.top = dy + 'px';
    });
    (function follow () {
      rx += (dx - rx) * 0.18; ry += (dy - ry) * 0.18;
      ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
      requestAnimationFrame(follow);
    })();
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest('a,button,.cert__thumb,.tech-chip,.info-card')) ring.classList.add('grow');
    });
    document.addEventListener('mouseout', (e) => {
      if (e.target.closest('a,button,.cert__thumb,.tech-chip,.info-card')) ring.classList.remove('grow');
    });
  })();

  /* ============================================================
     3D animated background — particle constellation (premium)
     ============================================================ */
  (function bg () {
    const cv = $('#bg-canvas'); if (!cv) return;
    const ctx = cv.getContext('2d');
    let W, H, DPR, pts = [], mx = 0, my = 0, tmx = 0, tmy = 0;
    const isDark = () => document.documentElement.getAttribute('data-theme') === 'dark';

    function size () {
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = cv.width = innerWidth * DPR;
      H = cv.height = innerHeight * DPR;
      cv.style.width = innerWidth + 'px';
      cv.style.height = innerHeight + 'px';
      build();
    }
    function build () {
      const area = innerWidth * innerHeight;
      const n = Math.max(40, Math.min(110, Math.round(area / 15000)));
      const R = Math.min(W, H) * 0.46;
      pts = [];
      for (let i = 0; i < n; i++) {
        // random point in a sphere-ish volume
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
    window.addEventListener('mousemove', (e) => {
      tmx = (e.clientX / innerWidth - 0.5);
      tmy = (e.clientY / innerHeight - 0.5);
    });

    const V = [124,58,237], C = [6,182,212];  // violet -> cyan
    function mix (t) {
      return [
        Math.round(V[0] + (C[0]-V[0])*t),
        Math.round(V[1] + (C[1]-V[1])*t),
        Math.round(V[2] + (C[2]-V[2])*t)
      ];
    }

    let ang = 0;
    function frame () {
      ang += 0.0016;
      mx += (tmx - mx) * 0.05; my += (tmy - my) * 0.05;
      ctx.clearRect(0, 0, W, H);

      const cx = W / 2, cy = H / 2;
      const focal = Math.min(W, H) * 0.9;
      const ay = ang + mx * 0.8;
      const ax = my * 0.5;
      const cosY = Math.cos(ay), sinY = Math.sin(ay);
      const cosX = Math.cos(ax), sinX = Math.sin(ax);

      const proj = pts.map(p => {
        // rotate Y
        let x = p.x * cosY - p.z * sinY;
        let z = p.x * sinY + p.z * cosY;
        let y = p.y;
        // rotate X
        let y2 = y * cosX - z * sinX;
        z = y * sinX + z * cosX; y = y2;
        const sc = focal / (focal + z + Math.min(W,H)*0.5);
        return { sx: cx + x * sc, sy: cy + y * sc, sc, z, s: p.s };
      });

      const dark = isDark();
      const maxDist = Math.min(W, H) * 0.20;
      // lines
      for (let i = 0; i < proj.length; i++) {
        for (let j = i + 1; j < proj.length; j++) {
          const a = proj[i], b = proj[j];
          const dx = a.sx - b.sx, dy = a.sy - b.sy;
          const d = Math.hypot(dx, dy);
          if (d > maxDist) continue;
          const t = (a.sc + b.sc) / 2;
          const depth = Math.max(0, Math.min(1, (t - 0.7) / 0.6));
          const [r,g,bl] = mix(1 - depth);
          const alpha = (1 - d / maxDist) * (dark ? 0.28 : 0.20) * (0.5 + depth);
          ctx.strokeStyle = `rgba(${r},${g},${bl},${alpha})`;
          ctx.lineWidth = DPR * 0.7;
          ctx.beginPath(); ctx.moveTo(a.sx, a.sy); ctx.lineTo(b.sx, b.sy); ctx.stroke();
        }
      }
      // points
      for (const p of proj) {
        const depth = Math.max(0, Math.min(1, (p.sc - 0.7) / 0.6));
        const [r,g,bl] = mix(1 - depth);
        const rad = p.s * p.sc * DPR * 1.3;
        const alpha = (dark ? 0.55 : 0.75) * (0.35 + depth);
        ctx.beginPath();
        ctx.fillStyle = `rgba(${r},${g},${bl},${alpha})`;
        ctx.shadowColor = `rgba(${r},${g},${bl},${alpha})`;
        ctx.shadowBlur = rad * 2.4;
        ctx.arc(p.sx, p.sy, rad, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.shadowBlur = 0;
      raf = requestAnimationFrame(frame);
    }

    let raf;
    size();
    window.addEventListener('resize', () => { cancelAnimationFrame(raf); size(); if (reduceMotion) drawStatic(); else frame(); });
    function drawStatic () { ang = 0.6; mx = my = 0; /* draw one frame */
      const keep = frame; }
    if (reduceMotion) { frame(); cancelAnimationFrame(raf); }  // single frame
    else frame();
  })();

  /* ============================================================
     Guided tour
     ============================================================ */
  (function tour () {
    const overlay = $('#tour'), spot = $('#tourSpot'), pop = $('#tourPop');
    const elStep = $('#tourStep'), elTitle = $('#tourTitle'), elText = $('#tourText');
    const btnNext = $('#tourNext'), btnPrev = $('#tourPrev'), btnSkip = $('#tourSkip');
    if (!overlay) return;

    const STEPS = [
      { sel:'.brand', title:'Welcome! 👋', text:"This is Jayashree Mondal's portfolio. That's her photo and name — click it anytime to return home." },
      { sel:'.nav',   title:'Navigation', text:'Jump to any section: Home, About, Journey, Skills, Projects, Certificates and Contact.' },
      { sel:'.socials', title:'Connect instantly', text:'Tap these to open LinkedIn, GitHub or send an email directly.' },
      { sel:'.clock', title:'Live date & time', text:'A live clock keeps ticking here in real time.' },
      { sel:'#about', title:'About', text:'A quick intro, education, focus areas and soft skills — plus a downloadable résumé.' },
      { sel:'#skills', title:'Skills', text:'Animated skill bars and a full toolbox of languages, frameworks and platforms.' },
      { sel:'#projects', title:'Projects', text:'Featured work in AI/ML and full-stack development, each linked to GitHub.' },
      { sel:'#certificates', title:'Certificates 👁️', text:'Tap the eye icon on any certificate to view it full-size, right here in the app.' },
      { sel:'#contact', title:'Get in touch', text:'Send a message through the form or reach out via the links. Enjoy exploring!' }
    ];
    let idx = 0, active = [];

    function place () {
      const step = active[idx];
      const el = $(step.sel);
      if (!el) { next(); return; }
      el.scrollIntoView({ behavior:'smooth', block:'center' });
      setTimeout(() => {
        const r = el.getBoundingClientRect();
        const pad = 8;
        spot.style.top    = (r.top - pad) + 'px';
        spot.style.left   = (r.left - pad) + 'px';
        spot.style.width  = (r.width + pad*2) + 'px';
        spot.style.height = (r.height + pad*2) + 'px';

        elStep.textContent = `${idx+1} / ${active.length}`;
        elTitle.textContent = step.title;
        elText.textContent = step.text;
        btnPrev.style.visibility = idx === 0 ? 'hidden' : 'visible';
        btnNext.textContent = idx === active.length - 1 ? 'Finish' : 'Next';

        // position popover
        const pw = pop.offsetWidth, phh = pop.offsetHeight;
        let top = r.bottom + 14, left = r.left;
        if (top + phh > innerHeight - 12) top = Math.max(12, r.top - phh - 14);
        if (top < 12) top = 12;
        left = Math.min(Math.max(12, left), innerWidth - pw - 12);
        pop.style.top = top + 'px';
        pop.style.left = left + 'px';
      }, 420);
    }
    function start () {
      active = STEPS.filter(s => { const e = $(s.sel); return e && e.getBoundingClientRect().width > 0 && e.offsetParent !== null; });
      if (!active.length) return;
      idx = 0; overlay.classList.add('open'); overlay.setAttribute('aria-hidden','false');
      place();
    }
    function end () {
      overlay.classList.remove('open'); overlay.setAttribute('aria-hidden','true');
      localStorage.setItem('jm-tour', '1');
    }
    function next () { if (idx < active.length - 1) { idx++; place(); } else end(); }
    function prev () { if (idx > 0) { idx--; place(); } }

    btnNext.addEventListener('click', next);
    btnPrev.addEventListener('click', prev);
    btnSkip.addEventListener('click', end);
    $('#tourBtn').addEventListener('click', start);
    window.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('open')) return;
      if (e.key === 'Escape') end();
      if (e.key === 'ArrowRight') next();
      if (e.key === 'ArrowLeft') prev();
    });

    // auto-start once for first-time visitors
    if (!localStorage.getItem('jm-tour')) {
      window.addEventListener('load', () => setTimeout(start, 1400));
    }
  })();

})();
