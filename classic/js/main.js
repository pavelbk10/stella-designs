/* ============================================================
   ESTER INTERIORS — interactions & animations
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Preloader ---------- */
  const preloader = document.getElementById('preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      setTimeout(() => preloader.classList.add('is-done'), 600);
    });
    // safety fallback
    setTimeout(() => preloader.classList.add('is-done'), 2500);
  }

  /* ---------- Current year ---------- */
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- Sticky nav state ---------- */
  const nav = document.getElementById('nav');
  const onScroll = () => {
    if (!nav || nav.classList.contains('nav--solid')) return;
    nav.classList.toggle('is-scrolled', window.scrollY > 60);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  const burger = document.getElementById('navBurger');
  const navLinks = document.getElementById('navLinks');
  if (burger && nav && navLinks) {
    const mobileMenu = window.matchMedia('(max-width: 1100px)');
    const setMenuOpen = (open) => {
      nav.classList.toggle('is-open', open);
      if (open) nav.classList.remove('is-hidden');
      burger.setAttribute('aria-expanded', String(open));
      navLinks.inert = mobileMenu.matches && !open;
    };
    burger.setAttribute('aria-controls', navLinks.id);
    setMenuOpen(false);
    burger.addEventListener('click', () => setMenuOpen(!nav.classList.contains('is-open')));
    navLinks.querySelectorAll('a').forEach(a =>
      a.addEventListener('click', () => setMenuOpen(false))
    );
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) setMenuOpen(false);
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && nav.classList.contains('is-open')) {
        setMenuOpen(false);
        burger.focus();
      }
    });
    mobileMenu.addEventListener('change', () => setMenuOpen(false));
  }

  /* ---------- Scroll reveal (IntersectionObserver fallback — GSAP takes over when loaded) ---------- */
  if (!window.ESTER_GSAP) {
    const revealEls = document.querySelectorAll('.reveal-up, .reveal-side-left, .reveal-side-right');
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  /* ---------- Staggered delays for grids ---------- */
  document.querySelectorAll('.portfolio__grid, .process__list, .values__grid').forEach(grid => {
    [...grid.children].forEach((child, i) => {
      child.style.setProperty('--d', `${i * 0.09}s`);
    });
  });

  /* ---------- Animated counters ---------- */
  const counters = document.querySelectorAll('.stat__num');
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = +el.dataset.count;
      const dur = 1600;
      const start = performance.now();
      const tick = (now) => {
        const p = Math.min((now - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.floor(eased * target);
        if (p < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
      counterIO.unobserve(el);
    });
  }, { threshold: 0.6 });
  counters.forEach(c => counterIO.observe(c));

  /* ---------- Parallax on showcase video (fallback — GSAP takes over when loaded) ---------- */
  const showcaseVid = document.querySelector('.showcase__video-wrap');
  if (showcaseVid && !window.ESTER_GSAP && window.matchMedia('(min-width: 901px) and (hover: hover)').matches) {
    window.addEventListener('scroll', () => {
      const rect = showcaseVid.parentElement.getBoundingClientRect();
      const offset = (rect.top / window.innerHeight) * 40;
      showcaseVid.style.transform = `translateY(${offset}px) scale(1.1)`;
    }, { passive: true });
  }

  /* ---------- Video modal ---------- */
  const modal = document.getElementById('modal');
  const playBtn = document.getElementById('playBtn');
  const modalClose = document.getElementById('modalClose');
  const modalVideo = document.getElementById('modalVideo');
  const openModal = () => { modal?.classList.add('is-open'); modalVideo?.play(); };
  const closeModal = () => { modal?.classList.remove('is-open'); modalVideo?.pause(); };
  playBtn?.addEventListener('click', openModal);
  modalClose?.addEventListener('click', closeModal);
  modal?.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  /* ---------- Contact form (demo) ---------- */
  const form = document.getElementById('contactForm');
  form?.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    if (btn) { btn.textContent = 'תודה! אחזור אליכם בקרוב ✓'; btn.disabled = true; }
    form.reset();
  });

  /* ---------- FAQ accordion ---------- */
  const refreshFaqAnswers = () => {
    document.querySelectorAll('.faq.is-open .faq__a').forEach(answer => {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  };
  window.addEventListener('resize', refreshFaqAnswers);
  document.fonts.ready.then(refreshFaqAnswers);
  document.querySelectorAll('.faq__q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.parentElement;
      const isOpen = item.classList.contains('is-open');
      document.querySelectorAll('.faq.is-open').forEach(f => {
        f.classList.remove('is-open');
        f.querySelector('.faq__a').style.maxHeight = '0px';
      });
      if (!isOpen) {
        item.classList.add('is-open');
        refreshFaqAnswers();
      }
    });
  });

  /* ---------- Floating contact buttons (WhatsApp + Call) ---------- */
  const CONTACT = {
    phone: '+972500000000',           // <-- עדכנו למספר האמיתי
    whatsapp: '972500000000',         // <-- מספר וואטסאפ בפורמט בינלאומי, בלי + ובלי 0
    waText: 'היי, הגעתי דרך האתר ואשמח לפגישת ייעוץ 🙂'
  };
  if (!document.getElementById('floatContact')) {
    const fc = document.createElement('div');
    fc.id = 'floatContact';
    fc.className = 'float-contact';
    fc.innerHTML = `
      <a class="float-btn float-btn--wa" data-cursor="hover" target="_blank" rel="noopener"
         href="https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(CONTACT.waText)}"
         aria-label="שליחת הודעה בוואטסאפ">
        <svg viewBox="0 0 24 24" width="26" height="26" aria-hidden="true" fill="currentColor">
          <path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38a9.9 9.9 0 0 0 4.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.91-7.02ZM12.05 20.15h-.01a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.11.82.83-3.04-.2-.31a8.16 8.16 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24a8.2 8.2 0 0 1 8.23 8.25c0 4.54-3.69 8.23-8.24 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.79.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.01-.38.11-.5.11-.11.25-.29.37-.43.13-.14.17-.25.25-.41.08-.17.04-.31-.02-.43-.06-.12-.56-1.34-.76-1.84-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.23.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.68-1.18.21-.58.21-1.07.14-1.18-.06-.11-.22-.17-.47-.29Z"/>
        </svg>
        <span class="float-btn__tip">וואטסאפ</span>
      </a>
      <a class="float-btn float-btn--call" data-cursor="hover" href="tel:${CONTACT.phone}" aria-label="חייגו עכשיו">
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true" fill="currentColor">
          <path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1.02-.24c1.12.37 2.33.57 3.57.57a1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.25.2 2.45.57 3.57a1 1 0 0 1-.25 1.02l-2.2 2.2Z"/>
        </svg>
        <span class="float-btn__tip">חייגו עכשיו</span>
      </a>`;
    document.body.appendChild(fc);
  }

  /* ---------- Accessibility widget ---------- */
  (function accessibility() {
    if (document.getElementById('a11yPanel')) return;
    const root = document.documentElement;
    const KEY = 'ester-a11y';
    const state = JSON.parse(localStorage.getItem(KEY) || '{}');

    const toggle = document.createElement('button');
    toggle.id = 'a11yToggle';
    toggle.className = 'a11y-toggle';
    toggle.setAttribute('aria-label', 'תפריט נגישות');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.innerHTML = `
      <svg viewBox="0 0 24 24" width="28" height="28" aria-hidden="true" fill="currentColor">
        <circle cx="12" cy="3.8" r="2"/>
        <path d="M21 8.5c0 .6-.5 1-1.1 1-2 .1-3.9.1-5.9 0v2.2l1.9 7.4c.1.6-.2 1.1-.8 1.3-.6.1-1.1-.2-1.3-.8l-1.6-6.2h-.4l-1.6 6.2c-.2.6-.7.9-1.3.8-.6-.2-.9-.7-.8-1.3l1.9-7.4V9.5c-2 .1-3.9.1-5.9 0C2.5 9.5 2 9.1 2 8.5s.5-1.1 1.1-1c2.9.2 6 .2 8.9.2s6-.0 8.9-.2c.6-.1 1.1.4 1.1 1Z"/>
      </svg>`;

    const panel = document.createElement('div');
    panel.id = 'a11yPanel';
    panel.className = 'a11y-panel';
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-label', 'הגדרות נגישות');
    panel.innerHTML = `
      <div class="a11y-panel__head">
        <h3>תפריט נגישות</h3>
        <button class="a11y-panel__close" id="a11yClose" aria-label="סגירה">×</button>
      </div>
      <div class="a11y-panel__grid">
        <button class="a11y-item" data-act="contrast">ניגודיות גבוהה</button>
        <button class="a11y-item" data-act="invert">היפוך צבעים</button>
        <button class="a11y-item" data-act="grayscale">גווני אפור</button>
        <button class="a11y-item" data-act="light">רקע בהיר</button>
        <button class="a11y-item" data-act="links">הדגשת קישורים</button>
        <button class="a11y-item" data-act="readable">גופן קריא</button>
        <button class="a11y-item" data-act="spacing">ריווח טקסט</button>
        <button class="a11y-item" data-act="bigcursor">סמן גדול</button>
        <button class="a11y-item" data-act="stopmotion">עצירת אנימציות</button>
        <button class="a11y-item a11y-item--num" data-act="font-dec">א−</button>
        <button class="a11y-item a11y-item--num" data-act="font-reset">איפוס גופן</button>
        <button class="a11y-item a11y-item--num" data-act="font-inc">א+</button>
      </div>
      <button class="a11y-reset" id="a11yReset">איפוס כל ההגדרות</button>
      <a class="a11y-statement" href="accessibility.html">להצהרת הנגישות המלאה ←</a>`;

    document.body.appendChild(toggle);
    document.body.appendChild(panel);

    const toggleClasses = {
      contrast: 'a11y-contrast',
      invert: 'a11y-invert',
      grayscale: 'a11y-grayscale',
      light: 'a11y-light',
      links: 'a11y-links',
      readable: 'a11y-readable',
      spacing: 'a11y-spacing',
      bigcursor: 'a11y-bigcursor',
      stopmotion: 'a11y-stopmotion'
    };

    function apply() {
      Object.entries(toggleClasses).forEach(([act, cls]) => {
        root.classList.toggle(cls, !!state[act]);
        const btn = panel.querySelector(`[data-act="${act}"]`);
        if (btn) btn.classList.toggle('is-active', !!state[act]);
      });
      const fs = state.font || 0;
      root.style.setProperty('--a11y-font', `${100 + fs * 12}%`);
      root.classList.toggle('a11y-font', fs !== 0);
      localStorage.setItem(KEY, JSON.stringify(state));
    }

    panel.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-act]');
      if (!btn) return;
      const act = btn.dataset.act;
      if (act === 'font-inc') state.font = Math.min((state.font || 0) + 1, 4);
      else if (act === 'font-dec') state.font = Math.max((state.font || 0) - 1, -2);
      else if (act === 'font-reset') state.font = 0;
      else state[act] = !state[act];
      apply();
    });

    const openPanel = (open) => {
      panel.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', () => openPanel(!panel.classList.contains('is-open')));
    document.getElementById('a11yClose').addEventListener('click', () => openPanel(false));
    document.getElementById('a11yReset').addEventListener('click', () => {
      Object.keys(state).forEach(k => delete state[k]);
      apply();
    });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') openPanel(false); });

    apply();
  })();

  /* ---------- Testimonials auto-rotation ---------- */
  (function testimonials() {
    const slides = document.querySelectorAll('.quote__slide');
    const dotsWrap = document.getElementById('quoteDots');
    if (slides.length < 2 || !dotsWrap) return;

    let current = 0;
    let timer;

    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'quote__dot' + (i === 0 ? ' is-active' : '');
      dot.setAttribute('aria-label', `המלצה ${i + 1}`);
      dot.addEventListener('click', () => { show(i); reset(); });
      dotsWrap.appendChild(dot);
    });
    const dots = dotsWrap.querySelectorAll('.quote__dot');

    function show(i) {
      slides[current].classList.remove('is-active');
      dots[current].classList.remove('is-active');
      current = (i + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      dots[current].classList.add('is-active');
    }
    function next() { show(current + 1); }
    function start() { timer = setInterval(next, 5000); }
    function reset() { clearInterval(timer); start(); }

    start();
  })();

  /* ---------- Custom cursor (disabled — using normal mouse cursor) ---------- */
});
