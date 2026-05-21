/* ---- Dynamic year ---- */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

/* ---- Navbar scroll ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

/* ---- Hamburger menu ---- */
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
hamburger.addEventListener('click', () => mobileMenu.classList.toggle('open'));
hamburger.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') mobileMenu.classList.toggle('open');
});
function closeMobile() { mobileMenu.classList.remove('open'); }

/* ---- Scroll reveal ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
revealEls.forEach(el => revealObs.observe(el));

/* ---- Animated counters ---- */
const counterEls = document.querySelectorAll('[data-count]');
const counterObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = parseInt(el.dataset.count, 10);
    const suffix = el.dataset.suffix || '';
    const dur = 1800;
    const start = performance.now();
    function tick(now) {
      const p = Math.min((now - start) / dur, 1);
      const e = 1 - Math.pow(1 - p, 3);
      el.textContent = Math.round(e * target) + suffix;
      if (p < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
    counterObs.unobserve(el);
  });
}, { threshold: 0.5 });
counterEls.forEach(el => counterObs.observe(el));

/* ---- Service icons (stroke SVGs) ---- */
const ICONS = {
  layoutGrid: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',
  briefcase: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>',
  mediaBuying: '<svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" id="Layer_1" data-name="Layer 1" viewBox="0 0 24 24" width="512" height="512"><path d="M24,8.5v7.5h-3v-4.879l-8,8-6-6-4.81,4.81L.069,15.81l6.931-6.931,6,6,5.879-5.879h-4.879v-3h7.5c1.379,0,2.5,1.121,2.5,2.5Z"/></svg>',
  clipboard: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/><path d="M9 12h6M9 16h6"/></svg>',
  penLine: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>',
  video: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="23 7 16 12 23 17 23 7"/><rect x="1" y="5" width="15" height="14" rx="2"/></svg>',
};

const services = [
  {  icon: 'layoutGrid', name: 'Integrated Marketing', tag: 'Branding', desc: 'Creating unified marketing campaigns across digital and traditional channels to deliver one consistent brand message and maximize customer engagement.' },
  { icon: 'briefcase', name: 'Branding & Marketing Strategy',      tag: 'Strategy',    desc: '    Building strong brand identities and developing strategic marketing plans that help businesses grow, position themselves clearly, and reach the right audience.' },
  { icon: 'mediaBuying', name: 'Media Buying',        tag: 'Growth',    desc: 'Planning and purchasing advertising spaces across platforms like Meta, Google, TikTok, and outdoor media to achieve the best ROI and audience reach.' },
  { icon: 'clipboard', name: 'Campaign Management',         tag: 'Planning',      desc: '    Managing marketing campaigns from planning to execution, including performance tracking, optimization, budgeting, and achieving campaign objectives efficiently.' },
  { icon: 'penLine', name: 'Content Creation',        tag: 'Content',   desc: '    Developing creative and engaging content such as social media posts, ad copy, visuals, and storytelling that strengthen brand presence and audience connection.' },
  { icon: 'video', name: 'Media Production',          tag: 'Media',    desc: '    Producing high-quality visual and audio content including photography, videography, commercials, reels, and branded media tailored for marketing purposes.' },

]
let svcCurrent = 1;

function buildSvcDots() {
  const wrap = document.getElementById('svcDots');
  if (!wrap) return;
  wrap.innerHTML = '';
  services.forEach((_, i) => {
    const btn = document.createElement('button');
    btn.className = 'svc-dot' + (i === svcCurrent ? ' active' : '');
    btn.setAttribute('aria-label', 'Go to service ' + (i + 1));
    btn.addEventListener('click', () => { svcCurrent = i; renderCarousel(); });
    wrap.appendChild(btn);
  });
}

function renderCarousel() {
  const n = services.length;
  const left = services[(svcCurrent - 1 + n) % n];
  const center = services[svcCurrent];
  const right = services[(svcCurrent + 1) % n];

  document.getElementById('svcLeftIcon').innerHTML = ICONS[left.icon];
  document.getElementById('svcLeftName').textContent = left.name;
  document.getElementById('svcLeftTag').textContent = left.tag;
  document.getElementById('svcCenterIcon').innerHTML = ICONS[center.icon];
  document.getElementById('svcCenterName').textContent = center.name;
  document.getElementById('svcCenterDesc').textContent = center.desc;
  document.getElementById('svcRightIcon').innerHTML = ICONS[right.icon];
  document.getElementById('svcRightName').textContent = right.name;
  document.getElementById('svcRightTag').textContent = right.tag;

  document.querySelectorAll('.svc-dot').forEach((d, i) =>
    d.classList.toggle('active', i === svcCurrent)
  );
}

document.getElementById('svcPrev').addEventListener('click', () => {
  svcCurrent = (svcCurrent - 1 + services.length) % services.length;
  renderCarousel();
});
document.getElementById('svcNext').addEventListener('click', () => {
  svcCurrent = (svcCurrent + 1) % services.length;
  renderCarousel();
});

buildSvcDots();
renderCarousel();

/* ---- Testimonial slider ---- */
const track = document.getElementById('sliderTrack');
const dotsWrap = document.getElementById('sliderDots');
const btnPrev = document.getElementById('slidePrev');
const btnNext = document.getElementById('slideNext');

let currentSlide = 0;
const cards = track.querySelectorAll('.testimonial-card');

function getVisibleCount() { return window.innerWidth <= 768 ? 1 : 2; }

function buildDots() {
  dotsWrap.innerHTML = '';
  const count = Math.ceil(cards.length / getVisibleCount());
  for (let i = 0; i < count; i++) {
    const dot = document.createElement('button');
    dot.className = 'slider-dot' + (i === currentSlide ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to slide ' + (i + 1));
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  }
}

function goTo(idx) {
  const visible = getVisibleCount();
  const maxIdx = Math.ceil(cards.length / visible) - 1;
  currentSlide = Math.max(0, Math.min(idx, maxIdx));
  const cardW = track.parentElement.offsetWidth;
  const offset = currentSlide * (cardW + 20);
  track.style.transform = `translateX(-${offset}px)`;
  dotsWrap.querySelectorAll('.slider-dot').forEach((d, i) =>
    d.classList.toggle('active', i === currentSlide)
  );
}

btnPrev.addEventListener('click', () => goTo(currentSlide - 1));
btnNext.addEventListener('click', () => goTo(currentSlide + 1));

let touchStartX = 0;
track.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
track.addEventListener('touchend', e => {
  const delta = touchStartX - e.changedTouches[0].clientX;
  if (Math.abs(delta) > 40) goTo(delta > 0 ? currentSlide + 1 : currentSlide - 1);
}, { passive: true });

buildDots();
window.addEventListener('resize', () => { buildDots(); goTo(0); });
setInterval(() => {
  const maxIdx = Math.ceil(cards.length / getVisibleCount()) - 1;
  goTo(currentSlide >= maxIdx ? 0 : currentSlide + 1);
}, 5000);

/* ---- Contact form replaced with QR card ---- */

/* ---- Active nav highlighting ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(sec => { if (window.scrollY >= sec.offsetTop - 140) current = sec.id; });
  navLinks.forEach(a => {
    a.style.color = a.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
}, { passive: true });
