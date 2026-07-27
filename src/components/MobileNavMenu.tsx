import type { CSSProperties, ReactNode } from 'react';

interface MobileNavTriggerProps {
  open: boolean;
  onClick: () => void;
}

/** Premium mobile menu trigger — a small glass pill with a glowing dot,
 * echoing the "chip" motif already used elsewhere in the design (hero eyebrow,
 * process labels) instead of a generic hamburger square. Hidden on desktop via
 * the `.nav-trigger` media query in global.css. */
export function MobileNavTrigger({ open, onClick }: MobileNavTriggerProps) {
  return (
    <button
      type="button"
      className="nav-trigger"
      aria-label={open ? 'Close menu' : 'Open menu'}
      aria-expanded={open}
      onClick={onClick}
      style={{
        alignItems: 'center',
        gap: 8,
        border: '1px solid ' + (open ? 'rgba(240,102,30,0.55)' : 'rgba(255,255,255,0.14)'),
        background: open ? 'rgba(240,102,30,0.12)' : 'rgba(255,255,255,0.05)',
        borderRadius: 999,
        padding: '11px 16px',
        fontFamily: "'JetBrains Mono',monospace",
        fontSize: 10.5,
        letterSpacing: '0.18em',
        color: open ? '#F0661E' : '#C9C0B4',
        cursor: 'pointer',
        flex: '0 0 auto',
        WebkitTapHighlightColor: 'transparent',
        transition: 'border-color .25s ease, color .25s ease, background .25s ease',
      } as CSSProperties}
    >
      <span
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: '#F0661E',
          boxShadow: '0 0 10px rgba(240,102,30,0.9)',
          flex: '0 0 auto',
          display: 'inline-block',
          marginRight: 8,
        }}
      />
      {open ? 'CLOSE' : 'MENU'}
    </button>
  );
}

interface MobileNavPanelProps {
  open: boolean;
  children: ReactNode;
}

/** Dropdown panel anchored to the nav pill (a positioned ancestor), reusing the
 * same glass/blur/border/shadow language as the desktop navbar's scrolled state. */
export function MobileNavPanel({ open, children }: MobileNavPanelProps) {
  return (
    <div
      className="nav-panel"
      data-open={open ? '1' : '0'}
      aria-hidden={!open}
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 'calc(100% + 10px)',
        borderRadius: 20,
        border: '1px solid rgba(255,255,255,0.1)',
        background: 'linear-gradient(160deg,rgba(40,32,26,0.94),rgba(18,15,13,0.96))',
        backdropFilter: 'blur(20px) saturate(1.3)',
        WebkitBackdropFilter: 'blur(20px) saturate(1.3)',
        boxShadow: '0 20px 50px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
        padding: 10,
        boxSizing: 'border-box',
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        transformOrigin: 'top center',
        opacity: open ? 1 : 0,
        visibility: open ? 'visible' : 'hidden',
        transform: open ? 'translateY(0) scale(1)' : 'translateY(-8px) scale(0.98)',
        pointerEvents: open ? 'auto' : 'none',
        transition: 'opacity .3s cubic-bezier(.2,.7,.25,1), transform .3s cubic-bezier(.2,.7,.25,1), visibility .3s',
      } as CSSProperties}
    >
      {children}
    </div>
  );
}
