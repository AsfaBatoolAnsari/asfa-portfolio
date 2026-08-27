import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { Hoverable } from '../components/Hoverable';
import { sx } from '../lib/sx';
import { projects, findProject, adjacent } from '../data/portfolio';
import './ProjectDetail.css';

export default function ProjectDetail() {
  const { slug } = useParams();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const p = findProject(slug) || findProject('happy-present');
  const { prev, next } = adjacent(projects, p ? p.slug : '');

  return (
    <div style={sx('position:relative;min-height:100vh;background:#0C0B0A;overflow-x:clip')}>
      <BackgroundBlobs />
      <Nav active="projects" />
      <main style={sx('position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:clamp(120px,20vh,180px) clamp(16px,4vw,32px) 40px;box-sizing:border-box')}>
        <Hoverable as={Link} data-up="1" to="/projects" base="display:inline-flex;align-items:center;gap:8px;font-size:13.5px;color:#A29889;white-space:nowrap" hoverCss="color:#F0661E">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
          Back to projects
        </Hoverable>

        {!p && (
          <>
            <h1 style={sx("margin-top:40px;font-family:'Sora',sans-serif;font-weight:700;font-size:32px")}>Project not found</h1>
            <p style={sx('margin-top:12px;color:#A29889')}>This project doesn't exist. <Link to="/projects" style={{ color: '#F0661E' }}>Back to all projects</Link>.</p>
          </>
        )}

        {p && p.type === 'public' && (
          <>
            <div data-up="1" className="pd-eyebrow" style={{ marginTop: 26 }}>{p.category.toUpperCase()}</div>
            <h1 data-up="1" className="pd-title">{p.title}</h1>
            <p data-up="1" className="pd-lead">{p.overview || p.summary}</p>
            <div data-up="1" id="pdByline">
              <div className="by-item"><span className="by-k">ROLE</span><span className="by-v">{p.role || '—'}</span></div>
              <div className="by-sep"></div>
              <div className="by-item"><span className="by-k">YEAR</span><span className="by-v">{p.year || '—'}</span></div>
              <div className="by-sep"></div>
              <div className="by-item"><span className="by-k">TIMELINE</span><span className="by-v">{p.timeline || '—'}</span></div>
              <div className="by-sep"></div>
              <div className="by-item"><span className="by-k">CATEGORY</span><span className="by-v">{p.category}</span></div>
            </div>
            {(p.behance || p.github) && (
              <div data-up="1" style={sx('display:flex;flex-wrap:wrap;gap:12px;margin-top:22px')}>
                {p.behance && (
                  <Hoverable as="a" href={p.behance} target="_blank" rel="noreferrer" base="display:inline-flex;align-items:center;gap:10px;background:linear-gradient(135deg,#FF8A3D 0%,#EA5E14 48%,#C74208 100%);color:#FFF7F0;font-weight:600;border-radius:999px;padding:13px 24px;font-size:14px;text-shadow:0 1px 2px rgba(0,0,0,0.25);box-shadow:0 10px 26px rgba(240,102,30,0.35), inset 0 1px 0 rgba(255,255,255,0.28)" hoverCss="transform:translateY(-2px);box-shadow:0 14px 32px rgba(240,102,30,0.45), inset 0 1px 0 rgba(255,255,255,0.32);color:#FFFFFF">
                    <span style={sx("display:inline-flex;align-items:center;justify-content:center;width:22px;height:22px;border-radius:50%;background:rgba(0,0,0,0.18);font-family:'Sora',sans-serif;font-weight:700;font-size:12px;line-height:1")}>Bē</span>
                    View on Behance
                  </Hoverable>
                )}
                {p.github && (
                  <Hoverable as="a" href={p.github} target="_blank" rel="noreferrer" base="display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.16);background:rgba(255,255,255,0.05);border-radius:999px;padding:11px 20px;font-size:13.5px;font-weight:500;color:#F5F1EA" hoverCss="border-color:rgba(240,102,30,0.55);color:#F0661E">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-3.16 19.5c.5.1.68-.22.68-.48v-1.7c-2.78.6-3.37-1.34-3.37-1.34-.45-1.16-1.11-1.47-1.11-1.47-.9-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.9 1.53 2.34 1.09 2.91.83.09-.65.35-1.09.63-1.34-2.22-.25-4.56-1.11-4.56-4.95 0-1.1.39-2 1.03-2.7-.1-.25-.45-1.28.1-2.66 0 0 .84-.27 2.75 1.02a9.4 9.4 0 0 1 5 0c1.9-1.3 2.75-1.02 2.75-1.02.55 1.38.2 2.41.1 2.66.64.7 1.03 1.6 1.03 2.7 0 3.85-2.34 4.7-4.57 4.94.36.31.68.92.68 1.85v2.75c0 .26.18.58.69.48A10 10 0 0 0 12 2Z"></path></svg>
                    View on GitHub
                  </Hoverable>
                )}
              </div>
            )}
            <div data-up="1" id="pdHero">
              <div className="glow" aria-hidden="true"></div>
              <div className="frame"><image-slot id={`pd-hero-${p.slug}`} src={p.hero || p.image} shape="rect" placeholder="Paste image URL here"></image-slot></div>
            </div>
            <div id="caseGrid">
              <aside id="caseAside" data-up="1">
                <div className="pd-kicker">CASE STUDY</div>
                <h2 style={{ ...sx("margin:12px 0 0;font-family:'Sora',sans-serif;font-weight:600;line-height:1.12;letter-spacing:-0.02em"), fontSize: 'clamp(23px,2.8vw,31px)' }}>The story behind the design.</h2>
                <p style={sx('margin:14px 0 0;font-size:14.5px;line-height:1.7;color:#A29889')}>{p.caseIntro || `A short walkthrough of the thinking behind ${p.title} — from the core problem through to the shipped solution.`}</p>
                <div style={sx("margin-top:24px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;color:#F0661E")}>TOOLKIT</div>
                <div style={sx('display:flex;flex-wrap:wrap;gap:9px;margin-top:14px')}>
                  {(p.tools || []).map((t) => (
                    <span key={t} style={sx("border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 15px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.08em;color:#C9C0B4")}>{t}</span>
                  ))}
                </div>
              </aside>
              <div className="story" data-up="1">
                <div className="step"><div className="stepNum">01</div><div><div className="step-label">CHALLENGE</div><h3 className="step-title">The problem to solve</h3><p className="step-p">{p.challenge}</p></div></div>
                <div className="step"><div className="stepNum">02</div><div><div className="step-label">PROCESS</div><h3 className="step-title">How I approached it</h3><p className="step-p">{p.process}</p></div></div>
                <div className="step"><div className="stepNum">03</div><div><div className="step-label">SOLUTION</div><h3 className="step-title">What I designed</h3><p className="step-p">{p.solution}</p></div></div>
                <div className="step"><div className="stepNum">04</div><div><div className="step-label">OUTCOME</div><h3 className="step-title">The result</h3><p className="step-p">{p.outcome}</p></div></div>
              </div>
            </div>
            <div id="pdGal" data-up="1">
              {(p.gallery || []).map((g, i) => (
                <div key={g} className="gal-cell"><image-slot id={`pd-${p.slug}-${i}`} src={g} shape="rect" placeholder="Paste image URL here"></image-slot></div>
              ))}
            </div>
          </>
        )}

        {p && p.type === 'nda' && (
          <>
            <div data-up="1" style={sx("display:inline-flex;align-items:center;gap:8px;margin:26px 0 0 16px;border:1px solid rgba(240,102,30,0.45);background:rgba(240,102,30,0.12);border-radius:999px;padding:7px 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;color:#F0661E")}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
              CONFIDENTIAL · NDA
            </div>
            <h1 data-up="1" className="pd-title" style={{ marginTop: 16 }}>{p.title}</h1>
            <p data-up="1" className="pd-lead">{p.overview}</p>
            <div data-up="1" id="pdByline">
              <div className="by-item"><span className="by-k">INDUSTRY</span><span className="by-v">{p.industry || '—'}</span></div>
              <div className="by-sep"></div>
              <div className="by-item"><span className="by-k">ROLE</span><span className="by-v">{p.role || '—'}</span></div>
              <div className="by-sep"></div>
              <div className="by-item"><span className="by-k">TIMELINE</span><span className="by-v">{p.timeline || '—'}</span></div>
              <div className="by-sep"></div>
              <div className="by-item"><span className="by-k">TYPE</span><span className="by-v">{p.category}</span></div>
            </div>
            <div data-up="1" id="pdHero">
              <div className="glow" aria-hidden="true"></div>
              <div className="frame" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', gap: 16, padding: '40px 24px' }}>
                <div className="nda-dots" aria-hidden="true"></div>
                <div className="nda-shimmer" aria-hidden="true"></div>
                <div className="nda-corner tl" aria-hidden="true"></div>
                <div className="nda-corner tr" aria-hidden="true"></div>
                <div className="nda-corner bl" aria-hidden="true"></div>
                <div className="nda-corner br" aria-hidden="true"></div>
                <div className="nda-lockWrap">
                  <div className="nda-ring" aria-hidden="true"></div>
                  <div className="nda-ring r2" aria-hidden="true"></div>
                  <span style={sx('position:relative;width:66px;height:66px;border-radius:19px;display:flex;align-items:center;justify-content:center;background:rgba(240,102,30,0.12);border:1px solid rgba(240,102,30,0.4);color:#F0661E')}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
                  </span>
                </div>
                <div style={{ position: 'relative', fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(18px,2.4vw,24px)', letterSpacing: '-0.01em' }}>Visuals protected under NDA</div>
                <p style={{ position: 'relative', margin: 0, maxWidth: '46ch', fontSize: 14, lineHeight: 1.6, color: '#A29889' }}>The full case study and screens can be shared privately during an interview or portfolio review.</p>
              </div>
            </div>
            <div id="caseGrid">
              <aside id="caseAside" data-up="1">
                <div className="pd-kicker">CONFIDENTIAL</div>
                <h2 style={{ ...sx("margin:12px 0 0;font-family:'Sora',sans-serif;font-weight:600;line-height:1.12;letter-spacing:-0.02em"), fontSize: 'clamp(23px,2.8vw,31px)' }}>A look under the hood.</h2>
                <p style={sx('margin:14px 0 0;font-size:14.5px;line-height:1.7;color:#A29889')}>{p.caseIntro || `What I can share about ${p.title} — the objective, my role and how the work came together, without breaking confidentiality.`}</p>
                <div style={sx("margin-top:24px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;color:#F0661E")}>TOOLKIT</div>
                <div style={sx('display:flex;flex-wrap:wrap;gap:9px;margin-top:14px')}>
                  {(p.tools || []).map((t) => (
                    <span key={t} style={sx("border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 15px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.08em;color:#C9C0B4")}>{t}</span>
                  ))}
                </div>
              </aside>
              <div style={{ minWidth: 0 }}>
                <div className="story" data-up="1">
                  <div className="step"><div className="stepNum">01</div><div><div className="step-label">OBJECTIVE</div><h3 className="step-title">What we set out to do</h3><p className="step-p">{p.problem}</p></div></div>
                  <div className="step"><div className="stepNum">02</div><div><div className="step-label">RESPONSIBILITIES</div><h3 className="step-title">My role on the project</h3><p className="step-p">{p.responsibilities}</p></div></div>
                  <div className="step"><div className="stepNum">03</div><div><div className="step-label">PROCESS</div><h3 className="step-title">How it came together</h3><p className="step-p">{p.processNote}</p></div></div>
                </div>
                <div className="glass" data-up="1" style={{ marginTop: 30, padding: 26 }}>
                  <div style={sx("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;color:#F0661E")}>KEY CONTRIBUTIONS</div>
                  <div style={sx('display:flex;flex-direction:column;gap:12px;margin-top:16px')}>
                    {(p.contributions || []).map((c) => (
                      <div key={c} style={sx('display:flex;align-items:flex-start;gap:12px')}>
                        <span style={sx('width:7px;height:7px;border-radius:50%;background:#F0661E;box-shadow:0 0 10px rgba(240,102,30,0.7);margin-top:7px;flex:0 0 auto')}></span>
                        <span style={sx('font-size:14.5px;line-height:1.6;color:#C9C0B4')}>{c}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            <div className="glass" data-up="1" style={{ marginTop: 'clamp(40px,6vw,64px)', padding: '24px 26px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 16 }}>
              <div style={sx('display:flex;align-items:center;gap:14px;min-width:0')}>
                <span style={sx('width:44px;height:44px;border-radius:13px;display:flex;align-items:center;justify-content:center;background:rgba(240,102,30,0.12);border:1px solid rgba(240,102,30,0.4);color:#F0661E;flex:0 0 auto')}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
                </span>
                <div style={sx('min-width:0')}>
                  <div style={sx("font-family:'Sora',sans-serif;font-weight:600;font-size:15px")}>Want to see this project?</div>
                  <div style={sx('margin-top:3px;font-size:13px;color:#A29889')}>Full visuals are available privately on request.</div>
                </div>
              </div>
              <Hoverable as={Link} to="/contact" base="display:inline-flex;align-items:center;gap:9px;background:#F0661E;color:#FFF7F0;font-weight:600;font-size:14px;border-radius:999px;padding:12px 22px;white-space:nowrap" hoverCss="background:#FF7A2E;color:#FFF7F0">
                Request access<span aria-hidden="true">→</span>
              </Hoverable>
            </div>
          </>
        )}

        {p && (
          <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:56px;padding-top:26px;border-top:1px solid rgba(255,255,255,0.08)')}>
            {prev ? (
              <Hoverable as={Link} to={`/projects/${prev.slug}`} base="display:inline-flex;flex-direction:column;gap:4px" hoverCss="color:#F0661E">
                <span style={sx("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.16em;color:#6E665C")}>← PREVIOUS</span>
                <span style={sx("font-family:'Sora',sans-serif;font-weight:600;font-size:15px")}>{prev.title}</span>
              </Hoverable>
            ) : <span></span>}
            {next && (
              <Hoverable as={Link} to={`/projects/${next.slug}`} base="display:inline-flex;flex-direction:column;gap:4px;text-align:right;margin-left:auto" hoverCss="color:#F0661E">
                <span style={sx("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.16em;color:#6E665C")}>NEXT →</span>
                <span style={sx("font-family:'Sora',sans-serif;font-weight:600;font-size:15px")}>{next.title}</span>
              </Hoverable>
            )}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
