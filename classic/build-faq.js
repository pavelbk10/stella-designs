/* One-off build script: bakes the 250 Q&As from js/faq-data/*.js
   into faq.html as static HTML + FAQPage JSON-LD (for GEO/SEO). */
const fs = require('fs');
const path = require('path');

global.window = {};
['part1', 'part2', 'part3', 'part4', 'part5'].forEach(p =>
  require(path.join(__dirname, 'js', 'faq-data', p + '.js')));
const parts = global.window.FAQ_PARTS;

const esc = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const pad = n => String(n).padStart(2, '0');

let html = '';
let total = 0;
parts.forEach((cat, i) => {
  total += cat.items.length;
  html += `    <section class="faq-cat" id="cat-${i}">\n`;
  html += `      <div class="faq-cat__head">\n`;
  html += `        <span class="faq-cat__num">${pad(i + 1)}</span>\n`;
  html += `        <h2 class="faq-cat__title">${esc(cat.category)}</h2>\n`;
  html += `        <span class="faq-cat__count">${cat.items.length} שאלות</span>\n`;
  html += `      </div>\n`;
  html += `      <div class="faq-cat__list">\n`;
  cat.items.forEach(item => {
    html += `        <div class="faq-item">\n`;
    html += `          <button class="faq-item__q" aria-expanded="false"><span class="q-text">${esc(item.q)}</span><span class="faq-item__icon" aria-hidden="true">+</span></button>\n`;
    html += `          <div class="faq-item__a"><p>${esc(item.a)}</p></div>\n`;
    html += `        </div>\n`;
  });
  html += `      </div>\n`;
  if (cat.items.length > 5) {
    html += `      <button class="faq-cat__more">עוד ${cat.items.length - 5} שאלות בנושא ▾</button>\n`;
  }
  html += `    </section>\n`;
});

const jsonld = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: parts.flatMap(cat =>
    cat.items.map(item => ({
      '@type': 'Question',
      name: item.q,
      acceptedAnswer: { '@type': 'Answer', text: item.a }
    }))
  )
};
const jsonldTag = '<script type="application/ld+json">\n' +
  JSON.stringify(jsonld, null, 2).replace(/<\//g, '<\\/') + '\n  </scr' + 'ipt>';

const faqPath = path.join(__dirname, 'faq.html');
let page = fs.readFileSync(faqPath, 'utf8');
if (!page.includes('<!-- FAQ_CONTENT -->') || !page.includes('<!-- FAQ_JSONLD -->')) {
  console.error('Placeholders missing — already built?'); process.exit(1);
}
page = page.replace('<!-- FAQ_CONTENT -->', html.trimEnd());
page = page.replace('<!-- FAQ_JSONLD -->', jsonldTag);
fs.writeFileSync(faqPath, page, 'utf8');
console.log(`Baked ${total} Q&As in ${parts.length} categories into faq.html`);
