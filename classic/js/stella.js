// STELLA CONTACT CONFIGURATION — update these values with the real contact details before publishing.
const STELLA_CONTACT = { email: '', phone: '', whatsapp: '' }; // WhatsApp format: 9725XXXXXXXX
const toggle = document.querySelector('.menu-toggle');
const nav = document.getElementById('main-nav');
if(toggle && nav) {
  toggle.addEventListener('click', () => {const open = !nav.classList.contains('is-open'); nav.classList.toggle('is-open', open); toggle.setAttribute('aria-expanded', String(open)); toggle.setAttribute('aria-label', open ? 'סגירת תפריט' : 'פתיחת תפריט');});
  nav.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}));
  document.addEventListener('keydown', e => {if(e.key === 'Escape'){nav.classList.remove('is-open');toggle.setAttribute('aria-expanded','false');}});
}
const direct = document.getElementById('contact-direct');
if(direct){
  if(STELLA_CONTACT.phone) {const a=document.createElement('a');a.href='tel:'+STELLA_CONTACT.phone;a.textContent='טלפון: '+STELLA_CONTACT.phone;direct.append(a);}
  if(STELLA_CONTACT.email) {const a=document.createElement('a');a.href='mailto:'+STELLA_CONTACT.email;a.textContent='אימייל: '+STELLA_CONTACT.email;direct.append(a);}
  if(STELLA_CONTACT.whatsapp) {const a=document.createElement('a');a.href='https://wa.me/'+STELLA_CONTACT.whatsapp;a.textContent='לפנייה בוואטסאפ';a.target='_blank';a.rel='noopener noreferrer';direct.append(a);}
  if(STELLA_CONTACT.email || STELLA_CONTACT.phone || STELLA_CONTACT.whatsapp) {const notice=document.querySelector('.contact-note');if(notice)notice.hidden=true;}
}
const form=document.getElementById('contact-form');
form?.addEventListener('submit',event=>{
  event.preventDefault();
  const name=document.getElementById('contact-name').value.trim(),phone=document.getElementById('contact-phone').value.trim(),project=document.getElementById('contact-project').value.trim();
  const message=`שלום סטלה,\nשמי ${name}\nטלפון: ${phone}\nעל הפרויקט: ${project}`;
  const status=document.getElementById('form-message');
  if(STELLA_CONTACT.whatsapp){window.open('https://wa.me/'+STELLA_CONTACT.whatsapp+'?text='+encodeURIComponent(message),'_blank','noopener,noreferrer'); status.textContent='נפתחה הודעה בוואטסאפ. יש ללחוץ על שליחה באפליקציה.';}
  else if(STELLA_CONTACT.email){window.location.href='mailto:'+STELLA_CONTACT.email+'?subject='+encodeURIComponent('פנייה חדשה מאתר סטלה')+'&body='+encodeURIComponent(message);status.textContent='נפתחה הודעה בתוכנת הדואר. יש לשלוח אותה כדי להשלים את הפנייה.';}
  else {status.textContent='יש להזין קודם כתובת אימייל או מספר וואטסאפ בקובץ js/stella.js כדי לאפשר שליחת פניות.';}
});
const y=document.getElementById('year'); if(y)y.textContent=new Date().getFullYear();
