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
  code: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>',
};

const services = [
  {  icon: 'layoutGrid', name: 'Integrated Marketing', tag: 'Branding', desc: 'Creating unified marketing campaigns across digital and traditional channels to deliver one consistent brand message and maximize customer engagement.' },
  { icon: 'briefcase', name: 'Branding & Marketing Strategy',      tag: 'Strategy',    desc: '    Building strong brand identities and developing strategic marketing plans that help businesses grow, position themselves clearly, and reach the right audience.' },
  { icon: 'mediaBuying', name: 'Media Buying',        tag: 'Growth',    desc: 'Planning and purchasing advertising spaces across platforms like Meta, Google, TikTok, and outdoor media to achieve the best ROI and audience reach.' },
  { icon: 'clipboard', name: 'Campaign Management',         tag: 'Planning',      desc: '    Managing marketing campaigns from planning to execution, including performance tracking, optimization, budgeting, and achieving campaign objectives efficiently.' },
  { icon: 'penLine', name: 'Content Creation',        tag: 'Content',   desc: '    Developing creative and engaging content such as social media posts, ad copy, visuals, and storytelling that strengthen brand presence and audience connection.' },
  { icon: 'video', name: 'Media Production',          tag: 'Media',    desc: '    Producing high-quality visual and audio content including photography, videography, commercials, reels, and branded media tailored for marketing purposes.' },
  { icon: 'code', name: 'Software Development',       tag: 'Development', desc: 'Designing and building custom websites, web applications, and digital platforms that support your brand and marketing goals, from landing pages to full-scale systems.' },

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

/* ---- Clients carousel ---- */
const clients = [
  {
    name: 'Zina',
    tag: 'Dresses Brand',
    logo: 'public/LOGO/zina-logo.png',
    logoBlack: true,
    useCase: 'For Zina, we built the brand entirely from scratch — starting with creating the brand name, developing its visual identity, and establishing its market positioning from the ground up. Through in-depth market research and competitor analysis, we designed a strategic growth plan focused on building a strong market presence, enhancing customer experience, and driving long-term brand loyalty. Our work also included sales strategy development, social media management, targeted advertising campaigns, and creating a premium after-sales service experience, successfully helping the brand achieve its planned growth and awareness objectives within the targeted timeline.',
  },
  {
    name: 'Abd Elaziz Street',
    tag: 'Household Supplies',
    logo: 'public/LOGO/abd-elazez-street.jpg',
    useCase: 'For Abd Elaziz Street, we built the brand entirely from scratch — starting with naming, brand identity development, and defining its positioning in the household supplies market. We conducted in-depth market research and competitor analysis to design an effective growth strategy focused on sales channels, customer targeting, and market penetration. Our work also included developing and managing marketing campaigns, handling social media presence, and improving customer engagement strategies, which helped establish a strong market presence and achieve the planned business and marketing objectives within the defined timeline.',
  },
  {
    name: 'Cue',
    tag: 'Fashion Brand',
    logo: 'public/LOGO/cue.png',
    useCase: 'For Cue, we started the brand from scratch, building its name, identity, and overall brand direction from the ground up. Through detailed market research and competitor analysis, we shaped a clear positioning strategy tailored to the fashion market and target audience. We also developed and managed the brand\'s social media presence, launched performance-focused advertising campaigns, and ensured a consistent visual and marketing language across all channels, which led to strong brand recognition and the achievement of key growth targets within the planned timeframe.',
  },
  {
    name: 'Mivo',
    tag: 'Beauty · Saudi & Egypt',
    logo: 'public/LOGO/mivo.png',
    useCase: 'For Mivo, a Saudi–Egyptian beauty brand, we built the brand entirely from scratch — starting with naming, brand identity development, and defining its positioning across both the Saudi and Egyptian markets. We conducted in-depth market research and competitor analysis in both regions to create a tailored growth strategy focused on audience targeting, service positioning, and market expansion. Our work also included managing social media presence, executing performance-driven advertising campaigns, and building a consistent brand experience across channels, which helped establish strong regional awareness and achieve the planned growth objectives within the set timeline.',
  },
  {
    name: 'Mawahib AK',
    tag: 'Branding & Marketing Strategy',
    logo: 'public/LOGO/mawahib-ak.png',
    useCase: 'For Mawahib AK, we developed a comprehensive branding and marketing strategy designed to establish a strong market presence and connect the brand with its ideal target audience. We conducted a complete market research process to understand the market landscape, identify key opportunities, analyze competitors, and define the most relevant customer segments. Based on these insights, we developed a strategic marketing plan with clear objectives and a focused approach to brand growth. The strategy included brand development, professional media production, and targeted paid advertising campaigns designed to maximize reach and engage a large number of potential customers within the target audience. Through the integrated execution of branding, strategic planning, media production, and performance-driven advertising, Mawahib AK was able to significantly expand its reach and strengthen its presence among its target customers.',
  },
  {
    name: 'Somaa',
    tag: 'Beauty & Skincare',
    logo: 'public/LOGO/somaa.png',
    logoBlack: true,
    useCase: 'For Somaa, a beauty and personal care brand specializing in skincare and haircare products, we developed a complete brand identity and a comprehensive marketing strategy designed to establish a strong and distinctive position in the market. We built a well-structured marketing plan based on clear objectives, market insights, and a deep understanding of the target audience. Our strategy focused on strengthening the brand’s positioning, creating a recognizable visual identity, and developing an effective path for sustainable market growth. Through strategic campaign planning and performance-driven marketing, Somaa achieved exceptional results, exceeding a 13x ROAS and generating significant sales growth. This strong performance enabled the brand to expand its reach rapidly, build strong market awareness, and capture a significant share of its target market.',
  },
  {
    name: 'Tamr Al Aseel',
    tag: 'Dates Brand',
    logo: 'public/LOGO/el-aseel.png',
    useCase: 'For Al Aseel Dates, we developed a complete brand transformation aimed at building a stronger and more competitive presence in the Middle Eastern market. We created a new brand identity and developed a distinctive packaging direction that enhanced the brand’s visual presence and reflected its positioning in the dates market. Alongside the rebranding process, we conducted comprehensive market and competitor research to identify key market opportunities, understand consumer behavior, and determine the most promising target regions. Based on these insights, we developed a strong, market-focused marketing strategy designed to accelerate brand awareness, increase market penetration, and establish a clear path for regional expansion. Through the strategic execution of the plan, Tamr Al Aseel achieved strong performance and significant growth, supporting its expansion and helping the brand build a stronger presence across the Middle East.',
  },
  {
    name: 'Burger Dad',
    tag: 'Food & Beverage',
    logo: 'public/LOGO/burger-dad.png',
    useCase: 'For Burger Dad, we led a comprehensive rebranding and marketing transformation designed to strengthen the brand’s market position and create a clear competitive advantage. We developed a powerful marketing strategy and a complete marketing plan built around clearly defined objectives and a strong strategic vision. Our approach focused on reshaping the brand’s positioning, identifying key opportunities in the market, and creating a distinctive competitive advantage that allowed Burger Dad to stand out from competitors. Through the implementation of our strategic vision and targeted marketing initiatives, Burger Dad achieved significant market reach and strong brand growth, resulting in increased customer demand and high sales performance.',
  },
  {
    name: 'More Marketing Academy',
    tag: 'Education Academy',
    logo: 'public/LOGO/more-marketing.png',
    useCase: 'For More Marketing Academy, we focused on building a strong and consistent digital presence for an educational brand operating across multiple governorates in Egypt. Our approach centered on developing a clear marketing direction, strengthening the academy’s brand positioning, and creating a communication strategy capable of connecting with students and potential learners across different locations. Through targeted digital campaigns, engaging content, and performance-driven marketing strategies, we worked on increasing brand awareness, generating qualified leads, and supporting the academy’s expansion across its different branches. The overall strategy was designed to establish More Marketing Academy as a recognizable and trusted educational brand while maintaining a consistent brand experience across all locations.',
  },
  {
    name: 'Hiilt',
    tag: 'Sportswear · Egypt & Iraq',
    logo: 'public/LOGO/hiilt.png',
    useCase: 'For Hiilt, a sportswear brand targeting the Egyptian and Iraqi markets, we developed and executed a comprehensive brand transformation focused on strengthening its market presence and accelerating growth. We led a complete rebranding process and developed a strategic marketing direction designed to establish strong competitive advantages and position Hiilt as a distinctive player within the sportswear market. Through extensive market research and a clear understanding of consumer needs, we developed a growth-focused marketing strategy supported by high-quality media production and large-scale advertising campaigns. These efforts significantly expanded the brand’s reach across both the Egyptian and Iraqi markets while driving exceptional sales performance, achieving a ROAS of over 11x. This strong performance created the opportunity to introduce new products to the market, which achieved rapid adoption and successfully gained significant market traction within a short period.',
  },
  {
    name: 'Hisham Islamic Library',
    tag: 'Islamic Bookstore',
    logo: 'public/LOGO/hisham-islamic-library.png',
    useCase: 'For Hisham Islamic Library, we developed a complete brand identity and transformed the way the brand presented itself to its audience through a more professional and consistent visual presence. We developed a targeted marketing strategy based on identifying the most relevant geographic areas and customer segments, followed by the execution of advertising campaigns across multiple targeted locations. Through professional creative presentation and strategically targeted advertising, we significantly expanded the brand’s visibility, reaching a large number of potential customers and establishing a strong presence in the market. The integrated approach contributed to positioning Hisham Islamic Library as one of the most recognized names in its market, achieving outstanding levels of brand awareness and sales performance.',
  },
  {
    name: 'Gawaherji Misr',
    tag: 'Salted Fish Products',
    logo: 'public/LOGO/gawaherji-misr.jpg',
    useCase: 'For Gawaherji Misr, a specialized brand in salted fish products, we developed a comprehensive marketing approach focused on improving product presentation, strengthening the brand’s market positioning, and driving sales growth. We worked on professionally presenting and promoting the full product range, highlighting the unique features and value of each product through detailed and targeted marketing communication. We also developed a new pricing structure and introduced innovative packages and offers with differentiated features designed to increase customer value, encourage purchasing, and create a stronger competitive advantage in the market. Through strategic product promotion, optimized pricing, distinctive packages, and targeted advertising campaigns, we achieved significant market reach and strong sales growth, helping the brand expand its customer base and strengthen its market presence.',
  },
  {
    name: 'Lily’s',
    tag: 'Fine Jewelry',
    logo: "public/LOGO/lily's.png",
    useCase: 'For Lily’s, a premium jewelry brand specializing in authentic natural gemstones, we developed a complete brand identity designed to reflect the exclusivity, quality, and premium value of its products. We developed and executed a comprehensive advertising strategy across multiple digital platforms, creating tailored campaigns to showcase the products, communicate their unique value, and reach high-intent audiences. Despite the premium nature and higher value of the products, our performance-driven approach successfully generated strong sales results, achieving a 7x ROAS. The strategy helped Lily’s expand its reach, strengthen its premium market positioning, and convert brand awareness into measurable sales growth.',
  },
  {
    name: 'Lazord Café',
    tag: 'Café',
    logo: 'public/LOGO/lazord cafe.jpg',
    useCase: 'For Lazord Café, we developed and executed a comprehensive multi-platform advertising strategy designed to increase brand visibility, attract new customers, and drive real business results. We created and launched creative-driven campaigns across multiple digital platforms, focusing on engaging content and compelling advertising concepts that generated significant reach and strong audience engagement. The campaigns successfully expanded Lazord Café’s visibility and attracted a large number of potential customers, while delivering a strong return in terms of in-café traffic and overall business performance.',
  },
  {
    name: 'Palette Gallery',
    tag: 'Art Gallery',
    logo: 'public/LOGO/palette logo png.png',
    useCase: 'For Palette Gallery, we developed a complete brand identity designed to establish a distinctive and recognizable presence in the market. We then developed and executed creative advertising campaigns across multiple digital platforms, combining strong visual communication with targeted performance marketing to maximize brand exposure and customer engagement. Through this integrated approach, Palette Gallery achieved significant market reach and strong sales performance, generating a ROAS of over 8x.',
  },
  {
    name: 'Abu Shams Wholesale',
    tag: 'Wholesale Retail',
    logo: 'public/LOGO/ابو شمس.PNG',
    logoClass: 'clients-logo--abu-shams',
    useCase: 'For Abu Shams Wholesale, we developed a complete brand identity designed to create a stronger and more professional market presence. We established an online sales presence across multiple digital platforms, creating a unified approach to product presentation and customer communication while expanding the brand’s reach beyond its traditional customer base. Through targeted digital marketing and online sales strategies, we reached a large number of potential customers and generated increased interest in the brand, contributing to significant growth in showroom visits and customer traffic.',
  },
  {
    name: 'Al Horeya Center',
    tag: 'Mental Health & Addiction Treatment',
    logo: 'public/LOGO/الحرية.jpg',
    useCase: 'For Al Horeya Center for Addiction Treatment and Mental Health, we developed and executed a comprehensive multi-platform advertising strategy designed to increase the center’s visibility and connect its services with people seeking professional support. We launched targeted advertising campaigns across multiple digital platforms, focusing on the geographic areas and audiences most relevant to the center’s services. Through strategic targeting and consistent campaign execution, we expanded the center’s digital reach and increased awareness of its services across the targeted locations.',
  },
  {
    name: 'Rony Pharma',
    tag: 'Pharmaceutical Distribution',
    logo: 'public/LOGO/rony pharma.jpg',
    useCase: 'For Rony Pharma, a company specializing in pharmaceutical products, cosmetics, and personal care products, we developed a digital marketing approach focused on expanding the brand’s online presence and driving sales. We professionally presented the company’s diverse product portfolio across social media, highlighting product features and creating engaging content designed to attract and convert potential customers. Through targeted advertising campaigns and a multi-platform sales strategy, we achieved significant online reach and strong sales across multiple digital channels.',
  },
  {
    name: 'Ayady Center',
    tag: 'Mental Health & Addiction Treatment',
    logo: 'public/LOGO/ايادي.jpg',
    useCase: 'For Ayady Center for Addiction Treatment and Mental Health, we developed and managed a targeted digital advertising strategy aimed at expanding the center’s reach and increasing awareness of its specialized services. We implemented advertising campaigns across various digital platforms, focusing on reaching the right audiences within carefully selected geographic areas. Through strategic audience targeting, creative campaign execution, and continuous performance optimization, we increased the center’s visibility and reached potential patients across the targeted locations.',
  },
  {
    name: 'Al Fares Cranes',
    tag: 'Cranes & Heavy Equipment',
    logo: 'public/LOGO/el fares.jpg',
    useCase: 'For Al Fares Cranes, we developed a complete brand identity designed to establish a professional and distinctive presence within the market. We then implemented an integrated marketing strategy combining advertising across multiple digital platforms with carefully planned offline marketing activities. The strategy focused on expanding brand awareness, reaching relevant target audiences, and strengthening the company’s market presence through a combination of digital and traditional marketing channels.',
  },
  {
    name: 'Sina Nursing Academy',
    tag: 'Nursing Academy',
    logo: 'public/LOGO/سينا.jpg',
    useCase: 'For Sina Nursing Academy, we developed and executed a comprehensive marketing campaign designed to increase awareness, attract prospective students, and drive enrollment bookings. We produced professional media content tailored to communicate the academy’s educational offerings and appeal to its target audience. Alongside the media production, we launched targeted advertising campaigns across multiple digital platforms to maximize reach and generate qualified inquiries. The academy achieved significant visibility and generated bookings through multiple digital channels.',
  },
  {
    name: 'Golden R Café',
    tag: 'Café',
    logo: 'public/LOGO/golden R.jpg',
    useCase: 'For Golden R Café, we developed a complete brand identity designed to create a distinctive and recognizable presence within the local market. We then developed and executed a creative advertising strategy across multiple digital platforms, focusing on differentiated marketing concepts and engaging communication. Through consistent branding, creative campaigns, and targeted digital advertising, we expanded the café’s reach and strengthened its presence across the surrounding market.',
  },
  {
    name: 'El Refaey Sweets',
    tag: 'Sweets & Desserts',
    logo: 'public/LOGO/الرفاعي.jpg',
    useCase: 'For El Refaey Sweets, we developed and executed a comprehensive advertising strategy across multiple digital platforms, with two clear objectives: expanding brand awareness and driving sales. We launched targeted campaigns designed to increase the brand’s visibility, reach a wider audience, and attract potential customers while maintaining a strong focus on generating actual sales. Through strategic campaign execution and continuous performance optimization, we significantly expanded the brand’s reach while generating tangible sales results.',
  },
  {
    name: 'AKG Group',
    tag: 'Investment Group',
    logo: 'public/LOGO/akg.png',
    useCase: 'For AKG Group, we developed a complete corporate brand identity designed to establish a strong, professional, and cohesive presence across its diverse business activities. We developed a comprehensive marketing strategy and structured plan focused on positioning the group as an attractive and credible business platform for potential investors. Through targeted marketing initiatives, AKG Group attracted a significant number of potential investors interested in launching and participating in diverse business activities across multiple sectors.',
  },
  {
    name: 'Tiger Gym',
    tag: 'Fitness Center',
    logo: 'public/LOGO/tiger gym.jpg',
    useCase: 'For Tiger Gym, we developed and executed a comprehensive multi-platform advertising strategy aimed at increasing brand awareness and attracting new customers across the gym’s full range of services. We launched targeted campaigns across various digital platforms, promoting the gym’s services and communicating their value to relevant audiences. Through strategic audience targeting and performance-driven advertising, we expanded Tiger Gym’s reach and successfully attracted customers interested in its services.',
  },
  {
    name: 'Ceramica Royal',
    tag: 'Ceramics & Finishes',
    logo: 'public/LOGO/سيراميكا رويال.jpg',
    useCase: 'For Ceramica Royal, we developed and executed an integrated advertising strategy combining digital campaigns across multiple platforms with offline marketing activities. Our approach was designed to maximize brand visibility, reach relevant audiences across different customer touchpoints, and create a strong market presence through a unified communication strategy. The integrated approach expanded the brand’s reach, generated significant customer demand, and contributed to substantial sales growth.',
  },
  {
    name: 'Verbo Clinic',
    tag: 'Special Needs Rehabilitation',
    logo: 'public/LOGO/verbo vlinic.jpg',
    useCase: 'For Verbo Clinic, a specialized clinic providing rehabilitation and care services for people with special needs, we developed a structured marketing strategy focused on building awareness and connecting the clinic with its target audience. We created distinctive and engaging content to communicate the clinic’s services clearly while building a strong and trustworthy digital presence. Alongside the content strategy, we executed targeted advertising campaigns across multiple digital platforms to expand the clinic’s reach and visibility.',
  },
  {
    name: 'Ultra Progress',
    tag: 'Digital Business Solutions',
    logo: 'public/LOGO/up.jpg',
    useCase: 'For Ultra Progress, a digital business solutions company, we developed a marketing direction focused on positioning the company as a comprehensive technology partner for businesses and organizations. The company provides software development, mobile applications, digital advertising, and integrated business systems. Our approach communicated the value of these solutions in a clear and professional way, highlighting Ultra Progress’s ability to provide integrated digital infrastructure for organizations seeking transformation and automation.',
  },
  {
    name: 'Mend Physiotherapy Center',
    tag: 'Physiotherapy Center',
    logo: 'public/LOGO/Mend.jpg',
    useCase: 'For Mend Physiotherapy Center, we developed a complete brand identity designed to establish a professional, distinctive, and trustworthy presence within the physiotherapy market. We conducted a comprehensive analysis of the market and competitors to identify key opportunities and define a clear positioning for the center. Based on these insights, we developed a structured marketing strategy and action plan focused on increasing brand awareness, reaching the right target audience, and establishing a sustainable path for growth.',
  },
  {
    name: 'Tadawy Hospital',
    tag: 'Hospital & Healthcare',
    logo: 'public/LOGO/تداوي.jpg',
    useCase: 'For Tadawy Hospital, we developed and executed a comprehensive multi-platform advertising strategy designed to expand the hospital’s market presence and connect its medical services with the targeted patient audience. We launched targeted campaigns across multiple digital platforms, promoting the hospital’s specialties and reaching audiences across the targeted geographic areas. Through strategic audience targeting, consistent campaign execution, and performance-focused advertising, we increased the hospital’s visibility and strengthened its presence within the local healthcare market.',
  },
];

let clientCurrent = 0;

function buildClientUI() {
  const logosWrap = document.getElementById('clientsLogos');
  const dotsWrap = document.getElementById('clientsDots');
  if (!logosWrap || !dotsWrap) return;

  logosWrap.innerHTML = '';
  dotsWrap.innerHTML = '';

  clients.forEach((c, i) => {
    const tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'clients-logo-btn' + (i === clientCurrent ? ' active' : '');
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', i === clientCurrent ? 'true' : 'false');
    tab.setAttribute('aria-label', c.name);
    const logoImgClass = [c.logoBlack && 'clients-logo--black', c.logoClass]
      .filter(Boolean)
      .join(' ');
    tab.innerHTML = `<span class="clients-logo-slot"><img class="${logoImgClass}" src="${c.logo}" alt="${c.name} logo" /></span>`;
    tab.addEventListener('click', () => { clientCurrent = i; renderClient(); });
    logosWrap.appendChild(tab);

    const dot = document.createElement('button');
    dot.type = 'button';
    dot.className = 'clients-dot' + (i === clientCurrent ? ' active' : '');
    dot.setAttribute('aria-label', 'Go to client ' + (i + 1));
    dot.addEventListener('click', () => { clientCurrent = i; renderClient(); });
    dotsWrap.appendChild(dot);
  });
}

function renderClient() {
  const c = clients[clientCurrent];
  const logoEl = document.getElementById('clientDetailLogo');
  const nameEl = document.getElementById('clientName');
  const tagEl = document.getElementById('clientTag');
  const descEl = document.getElementById('clientUseCase');
  if (!logoEl || !nameEl || !tagEl || !descEl) return;

  logoEl.src = c.logo;
  logoEl.alt = c.name + ' logo';
  logoEl.classList.toggle('clients-logo--black', !!c.logoBlack);
  logoEl.classList.toggle('clients-logo--abu-shams', c.logoClass === 'clients-logo--abu-shams');
  nameEl.textContent = c.name;
  tagEl.textContent = c.tag;
  descEl.textContent = c.useCase;

  document.querySelectorAll('.clients-logo-btn').forEach((btn, i) => {
    btn.classList.toggle('active', i === clientCurrent);
    btn.setAttribute('aria-selected', i === clientCurrent ? 'true' : 'false');
  });
  document.querySelectorAll('.clients-dot').forEach((d, i) =>
    d.classList.toggle('active', i === clientCurrent)
  );
}

const clientsPrev = document.getElementById('clientsPrev');
const clientsNext = document.getElementById('clientsNext');
if (clientsPrev && clientsNext) {
  clientsPrev.addEventListener('click', () => {
    clientCurrent = (clientCurrent - 1 + clients.length) % clients.length;
    renderClient();
  });
  clientsNext.addEventListener('click', () => {
    clientCurrent = (clientCurrent + 1) % clients.length;
    renderClient();
  });
  buildClientUI();
  renderClient();
}

/* ---- Testimonial slider ---- */
const track = document.getElementById('sliderTrack');
const dotsWrap = document.getElementById('sliderDots');
const btnPrev = document.getElementById('slidePrev');
const btnNext = document.getElementById('slideNext');

if (!track || !dotsWrap || !btnPrev || !btnNext) {
  /* testimonials section not in DOM */
} else {

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

}

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
