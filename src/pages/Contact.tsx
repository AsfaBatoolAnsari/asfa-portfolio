import { useEffect } from 'react';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { Hoverable } from '../components/Hoverable';
import { sx } from '../lib/sx';
import './Contact.css';

export default function Contact() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={sx('position:relative;min-height:100vh;background:#0C0B0A;overflow-x:clip')}>
      <BackgroundBlobs />
      <Nav active="contact" ctaLabel="Email me" ctaHref="mailto:asfabatoolansari21@gmail.com" variant="warm" />
      <main style={sx('position:relative;z-index:1;max-width:1120px;margin:0 auto;padding:clamp(120px,20vh,180px) clamp(16px,4vw,32px) 40px;box-sizing:border-box')}>
        <div data-up="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
          <span style={sx('width:6px;height:6px;border-radius:50%;background:#F0661E;box-shadow:0 0 10px rgba(240,102,30,0.9)')}></span>
          GET IN TOUCH
        </div>
        <h1 data-up="1" style={sx("margin:20px 0 0;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(34px,5vw,60px);line-height:1.08;letter-spacing:-0.025em;max-width:16ch")}>
          Let's build something <span style={{ color: '#F0661E' }}>together.</span>
        </h1>
        <p data-up="1" style={sx('margin:18px 0 0;max-width:56ch;font-size:16px;line-height:1.7;color:#A29889')}>
          Have a project in mind or just want to say hello? Reach me through any of these — I'll get back to you within a day.
        </p>

        <div id="quickRow" style={sx('margin-top:clamp(36px,5vw,52px)')}>
          <Hoverable as="a" data-up="1" href="tel:03153131393" className="glass" base="display:block;padding:22px" hoverCss="color:#F5F1EA">
            <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,rgba(255,138,64,0.95),rgba(199,66,8,0.95));border:1px solid rgba(255,255,255,0.22);box-shadow:0 8px 22px rgba(240,102,30,0.32),inset 0 1px 0 rgba(255,255,255,0.3);color:#FFF7F0')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 5c0 8.28 6.72 15 15 15l1.5-3.5-4-1.5-1.8 1.8a12 12 0 0 1-5.5-5.5l1.8-1.8-1.5-4L6 4C4.9 4 4 4.9 4 5Z"></path></svg>
            </span>
            <div style={sx("margin-top:16px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.18em;color:#8B8172")}>CALL ME</div>
            <div style={sx('margin-top:7px;font-size:15px;font-weight:500;color:#F5F1EA;word-break:break-word')}>031-53131393</div>
            <div style={sx("margin-top:14px;font-size:13px;font-weight:500;color:#F0661E")}>Give me a call →</div>
          </Hoverable>
          <Hoverable as="a" data-up="1" href="mailto:asfabatoolansari21@gmail.com" className="glass" base="display:block;padding:22px" hoverCss="color:#F5F1EA">
            <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,rgba(255,138,64,0.95),rgba(199,66,8,0.95));border:1px solid rgba(255,255,255,0.22);box-shadow:0 8px 22px rgba(240,102,30,0.32),inset 0 1px 0 rgba(255,255,255,0.3);color:#FFF7F0')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="3" y="5" width="18" height="14" rx="2.5"></rect><path d="m4 7 8 6 8-6"></path></svg>
            </span>
            <div style={sx("margin-top:16px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.18em;color:#8B8172")}>EMAIL ME</div>
            <div style={sx('margin-top:7px;font-size:15px;font-weight:500;color:#F5F1EA;word-break:break-word')}>asfabatoolansari21@gmail.com</div>
            <div style={sx("margin-top:14px;font-size:13px;font-weight:500;color:#F0661E")}>Drop a mail →</div>
          </Hoverable>
          <Hoverable as="a" data-up="1" href="#" target="_blank" rel="noreferrer" className="glass" base="display:block;padding:22px" hoverCss="color:#F5F1EA">
            <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:46px;height:46px;border-radius:13px;background:linear-gradient(135deg,rgba(255,138,64,0.95),rgba(199,66,8,0.95));border:1px solid rgba(255,255,255,0.22);box-shadow:0 8px 22px rgba(240,102,30,0.32),inset 0 1px 0 rgba(255,255,255,0.3);color:#FFF7F0')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z"></path></svg>
            </span>
            <div style={sx("margin-top:16px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.18em;color:#8B8172")}>LINKEDIN</div>
            <div style={sx('margin-top:7px;font-size:15px;font-weight:500;color:#F5F1EA;word-break:break-word')}>Asfa Batool Ansari</div>
            <div style={sx("margin-top:14px;font-size:13px;font-weight:500;color:#F0661E")}>Connect with me →</div>
          </Hoverable>
        </div>

        <div id="cGrid">
          <div data-up="1" style={{ ...sx('position:relative;border-radius:22px;border:1px solid rgba(255,255,255,0.08);background:linear-gradient(165deg,rgba(26,21,18,0.96),rgba(15,12,10,0.97));box-shadow:0 24px 60px rgba(0,0,0,0.5),inset 0 1px 0 rgba(255,255,255,0.06);overflow:hidden'), padding: 'clamp(26px,3.2vw,36px)' }}>
            <div aria-hidden="true" style={sx('position:absolute;left:-10%;top:-30%;width:60%;height:70%;background:radial-gradient(circle,rgba(240,102,30,0.14),transparent 62%);filter:blur(30px);pointer-events:none')}></div>
            <h2 style={{ ...sx("position:relative;margin:0;font-family:'Sora',sans-serif;font-weight:600;letter-spacing:-0.01em"), fontSize: 'clamp(20px,2.4vw,26px)' }}>Contact information</h2>
            <p style={sx('position:relative;margin:10px 0 0;font-size:14px;line-height:1.6;color:#A29889')}>Prefer a direct line? Here's where to find me — pick whatever's easiest.</p>
            <div style={sx('position:relative;display:flex;flex-direction:column;gap:12px;margin-top:22px')}>
              <div style={sx('display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 16px')}>
                <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:11px;background:rgba(240,102,30,0.12);border:1px solid rgba(240,102,30,0.38);color:#F0661E;flex:0 0 auto')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 21s7-5.3 7-11a7 7 0 1 0-14 0c0 5.7 7 11 7 11Z"></path><circle cx="12" cy="10" r="2.5"></circle></svg>
                </span>
                <span style={sx('min-width:0')}>
                  <span style={sx("display:block;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.16em;color:#6E665C")}>LOCATION</span>
                  <span style={sx('display:block;margin-top:3px;font-size:14px;color:#E7E0D6')}>Karachi, Pakistan</span>
                </span>
              </div>
              <div style={sx('display:flex;align-items:center;gap:14px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:14px 16px')}>
                <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:38px;height:38px;border-radius:11px;background:rgba(240,102,30,0.12);border:1px solid rgba(240,102,30,0.38);color:#F0661E;flex:0 0 auto')}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"></circle><path d="M12 7v5l3 2"></path></svg>
                </span>
                <span style={sx('min-width:0')}>
                  <span style={sx("display:block;font-family:'JetBrains Mono',monospace;font-size:9px;letter-spacing:0.16em;color:#6E665C")}>RESPONSE TIME</span>
                  <span style={sx('display:block;margin-top:3px;font-size:14px;color:#E7E0D6')}>Within 24 hours</span>
                </span>
              </div>
            </div>
            <div style={sx("position:relative;margin-top:26px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.2em;color:#6E665C")}>FOLLOW ME</div>
            <div style={sx('position:relative;display:flex;gap:10px;margin-top:14px')}>
              <Hoverable as="a" href="#" target="_blank" rel="noreferrer" aria-label="LinkedIn" base="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:11px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);color:#C9C0B4" hoverCss="border-color:rgba(240,102,30,0.6);color:#F0661E">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z"></path></svg>
              </Hoverable>
              <Hoverable as="a" href="#" target="_blank" rel="noreferrer" aria-label="Instagram" base="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:11px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);color:#C9C0B4" hoverCss="border-color:rgba(240,102,30,0.6);color:#F0661E">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"></circle></svg>
              </Hoverable>
              <Hoverable as="a" href="#" target="_blank" rel="noreferrer" aria-label="Behance" base="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:11px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);color:#C9C0B4" hoverCss="border-color:rgba(240,102,30,0.6);color:#F0661E">
                <span style={sx("font-family:'Sora',sans-serif;font-weight:700;font-size:13px;line-height:1")}>Bē</span>
              </Hoverable>
              <Hoverable as="a" href="#" target="_blank" rel="noreferrer" aria-label="Figma" base="display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:11px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);color:#C9C0B4" hoverCss="border-color:rgba(240,102,30,0.6);color:#F0661E">
                <span style={sx("font-family:'Sora',sans-serif;font-weight:700;font-size:13px;line-height:1")}>Fig</span>
              </Hoverable>
            </div>
            <div style={sx('position:relative;display:flex;align-items:center;gap:14px;margin-top:24px;padding:16px 18px;border-radius:14px;background:linear-gradient(155deg,rgba(240,102,30,0.14),rgba(240,102,30,0.05));border:1px solid rgba(240,102,30,0.28)')}>
              <span style={sx('position:relative;display:inline-flex;flex:0 0 auto;width:11px;height:11px')}>
                <span style={sx('position:absolute;inset:0;border-radius:50%;background:#3FCF6B')}></span>
                <span style={sx('position:absolute;inset:-4px;border-radius:50%;background:rgba(63,207,107,0.35)')}></span>
              </span>
              <div style={sx('min-width:0')}>
                <div style={sx("font-family:'Sora',sans-serif;font-weight:600;font-size:14.5px;color:#F5F1EA")}>Available for new projects</div>
                <div style={sx('margin-top:3px;font-size:12.5px;color:#A29889')}>Currently taking freelance &amp; full-time work for Q3 2026.</div>
              </div>
            </div>
          </div>

          <div data-up="1" className="glass" style={{ padding: 'clamp(26px,3.2vw,36px)' }}>
            <h2 style={{ ...sx("margin:0;font-family:'Sora',sans-serif;font-weight:600;letter-spacing:-0.01em"), fontSize: 'clamp(20px,2.4vw,26px)' }}>
              Prefer to talk <span style={{ color: '#F0661E' }}>directly?</span>
            </h2>
            <p style={sx('margin:10px 0 0;font-size:14px;line-height:1.6;color:#A29889')}>Reach out on WhatsApp and let's start the conversation — I'll get back to you within a day.</p>
            <Hoverable
              as="a"
              href="https://wa.me/923153131393"
              target="_blank"
              rel="noreferrer"
              base="display:flex;align-items:center;gap:14px;margin-top:22px;background:linear-gradient(135deg,#FF8A3D,#EA5E14 48%,#C74208);color:#FFF7F0;border-radius:16px;padding:16px 20px;box-shadow:0 12px 30px rgba(240,102,30,0.32),inset 0 1px 0 rgba(255,255,255,0.28)"
              hoverCss="color:#FFFFFF"
            >
              <span style={sx('display:inline-flex;align-items:center;justify-content:center;width:40px;height:40px;border-radius:12px;background:rgba(0,0,0,0.18);flex:0 0 auto')}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.5 15.2L2 22l4.9-1.3A10 10 0 1 0 12 2Zm5.3 14.1c-.2.6-1.2 1.1-1.7 1.2-.4.1-1 .1-1.6-.1-.4-.1-.9-.3-1.5-.6-2.6-1.1-4.3-3.8-4.4-4-.1-.2-1-1.4-1-2.6s.6-1.8.9-2.1c.2-.2.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.7 1.7c.1.2.1.4 0 .5l-.3.5c-.1.2-.3.3-.1.6.1.2.6 1 1.3 1.6.9.8 1.6 1 1.8 1.1.2.1.4.1.5-.1l.6-.7c.2-.2.3-.2.6-.1l1.6.8c.2.1.4.2.5.3.1.3.1.6-.1 1.1Z"></path></svg>
              </span>
              <span style={sx('flex:1;min-width:0')}>
                <span style={sx('display:block;font-weight:600;font-size:15px')}>Message me on WhatsApp</span>
                <span style={sx('display:block;margin-top:2px;font-size:12px;color:rgba(255,247,240,0.8)')}>Fastest way to reach me</span>
              </span>
              <span aria-hidden="true" style={sx('font-size:18px')}>→</span>
            </Hoverable>
            <div style={sx("margin-top:26px;font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.2em;color:#F0661E")}>WHAT HAPPENS NEXT</div>
            <div style={sx('display:flex;flex-direction:column;gap:16px;margin-top:16px')}>
              <div style={sx('display:flex;gap:14px')}>
                <span style={sx("display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:rgba(240,102,30,0.14);border:1px solid rgba(240,102,30,0.5);color:#F0661E;font-family:'JetBrains Mono',monospace;font-size:12px;flex:0 0 auto")}>1</span>
                <div style={sx('min-width:0')}>
                  <div style={sx("font-family:'Sora',sans-serif;font-weight:600;font-size:14.5px")}>You reach out</div>
                  <div style={sx('margin-top:4px;font-size:13px;line-height:1.55;color:#A29889')}>Send a quick note about your project, goals and timeline.</div>
                </div>
              </div>
              <div style={sx('display:flex;gap:14px')}>
                <span style={sx("display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:rgba(240,102,30,0.14);border:1px solid rgba(240,102,30,0.5);color:#F0661E;font-family:'JetBrains Mono',monospace;font-size:12px;flex:0 0 auto")}>2</span>
                <div style={sx('min-width:0')}>
                  <div style={sx("font-family:'Sora',sans-serif;font-weight:600;font-size:14.5px")}>We talk it through</div>
                  <div style={sx('margin-top:4px;font-size:13px;line-height:1.55;color:#A29889')}>A short call to align on scope, deliverables and budget.</div>
                </div>
              </div>
              <div style={sx('display:flex;gap:14px')}>
                <span style={sx("display:inline-flex;align-items:center;justify-content:center;width:26px;height:26px;border-radius:50%;background:rgba(240,102,30,0.14);border:1px solid rgba(240,102,30,0.5);color:#F0661E;font-family:'JetBrains Mono',monospace;font-size:12px;flex:0 0 auto")}>3</span>
                <div style={sx('min-width:0')}>
                  <div style={sx("font-family:'Sora',sans-serif;font-weight:600;font-size:14.5px")}>I start designing</div>
                  <div style={sx('margin-top:4px;font-size:13px;line-height:1.55;color:#A29889')}>You get a clear plan and first designs in days, not weeks.</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
