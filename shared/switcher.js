(function(){
'use strict';
const script=document.currentScript;
const active=Number(script && script.dataset.design || '1')-1;
const designs=[{"name": "הבסיס המשודרג", "detail": "קלאסי ומאוזן", "href": "../classic/landing.html"}, {"name": "מגזיני חם", "detail": "עריכה מגזינית", "href": "../classic/design-a.html"}, {"name": "גלריה לבנה", "detail": "מינימליזם וצילומים", "href": "../classic/design-b.html"}, {"name": "סטודיו אדריכלי", "detail": "גיאומטריה מאופקת", "href": "../classic/design-c.html"}, {"name": "נורדי רך", "detail": "בהיר וטבעי", "href": "../classic/design-d.html"}, {"name": "מונוכרום", "detail": "שחור ולבן", "href": "../classic/design-e.html"}, {"name": "אדמה וחומר", "detail": "גוונים חמים", "href": "../classic/design-f.html"}, {"name": "פורטפוליו פתוח", "detail": "פרויקטים בפרונט", "href": "../classic/design-g.html"}, {"name": "זן יפני", "detail": "שקט ומדויק", "href": "../classic/design-h.html"}, {"name": "ים־תיכוני", "detail": "טקסטורות ואור", "href": "../classic/design-i.html"}, {"name": "מגזין אמנותי", "detail": "סיפור וקומפוזיציה", "href": "../concept/editorial.html"}, {"name": "פורטפוליו קולנועי", "detail": "דרמטי ומצולם", "href": "../concept/cinematic.html"}, {"name": "סטודיו מדויק", "detail": "גריד קפדני", "href": "../concept/studio.html"}, {"name": "גלריה שקטה", "detail": "ניווט צד מינימליסטי", "href": "../modern/gallery.html"}, {"name": "אדריכלות דרמטית", "detail": "כהה ואימרסיבי", "href": "../modern/noir.html"}, {"name": "סטודיו חדש", "detail": "טיפוגרפיה וגריד", "href": "../modern/grid.html"}];
const prefix='../';
if(location.pathname.endsWith('-articles.html')){
 designs.forEach(design=>{design.href=design.href.replace('.html','-articles.html')});
}
function esc(s){return s.replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function init(){
 const bar=document.createElement('div');bar.id='stella-reviewbar';bar.setAttribute('role','navigation');bar.setAttribute('aria-label','מעבר בין עיצובים');
 const before=(active+designs.length-1)%designs.length,after=(active+1)%designs.length;
 bar.innerHTML='<div class="sr-title"><span>STELLA <span style="font-weight:400">/</span> DESIGN REVIEW</span><span class="sr-caption">16 אפשרויות</span></div><div class="sr-controls"><a class="sr-home" href="../index.html" aria-label="לעמוד ההשוואה">כל העיצובים</a><a class="sr-step" href="'+designs[before].href+'" title="הקודם: '+esc(designs[before].name)+'" aria-label="עיצוב קודם">→</a><button type="button" class="sr-select" aria-controls="sr-picker" aria-expanded="false"> <span>'+String(active+1).padStart(2,'0')+' / 16 · '+esc(designs[active].name)+'</span><span aria-hidden="true">⌄</span></button><a class="sr-step" href="'+designs[after].href+'" title="הבא: '+esc(designs[after].name)+'" aria-label="עיצוב הבא">←</a></div>';
 const picker=document.createElement('div');picker.id='sr-picker';picker.dataset.open='false';
 picker.innerHTML='<h2 class="sr-picker-title">מעבר בין עיצובים</h2><p class="sr-picker-subtitle">בחרו אחת מ־16 הדוגמאות. כל דוגמה היא דף עצמאי שאפשר להציג ולבחון.</p><div class="sr-grid">'+designs.map((d,i)=>'<a class="sr-option" href="'+d.href+'" '+(i===active?'aria-current="page"':'')+'><span class="sr-n">'+String(i+1).padStart(2,'0')+'</span><span><strong>'+esc(d.name)+'</strong><small>'+esc(d.detail)+'</small></span></a>').join('')+'</div><div class="sr-footer"><span>סטלה · תצוגת עיצוב להחלטה</span><a href="../index.html">למסך השוואת כל העיצובים</a></div>';
 document.body.prepend(bar,picker);
 const button=bar.querySelector('.sr-select');
 const close=()=>{picker.dataset.open='false';button.setAttribute('aria-expanded','false')};
 button.addEventListener('click',()=>{let open=picker.dataset.open!=='true';picker.dataset.open=String(open);button.setAttribute('aria-expanded',String(open));});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')close()});
 document.addEventListener('pointerdown',e=>{if(!bar.contains(e.target)&&!picker.contains(e.target))close()});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();