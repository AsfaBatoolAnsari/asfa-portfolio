import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Footer } from '../components/Footer';
import { Starfield } from '../components/Starfield';
import { Hoverable } from '../components/Hoverable';
import { MobileNavPanel, MobileNavTrigger } from '../components/MobileNavMenu';
import { useIntroTimeline } from '../hooks/useIntroTimeline';
import { sx } from '../lib/sx';
import { findProject, findDesign } from '../data/portfolio';
import './Home.css';

// Projects data for the home page's category-filtered grid — a separate, smaller
// list than src/data/portfolio.ts, exactly as the original design authored it
// (the full case-study data lives on the dedicated Projects/ProjectDetail pages).
const PROJ_CATS = ['UI/UX Design', 'Vibe Code'];
const PROJECTS = [
  { cats: ['UI/UX Design'], title: 'Happy Present', slug: 'happy-present' },
  { cats: ['UI/UX Design'], title: 'Car Parking', slug: 'car-parking' },
  { cats: ['UI/UX Design'], title: 'Donatefy Tap-to-Pay', slug: 'donatefy-tap-to-pay', nda: true },
];

const SKILLS_LEFT = [
  { name: 'Figma', pct: 95 },
  { name: 'Photoshop', pct: 85 },
  { name: 'Illustrator', pct: 80 },
  { name: 'Prototyping', pct: 92 },
  { name: 'VS Code', pct: 88 },
  { name: 'Claude', pct: 95 },
  { name: 'ChatGPT', pct: 92 },
];
const SKILLS_RIGHT = [
  { name: 'Adobe XD', pct: 88 },
  { name: 'Canva', pct: 90 },
  { name: 'After Effects', pct: 70 },
  { name: 'HTML & CSS', pct: 72 },
  { name: 'Gemini', pct: 88 },
  { name: 'Lovable', pct: 90 },
  { name: 'GitHub Copilot', pct: 89 },
];

const SERVICES = [
  { n: '01', title: 'UI/UX Design', desc: 'Designing websites, web applications, dashboards, and mobile apps with a focus on usability, responsive design, and consistent user experiences.', tags: ['FIGMA', 'PROTOTYPING', 'DESIGN SYSTEM', 'DASHBOARDS', 'MOBILE APPS'], icon: <path d="M4 20l4.5-1L18 9.5a2.12 2.12 0 0 0-3-3L5.5 16 4 20Z"></path> },
  { n: '02', title: 'Website Design', desc: 'Designing responsive marketing, corporate, e-commerce, and educational websites with clear navigation and engaging user experiences.', tags: ['LANDING PAGES', 'E-COMMERCE', 'RESPONSIVE'], icon: <><rect x="2" y="4" width="13.5" height="10" rx="1.8"></rect><path d="M6 17h5.5"></path><rect x="15.5" y="9" width="6.5" height="11" rx="1.8"></rect><path d="M18 17.3h1.6"></path></> },
  { n: '03', title: 'Design Systems', desc: 'Building scalable design systems with reusable components, consistent styles, and responsive UI patterns across digital products.', tags: ['COMPONENTS', 'TOKENS', 'GUIDELINES', 'AUTO LAYOUT', 'VARIABLES'], icon: <><rect x="3.5" y="3.5" width="7.5" height="7.5" rx="2"></rect><rect x="13" y="3.5" width="7.5" height="7.5" rx="2" opacity="0.55"></rect><rect x="3.5" y="13" width="7.5" height="7.5" rx="2" opacity="0.55"></rect><rect x="13" y="13" width="7.5" height="7.5" rx="2"></rect></> },
  { n: '04', title: 'Mobile App Design', desc: 'Designing intuitive mobile applications with user-friendly navigation, responsive layouts, and seamless experiences across Android and iOS.', tags: ['IOS', 'ANDROID', 'APP FLOWS', 'PROTOTYPING'], icon: <><rect x="7" y="2.5" width="10" height="19" rx="2.5"></rect><path d="M10.5 18.5h3"></path></> },
  { n: '05', title: 'Branding & Creative', desc: 'Creating brand assets, brochures, social media creatives, and marketing materials that maintain a consistent visual identity across digital platforms.', tags: ['LOGO', 'Branding', 'TYPOGRAPHY'], icon: <><path d="M12 3.5a8.5 8.5 0 1 0 0 17c1.3 0 1.9-1 1.9-1.9 0-1.2-.9-1.4-.9-2.3 0-.75.65-1.4 1.5-1.4H17a3.5 3.5 0 0 0 3.5-3.5c0-4.2-3.8-7.4-8.5-7.4Z"></path><circle cx="7.5" cy="12" r="1"></circle><circle cx="9.5" cy="8" r="1"></circle><circle cx="14" cy="7.5" r="1"></circle></> },
  { n: '06', title: 'UX Research', desc: 'Understanding user needs through research, competitor analysis, and user flows to create intuitive and practical digital experiences.', tags: ['WIREFRAMING', 'USABILITY', 'INSIGHTS', 'INFORMATION ARCHITECHTURE'], icon: <><circle cx="11" cy="11" r="7"></circle><path d="M20 20l-4-4"></path></> },
  { n: '07', title: 'Vibe Coding', desc: 'Turning designs into real, working products using AI-assisted coding tools — building functional prototypes and websites faster, without losing design quality.', tags: ['AI TOOLS', 'PROTOTYPING', 'NO-CODE', 'RAPID BUILD'], icon: <><polyline points="8 9 4 12 8 15"></polyline><polyline points="16 9 20 12 16 15"></polyline></> },
];

const EXPERIENCE = [
  { date: 'JAN 2025 – JUNE 2026', role: 'UX / UI Designer', org: 'AmeriCloud Solutions', desc: 'Designed websites, web applications, SaaS dashboards, branding assets, brochures, and social media marketing creatives for multiple client projects.', current: true },
  { date: 'NOV 2024 – 2025', role: 'Junior UX / UI Designer', org: 'SplitConvert', desc: 'Redesigned responsive Shopify e-commerce stores with a focus on usability, user experience, and conversion optimization.' },
  { date: 'APR – MAY 2023', role: 'Intern UX / UI Designer', org: 'Pixolie Lab', desc: 'Designed web applications, mobile apps, and e-commerce platforms for multiple client projects across different industries.' },
];
const EDUCATION = [
  { date: '2023 – PRESENT', role: 'BB Information Technology', org: 'Virtual University', desc: "Currently pursuing a Bachelor's degree in Business & Information Technology with a focus on technology, business, and digital solutions.", current: true },
  { date: '2022 – 2023', role: 'UI / UX Designer', org: 'Institute of Emerging Career (IEC)', desc: 'Completed hands-on UI/UX design training covering UX research, wireframing, prototyping, design systems, and high-fidelity UI design.' },
  { date: '2022', role: 'Web Designing', org: 'Slim Coder Academy', desc: 'Completed front-end development training covering HTML, CSS, Bootstrap, JavaScript, and responsive web development.' },
];

const TESTIMONIALS = [
  { quote: 'Asfa consistently delivered clean, well-structured designs and was always open to feedback. Her attention to detail and ability to improve user experience made the collaboration smooth and efficient.', role: 'Client' },
  { quote: 'She redesigned our product with a strong focus on usability and visual consistency. Communication was clear, deadlines were met, and the final designs were ready for development.', role: 'Project Manager' },
  { quote: 'From dashboards to responsive websites, Asfa handled every project professionally. Her designs were thoughtful, organized, and easy for our development team to implement.', role: 'Client' },
];

const DESIGN_PICKS = [
  { slug: 'parallax-scroll', cat: 'ANIMATION', title: 'Parallax Scroll Effects in Figma' },
  { slug: '3d-rotation', cat: 'ANIMATION', title: '3D Rotation Animation in Figma' },
  { slug: 'mobile-dashboard', cat: 'UI', title: 'Mobile Dashboard UI' },
];

export default function Home() {
  const [projCat, setProjCat] = useState('UI/UX Design');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  useIntroTimeline({ playIntro: true, introSpeed: 1.1 });

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 779) setMobileNavOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const projList = PROJECTS.filter((p) => p.cats.includes(projCat));

  return (
    <div style={sx('position:relative;min-height:100vh;background:#0C0B0A;overflow-x:clip')}>
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: '-12vw', top: '-18vh', width: '58vw', height: '58vw', borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(240,102,30,0.13), transparent 65%)', filter: 'blur(70px)', animation: 'drift1 26s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', right: '-16vw', top: '22vh', width: '52vw', height: '52vw', borderRadius: '50%', background: 'radial-gradient(circle at 55% 45%, rgba(255,138,64,0.07), transparent 62%)', filter: 'blur(80px)', animation: 'drift2 32s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', left: '22vw', bottom: '-30vh', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle at 50% 40%, rgba(64,28,10,0.55), transparent 66%)', filter: 'blur(70px)', animation: 'drift1 38s ease-in-out infinite alternate-reverse' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 42%, transparent 45%, rgba(6,5,4,0.7) 100%)' }} />
        <div style={{ position: 'absolute', inset: 0, opacity: 0.05, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='160' height='160' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")" }} />
      </div>

      <div id="site" style={{ position: 'relative', zIndex: 1 }}>
        {/* ---------- HERO ---------- */}
        <section id="hero" style={{ position: 'relative', height: '100svh', minHeight: 560 }}>
          <div aria-hidden="true" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 1, pointerEvents: 'none' }}>
            <soft-aurora speed="0.7" scale="1" brightness="0.8" color1="#ffb887" color2="#b74b00" noise-frequency="3.5" noise-amplitude="1" band-height="0.62" band-spread="1.1" octave-decay="0.06" layer-offset="0" color-speed="1.6" mouse-influence="0.1"></soft-aurora>
          </div>
          <div id="chrome" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', zIndex: 3, pointerEvents: 'none', border: '1.5px solid transparent', borderRadius: 12, boxSizing: 'border-box', opacity: 0 }}>
            <div id="hd1" style={{ position: 'absolute', left: -5, top: -5, width: 9, height: 9, background: '#FFF', border: '1.5px solid #F0661E', borderRadius: 2 }} />
            <div id="hd2" style={{ position: 'absolute', right: -5, top: -5, width: 9, height: 9, background: '#FFF', border: '1.5px solid #F0661E', borderRadius: 2 }} />
            <div id="hd3" style={{ position: 'absolute', left: -5, bottom: -5, width: 9, height: 9, background: '#FFF', border: '1.5px solid #F0661E', borderRadius: 2 }} />
            <div id="hd4" style={{ position: 'absolute', right: -5, bottom: -5, width: 9, height: 9, background: '#FFF', border: '1.5px solid #F0661E', borderRadius: 2 }} />
            <div id="frameTag" style={{ position: 'absolute', left: 0, top: -26, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#F0661E', letterSpacing: '0.04em', whiteSpace: 'nowrap' }}>Hero / Desktop</div>
          </div>
          <div id="fw" style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2, background: 'transparent' }}>
            <div id="inner" style={{ position: 'relative', width: '100%', height: '100%', transformOrigin: '0 0', background: 'transparent' }}>
              <div id="guides" aria-hidden="true" style={{ position: 'absolute', inset: 0, opacity: 0, pointerEvents: 'none' }}>
                <div style={{ position: 'absolute', left: '25%', top: 0, width: 1, height: '100%', background: 'rgba(240,102,30,0.28)' }} />
                <div style={{ position: 'absolute', left: '50%', top: 0, width: 1, height: '100%', background: 'rgba(240,102,30,0.28)' }} />
                <div style={{ position: 'absolute', left: '75%', top: 0, width: 1, height: '100%', background: 'rgba(240,102,30,0.28)' }} />
              </div>
              <nav id="heroNav" style={{ position: 'absolute', left: 0, top: 0, width: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '26px 48px', gap: 24 }}>
                <a href="#hero" style={{ display: 'flex', alignItems: 'center', gap: 12, flex: '0 0 auto' }}><img src="/assets/logo.png" alt="AB — Asfa Batool Ansari" style={{ height: 30, width: 'auto', display: 'block' }} /></a>
                <div id="hnLinks" style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 14, fontWeight: 500 }}>
                  <a href="#hero" style={{ color: '#F5F1EA' }}>Home</a>
                  <a href="#about" style={{ color: '#A29889' }}>About</a>
                  <a href="#services" style={{ color: '#A29889' }}>Services</a>
                  <Link to="/projects" style={{ color: '#A29889' }}>UI/UX</Link>
                  <Link to="/vibe-code" style={{ color: '#A29889' }}>Vibe Code</Link>
                  <Link to="/designs" style={{ color: '#A29889' }}>Designs</Link>
                  <Link to="/contact" style={{ color: '#A29889' }}>Contact</Link>
                </div>
                <Link id="hnCta" to="/contact" style={{ color: '#F0661E', border: '1px solid rgba(240,102,30,0.55)', borderRadius: 999, padding: '9px 22px', fontSize: 14, whiteSpace: 'nowrap' }}>Let's talk</Link>
              </nav>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '96px 24px 48px', boxSizing: 'border-box', gap: 0 }}>
                <div id="chip" style={{ display: 'inline-flex', alignItems: 'center', gap: 9, border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, padding: '8px 18px', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.18em', color: '#A29889' }}>
                  <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)' }} />UI/UX DESIGNER
                </div>
                <h1 id="heroTitle" style={{ margin: '26px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 700, fontSize: 'clamp(42px,6.2vw,86px)', lineHeight: 1.05, letterSpacing: '-0.025em' }}>
                  <span style={{ display: 'block', overflow: 'hidden' }}><span id="m1a" style={{ display: 'block' }}>Designing interfaces</span></span>
                  <span style={{ display: 'block', overflow: 'hidden' }}><span id="m1b" style={{ display: 'block' }}>people <span style={{ color: '#F0661E' }}>remember.</span></span></span>
                </h1>
                <p id="desc" style={{ margin: '18px 0 0', maxWidth: 560, fontSize: 17, lineHeight: 1.65, color: '#A29889' }}>I turn complex problems into clean, considered digital experiences — from the first wireframe to polished, production-ready interfaces.</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginTop: 34, flexWrap: 'wrap', justifyContent: 'center' }}>
                  <Link id="btnP" to="/projects" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#FF8A3D 0%,#EA5E14 48%,#C74208 100%)', color: '#FFF7F0', fontWeight: 600, fontSize: 15, borderRadius: 999, padding: '15px 32px', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.25)', boxShadow: '0 10px 28px rgba(240,102,30,0.35), inset 0 1px 0 rgba(255,255,255,0.28)' }}>View my work</Link>
                  <a id="btnG" href="https://www.linkedin.com/in/asfa-batool-ansari/" target="_blank" rel="noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 10, color: '#F5F1EA', fontWeight: 500, fontSize: 15, border: '1px solid rgba(255,255,255,0.16)', borderRadius: 999, padding: '13px 26px', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)' }}>Connect on LinkedIn</a>
                </div>
              </div>
              <div id="scrollI" style={{ display: 'none' }} />
              <div id="selB" aria-hidden="true" style={{ position: 'absolute', left: 0, top: 0, width: 100, height: 40, border: '1px solid #F0661E', opacity: 0, pointerEvents: 'none' }}>
                <span style={{ position: 'absolute', left: -3, top: -3, width: 5, height: 5, background: '#FFF', border: '1px solid #F0661E' }} />
                <span style={{ position: 'absolute', right: -3, top: -3, width: 5, height: 5, background: '#FFF', border: '1px solid #F0661E' }} />
                <span style={{ position: 'absolute', left: -3, bottom: -3, width: 5, height: 5, background: '#FFF', border: '1px solid #F0661E' }} />
                <span style={{ position: 'absolute', right: -3, bottom: -3, width: 5, height: 5, background: '#FFF', border: '1px solid #F0661E' }} />
                <span id="selLbl" style={{ position: 'absolute', left: -1, top: -22, background: '#F0661E', color: '#12100E', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: '3px 7px', borderRadius: 3, whiteSpace: 'nowrap' }}>layer</span>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- ABOUT ---------- */}
        <section id="about" style={{ position: 'relative', zIndex: 2, maxWidth: 1240, margin: 'clamp(-120px,-10svh,-48px) auto 0', padding: '0 clamp(16px,4vw,32px)', boxSizing: 'border-box' }}>
          <div aria-hidden="true" style={{ position: 'absolute', left: '-4vw', right: '-4vw', top: -90, bottom: -90, pointerEvents: 'none' }}>
            <magic-rings color="#b64b00" color-two="#9c4000" ring-count="9" speed="0.6" attenuation="12.5" line-thickness="1.5" base-radius="0.35" radius-step="0.1" scale-rate="0.15" opacity="1" blur="0.5" noise-amount="0.02" rotation="0" ring-gap="1.5" fade-in="0.5" fade-out="0.5"></magic-rings>
          </div>
          <div id="aboutV2" style={{ position: 'relative', borderRadius: 28, border: '1px solid rgba(255,255,255,0.09)', boxShadow: '0 30px 80px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.06)', overflow: 'hidden' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(90% 70% at 50% 0%, rgba(240,102,30,0.06), transparent 60%)' }} />
            <div aria-hidden="true" style={{ position: 'absolute', left: '8%', right: '8%', top: 0, height: 1, background: 'linear-gradient(90deg,transparent,rgba(240,102,30,0.35),transparent)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', padding: 'clamp(48px,7vw,84px) clamp(24px,5vw,64px)' }}>
              <div id="v2grid">
                <div id="v2head" data-rv="1">
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.3em', color: '#F0661E' }}>01 — ABOUT ME</div>
                  <h2 style={{ margin: '14px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(27px,3vw,40px)', lineHeight: 1.14, letterSpacing: '-0.02em' }}>Turning ideas into <span style={{ color: '#F0661E' }}>seamless</span> experiences.</h2>
                </div>
                <div id="v2left" data-rv="1">
                  <p style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: '#A29889' }}>I'm a UI/UX Designer with 3 years of experience designing SaaS platforms, dashboards, websites and mobile applications. I create clear, user-friendly interfaces with a strong focus on usability, consistency and thoughtful visual design.</p>
                  <div id="v2tags" style={{ display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 20 }}>
                    {['FUNDRAISING', 'TELECOM', 'E-COMMERCE', 'SERVICE MARKETPLACE', 'EDUCATION'].map((t) => (
                      <span key={t} style={{ border: '1px solid rgba(255,255,255,0.12)', background: 'rgba(255,255,255,0.04)', borderRadius: 999, padding: '7px 14px', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.1em', color: '#C9C0B4' }}>{t}</span>
                    ))}
                  </div>
                  <div id="v2meta" style={{ display: 'flex', flexDirection: 'column', gap: 5, marginTop: 20, fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.16em', color: '#6E665C' }}>
                    <span>ASFA BATOOL ANSARI</span><span>KARACHI, PAKISTAN</span>
                  </div>
                </div>
                <div id="v2center" data-rv="1" style={{ position: 'relative' }}>
                  <div aria-hidden="true" style={{ position: 'absolute', inset: '-14%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,102,30,0.15), transparent 62%)', filter: 'blur(20px)', pointerEvents: 'none' }} />
                  <div aria-hidden="true" style={{ position: 'absolute', inset: '-7%', borderRadius: '50%', border: '1px solid rgba(240,102,30,0.22)', pointerEvents: 'none' }}>
                    <span style={{ position: 'absolute', left: '50%', top: -3.5, width: 7, height: 7, marginLeft: -3.5, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)' }} />
                  </div>
                  <div style={{ position: 'relative', aspectRatio: '1', borderRadius: '50%', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.14)', background: 'rgba(255,255,255,0.04)', boxShadow: '0 24px 60px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.1)' }}>
                    <image-slot id="portrait" src="/assets/about-portrait.png" shape="rect" style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '132%' }} placeholder="Paste image URL here"></image-slot>
                  </div>
                </div>
                <div id="v2right" data-rv="1" style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  <div style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px 22px', boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}><span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 27 }}>3<span style={{ color: '#F0661E' }}>+</span></span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.16em', color: '#6E665C' }}>YEARS EXPERIENCE</span></div>
                    <div aria-hidden="true" style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '14px 0' }} />
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 12 }}><span style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 27 }}>12<span style={{ color: '#F0661E' }}>+</span></span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.16em', color: '#6E665C' }}>PROJECTS DELIVERED</span></div>
                    <div aria-hidden="true" style={{ height: 1, background: 'rgba(255,255,255,0.07)', margin: '14px 0' }} />
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)', flex: '0 0 auto' }} /><span style={{ fontSize: 13.5, color: '#C9C0B4' }}>Available for freelance &amp; full-time</span></div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.035)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 18, padding: '20px 22px', boxShadow: '0 12px 32px rgba(0,0,0,0.25)' }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.25em', color: '#F0661E' }}>PROCESS</div>
                    <div style={{ position: 'relative', marginTop: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
                      <div aria-hidden="true" style={{ position: 'absolute', left: 3, top: 8, bottom: 8, width: 1, background: 'rgba(240,102,30,0.25)' }} />
                      {[['Research', 1, '01'], ['Wireframe', 0.75, '02'], ['UI Design', 0.6, '03'], ['Prototype', 0.45, '04'], ['Ship', 0.3, '05']].map(([label, op, idx]) => (
                        <div key={idx as string} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#F0661E', opacity: op as number, flex: '0 0 auto', position: 'relative' }} />
                          <span style={{ fontSize: 14, color: '#C9C0B4' }}>{label}</span>
                          <span style={{ flex: 1 }} />
                          <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, color: '#6E665C' }}>{idx}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- SERVICES ---------- */}
        {/* Mobile-only duplicate of the intro copy below, rendered in normal
            scroll flow ABOVE the pinned #services section (not inside it) so
            the sticky viewport only has to fit the card stack, not the text
            too — the text+stack combined don't fit a single mobile screen
            the way they comfortably do side-by-side on desktop. Kept outside
            #services entirely so the pin/scroll-progress math (which measures
            from #services' own top) is completely unaffected. */}
        <div id="svcIntroMobile" style={{ maxWidth: 1240, margin: '0 auto', padding: '48px clamp(16px,4vw,32px) 0', boxSizing: 'border-box' }}>
          <div data-rv="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)' }} />WHAT I DO
          </div>
          <h2 data-rv="1" style={{ margin: '22px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>Designing meaningful<br />digital experiences<br />that users <span style={{ color: '#F0661E' }}>enjoy.</span></h2>
          <p data-rv="1" style={{ margin: '22px 0 0', maxWidth: '46ch', fontSize: 15.5, lineHeight: 1.7, color: '#A29889' }}>I focus on designing websites, web apps, dashboards, and mobile apps that are easy to use, visually consistent, and built with real users in mind.</p>
        </div>
        <section id="services" style={{ position: 'relative' }}>
          <div id="svcSticky">
            <div id="svcPad" style={{ position: 'relative', width: '100%', maxWidth: 1240, margin: '0 auto', padding: '24px clamp(16px,4vw,32px)', boxSizing: 'border-box' }}>
              <div aria-hidden="true" style={{ position: 'absolute', right: '-14%', top: '6%', width: '46vw', height: '46vw', borderRadius: '50%', background: 'radial-gradient(circle at 45% 45%, rgba(240,102,30,0.09), transparent 62%)', filter: 'blur(60px)', animation: 'drift2 30s ease-in-out infinite alternate', pointerEvents: 'none' }} />
              <div aria-hidden="true" style={{ position: 'absolute', left: '-14%', bottom: '2%', width: '40vw', height: '40vw', borderRadius: '50%', background: 'radial-gradient(circle at 50% 45%, rgba(255,138,64,0.06), transparent 62%)', filter: 'blur(64px)', animation: 'drift1 36s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }} />
              <div id="svcGrid">
                <div id="svcLeft">
                  <div data-rv="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
                    <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)' }} />WHAT I DO
                  </div>
                  <h2 data-rv="1" style={{ margin: '22px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>Designing meaningful<br />digital experiences<br />that users <span style={{ color: '#F0661E' }}>enjoy.</span></h2>
                  <p data-rv="1" style={{ margin: '22px 0 0', maxWidth: '46ch', fontSize: 15.5, lineHeight: 1.7, color: '#A29889' }}>I focus on designing websites, web apps, dashboards, and mobile apps that are easy to use, visually consistent, and built with real users in mind.</p>
                </div>
                <div id="svcStackArea" style={{ minWidth: 0 }}>
                  {SERVICES.map((s, i) => (
                    <div
                      key={s.n}
                      data-svc-card="1"
                      style={{ marginBottom: i === SERVICES.length - 1 ? 0 : 100, border: '1px solid transparent', borderRadius: 26, minHeight: '20rem', boxSizing: 'border-box', willChange: 'transform', padding: 'clamp(26px,3.5vw,40px)', boxShadow: '0 -6px 24px rgba(0,0,0,0.3), 0 8px 20px rgba(0,0,0,0.3), 0 28px 70px rgba(0,0,0,0.5), 0 0 44px rgba(240,102,30,0.07), inset 0 1px 0 rgba(255,255,255,0.16), inset 0 -1px 0 rgba(0,0,0,0.3), inset 1px 0 0 rgba(255,255,255,0.05)', overflow: 'hidden', transformOrigin: 'top center', backfaceVisibility: 'hidden' }}
                    >
                      <div aria-hidden="true" style={{ position: 'absolute', left: '-20%', top: '-40%', width: '70%', height: '90%', background: 'radial-gradient(circle, rgba(240,102,30,0.12), transparent 65%)', filter: 'blur(24px)', pointerEvents: 'none' }} />
                      <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16 }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 46, height: 46, borderRadius: 14, background: 'linear-gradient(135deg,rgba(255,138,64,0.95),rgba(199,66,8,0.95))', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 8px 22px rgba(240,102,30,0.35), inset 0 1px 0 rgba(255,255,255,0.35)', fontFamily: "'JetBrains Mono',monospace", fontSize: 13, fontWeight: 500, color: '#FFF7F0' }}>{s.n}</span>
                        <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="#F0661E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{s.icon}</svg>
                      </div>
                      <h3 style={{ position: 'relative', margin: '24px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 22, letterSpacing: '-0.01em' }}>{s.title}</h3>
                      <p style={{ position: 'relative', margin: '12px 0 0', fontSize: 15, lineHeight: 1.68, color: '#A29889' }}>{s.desc}</p>
                      <div style={{ position: 'relative', display: 'flex', flexWrap: 'wrap', gap: 9, marginTop: 22 }}>
                        {s.tags.map((tag) => (
                          <span key={tag} style={sx("border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:7px 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.1em;color:#C9C0B4")}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ---------- JOURNEY ---------- */}
        <section id="journey" style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: 'clamp(80px,11vh,140px) clamp(16px,4vw,32px) clamp(60px,9vh,110px)', boxSizing: 'border-box' }}>
          <div aria-hidden="true" style={{ position: 'absolute', left: '-12%', top: '32%', width: '44vw', height: '44vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,102,30,0.07), transparent 62%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div data-rv="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)' }} />MY JOURNEY
            </div>
            <h2 data-rv="1" style={{ margin: '20px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>Experience &amp; <span style={{ color: '#F0661E' }}>education.</span></h2>
          </div>
          <div id="jrnGrid" style={{ position: 'relative', marginTop: 'clamp(44px,6vw,68px)' }}>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.3em', color: '#F0661E' }}>EXPERIENCE</div>
              <div style={{ position: 'relative', marginTop: 26 }}>
                <div aria-hidden="true" style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 1, background: 'linear-gradient(180deg,rgba(240,102,30,0.45),rgba(240,102,30,0.08))' }} />
                {EXPERIENCE.map((e, i) => (
                  <div key={e.role} data-rv="1" style={{ position: 'relative', padding: i === EXPERIENCE.length - 1 ? '0 0 4px 36px' : '0 0 36px 36px' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 5, width: 13, height: 13, borderRadius: '50%', background: e.current ? '#F0661E' : '#12100E', border: '1.5px solid #F0661E', boxShadow: e.current ? '0 0 14px rgba(240,102,30,0.7)' : '0 0 12px rgba(240,102,30,0.45)', boxSizing: 'border-box' }} />
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.18em', color: '#6E665C' }}>{e.date}</div>
                    <h3 style={{ margin: '8px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em' }}>{e.role}</h3>
                    <div style={{ marginTop: 4, fontSize: 13.5, fontWeight: 500, color: '#F0661E' }}>{e.org}</div>
                    <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.65, color: '#A29889' }}>{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.3em', color: '#F0661E' }}>EDUCATION</div>
              <div style={{ position: 'relative', marginTop: 26 }}>
                <div aria-hidden="true" style={{ position: 'absolute', left: 6, top: 8, bottom: 8, width: 1, background: 'linear-gradient(180deg,rgba(240,102,30,0.45),rgba(240,102,30,0.08))' }} />
                {EDUCATION.map((e, i) => (
                  <div key={e.role} data-rv="1" style={{ position: 'relative', padding: i === EDUCATION.length - 1 ? '0 0 4px 36px' : '0 0 36px 36px' }}>
                    <span aria-hidden="true" style={{ position: 'absolute', left: 0, top: 5, width: 13, height: 13, borderRadius: '50%', background: e.current ? '#F0661E' : '#12100E', border: '1.5px solid #F0661E', boxShadow: e.current ? '0 0 14px rgba(240,102,30,0.7)' : '0 0 12px rgba(240,102,30,0.45)', boxSizing: 'border-box' }} />
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, letterSpacing: '0.18em', color: '#6E665C' }}>{e.date}</div>
                    <h3 style={{ margin: '8px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 18, letterSpacing: '-0.01em' }}>{e.role}</h3>
                    <div style={{ marginTop: 4, fontSize: 13.5, fontWeight: 500, color: '#F0661E' }}>{e.org}</div>
                    <p style={{ margin: '10px 0 0', fontSize: 14.5, lineHeight: 1.65, color: '#A29889' }}>{e.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ---------- PROJECTS ---------- */}
        <section id="projects" style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: 'clamp(80px,11vh,140px) clamp(16px,4vw,32px) clamp(40px,7vh,90px)', boxSizing: 'border-box' }}>
          <div aria-hidden="true" style={{ position: 'absolute', right: '-10%', top: '14%', width: '44vw', height: '44vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,102,30,0.07), transparent 62%)', filter: 'blur(60px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div data-rv="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)' }} />SELECTED WORK
            </div>
            <h2 data-rv="1" style={{ margin: '20px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>Let's have a look at<br /><span style={{ color: '#F0661E' }}>my work.</span></h2>
            <div data-rv="1" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 28 }}>
              {PROJ_CATS.map((name) => (
                <button key={name} type="button" data-fpill="1" data-act={name === projCat ? 'true' : 'false'} onClick={() => setProjCat(name)} style={{ border: 'none', borderRadius: 999, padding: '10px 20px', fontSize: 13.5, fontWeight: 500, letterSpacing: '0.01em' }}>{name}</button>
              ))}
            </div>
          </div>
          <div id="projGrid" data-count={String(projCat === 'Vibe Code' ? 0 : projList.length)} style={{ position: 'relative', marginTop: 'clamp(36px,5vw,52px)' }}>
            {projCat === 'Vibe Code' && (
              <div style={{ gridColumn: '1/-1', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 22, padding: 'clamp(48px,7vw,72px) 24px', textAlign: 'center', overflow: 'hidden', background: 'linear-gradient(165deg,rgba(26,21,18,0.9),rgba(15,12,10,0.95))', boxShadow: '0 18px 50px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.08)' }}>
                <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '-20%', transform: 'translateX(-50%)', width: '50%', height: '80%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,102,30,0.16), transparent 65%)', filter: 'blur(40px)', pointerEvents: 'none' }} />
                <span style={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 58, height: 58, borderRadius: 18, background: 'linear-gradient(135deg,rgba(255,138,64,0.95),rgba(199,66,8,0.95))', border: '1px solid rgba(255,255,255,0.25)', boxShadow: '0 10px 26px rgba(240,102,30,0.35), inset 0 1px 0 rgba(255,255,255,0.32)' }}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#FFF7F0" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><polyline points="8 9 4 12 8 15"></polyline><polyline points="16 9 20 12 16 15"></polyline></svg>
                </span>
                <div style={{ position: 'relative', marginTop: 22, fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.22em', color: '#F0661E' }}>COMING SOON</div>
                <h3 style={{ position: 'relative', margin: '12px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(20px,2.6vw,28px)', letterSpacing: '-0.01em' }}>Vibe coding projects are on the way.</h3>
                <p style={{ position: 'relative', margin: '12px auto 0', maxWidth: '46ch', fontSize: 14.5, lineHeight: 1.7, color: '#A29889' }}>I'm currently building AI-assisted, code-driven projects — check back soon to see them here.</p>
              </div>
            )}
            {projCat !== 'Vibe Code' && projList.map((p, i) => (
              <Link key={p.slug} data-proj="1" data-i={String(i)} to={`/projects/${p.slug}`} style={{ position: 'relative', border: '1px solid transparent', borderRadius: 22, overflow: 'hidden', padding: 12, boxSizing: 'border-box', boxShadow: '0 18px 50px rgba(0,0,0,0.42), 0 0 36px rgba(240,102,30,0.05), inset 0 1px 0 rgba(255,255,255,0.12)', color: '#F5F1EA' }}>
                {p.nda ? (
                  <div style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', background: 'linear-gradient(150deg,#241d18,#171310)' }}>
                    <div aria-hidden="true" style={{ position: 'absolute', inset: 0, background: 'radial-gradient(80% 70% at 78% 20%, rgba(240,102,30,0.16), transparent 60%)' }} />
                    <div aria-hidden="true" style={{ position: 'absolute', left: '12%', top: '16%', right: '38%', height: 11, borderRadius: 6, background: 'rgba(255,255,255,0.06)' }} />
                    <div aria-hidden="true" style={{ position: 'absolute', left: '12%', top: '26%', right: '22%', height: 8, borderRadius: 5, background: 'rgba(255,255,255,0.045)' }} />
                    <div aria-hidden="true" style={{ position: 'absolute', left: '12%', bottom: '14%', right: '30%', height: 8, borderRadius: 5, background: 'rgba(255,255,255,0.04)' }} />
                    <span style={sx("position:absolute;left:18px;top:18px;display:inline-flex;align-items:center;gap:7px;border:1px solid rgba(240,102,30,0.45);background:rgba(240,102,30,0.12);border-radius:999px;padding:6px 12px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.14em;color:#F0661E")}>
                      <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
                      NDA
                    </span>
                    <span style={{ position: 'absolute', left: '50%', top: '54%', transform: 'translate(-50%,-50%)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 15, background: 'rgba(240,102,30,0.14)', border: '1px solid rgba(240,102,30,0.45)', boxShadow: '0 0 26px rgba(240,102,30,0.25)' }}>
                      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#F0661E" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="5" y="10.5" width="14" height="9.5" rx="2.5"></rect><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"></path></svg>
                    </span>
                  </div>
                ) : (
                  <div data-pmedia="1" style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', background: 'linear-gradient(160deg,#2C2620,#1C1815)' }}>
                    <image-slot id={`proj-${p.slug}`} src={findProject(p.slug)?.image} shape="rect" placeholder="Paste image URL here"></image-slot>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 14, padding: '16px 8px 8px' }}>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.22em', color: '#F0661E' }}>{projCat.toUpperCase()}{p.nda ? ' · CONFIDENTIAL' : ''}</div>
                    <div style={{ marginTop: 6, fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 17.5, letterSpacing: '-0.01em' }}>{p.title}</div>
                  </div>
                  <span data-parrow="1" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 36, height: 36, borderRadius: '50%', border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.05)', color: '#F5F1EA', flex: '0 0 auto' }}>
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 L17 7M9 7h8v8"></path></svg>
                  </span>
                </div>
              </Link>
            ))}
            {projCat !== 'Vibe Code' && projList.length === 0 && (
              <div style={{ gridColumn: '1/-1', border: '1px dashed rgba(255,255,255,0.16)', borderRadius: 18, padding: '44px 24px', textAlign: 'center', color: '#A29889', fontSize: 14.5 }}>
                Case studies in this category are shared privately — <Link to="/contact" style={{ color: '#F0661E' }}>get in touch</Link> for a walkthrough.
              </div>
            )}
          </div>
          <div data-rv="1" style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(36px,5vw,52px)' }}>
            <Hoverable as={Link} to="/projects" base="display:inline-flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.05);border-radius:999px;padding:10px 10px 10px 24px;font-size:14.5px;font-weight:500;color:#F5F1EA" hoverCss="border-color:rgba(240,102,30,0.55);color:#F0661E">
              View all projects
              <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#FF8A3D,#EA5E14);color:#12100E;box-shadow:0 6px 16px rgba(240,102,30,0.35)')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
              </span>
            </Hoverable>
          </div>
        </section>

        {/* ---------- SKILLS ---------- */}
        <section id="skills" style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: 'clamp(80px,11vh,140px) clamp(16px,4vw,32px) clamp(40px,7vh,90px)', boxSizing: 'border-box' }}>
          <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: 0, transform: 'translateX(-50%)', width: '52vw', height: '40vh', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,102,30,0.07), transparent 62%)', filter: 'blur(56px)', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div data-rv="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)' }} />TOOLKIT
            </div>
            <h2 data-rv="1" style={{ margin: '20px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>Tools I use to<br /><span style={{ color: '#F0661E' }}>ship great work.</span></h2>
          </div>
          <div id="skillsGrid" style={{ position: 'relative', marginTop: 'clamp(40px,6vw,64px)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30, minWidth: 0 }}>
              {SKILLS_LEFT.map((sk) => (
                <div key={sk.name} data-rv="1" style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}><span style={{ fontSize: 15, fontWeight: 500 }}>{sk.name}</span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#F0661E' }}>{sk.pct}%</span></div>
                  <div style={{ marginTop: 10, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <span data-pct={sk.pct} style={{ display: 'block', height: '100%', width: '0%', borderRadius: 999, background: 'linear-gradient(90deg,#FF9A4D,#F0661E)', boxShadow: '0 0 12px rgba(240,102,30,0.5)' }} />
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 30, minWidth: 0 }}>
              {SKILLS_RIGHT.map((sk) => (
                <div key={sk.name} data-rv="1" style={{ minWidth: 0 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}><span style={{ fontSize: 15, fontWeight: 500 }}>{sk.name}</span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: '#F0661E' }}>{sk.pct}%</span></div>
                  <div style={{ marginTop: 10, height: 6, borderRadius: 999, background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                    <span data-pct={sk.pct} style={{ display: 'block', height: '100%', width: '0%', borderRadius: 999, background: 'linear-gradient(90deg,#FF9A4D,#F0661E)', boxShadow: '0 0 12px rgba(240,102,30,0.5)' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ---------- TESTIMONIALS ---------- */}
        <section id="testimonials" style={{ position: 'relative', maxWidth: 1180, margin: '0 auto', padding: 'clamp(80px,11vh,140px) clamp(16px,4vw,32px) clamp(40px,7vh,90px)', boxSizing: 'border-box' }}>
          <div aria-hidden="true" style={{ position: 'absolute', left: '8%', top: '24%', width: '38vw', height: '38vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,102,30,0.08), transparent 62%)', filter: 'blur(58px)', animation: 'drift1 30s ease-in-out infinite alternate', pointerEvents: 'none' }} />
          <div aria-hidden="true" style={{ position: 'absolute', right: '2%', bottom: '6%', width: '32vw', height: '32vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255,138,64,0.055), transparent 62%)', filter: 'blur(60px)', animation: 'drift2 36s ease-in-out infinite alternate-reverse', pointerEvents: 'none' }} />
          <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div data-rv="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)' }} />KIND WORDS
            </div>
            <h2 data-rv="1" style={{ margin: '20px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>What people say about<br /><span style={{ color: '#F0661E' }}>working with me.</span></h2>
          </div>
          <div id="tstGrid" style={{ position: 'relative', marginTop: 'clamp(36px,5vw,52px)' }}>
            {TESTIMONIALS.map((t, i) => (
              <div key={i} data-tst="1" data-rv="1" style={{ padding: '26px 26px 24px', boxSizing: 'border-box' }}>
                <div aria-hidden="true" style={{ color: '#F0661E', fontSize: 15, letterSpacing: 4, textShadow: '0 0 14px rgba(240,102,30,0.45)' }}>★★★★★</div>
                <p style={{ position: 'relative', margin: '16px 0 0', fontSize: 14.5, lineHeight: 1.7, color: '#C9C0B4' }}>"{t.quote}"</p>
                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 12, marginTop: 'auto', paddingTop: 20 }}>
                  <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#FF8A3D,#EA5E14)', color: '#FFF7F0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 14, boxShadow: '0 6px 16px rgba(240,102,30,0.35), inset 0 1px 0 rgba(255,255,255,0.3)', flex: '0 0 auto' }}>{t.role[0]}</span>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 14 }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ---------- STATEMENT ---------- */}
        <section id="statement" style={{ position: 'relative', maxWidth: 1140, margin: '0 auto', padding: 'clamp(30px,5vh,70px) clamp(16px,4vw,32px) clamp(70px,10vh,130px)', boxSizing: 'border-box' }}>
          <div aria-hidden="true" style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', width: '56vw', height: '40vh', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,102,30,0.06), transparent 62%)', filter: 'blur(56px)', pointerEvents: 'none' }} />
          <falling-text
            style={{ display: 'block', overflow: 'hidden', position: 'relative', height: 'clamp(320px,46vh,480px)', fontFamily: "'Sora',sans-serif", fontWeight: 600, letterSpacing: '-0.015em', color: '#F5F1EA', cursor: 'grab' }}
            font-size="clamp(24px,3.4vw,44px)"
            gravity="0.61"
            stiffness="0.6"
            highlight-color="#F0661E"
            text="Crafting **digital experiences** through **UI/UX design** and **creative solutions.**"
          ></falling-text>
        </section>

        {/* ---------- DESIGNS ---------- */}
        <section id="designs" style={{ position: 'relative', zIndex: 2, maxWidth: 1240, margin: 'clamp(80px,11vh,140px) auto 0', padding: '0 clamp(16px,4vw,32px)', boxSizing: 'border-box' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <div style={{ minWidth: 0 }}>
              <div data-rv="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#F0661E', boxShadow: '0 0 10px rgba(240,102,30,0.9)' }} />SHOWCASE
              </div>
              <h2 data-rv="1" style={{ margin: '16px 0 0', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(28px,3.2vw,44px)', lineHeight: 1.15, letterSpacing: '-0.02em' }}>From my <span style={{ color: '#F0661E' }}>design.</span></h2>
            </div>
          </div>
          <div id="shGrid" style={{ position: 'relative', marginTop: 'clamp(28px,4vw,40px)' }}>
            {DESIGN_PICKS.map((d) => (
              <Link key={d.slug} data-proj="1" data-rv="1" to={`/designs/${d.slug}`} style={{ position: 'relative', border: '1px solid transparent', borderRadius: 22, overflow: 'hidden', padding: 12, boxSizing: 'border-box', boxShadow: '0 18px 50px rgba(0,0,0,0.42), 0 0 36px rgba(240,102,30,0.05), inset 0 1px 0 rgba(255,255,255,0.12)', color: '#F5F1EA' }}>
                <div data-pmedia="1" style={{ position: 'relative', aspectRatio: '4/3', borderRadius: 14, overflow: 'hidden', background: 'linear-gradient(160deg,#2C2620,#1C1815)' }}>
                  <image-slot id={`show-${d.slug === 'parallax-scroll' ? 'parallax' : d.slug === '3d-rotation' ? 'rotation' : 'dashboard'}`} src={findDesign(d.slug)?.image} shape="rect" placeholder="Paste image URL here"></image-slot>
                </div>
                <div style={{ padding: '16px 8px 8px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 9.5, letterSpacing: '0.22em', color: '#F0661E' }}>{d.cat}</div>
                  <div style={{ marginTop: 6, fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 17, letterSpacing: '-0.01em' }}>{d.title}</div>
                  <div data-vlink="1" style={{ marginTop: 12, fontSize: 13.5, fontWeight: 500, color: '#C9C0B4' }}>View design <span aria-hidden="true">↗</span></div>
                </div>
              </Link>
            ))}
          </div>
          <div data-rv="1" style={{ display: 'flex', justifyContent: 'center', marginTop: 'clamp(36px,5vw,52px)' }}>
            <Hoverable as={Link} to="/designs" base="display:inline-flex;align-items:center;gap:12px;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.05);border-radius:999px;padding:10px 10px 10px 24px;font-size:14.5px;font-weight:500;color:#F5F1EA" hoverCss="border-color:rgba(240,102,30,0.55);color:#F0661E">
              View all articles
              <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,#FF8A3D,#EA5E14);color:#12100E;box-shadow:0 6px 16px rgba(240,102,30,0.35)')}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"></path></svg>
              </span>
            </Hoverable>
          </div>
        </section>

        {/* ---------- CTA ---------- */}
        <section id="cta" style={{ position: 'relative', overflow: 'hidden', padding: 'clamp(40px,6vh,80px) clamp(16px,4vw,32px) clamp(14px,2.5vh,32px)', boxSizing: 'border-box' }}>
          <div style={{ position: 'relative' }}>
            <div aria-hidden="true" style={{ position: 'absolute', inset: '-30% -20%', pointerEvents: 'none' }}>
              <Starfield starCount={3200} starColor={{ r: 240, g: 102, b: 30 }} maxOpacity={255} starEscapeWidth={420} rotationSpeed={0.00018} waveSpeed={0.003} />
            </div>
            <div aria-hidden="true" style={{ position: 'absolute', left: '50%', bottom: '-46%', transform: 'translateX(-50%)', width: '76%', height: '80%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,102,30,0.14), transparent 62%)', filter: 'blur(46px)', pointerEvents: 'none' }} />
            <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center', padding: 'clamp(56px,9vw,104px) clamp(24px,5vw,72px)' }}>
              <h2 data-rv="1" style={{ margin: 0, fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(30px,3.8vw,52px)', lineHeight: 1.14, letterSpacing: '-0.02em', maxWidth: '18ch' }}>Have an awesome project idea? <span style={{ color: '#F0661E' }}>Let's discuss.</span></h2>
              <p data-rv="1" style={{ margin: '18px 0 0', maxWidth: '52ch', fontSize: 16, lineHeight: 1.7, color: '#A29889' }}>I'm currently open to freelance projects and full-time opportunities. Let's build something users love.</p>
              <div data-rv="1" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 14, flexWrap: 'wrap', marginTop: 32 }}>
                <a href="https://mail.google.com/mail/?view=cm&fs=1&to=asfabatoolansari21@gmail.com" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', background: 'linear-gradient(135deg,#FF8A3D 0%,#EA5E14 48%,#C74208 100%)', color: '#FFF7F0', fontWeight: 600, fontSize: 15, borderRadius: 999, padding: '15px 32px', whiteSpace: 'nowrap', textShadow: '0 1px 2px rgba(0,0,0,0.25)', boxShadow: '0 10px 28px rgba(240,102,30,0.35), inset 0 1px 0 rgba(255,255,255,0.28)' }}>Send me an email →</a>
                <a href="https://www.figma.com/proto/hPNcs8X2E1l0MjTf1GCYSL/Asfa-Resume?node-id=0-1&t=nbNOlV1Wodj2r5k5-1" target="_blank" rel="noopener noreferrer" style={{ display: 'inline-block', color: '#F5F1EA', fontWeight: 500, fontSize: 15, border: '1px solid rgba(255,255,255,0.16)', background: 'rgba(255,255,255,0.06)', borderRadius: 999, padding: '14px 30px', whiteSpace: 'nowrap', boxShadow: '0 8px 24px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.08)' }}>View Resume ↗</a>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* ---------- POST-INTRO FIXED NAV ---------- */}
      <nav id="pageNav" aria-label="Primary" style={{ position: 'fixed', left: 'clamp(12px,3vw,32px)', top: 14, right: 'clamp(12px,3vw,32px)', zIndex: 40, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, padding: '13px clamp(16px,2.5vw,26px)', boxSizing: 'border-box', borderRadius: 999, opacity: 0, visibility: 'hidden', pointerEvents: 'none' }}>
        <a href="#hero" style={{ display: 'flex', alignItems: 'center', flex: '0 0 auto' }}><img src="/assets/logo.png" alt="AB — Asfa Batool Ansari" style={{ height: 30, width: 'auto', display: 'block' }} /></a>
        <div id="pnLinks" style={{ display: 'flex', alignItems: 'center', gap: 26, fontSize: 14, fontWeight: 500 }}>
          <a data-sec="hero" href="#hero" style={{ color: '#A29889' }}>Home</a>
          <a data-sec="about" href="#about" style={{ color: '#A29889' }}>About</a>
          <a data-sec="services" href="#services" style={{ color: '#A29889' }}>Services</a>
          <Link to="/projects" style={{ color: '#A29889' }}>UI/UX</Link>
          <Link to="/vibe-code" style={{ color: '#A29889' }}>Vibe Code</Link>
          <Link to="/designs" style={{ color: '#A29889' }}>Designs</Link>
          <Link to="/contact" style={{ color: '#A29889' }}>Contact</Link>
        </div>
        <Link id="pnCta" className="nav-cta-desktop" to="/contact" style={{ color: '#F0661E', border: '1px solid rgba(240,102,30,0.55)', borderRadius: 999, padding: '9px 22px', fontSize: 14, whiteSpace: 'nowrap', flex: '0 0 auto', transition: 'background .25s ease,color .25s ease,transform .25s ease,box-shadow .25s ease' }}>Let's talk</Link>
        <MobileNavTrigger open={mobileNavOpen} onClick={() => setMobileNavOpen((o) => !o)} />
        <MobileNavPanel open={mobileNavOpen}>
          <a data-sec="hero" href="#hero" onClick={() => setMobileNavOpen(false)} style={{ display: 'block', color: '#A29889', fontSize: 15, padding: '14px 16px', borderRadius: 12 }}>Home</a>
          <a data-sec="about" href="#about" onClick={() => setMobileNavOpen(false)} style={{ display: 'block', color: '#A29889', fontSize: 15, padding: '14px 16px', borderRadius: 12 }}>About</a>
          <a data-sec="services" href="#services" onClick={() => setMobileNavOpen(false)} style={{ display: 'block', color: '#A29889', fontSize: 15, padding: '14px 16px', borderRadius: 12 }}>Services</a>
          <Link to="/projects" onClick={() => setMobileNavOpen(false)} style={{ display: 'block', color: '#A29889', fontSize: 15, padding: '14px 16px', borderRadius: 12 }}>UI/UX</Link>
          <Link to="/vibe-code" onClick={() => setMobileNavOpen(false)} style={{ display: 'block', color: '#A29889', fontSize: 15, padding: '14px 16px', borderRadius: 12 }}>Vibe Code</Link>
          <Link to="/designs" onClick={() => setMobileNavOpen(false)} style={{ display: 'block', color: '#A29889', fontSize: 15, padding: '14px 16px', borderRadius: 12 }}>Designs</Link>
          <Link to="/contact" onClick={() => setMobileNavOpen(false)} style={{ display: 'block', color: '#A29889', fontSize: 15, padding: '14px 16px', borderRadius: 12 }}>Contact</Link>
          <Link to="/contact" onClick={() => setMobileNavOpen(false)} style={{ display: 'block', textAlign: 'center', color: '#F0661E', border: '1px solid rgba(240,102,30,0.55)', borderRadius: 999, padding: '13px 22px', fontSize: 14, marginTop: 8 }}>Let's talk</Link>
        </MobileNavPanel>
      </nav>

      {/* ---------- INTRO OVERLAY STAGE ---------- */}
      <div id="stage" aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 50, pointerEvents: 'none', background: '#0C0B0A' }}>
        <div id="grid" style={{ position: 'absolute', inset: 0, opacity: 0, backgroundImage: 'radial-gradient(rgba(255,255,255,0.13) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />
        <div id="lgS" style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div id="lgGlow" style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(240,102,30,0.22), transparent 62%)', filter: 'blur(30px)', opacity: 0 }} />
          <div id="lgWrap" style={{ position: 'relative', display: 'inline-block' }}>
            <img id="lg" src="/assets/logo.png" alt="" style={{ width: 132, height: 'auto', display: 'block', position: 'relative' }} />
            <div id="lgPen" style={{ position: 'absolute', top: 0, left: 0, width: 7, height: 7, borderRadius: '50%', background: '#FFCBA4', boxShadow: '0 0 10px 3px rgba(240,102,30,0.9),0 0 22px 6px rgba(240,102,30,0.45)', opacity: 0, pointerEvents: 'none', transform: 'translate(-50%,-50%)' }} />
          </div>
        </div>
        <div id="tb" style={{ position: 'absolute', left: '50%', bottom: 28, transform: 'translateX(-50%)', display: 'flex', gap: 6, padding: 8, background: '#1B1917', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, boxShadow: '0 14px 40px rgba(0,0,0,0.5)', opacity: 0 }}>
          <div id="tb1" style={{ width: 42, height: 42, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#F0661E', color: '#12100E' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M5 3 L12 19.5 L13.9 13.2 L20 11 Z"></path></svg></div>
          <div id="tb2" style={{ width: 42, height: 42, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#D8D2C8' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M7.5 3v18M16.5 3v18M3 7.5h18M3 16.5h18"></path></svg></div>
          <div id="tb3" style={{ width: 42, height: 42, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#D8D2C8' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6"><rect x="4" y="5.5" width="16" height="13" rx="1.5"></rect></svg></div>
          <div id="tb4" style={{ width: 42, height: 42, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#D8D2C8' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M5 6h14M12 6v13"></path></svg></div>
          <div id="tb5" style={{ width: 42, height: 42, borderRadius: 9, display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'transparent', color: '#D8D2C8' }}><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"><path d="M20 11a8 8 0 1 0-14.9 4.2L4 20l5-1.2A8 8 0 0 0 20 11z"></path></svg></div>
        </div>
        <div id="cur" style={{ position: 'absolute', left: 0, top: 0, opacity: 0, filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.45))' }}>
          <svg width="26" height="26" viewBox="0 0 24 24"><path d="M4 3 L11.5 20.5 L13.6 13.6 L20.5 11.5 Z" fill="#FFFFFF" stroke="#12100E" strokeWidth="1.2" strokeLinejoin="round"></path></svg>
          <div id="curTag" style={{ position: 'absolute', left: 16, top: 22, background: '#F0661E', color: '#12100E', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, fontWeight: 500, padding: '3px 8px', borderRadius: '4px 10px 10px 10px', whiteSpace: 'nowrap' }}>Asfa</div>
          <div id="dims" style={{ position: 'absolute', left: 14, top: 46, background: '#1B1917', border: '1px solid rgba(240,102,30,0.5)', color: '#F0661E', fontFamily: "'JetBrains Mono',monospace", fontSize: 10, padding: '3px 7px', borderRadius: 4, whiteSpace: 'nowrap', opacity: 0 }}>0 × 0</div>
        </div>
        <canvas id="sparkCv" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }} />
        <button id="skipBtn" style={{ position: 'absolute', right: 22, bottom: 24, pointerEvents: 'auto', background: 'rgba(27,25,23,0.7)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: 999, color: '#A29889', fontFamily: "'JetBrains Mono',monospace", fontSize: 11, letterSpacing: '0.12em', padding: '9px 18px', cursor: 'pointer', opacity: 0 }}>SKIP INTRO →</button>
      </div>
    </div>
  );
}
