import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, basename, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const shared = dirname(fileURLToPath(import.meta.url));
const designs = JSON.parse(readFileSync(resolve(shared, 'designs.json'), 'utf8'));
const articles = [
  { category: 'planning', label: 'תכנון הבית', title: 'בית יפה מתחיל בתכנון נכון', text: 'מה חשוב לבדוק לפני שבוחרים ספה, ואיך יוצרים חלל שעובד עם החיים שלכם.', image: 'photo-1600607687939-ce8a6c25118c', alt: 'חלל מגורים מואר עם ריהוט טבעי' },
  { category: 'materials', label: 'חומרים וצבע', title: 'החומרים שעושים את ההבדל', text: 'עץ, אבן וטקסטיל: חיבורים קטנים שמעניקים לבית עומק ואופי.', image: 'photo-1600566753190-17f0baa2a6c3', alt: 'פינת מגורים בגווני אבן ועץ' },
  { category: 'lighting', label: 'אור ואווירה', title: 'לתת לאור מקום בבית', text: 'בין תאורה טבעית לפינה אינטימית — מחשבות על בית שנעים להיות בו.', image: 'photo-1600210492486-724fe5c67fb0', alt: 'סלון מואר בגוונים רכים' },
  { category: 'planning', label: 'תכנון הבית', title: 'חלל קטן, אפשרויות גדולות', text: 'פרופורציות, אחסון ומעברים שמאפשרים לכל מטר בבית לקבל משמעות.', image: 'photo-1618220179428-22790b461013', alt: 'פנים בית עם חלוקה נקייה' },
  { category: 'materials', label: 'חומרים וצבע', title: 'פלטת צבעים שמרגישה שלכם', text: 'איך מחברים גוונים טבעיים עם נגיעה אישית בלי להעמיס על החלל.', image: 'photo-1600607687920-4e2a09cf159d', alt: 'חלל מינימליסטי בפלטת צבעים טבעית' },
  { category: 'lighting', label: 'אור ואווירה', title: 'הפרטים שהופכים חלל לבית', text: 'שכבות של אור, בד וזיכרונות שמוסיפות רכות לסיפור העיצובי.', image: 'photo-1600566753086-00f18fb6b3ea', alt: 'בית בהיר עם טקסטורות עדינות' },
];
const reviews = [
  { quote: 'מהפגישה הראשונה הרגשנו שמקשיבים לנו. כל בחירה התחברה לבית שרצינו לחיות בו.', name: 'משפחה לדוגמה א׳', project: 'עיצוב דירה' },
  { quote: 'פתאום הכול התחבר — החומרים, האור והפרטים הקטנים. בית שנעים לחזור אליו.', name: 'משפחה לדוגמה ב׳', project: 'הלבשת הבית' },
  { quote: 'התכנון עשה סדר והפך את הדרך להרבה יותר ברורה. התוצאה מרגישה בדיוק כמונו.', name: 'משפחה לדוגמה ג׳', project: 'תכנון ושיפוץ' },
];
const escape = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const imageUrl = image => `https://images.unsplash.com/${image}?auto=format&fit=crop&w=1100&q=80`;
const marker = (name, html) => `<!-- stella-content:${name}:start -->\n${html.replace(/[ \t]+\n/g, '\n')}\n<!-- stella-content:${name}:end -->`;
const stripContent = html => html.replace(/<!-- stella-content:([\w-]+):start -->[\s\S]*?<!-- stella-content:\1:end -->\s*/g, '');

function cards(count, preview) {
  return articles.slice(0, count).map((article, index) => `<article class="sc-article" data-article-category="${article.category}">
    <div class="sc-image"><img src="${imageUrl(article.image)}" alt="${article.alt}" loading="${index === 0 && preview ? 'eager' : 'lazy'}"><span class="sc-index">${String(index + 1).padStart(2, '0')}</span></div>
    <div class="sc-card-copy"><p class="sc-kicker">${article.label}</p><h${preview ? '2' : '3'}>${article.title}</h${preview ? '2' : '3'}><p class="sc-summary">${article.text}</p>
    ${preview ? `<button class="sc-link" type="button" data-preview="${index}">הצצה למאמר <span aria-hidden="true">↗</span></button>` : ''}
    </div></article>`).join('\n');
}

function recommendations(id) {
  return `<section class="sc-section sc-reviews" data-content-design="${id}" id="client-reviews" aria-labelledby="sc-reviews-title">
    <div class="sc-heading"><div><p class="sc-kicker">CLIENT STORIES / מילים מהבית</p><h2 id="sc-reviews-title">הבתים שלהם.<br><em>המילים שלהם.</em></h2></div><p class="sc-demo">המלצות לדוגמה · להמחשת העיצוב בלבד</p></div>
    <div class="sc-quotes">${reviews.map((review, index) => `<figure class="sc-quote"><span class="sc-quote-mark" aria-hidden="true">“</span><blockquote><p>${review.quote}</p></blockquote><figcaption><span class="sc-avatar" aria-hidden="true">${String(index + 1).padStart(2, '0')}</span><span><strong>${review.name}</strong><small>${review.project} · תוכן לדוגמה</small></span></figcaption></figure>`).join('\n')}</div>
    </section>`;
}

function journal(id, filename) {
  return `<section class="sc-section sc-journal" data-content-design="${id}" id="design-journal" aria-labelledby="sc-journal-title">
    <div class="sc-heading"><div><p class="sc-kicker">THE JOURNAL / השראה ומחשבות</p><h2 id="sc-journal-title">עוד מבט<br><em>על הבית.</em></h2></div><a class="sc-link" href="${filename}">לכל המאמרים <span aria-hidden="true">↗</span></a></div>
    <div class="sc-articles">${cards(3, false)}</div></section>`;
}

function articlePage(id, home) {
  return `<div class="sc-page" data-content-design="${id}">
    <section class="sc-section sc-page-intro" aria-labelledby="sc-page-title"><a class="sc-link" href="${home}">→ חזרה לבית</a><div class="sc-page-heading"><div><p class="sc-kicker">STELLA / THE JOURNAL</p><h1 id="sc-page-title">מחשבות על חלל.<br><em>השראה לחיים.</em></h1></div><p class="sc-intro-copy">על תכנון, חומר ואור — רעיונות קטנים שמתחברים לבית.<br><span class="sc-demo">תצוגת עיצוב · כותרות ותקצירים לדוגמה</span></p></div></section>
    <section class="sc-section sc-library" aria-label="מאמרים והשראה"><div class="sc-filters" role="group" aria-label="סינון מאמרים"><button type="button" data-journal-filter="all" aria-pressed="true">הכול</button><button type="button" data-journal-filter="planning" aria-pressed="false">תכנון הבית</button><button type="button" data-journal-filter="materials" aria-pressed="false">חומרים וצבע</button><button type="button" data-journal-filter="lighting" aria-pressed="false">אור ואווירה</button></div><p class="sc-results" role="status" aria-live="polite">6 מאמרים לדוגמה</p><div class="sc-articles">${cards(6, true)}</div></section>
    <section class="sc-section sc-page-end"><p class="sc-kicker">FROM INSPIRATION TO HOME</p><h2>הרעיון הבא<br><em>מתחיל אצלכם.</em></h2><a class="sc-link" href="${home}#client-reviews">למילים של הלקוחות <span aria-hidden="true">↗</span></a></section>
    <dialog class="sc-dialog" aria-labelledby="sc-preview-title"><button class="sc-dialog-close" type="button" aria-label="סגירת תצוגת המאמר">✕</button><p class="sc-kicker" id="sc-preview-category"></p><h2 id="sc-preview-title"></h2><p id="sc-preview-text"></p><p class="sc-demo">זוהי הצצה עיצובית בלבד — מאמר מלא אינו כלול בתצוגה.</p></dialog></div>`;
}

function addNavigation(html, articleName) {
  const links = `<a class="sc-nav-link" href="${articleName}">מאמרים</a><a class="sc-nav-link" href="#client-reviews">לקוחות ממליצים</a>`;
  return html.replace(/<header\b[\s\S]*?<\/header>/, header => {
    if (/<nav\b(?![^>]*class="switcher")/.test(header)) {
      return header.replace(/(<nav\b(?![^>]*class="switcher")[^>]*>)([\s\S]*?)(<\/nav>)/, (_, open, body, close) => open + body + marker('nav', links) + close);
    }
    return header.replace('</header>', marker('nav', `<nav class="sc-header-links" aria-label="תוכן והשראה">${links}</nav>`) + '</header>');
  });
}

for (const [index, design] of designs.entries()) {
  const id = index + 1;
  const source = resolve(shared, design.href);
  const home = basename(source);
  const articleName = home.replace('.html', '-articles.html');
  let html = stripContent(readFileSync(source, 'utf8'));
  html = html.replace('</head>', marker('css', '<link rel="stylesheet" href="../shared/content.css">') + '\n</head>');
  html = html.replace('</body>', marker('js', '<script src="../shared/content.js" defer></script>') + '\n</body>');
  html = addNavigation(html, articleName);
  if (id === 1) {
    html = html.replace(/[ \t]*<section class="lp-reviews">[\s\S]*?<\/section>/, '');
    html = html.replace(/<!-- ===== Testimonials ===== -->\s*/, '');
  }
  const contact = id === 1 ? /<section class="lp-lead" id="lead">/ : /<section\b[^>]*\bid="contact"[^>]*>/;
  if (!contact.test(html)) throw new Error(`Contact insertion point missing: ${home}`);
  html = html.replace(contact, match => marker('home', journal(id, articleName) + '\n' + recommendations(id)) + '\n' + match);
  writeFileSync(source, html);

  let page = stripContent(html);
  page = page.replace(/<title>[\s\S]*?<\/title>/, `<title>מאמרים והשראה | סטלה — ${escape(design.name)}</title>`);
  page = page.replace(/<meta\b(?=[^>]*name="description")[^>]*>/, '<meta name="description" content="מאמרים והשראה על עיצוב פנים — תצוגת כותרות ותקצירים לבחירת עיצוב.">');
  page = page.replace('</head>', '<link rel="stylesheet" href="../shared/content.css">\n</head>');
  if (id === 1) {
    const head = page.slice(0, page.indexOf('<body'));
    const header = page.match(/<header\b[\s\S]*?<\/header>/)[0];
    const footer = page.match(/<footer\b[\s\S]*?<\/footer>/)[0];
    page = `${head}<body class="page-landing sc-article-page">${header}<main id="main">${articlePage(id, home)}</main>${footer}<script src="../shared/switcher.js" data-design="${id}"></script></body></html>`;
  } else {
    page = page.replace(/(<main\b[^>]*>)([\s\S]*?)(<\/main>)/, (_, open, body, close) => {
      const header = body.slice(0, body.indexOf('<section'));
      return open + header + articlePage(id, home) + close;
    });
  }
  page = addNavigation(page, articleName);
  page = page.replace(/href="#([^"]*)"/g, (match, anchor) => anchor === 'main' ? match : `href="${home}#${anchor}"`);
  page = page.replace(/href="index.html"/g, `href="${home}"`);
  if (id === 1) page = page.replace(/href="index.html#portfolio"/g, `href="${home}#works"`);
  page = page.replace(/href="articles.html"/g, `href="${articleName}"`);
  page = page.replace(`class="sc-nav-link" href="${articleName}"`, `class="sc-nav-link" href="${articleName}" aria-current="page"`);
  page = page.replace('</body>', '<script src="../shared/content.js" defer></script>\n</body>');
  writeFileSync(resolve(dirname(source), articleName), page.replace(/[ \t]+$/gm, ''));
  console.log(`${id.toString().padStart(2, '0')} ${home} -> ${articleName}`);
}
