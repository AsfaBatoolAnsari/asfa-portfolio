import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { sx } from '../lib/sx';
import { projects } from '../data/portfolio';
import './Projects.css';

const mapProject = (p: (typeof projects)[number]) => ({
  slug: p.slug,
  title: p.title,
  summary: p.summary || p.overview || '',
  year: p.year || p.timeline || '',
  catUpper: p.category.toUpperCase(),
  tags: (p.tools || []).slice(0, 4),
});

export default function Projects() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  const pub = projects.filter((p) => p.type === 'public' && p.slug !== 'fitpulse-tracker').map(mapProject);
  const featured = pub[0] || null;
  const restList = pub.slice(1);
  const ndaList = projects.filter((p) => p.type === 'nda').map(mapProject);

  return (
    <div style={sx('position:relative;min-height:100vh;background:#0C0B0A;overflow-x:clip')}>
      <div aria-hidden="true" style={{ position: 'fixed', inset: 0, zIndex: 0, overflow: 'hidden', pointerEvents: 'none' }}>
        <div style={{ position: 'absolute', left: '-12vw', top: '-18vh', width: '58vw', height: '58vw', borderRadius: '50%', background: 'radial-gradient(circle at 40% 40%, rgba(240,102,30,0.12), transparent 65%)', filter: 'blur(70px)', animation: 'drift1 26s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', right: '-16vw', top: '26vh', width: '52vw', height: '52vw', borderRadius: '50%', background: 'radial-gradient(circle at 55% 45%, rgba(255,138,64,0.06), transparent 62%)', filter: 'blur(80px)', animation: 'drift2 32s ease-in-out infinite alternate' }} />
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 30%, transparent 45%, rgba(6,5,4,0.7) 100%)' }} />
      </div>
      <Nav active="projects" />
      <main style={sx('position:relative;z-index:1;max-width:1180px;margin:0 auto;padding:clamp(120px,20vh,180px) clamp(16px,4vw,32px) 40px;box-sizing:border-box')}>
        <div style={sx('display:flex;flex-direction:column;align-items:flex-start;text-align:left')}>
          <div data-up="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
            <span style={sx('width:6px;height:6px;border-radius:50%;background:#F0661E;box-shadow:0 0 10px rgba(240,102,30,0.9)')}></span>
            SELECTED WORK
          </div>
          <h1 data-up="1" style={sx("margin:20px 0 0;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(34px,5vw,60px);line-height:1.08;letter-spacing:-0.025em")}>
            Featured <span style={{ color: '#F0661E' }}>projects.</span>
          </h1>
          <p data-up="1" style={sx('margin:18px 0 0;max-width:56ch;font-size:16px;line-height:1.7;color:#A29889')}>
            A selection of shipped products across mobile, web and dashboards. Tap any card for the full case study.
          </p>
        </div>

        {featured && (
          <Link data-proj="1" data-feat="1" to={`/projects/${featured.slug}`} style={{ display: 'block', marginTop: 'clamp(36px,5vw,52px)' }}>
            <div id="featWrap">
              <div data-pmedia="1" style={sx('position:relative;border-radius:16px;overflow:hidden;background:linear-gradient(160deg,#2C2620,#1C1815)')}>
                <image-slot id={`proj-list-${featured.slug}`} shape="rect" placeholder={`Drop the ${featured.title} preview`}></image-slot>
              </div>
              <div style={{ minWidth: 0, padding: 'clamp(8px,2vw,22px) clamp(8px,1.5vw,18px)' }}>
                <div style={sx("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.22em;color:#F0661E")}>{featured.catUpper} · {featured.year}</div>
                <h2 style={sx("margin:12px 0 0;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(26px,3.2vw,38px);line-height:1.08;letter-spacing:-0.02em")}>{featured.title}</h2>
                <p style={sx('margin:14px 0 0;max-width:46ch;font-size:15px;line-height:1.65;color:#A29889')}>{featured.summary}</p>
                <div style={sx('display:flex;flex-wrap:wrap;gap:9px;margin-top:20px')}>
                  {featured.tags.map((tg) => (
                    <span key={tg} style={sx("border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:7px 14px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.06em;color:#C9C0B4")}>{tg}</span>
                  ))}
                </div>
                <span data-vlink="1" style={sx('display:inline-flex;align-items:center;gap:8px;margin-top:24px;font-size:14px;font-weight:600;color:#F0661E')}>
                  View project <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 L17 7M9 7h8v8"></path></svg>
                </span>
              </div>
            </div>
          </Link>
        )}

        <div id="pGrid" style={{ marginTop: 22 }}>
          {restList.map((p) => (
            <Link key={p.slug} data-proj="1" to={`/projects/${p.slug}`} style={{ display: 'block' }}>
              <div data-pmedia="1" style={sx('position:relative;aspect-ratio:4/3;border-radius:14px;overflow:hidden;background:linear-gradient(160deg,#2C2620,#1C1815)')}>
                <image-slot id={`proj-list-${p.slug}`} shape="rect" placeholder={`Drop the ${p.title} preview`}></image-slot>
              </div>
              <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 8px 8px')}>
                <div style={sx('min-width:0')}>
                  <div style={sx("font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.22em;color:#F0661E")}>{p.catUpper} · {p.year}</div>
                  <div style={sx("margin-top:6px;font-family:'Sora',sans-serif;font-weight:600;font-size:17.5px;letter-spacing:-0.01em")}>{p.title}</div>
                  <div style={sx('margin-top:6px;font-size:13px;line-height:1.55;color:#A29889')}>{p.summary}</div>
                </div>
                <span data-arrow="1" style={sx('display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.05);color:#F5F1EA;flex:0 0 auto')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 L17 7M9 7h8v8"></path></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', marginTop: 'clamp(70px,10vh,120px)' }}>
          <div data-up="1" style={sx("display:inline-flex;align-items:center;gap:8px;border:1px solid rgba(240,102,30,0.4);background:rgba(240,102,30,0.1);border-radius:999px;padding:8px 16px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.18em;color:#F0661E")}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
            CONFIDENTIAL
          </div>
          <h2 data-up="1" style={sx("margin:18px 0 0;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(28px,4vw,48px);line-height:1.1;letter-spacing:-0.025em")}>
            Under <span style={{ color: '#F0661E' }}>NDA.</span>
          </h2>
          <p data-up="1" style={sx('margin:16px 0 0;max-width:56ch;font-size:16px;line-height:1.7;color:#A29889')}>
            Client work I can't show publicly. The full story, screens and results are available privately on request.
          </p>
        </div>
        <div id="ndaGrid" style={{ marginTop: 'clamp(32px,5vw,48px)' }}>
          {ndaList.map((p) => (
            <Link key={p.slug} data-proj="1" to={`/projects/${p.slug}`} style={{ display: 'block' }}>
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
              <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:14px;padding:16px 8px 8px')}>
                <div style={sx('min-width:0')}>
                  <div style={sx("font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.22em;color:#F0661E")}>{p.catUpper} · CONFIDENTIAL</div>
                  <div style={sx("margin-top:6px;font-family:'Sora',sans-serif;font-weight:600;font-size:17.5px;letter-spacing:-0.01em")}>{p.title}</div>
                  <div style={sx('margin-top:6px;font-size:13px;line-height:1.55;color:#A29889')}>{p.summary}</div>
                </div>
                <span data-arrow="1" style={sx('display:inline-flex;align-items:center;justify-content:center;width:36px;height:36px;border-radius:50%;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.05);color:#F5F1EA;flex:0 0 auto')}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M7 17 L17 7M9 7h8v8"></path></svg>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
