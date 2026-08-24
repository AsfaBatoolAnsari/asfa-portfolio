import { useEffect, useState, type CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { Hoverable } from './Hoverable';
import { MobileNavPanel, MobileNavTrigger } from './MobileNavMenu';
import { sx } from '../lib/sx';

type Section = 'home' | 'about' | 'services' | 'projects' | 'designs' | 'vibe-code' | 'contact';

interface NavProps {
  active: Section;
  ctaLabel?: string;
  ctaHref?: string;
  /** Contact's scrolled-nav background is a warmer gradient than the other inner pages. */
  variant?: 'plain' | 'warm';
}

const LINK_BASE = 'color:#A29889';
const LINK_HOVER = 'color:#F0661E';
const ACTIVE = sx('color:#F0661E');

const MOBILE_LINK_BASE = 'display:block;color:#A29889;font-size:15px;padding:14px 16px;border-radius:12px';
const MOBILE_LINK_HOVER = 'color:#F0661E;background:rgba(255,255,255,0.05)';

const NAV_ITEMS: { label: string; to: string; section: Section }[] = [
  { label: 'Home', to: '/', section: 'home' },
  { label: 'About', to: '/#about', section: 'about' },
  { label: 'Services', to: '/#services', section: 'services' },
  { label: 'UI/UX', to: '/projects', section: 'projects' },
  { label: 'Vibe Code', to: '/vibe-code', section: 'vibe-code' },
  { label: 'Designs', to: '/designs', section: 'designs' },
  { label: 'Contact', to: '/contact', section: 'contact' },
];

/** Shared fixed top nav used by every page except Home (Home has its own
 * hero-overlay + post-intro nav pair driven by the intro timeline). */
export function Nav({ active, ctaLabel = "Let's talk", ctaHref = '/contact', variant = 'plain' }: NavProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => { if (window.innerWidth > 779) setMobileOpen(false); };
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const scrolledStyle: CSSProperties = scrolled
    ? variant === 'warm'
      ? {
          background: 'linear-gradient(160deg,rgba(40,32,26,0.42),rgba(18,15,13,0.34))',
          borderColor: 'rgba(255,255,255,0.14)',
          boxShadow: '0 14px 40px rgba(0,0,0,0.42), inset 0 1px 0 rgba(255,255,255,0.14), inset 0 -1px 0 rgba(0,0,0,0.25)',
          backdropFilter: 'blur(22px) saturate(1.5)',
          WebkitBackdropFilter: 'blur(22px) saturate(1.5)' as any,
        }
      : {
          background: 'rgba(18,15,13,0.55)',
          borderColor: 'rgba(255,255,255,0.08)',
          boxShadow: '0 12px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.05)',
          backdropFilter: 'blur(16px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(16px) saturate(1.2)' as any,
        }
    : {};

  return (
    <nav
      aria-label="Primary"
      data-scrolled={scrolled ? '1' : '0'}
      style={{
        ...sx('position:fixed;left:clamp(12px,3vw,32px);top:14px;right:clamp(12px,3vw,32px);z-index:40;display:flex;align-items:center;justify-content:space-between;gap:24px;padding:13px clamp(16px,2.5vw,26px);box-sizing:border-box;border-radius:999px'),
        border: '1px solid transparent',
        transition: 'background .35s ease, box-shadow .35s ease, border-color .35s ease',
        ...scrolledStyle,
      }}
    >
      <Link to="/" style={sx('display:flex;align-items:center;flex:0 0 auto')}>
        <img src="/assets/logo.png" alt="AB — Asfa Batool Ansari" style={{ height: 30, width: 'auto', display: 'block' }} />
      </Link>
      <div className="nav-links">
        <Hoverable as={Link} to="/" base={LINK_BASE} hoverCss={LINK_HOVER} style={active === 'home' ? ACTIVE : undefined}>Home</Hoverable>
        <Hoverable as={Link} to="/#about" base={LINK_BASE} hoverCss={LINK_HOVER} style={active === 'about' ? ACTIVE : undefined}>About</Hoverable>
        <Hoverable as={Link} to="/#services" base={LINK_BASE} hoverCss={LINK_HOVER} style={active === 'services' ? ACTIVE : undefined}>Services</Hoverable>
        <Hoverable as={Link} to="/projects" base={LINK_BASE} hoverCss={LINK_HOVER} style={active === 'projects' ? ACTIVE : undefined}>UI/UX</Hoverable>
        <Hoverable as={Link} to="/vibe-code" base={LINK_BASE} hoverCss={LINK_HOVER} style={active === 'vibe-code' ? ACTIVE : undefined}>Vibe Code</Hoverable>
        <Hoverable as={Link} to="/designs" base={LINK_BASE} hoverCss={LINK_HOVER} style={active === 'designs' ? ACTIVE : undefined}>Designs</Hoverable>
        <Hoverable as={Link} to="/contact" base={LINK_BASE} hoverCss={LINK_HOVER} style={active === 'contact' ? ACTIVE : undefined}>Contact</Hoverable>
      </div>
      <Hoverable
        as={ctaHref.startsWith('mailto:') ? 'a' : Link}
        {...(ctaHref.startsWith('mailto:') ? { href: ctaHref } : { to: ctaHref })}
        className="nav-cta-desktop"
        base="color:#F0661E;border:1px solid rgba(240,102,30,0.55);border-radius:999px;padding:9px 22px;font-size:14px;white-space:nowrap;flex:0 0 auto"
        hoverCss="background:rgba(240,102,30,0.12)"
      >
        {ctaLabel}
      </Hoverable>
      <MobileNavTrigger open={mobileOpen} onClick={() => setMobileOpen((o) => !o)} />
      <MobileNavPanel open={mobileOpen}>
        {NAV_ITEMS.map((item) => (
          <Hoverable
            key={item.section}
            as={Link}
            to={item.to}
            base={MOBILE_LINK_BASE}
            hoverCss={MOBILE_LINK_HOVER}
            style={active === item.section ? ACTIVE : undefined}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Hoverable>
        ))}
        <Hoverable
          as={ctaHref.startsWith('mailto:') ? 'a' : Link}
          {...(ctaHref.startsWith('mailto:') ? { href: ctaHref } : { to: ctaHref })}
          base="display:block;text-align:center;color:#F0661E;border:1px solid rgba(240,102,30,0.55);border-radius:999px;padding:13px 22px;font-size:14px;margin-top:8px"
          hoverCss="background:rgba(240,102,30,0.12)"
          onClick={() => setMobileOpen(false)}
        >
          {ctaLabel}
        </Hoverable>
      </MobileNavPanel>
    </nav>
  );
}
