/* ============================================================
   ESTER INTERIORS — FAQ page logic
   Search + category chips + smooth accordion + per-category
   "show more". Content itself is static HTML (GEO-friendly);
   this file only adds interactivity.
   ============================================================ */
document.addEventListener('DOMContentLoaded', () => {
  const wrap = document.getElementById('faqWrap');
  if (!wrap) return;

  const cats = [...wrap.querySelectorAll('.faq-cat')];
  const chipsWrap = document.getElementById('faqChips');
  const searchInput = document.getElementById('faqSearch');
  const searchCount = document.getElementById('faqSearchCount');
  const emptyState = document.getElementById('faqEmpty');
  const emptyTerm = document.getElementById('faqEmptyTerm');
  const INITIAL_VISIBLE = 5;
  const norm = s => (s || '').toLowerCase().replace(/[״"]/g, '"').trim();
  const refreshAnswers = () => {
    wrap.querySelectorAll('.faq-item.is-open .faq-item__a').forEach(answer => {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    });
  };
  window.addEventListener('resize', refreshAnswers);
  document.fonts.ready.then(refreshAnswers);

  /* ---------- Accordion (dynamic heights) ---------- */
  wrap.querySelectorAll('.faq-item__q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const answer = item.querySelector('.faq-item__a');
      const open = item.classList.toggle('is-open');
      btn.setAttribute('aria-expanded', String(open));
      answer.style.maxHeight = open ? answer.scrollHeight + 'px' : '0px';
    });
  });

  /* ---------- Collapse long categories + "show more" ---------- */
  cats.forEach(cat => {
    const items = [...cat.querySelectorAll('.faq-item')];
    const hidden = items.slice(INITIAL_VISIBLE);
    if (!hidden.length) return;
    hidden.forEach(el => el.classList.add('is-collapsed'));
    const more = cat.querySelector('.faq-cat__more');
    if (more) {
      more.addEventListener('click', () => {
        const collapsed = cat.classList.toggle('is-expanded');
        more.textContent = collapsed
          ? 'הצג פחות ▴'
          : `עוד ${hidden.length} שאלות בנושא ▾`;
      });
    }
  });

  /* ---------- Category chips ---------- */
  let activeCat = 'all';
  const totalItems = wrap.querySelectorAll('.faq-item').length;

  const mkChip = (label, count, value) => {
    const b = document.createElement('button');
    b.className = 'faq-chip';
    b.dataset.cat = value;
    b.setAttribute('role', 'tab');
    b.innerHTML = `${label}<span class="n">${count}</span>`;
    b.addEventListener('click', () => {
      activeCat = value;
      chipsWrap.querySelectorAll('.faq-chip').forEach(c => c.classList.toggle('is-active', c === b));
      applyFilter();
      if (value !== 'all') {
        const target = document.getElementById('cat-' + value);
        if (target) {
          const toolbar = document.getElementById('faqToolbar');
          const toolbarBottom = parseFloat(getComputedStyle(toolbar).top) + toolbar.offsetHeight;
          const y = target.getBoundingClientRect().top + window.scrollY - toolbarBottom - 16;
          window.scrollTo({ top: y, behavior: 'smooth' });
        }
      }
    });
    chipsWrap.appendChild(b);
    return b;
  };

  const allChip = mkChip('הכל', totalItems, 'all');
  allChip.classList.add('is-active');
  cats.forEach((cat, i) => {
    mkChip(cat.querySelector('.faq-cat__title').textContent, cat.querySelectorAll('.faq-item').length, String(i));
  });

  /* ---------- Search + filter ---------- */
  let term = '';
  const highlight = (el, t) => {
    const original = el.dataset.original || (el.dataset.original = el.textContent);
    if (!t) { el.textContent = original; return; }
    const idx = norm(original).indexOf(t);
    if (idx === -1) { el.textContent = original; return; }
    el.innerHTML = original.slice(0, idx) + '<mark>' + original.slice(idx, idx + t.length) + '</mark>' + original.slice(idx + t.length);
  };

  function applyFilter() {
    let visibleTotal = 0;
    const searching = term.length > 0;

    cats.forEach((cat, i) => {
      const catMatch = activeCat === 'all' || activeCat === String(i);
      let visibleInCat = 0;

      cat.querySelectorAll('.faq-item').forEach(item => {
        const q = item.querySelector('.faq-item__q .q-text');
        const a = item.querySelector('.faq-item__a p');
        const textMatch = !searching || norm(q.textContent).includes(term) || norm(a.textContent).includes(term);
        const show = catMatch && textMatch;
        item.style.display = show ? '' : 'none';
        if (show) {
          visibleInCat++;
          // while searching, ignore the collapsed state so results are visible
          item.classList.toggle('is-collapsed', !searching && item.dataset.collapsible === '1' && !cat.classList.contains('is-expanded'));
        }
        highlight(q, searching ? term : '');
      });

      cat.style.display = visibleInCat ? '' : 'none';
      const more = cat.querySelector('.faq-cat__more');
      if (more) more.style.display = (searching || !catMatch) ? 'none' : '';
      visibleTotal += visibleInCat;
    });

    searchCount.textContent = searching ? `${visibleTotal} תוצאות` : '';
    emptyState.classList.toggle('is-visible', visibleTotal === 0);
    if (visibleTotal === 0) emptyTerm.textContent = searchInput.value;
  }

  // mark collapsible items once
  cats.forEach(cat => {
    [...cat.querySelectorAll('.faq-item')].slice(INITIAL_VISIBLE).forEach(el => { el.dataset.collapsible = '1'; });
  });

  let debounce;
  searchInput.addEventListener('input', () => {
    clearTimeout(debounce);
    debounce = setTimeout(() => { term = norm(searchInput.value); applyFilter(); }, 160);
  });

  applyFilter();
});
