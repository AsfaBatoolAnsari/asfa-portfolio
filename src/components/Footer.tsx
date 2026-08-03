import { Link } from 'react-router-dom';
import { Hoverable } from './Hoverable';
import { sx } from '../lib/sx';

const socialIconStyle = 'display:inline-flex;align-items:center;justify-content:center;width:100%;aspect-ratio:1;border-radius:50%;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);color:#C9C0B4';
const socialIconHover = 'border-color:rgba(240,102,30,0.6);color:#F0661E';

export function Footer() {
  return (
    <footer
      id="siteFooter"
      style={sx('position:relative;overflow:hidden;border-top:1px solid rgba(255,255,255,0.08);padding:clamp(70px,10vh,120px) clamp(20px,4vw,48px) 40px;margin-top:0')}
    >
      <div aria-hidden="true" style={sx('position:absolute;inset:0;pointer-events:none;opacity:0.55')}>
        <grainient-bg color1="#ab6636" color2="#2e1809" color3="#682c03" time-speed="0.25" warp-amplitude="50" rotation-amount="500" contrast="1.35" zoom="0.9"></grainient-bg>
      </div>
      <div aria-hidden="true" style={{ ...sx('position:absolute;inset:0;pointer-events:none;opacity:0.7'), mixBlendMode: 'screen' }}>
        <light-rays rays-origin="top-center" rays-color="#aa4600" rays-speed="1" light-spread="0.5" ray-length="3" follow-mouse="1" mouse-influence="0.1" noise-amount="0" distortion="0" pulsating="0" fade-distance="1" saturation="1"></light-rays>
      </div>
      <div aria-hidden="true" style={sx('position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(12,11,10,0.82),rgba(12,11,10,0.72))')}></div>
      <div style={sx('position:relative;max-width:1180px;margin:0 auto')}>
        <div style={sx('display:flex;align-items:flex-end;justify-content:space-between;gap:20px 32px;flex-wrap:wrap')}>
          <h2 style={sx("margin:0;font-family:'Sora',sans-serif;font-weight:600;font-size:clamp(34px,5vw,64px);line-height:1.05;letter-spacing:-0.025em")}>
            Let's <span style={{ color: '#F0661E' }}>connect.</span>
          </h2>
          <Hoverable
            as={Link}
            to="/contact"
            base="display:inline-flex;align-items:center;gap:12px;background:linear-gradient(135deg,#FF8A3D 0%,#EA5E14 48%,#C74208 100%);color:#FFF7F0;font-weight:600;font-size:15px;border-radius:999px;padding:13px 12px 13px 26px;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,0.25);box-shadow:0 10px 28px rgba(240,102,30,0.35), inset 0 1px 0 rgba(255,255,255,0.28);transition:transform .3s cubic-bezier(.2,.7,.25,1),box-shadow .3s ease,filter .3s ease"
            hoverCss="transform:translateY(-3px);box-shadow:0 18px 40px rgba(240,102,30,0.5), inset 0 1px 0 rgba(255,255,255,0.32);filter:brightness(1.06);color:#FFFFFF"
          >
            Get in touch
            <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:32px;height:32px;border-radius:50%;background:rgba(0,0,0,0.18)')}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 L17 7M9 7h8v8"></path></svg>
            </span>
          </Hoverable>
        </div>
        <div aria-hidden="true" style={sx('height:1px;background:rgba(255,255,255,0.1);margin:clamp(36px,5vw,56px) 0')}></div>
        <div id="ftGrid">
          <div style={sx('min-width:0')}>
            <img src="/assets/logo.png" alt="AB — Asfa Batool Ansari" style={{ height: 34, width: 'auto', display: 'block' }} />
            <div style={sx("margin-top:16px;font-family:'Sora',sans-serif;font-weight:600;font-size:19px;letter-spacing:-0.01em")}>Asfa Batool Ansari</div>
            <p style={sx('margin:12px 0 0;max-width:38ch;font-size:14.5px;line-height:1.7;color:#A29889')}>
              Thank you for visiting my portfolio. I'm dedicated to crafting seamless digital experiences that captivate and engage. Let's turn your ideas into reality.
            </p>
            <div style={sx('display:grid;grid-template-columns:repeat(9,minmax(0,1fr));gap:8px;margin-top:22px;max-width:396px')}>
              <Hoverable as="a" href="https://www.linkedin.com/in/asfa-batool-ansari/" target="_blank" rel="noreferrer" aria-label="LinkedIn" base={socialIconStyle} hoverCss={socialIconHover}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z"></path></svg>
              </Hoverable>
              <Hoverable as="a" href="https://www.instagram.com/asfabatoolansari?igsh=NTlreDJ3cDdndzBr" target="_blank" rel="noreferrer" aria-label="Instagram" base={socialIconStyle} hoverCss={socialIconHover}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"></circle></svg>
              </Hoverable>
              <Hoverable as="a" href="https://www.figma.com/@asfabatool" target="_blank" rel="noreferrer" aria-label="Figma" base={socialIconStyle} hoverCss={socialIconHover}>
                <span style={sx("font-family:'Sora',sans-serif;font-weight:700;font-size:12px;line-height:1")}>Fig</span>
              </Hoverable>
              <Hoverable as="a" href="https://www.behance.net/asfabatoolansari" target="_blank" rel="noreferrer" aria-label="Behance" base={socialIconStyle} hoverCss={socialIconHover}>
                <span style={sx("font-family:'Sora',sans-serif;font-weight:700;font-size:12px;line-height:1")}>Bē</span>
              </Hoverable>
              <Hoverable as="a" href="https://www.tiktok.com/@asfabatoolansari11" target="_blank" rel="noreferrer" aria-label="TikTok" base={socialIconStyle} hoverCss={socialIconHover}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M15.5 4c.4 2.1 1.7 3.4 3.7 3.6v2.7c-1.3 0-2.5-.4-3.6-1.1v5.3a5 5 0 1 1-5-5c.3 0 .5 0 .8.1v2.8a2.2 2.2 0 1 0 1.5 2.1V4h2.6Z"></path></svg>
              </Hoverable>
              <Hoverable as="a" href="https://www.facebook.com/share/1D4TnfU6yb/" target="_blank" rel="noreferrer" aria-label="Facebook" base={socialIconStyle} hoverCss={socialIconHover}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13.5 21v-7h2.3l.4-3h-2.7V9c0-.9.3-1.5 1.6-1.5H16V4.8C15.7 4.8 14.7 4.7 13.6 4.7c-2.3 0-3.9 1.4-3.9 4V11H7.3v3h2.4v7h3.8Z"></path></svg>
              </Hoverable>
              <Hoverable as="a" href="https://wa.me/923193131393" target="_blank" rel="noreferrer" aria-label="WhatsApp" base={socialIconStyle} hoverCss={socialIconHover}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2.1.4 0 .5l-.3.5c-.1.2-.3.3-.1.6.1.2.6 1 1.3 1.6.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.2.1.4.2.5.3.1.3.1.6-.1 1.1Z"></path></svg>
              </Hoverable>
              <Hoverable as="a" href="https://mail.google.com/mail/?view=cm&fs=1&to=asfabatoolansari21@gmail.com" target="_blank" rel="noopener noreferrer" aria-label="Gmail" base={socialIconStyle} hoverCss={socialIconHover}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="m4 7 8 6 8-6"></path></svg>
              </Hoverable>
              <Hoverable as="a" href="https://youtube.com/@asfabatoolansari9021?si=GuXb2jPOcEnYEqP4" target="_blank" rel="noreferrer" aria-label="YouTube" base={socialIconStyle} hoverCss={socialIconHover}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.8-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6a2.9 2.9 0 0 0 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.4a2.9 2.9 0 0 0 2-2C23 15.8 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z"></path></svg>
              </Hoverable>
            </div>
          </div>
          <div style={sx('min-width:0')}>
            <div style={sx("font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.25em;color:#F0661E")}>NAVIGATION</div>
            <div style={sx('display:flex;flex-direction:column;gap:12px;margin-top:20px;font-size:14.5px')}>
              <Hoverable as={Link} to="/" base="color:#C9C0B4" hoverCss="color:#F0661E">Home</Hoverable>
              <Hoverable as={Link} to="/#about" base="color:#C9C0B4" hoverCss="color:#F0661E">About me</Hoverable>
              <Hoverable as={Link} to="/#services" base="color:#C9C0B4" hoverCss="color:#F0661E">Service</Hoverable>
              <Hoverable as={Link} to="/projects" base="color:#C9C0B4" hoverCss="color:#F0661E">Project</Hoverable>
              <Hoverable as={Link} to="/designs" base="color:#C9C0B4" hoverCss="color:#F0661E">Designs</Hoverable>
            </div>
          </div>
          <div style={sx('min-width:0')}>
            <div style={sx("font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.25em;color:#F0661E")}>CONTACT</div>
            <div style={sx('display:flex;flex-direction:column;gap:16px;margin-top:20px')}>
              <Hoverable as="a" href="tel:03193131393" base="display:flex;align-items:center;gap:12px;color:#C9C0B4;font-size:14.5px" hoverCss="color:#F0661E">
                <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:#F0661E;flex:0 0 auto')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5c0 8.28 6.72 15 15 15l1.5-3.5-4-1.5-1.8 1.8a12 12 0 0 1-5.5-5.5l1.8-1.8-1.5-4L6 4C4.9 4 4 4.9 4 5Z"></path></svg>
                </span>
                <span>031-93131393</span>
              </Hoverable>
              <Hoverable as="a" href="https://mail.google.com/mail/?view=cm&fs=1&to=asfabatoolansari21@gmail.com" target="_blank" rel="noopener noreferrer" base="display:flex;align-items:center;gap:12px;color:#C9C0B4;font-size:14.5px" hoverCss="color:#F0661E">
                <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:#F0661E;flex:0 0 auto')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="m4 7 8 6 8-6"></path></svg>
                </span>
                <span>asfabatoolansari21@gmail.com</span>
              </Hoverable>
              <div style={sx('display:flex;align-items:center;gap:12px;color:#C9C0B4;font-size:14.5px')}>
                <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:10px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);color:#F0661E;flex:0 0 auto')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>
                </span>
                <span>Karachi, Pakistan</span>
              </div>
            </div>
          </div>
        </div>
        <div aria-hidden="true" style={sx('height:1px;background:rgba(255,255,255,0.1);margin:clamp(36px,5vw,52px) 0 22px')}></div>
        <div style={sx("display:flex;align-items:center;justify-content:center;text-align:center;gap:12px 20px;flex-wrap:wrap;font-family:'JetBrains Mono',monospace;font-size:11px;letter-spacing:0.1em;color:#6E665C")}>
          <span>Copyright © 2026 Asfa Batool. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
