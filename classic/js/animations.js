/* ============================================================
   ESTER INTERIORS — 2026 advanced animations
   GSAP + ScrollTrigger + Lenis smooth scroll.
   Loaded after main.js. Everything degrades gracefully:
   if the CDNs fail, main.js IntersectionObserver reveals
   keep working (it checks window.ESTER_GSAP).
   ============================================================ */
window.ESTER_GSAP = !!(window.gsap && window.ScrollTrigger);

(function () {
  if (!window.ESTER_GSAP) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stopMotion = document.documentElement.classList.contains('a11y-stopmotion');
  if (reduceMotion || stopMotion) { window.ESTER_GSAP = false; return; }

  gsap.registerPlugin(ScrollTrigger);
  var isTouch = window.matchMedia('(hover: none)').matches;
  var compactScreen = window.matchMedia('(max-width: 900px)').matches;

  document.addEventListener('DOMContentLoaded', function () {
    document.body.classList.add('gsap-ready');

    /* ---------- Lenis smooth scroll ---------- */
    var lenis = null;
    if (window.Lenis && !isTouch && window.matchMedia('(min-width: 1101px)').matches) {
      lenis = new Lenis({ duration: 1.15, smoothWheel: true });
      lenis.on('scroll', ScrollTrigger.update);
      // own rAF loop — more reliable than gsap.ticker across tab visibility changes
      (function raf(time) { lenis.raf(time); requestAnimationFrame(raf); })(performance.now());

      // anchor links through lenis
      document.querySelectorAll('a[href^="#"]').forEach(function (a) {
        a.addEventListener('click', function (e) {
          var id = a.getAttribute('href');
          if (id.length < 2) return;
          var target = document.querySelector(id);
          if (!target) return;
          e.preventDefault();
          lenis.scrollTo(target, { offset: -90 });
        });
      });
    }

    /* ---------- Nav: hide on scroll down, show on up ---------- */
    var nav = document.getElementById('nav');
    if (nav) {
      ScrollTrigger.create({
        start: 'top top',
        end: 'max',
        onUpdate: function (self) {
          if (nav.classList.contains('is-open')) return;
          if (self.direction === 1 && self.scroll() > 220) nav.classList.add('is-hidden');
          else nav.classList.remove('is-hidden');
        }
      });
    }

    /* ---------- Hero intro timeline ---------- */
    var heroTitle = document.querySelector('.hero__title, .lp-hero__title, .about-hero__title, .page-hero__title');
    if (heroTitle) {
      var lines = heroTitle.querySelectorAll('.line span');
      var tl = gsap.timeline({ delay: .15, defaults: { ease: 'power4.out' } });
      if (lines.length) {
        gsap.set(lines, { yPercent: 115 });
        tl.to(lines, { yPercent: 0, duration: 1.2, stagger: .14 });
      }
      var eyebrow = document.querySelector('.hero__eyebrow, .page-hero__eyebrow');
      if (eyebrow) tl.from(eyebrow, { y: 26, autoAlpha: 0, duration: .9 }, '-=.9');
      var sub = document.querySelector('.hero__sub, .page-hero__sub, .about-hero__sub');
      if (sub) tl.from(sub, { y: 30, autoAlpha: 0, duration: .9 }, '-=.7');
      var actions = document.querySelector('.hero__actions, .lp-hero__actions, .page-hero__count');
      if (actions) tl.from(actions, { y: 26, autoAlpha: 0, duration: .8 }, '-=.65');
      var scrollHint = document.querySelector('.hero__scroll');
      if (scrollHint) tl.from(scrollHint, { autoAlpha: 0, duration: .8 }, '-=.4');
    }

    /* ---------- Hero video: scale + drift on scroll ---------- */
    var heroVideo = document.querySelector('.hero__video, .lp-hero__video');
    if (heroVideo && !isTouch && !compactScreen) {
      gsap.to(heroVideo, {
        yPercent: 18, scale: 1.12, ease: 'none',
        scrollTrigger: { trigger: heroVideo.closest('section'), start: 'top top', end: 'bottom top', scrub: true }
      });
      var heroContent = document.querySelector('.hero__content, .lp-hero__content');
      if (heroContent) {
        gsap.to(heroContent, {
          yPercent: -14, autoAlpha: .25, ease: 'none',
          scrollTrigger: { trigger: heroVideo.closest('section'), start: 'top top', end: '70% top', scrub: true }
        });
      }
    }

    /* ---------- Scroll reveals (replace IO when GSAP active) ---------- */
    var revealMap = [
      ['.reveal-up', { y: 64, x: 0 }],
      ['.reveal-side-left', { x: -48, y: 0 }],
      ['.reveal-side-right', { x: 48, y: 0 }]
    ];
    revealMap.forEach(function (pair) {
      document.querySelectorAll(pair[0]).forEach(function (el) {
        // skip hero children — already handled by the intro timeline
        if (el.closest('.hero, .lp-hero, .page-hero, .about-hero')) return;
        gsap.set(el, { autoAlpha: 0, x: compactScreen ? 0 : pair[1].x, y: compactScreen ? 32 : pair[1].y });
        ScrollTrigger.create({
          trigger: el, start: 'top 88%', once: true,
          onEnter: function () {
            gsap.to(el, { autoAlpha: 1, x: 0, y: 0, duration: 1.15, ease: 'power4.out', delay: parseFloat(getComputedStyle(el).getPropertyValue('--d')) || 0 });
          }
        });
      });
    });

    /* ---------- Portfolio image parallax ---------- */
    if (!isTouch) {
      document.querySelectorAll('.work__img img, .area-card__img img, .about-gallery__item img').forEach(function (img) {
        gsap.fromTo(img, { yPercent: -7 }, {
          yPercent: 7, ease: 'none',
          scrollTrigger: { trigger: img.closest('.work, .area-card, .about-gallery__item'), start: 'top bottom', end: 'bottom top', scrub: true }
        });
      });
    }

    /* ---------- Section titles: word-by-word rise ---------- */
    document.querySelectorAll('.section__head .section__title').forEach(function (title) {
      var words = title.textContent.trim().split(/\s+/);
      title.innerHTML = words.map(function (w) { return '<span class="split-line"><span>' + w + '</span></span>'; }).join(' ');
      var spans = title.querySelectorAll('.split-line > span');
      gsap.set(spans, { yPercent: 110 });
      ScrollTrigger.create({
        trigger: title, start: 'top 86%', once: true,
        onEnter: function () { gsap.to(spans, { yPercent: 0, duration: 1, stagger: .06, ease: 'power4.out' }); }
      });
    });

    /* ---------- Marquees: GSAP-driven, scroll-velocity reactive ---------- */
    function gsapMarquee(track, baseDuration) {
      if (!track) return;
      track.style.animation = 'none';
      var tween = gsap.to(track, { xPercent: 50, repeat: -1, ease: 'none', duration: baseDuration });
      ScrollTrigger.create({
        onUpdate: function (self) {
          var v = Math.min(Math.abs(self.getVelocity()) / 900, 4);
          gsap.to(tween, { timeScale: 1 + v, duration: .3, overwrite: true });
        }
      });
    }
    document.querySelectorAll('.marquee__track').forEach(function (t) { gsapMarquee(t, 26); });

    /* areas strip: duplicate content then marquee */
    document.querySelectorAll('.areas-strip__row').forEach(function (row) {
      row.innerHTML += row.innerHTML;
      gsapMarquee(row, 38);
    });

    /* ---------- Magnetic buttons ---------- */
    if (!isTouch) {
      document.querySelectorAll('.btn, .nav__link--cta, .play-btn').forEach(function (el) {
        var strength = 22;
        el.addEventListener('mousemove', function (e) {
          var r = el.getBoundingClientRect();
          var x = (e.clientX - r.left - r.width / 2) / (r.width / 2);
          var y = (e.clientY - r.top - r.height / 2) / (r.height / 2);
          gsap.to(el, { x: x * strength, y: y * strength, duration: .5, ease: 'power3.out' });
        });
        el.addEventListener('mouseleave', function () {
          gsap.to(el, { x: 0, y: 0, duration: .7, ease: 'elastic.out(1, .45)' });
        });
      });
    }

    /* ---------- Showcase video parallax (GSAP version) ---------- */
    var showcaseVid = document.querySelector('.showcase__video');
    if (showcaseVid) {
      gsap.fromTo(showcaseVid, { yPercent: -10, scale: 1.15 }, {
        yPercent: 10, scale: 1.15, ease: 'none',
        scrollTrigger: { trigger: '.showcase', start: 'top bottom', end: 'bottom top', scrub: true }
      });
    }

    /* ---------- 3D tilt on cards ---------- */
    if (!isTouch) {
      document.querySelectorAll('.work, .area-card, .step, .value').forEach(function (card) {
        card.classList.add('tilt-card');
        card.addEventListener('mousemove', function (e) {
          var r = card.getBoundingClientRect();
          var x = (e.clientX - r.left) / r.width - .5;
          var y = (e.clientY - r.top) / r.height - .5;
          gsap.to(card, { rotateY: x * 8, rotateX: -y * 8, duration: .4, ease: 'power2.out', transformPerspective: 800 });
        });
        card.addEventListener('mouseleave', function () {
          gsap.to(card, { rotateY: 0, rotateX: 0, duration: .7, ease: 'elastic.out(1, .5)' });
        });
      });
    }

    /* ---------- Israel map pins: staggered drop + scroll-to-card ---------- */
    var mapWrap = document.querySelector('.map-wrap');
    if (mapWrap) {
      var pins = mapWrap.querySelectorAll('.map-pin');
      // stagger index for entrance animation
      pins.forEach(function (p, i) { p.style.setProperty('--i', i); });
      // trigger entrance when map scrolls into view
      ScrollTrigger.create({
        trigger: mapWrap, start: 'top 80%', once: true,
        onEnter: function () { mapWrap.classList.add('is-in'); }
      });
      // click → scroll to the area card
      var cityToId = {
        'הרצליה': 'area-herzliya', 'תל אביב': 'area-tel-aviv', 'רמת השרון': 'area-ramat-hasharon',
        'כפר שמריהו': 'area-kfar-shmaryahu', 'רעננה': 'area-raanana', 'הוד השרון': 'area-hod-hasharon',
        'גבעתיים': 'area-givatayim', 'רמת גן': 'area-ramat-gan', 'נתניה': 'area-netanya',
        'קיסריה': 'area-caesarea', 'אבן יהודה': 'area-even-yehuda', 'תל מונד': 'area-tel-mond'
      };
      pins.forEach(function (p) {
        p.addEventListener('click', function () {
          var target = document.getElementById(cityToId[p.dataset.city]);
          if (!target) return;
          var card = target.closest('.area-card');
          var y = card.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top: y, behavior: 'smooth' });
          gsap.fromTo(card, { boxShadow: '0 0 0 0 rgba(176,141,95,.6)' }, { boxShadow: '0 0 0 14px rgba(176,141,95,0)', duration: 1.2, ease: 'power2.out' });
        });
      });
    }

    /* ---------- Generic [data-reveal] for new pages ---------- */
    document.querySelectorAll('[data-reveal]').forEach(function (el) {
      gsap.set(el, { autoAlpha: 0, y: 54 });
      ScrollTrigger.create({
        trigger: el, start: 'top 90%', once: true,
        onEnter: function () { gsap.to(el, { autoAlpha: 1, y: 0, duration: 1.05, ease: 'power4.out', delay: +(el.dataset.delay || 0) }); }
      });
    });

    /* stagger groups: [data-stagger] children */
    document.querySelectorAll('[data-stagger]').forEach(function (wrap) {
      var kids = wrap.children;
      gsap.set(kids, { autoAlpha: 0, y: 46 });
      ScrollTrigger.create({
        trigger: wrap, start: 'top 86%', once: true,
        onEnter: function () { gsap.to(kids, { autoAlpha: 1, y: 0, duration: .95, stagger: .08, ease: 'power4.out' }); }
      });
    });
  });
})();
