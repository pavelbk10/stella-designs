(function () {
  'use strict';
  const library = document.querySelector('.sc-library');
  if (!library) return;

  const cards = Array.from(library.querySelectorAll('.sc-article'));
  const filters = library.querySelectorAll('[data-journal-filter]');
  filters.forEach(button => button.addEventListener('click', () => {
    filters.forEach(filter => filter.setAttribute('aria-pressed', String(filter === button)));
    let count = 0;
    cards.forEach(card => {
      card.hidden = button.dataset.journalFilter !== 'all' && card.dataset.articleCategory !== button.dataset.journalFilter;
      if (!card.hidden) count++;
    });
    library.querySelector('.sc-results').textContent = `${count} מאמרים לדוגמה`;
  }));

  const dialog = document.querySelector('.sc-dialog');
  library.querySelectorAll('[data-preview]').forEach(button => button.addEventListener('click', () => {
    const card = button.closest('.sc-article');
    dialog.querySelector('#sc-preview-title').textContent = card.querySelector('h2').textContent;
    dialog.querySelector('#sc-preview-category').textContent = card.querySelector('.sc-kicker').textContent;
    dialog.querySelector('#sc-preview-text').textContent = card.querySelector('.sc-summary').textContent;
    dialog.showModal();
  }));
  dialog.querySelector('.sc-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      event.preventDefault();
      dialog.close();
    }
  });
  dialog.addEventListener('click', event => {
    if (event.target === dialog) {
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
    }
  });
})();
