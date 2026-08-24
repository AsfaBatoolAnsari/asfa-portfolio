import { useEffect } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { Hoverable } from '../components/Hoverable';
import { sx } from '../lib/sx';
import './VibeCode.css';

const FEATURES = [
  {
    title: 'AI-assisted builds',
    desc: 'Working with tools like Claude, ChatGPT, Gemini and Lovable to turn ideas into functional products, fast.',
    icon: <><path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1"></path><circle cx="12" cy="12" r="3.2"></circle></>,
  },
  {
    title: 'Real, working prototypes',
    desc: 'Not just mockups — interactive builds you can click through, test, and actually use.',
    icon: <><rect x="4" y="3.5" width="16" height="17" rx="2.5"></rect><path d="M8 8h8M8 12h8M8 16h5"></path></>,
  },
  {
    title: 'Design-to-code, seamlessly',
    desc: 'The same eye for UI/UX carried straight through into the final, shipped experience.',
    icon: <><path d="M9 6 3 12l6 6"></path><path d="M15 6l6 6-6 6"></path></>,
  },
];

export default function VibeCode() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={sx('position:relative;min-height:100vh;background:#0C0B0A;overflow-x:clip')}>
      <BackgroundBlobs />
      <Nav active="vibe-code" ctaLabel="Get in touch" ctaHref="/contact" variant="plain" />

      <main style={sx('position:relative;z-index:1;max-width:1000px;margin:0 auto;padding:clamp(130px,22vh,190px) clamp(16px,4vw,32px) 40px;box-sizing:border-box')}>
        <div style={sx('display:flex;flex-direction:column;align-items:center;text-align:center')}>
          <div data-up="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
            <span style={sx('width:6px;height:6px;border-radius:50%;background:#F0661E;box-shadow:0 0 10px rgba(240,102,30,0.9)')}></span>
            VIBE CODE
          </div>

          <h1 data-up="1" style={sx("margin:22px 0 0;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(34px,5.4vw,60px);line-height:1.08;letter-spacing:-0.025em;max-width:16ch")}>
            Where design meets <span style={{ color: '#F0661E' }}>code.</span>
          </h1>
          <p data-up="1" style={sx('margin:18px 0 0;max-width:52ch;font-size:16px;line-height:1.7;color:#A29889')}>
            I'm building a new kind of work here — AI-assisted, code-driven projects that go beyond design files into real, working products. This space is currently in progress.
          </p>

          <div data-up="1" id="vcStatus" className="glass" style={sx('position:relative;margin-top:44px;display:inline-flex;align-items:center;gap:14px;padding:16px 26px;border-radius:999px')}>
            <span aria-hidden="true" style={sx('position:relative;display:inline-flex;flex:0 0 auto;width:11px;height:11px')}>
              <span style={sx('position:absolute;inset:0;border-radius:50%;background:#F0661E')}></span>
              <span id="vcPulse" style={sx('position:absolute;inset:-4px;border-radius:50%;background:rgba(240,102,30,0.35)')}></span>
            </span>
            <span style={sx("font-family:'JetBrains Mono',monospace;font-size:11.5px;letter-spacing:0.08em;color:#E7E0D6")}>Coming soon — in active development</span>
          </div>
        </div>

        <div id="vcFeatGrid" style={sx('margin-top:clamp(56px,8vw,84px)')}>
          {FEATURES.map((f) => (
            <div key={f.title} data-up="1" className="glass" style={{ padding: 'clamp(24px,3vw,30px)' }}>
              <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:14px;background:linear-gradient(135deg,rgba(255,138,64,0.95),rgba(199,66,8,0.95));border:1px solid rgba(255,255,255,0.25);box-shadow:0 8px 22px rgba(240,102,30,0.35),inset 0 1px 0 rgba(255,255,255,0.35);color:#FFF7F0')}>
                <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{f.icon}</svg>
              </span>
              <h3 style={sx("margin:20px 0 0;font-family:'Sora',sans-serif;font-weight:600;font-size:17px;letter-spacing:-0.01em")}>{f.title}</h3>
              <p style={sx('margin:10px 0 0;font-size:14px;line-height:1.65;color:#A29889')}>{f.desc}</p>
            </div>
          ))}
        </div>

        <div data-up="1" id="vcCta" style={sx('position:relative;margin-top:clamp(56px,8vw,84px);border-radius:24px;border:1px solid rgba(240,102,30,0.28);background:linear-gradient(155deg,rgba(240,102,30,0.14),rgba(240,102,30,0.04));padding:clamp(32px,5vw,48px);text-align:center;overflow:hidden')}>
          <div aria-hidden="true" style={sx('position:absolute;left:50%;top:-40%;transform:translateX(-50%);width:60%;height:90%;border-radius:50%;background:radial-gradient(circle,rgba(240,102,30,0.16),transparent 65%);filter:blur(40px);pointer-events:none')}></div>
          <h2 style={{ ...sx("position:relative;margin:0;font-family:'Sora',sans-serif;font-weight:600;letter-spacing:-0.01em"), fontSize: 'clamp(21px,2.6vw,28px)' }}>
            Want to be the first to know?
          </h2>
          <p style={sx('position:relative;margin:12px auto 0;max-width:44ch;font-size:14.5px;line-height:1.7;color:#A29889')}>
            Reach out and I'll let you know the moment the first vibe-coded projects go live.
          </p>
          <div style={sx('position:relative;display:flex;align-items:center;justify-content:center;gap:14px;flex-wrap:wrap;margin-top:26px')}>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=asfabatoolansari21@gmail.com" target="_blank" rel="noopener noreferrer" style={sx('display:inline-block;background:linear-gradient(135deg,#FF8A3D 0%,#EA5E14 48%,#C74208 100%);color:#FFF7F0;font-weight:600;font-size:15px;border-radius:999px;padding:15px 32px;white-space:nowrap;text-shadow:0 1px 2px rgba(0,0,0,0.25);box-shadow:0 10px 28px rgba(240,102,30,0.35),inset 0 1px 0 rgba(255,255,255,0.28)')}>
              Email me →
            </a>
            <Hoverable as="a" href="https://wa.me/923193131393" target="_blank" rel="noreferrer" base="display:inline-block;color:#F5F1EA;font-weight:500;font-size:15px;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.06);border-radius:999px;padding:14px 30px;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,0.25),inset 0 1px 0 rgba(255,255,255,0.08)" hoverCss="border-color:rgba(240,102,30,0.55);color:#F0661E">
              WhatsApp me ↗
            </Hoverable>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
