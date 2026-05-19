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

/* ---- Services carousel ---- */
const services = [
  { icon: '📊', name: 'Integrated Marketing', tag: 'Development', desc: 'Creating unified marketing campaigns across digital and traditional channels to deliver one consistent brand message and maximize customer engagement.' },
  { icon: '🎯', name: 'Branding & Marketing Strategy', tag: 'Strategy', desc: 'Building strong brand identities and developing strategic marketing plans that help businesses grow, position themselves clearly, and reach the right audience.' },
  { icon: '📈', name: 'Media Buying', tag: 'Branding', desc: 'Planning and purchasing advertising spaces across platforms like Meta, Google, TikTok, and outdoor media to achieve the best ROI and audience reach.' },
  { icon: '📋', name: 'Campaign Management', tag: 'Growth', desc: 'Managing marketing campaigns from planning to execution, including performance tracking, optimization, budgeting, and achieving campaign objectives efficiently.' },
  { icon: '💡', name: 'Content Creation', tag: 'Campaigns', desc: 'Developing creative and engaging content such as social media posts, ad copy, visuals, and storytelling that strengthen brand presence and audience connection.' },
  { icon: '🎬', name: 'Media Production', tag: 'Research', desc: 'Producing high-quality visual and audio content including photography, videography, commercials, reels, and branded media tailored for marketing purposes.' },
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

  document.getElementById('svcLeftIcon').textContent = left.icon;
  document.getElementById('svcLeftName').textContent = left.name;
  document.getElementById('svcLeftTag').textContent = left.tag;
  document.getElementById('svcCenterIcon').textContent = center.icon;
  document.getElementById('svcCenterName').textContent = center.name;
  document.getElementById('svcCenterDesc').textContent = center.desc;
  document.getElementById('svcRightIcon').textContent = right.icon;
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
