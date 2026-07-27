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
            <div data-up="1" id="pdHero">
              <div className="glow" aria-hidden="true"></div>
              <div className="frame"><image-slot id={`pd-hero-${p.slug}`} shape="rect" placeholder={`Drop the ${p.title} hero image`}></image-slot></div>
            </div>
            <div id="caseGrid">
              <aside id="caseAside" data-up="1">
                <div className="pd-kicker">CASE STUDY</div>
                <h2 style={{ ...sx("margin:12px 0 0;font-family:'Sora',sans-serif;font-weight:600;line-height:1.12;letter-spacing:-0.02em"), fontSize: 'clamp(23px,2.8vw,31px)' }}>The story behind the design.</h2>
                <p style={sx('margin:14px 0 0;font-size:14.5px;line-height:1.7;color:#A29889')}>A short walkthrough of the thinking behind {p.title} — from the core problem through to the shipped solution.</p>
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
              {(p.gallery || []).map((g) => (
                <div key={g} className="gal-cell"><image-slot id={`pd-${p.slug}-${g}`} shape="rect" placeholder="Gallery image"></image-slot></div>
              ))}
            </div>
          </>
        )}

        {p && p.type === 'nda' && (
          <>
            <div data-up="1" style={sx("display:inline-flex;align-items:center;gap:8px;margin-top:26px;border:1px solid rgba(240,102,30,0.45);background:rgba(240,102,30,0.12);border-radius:999px;padding:7px 14px;font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.14em;color:#F0661E")}>
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
                <span style={sx('width:66px;height:66px;border-radius:19px;display:flex;align-items:center;justify-content:center;background:rgba(240,102,30,0.12);border:1px solid rgba(240,102,30,0.4);color:#F0661E')}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" aria-hidden="true"><rect x="5" y="11" width="14" height="9" rx="2"></rect><path d="M8 11V8a4 4 0 0 1 8 0v3"></path></svg>
                </span>
                <div style={{ fontFamily: "'Sora',sans-serif", fontWeight: 600, fontSize: 'clamp(18px,2.4vw,24px)', letterSpacing: '-0.01em' }}>Visuals protected under NDA</div>
                <p style={{ margin: 0, maxWidth: '46ch', fontSize: 14, lineHeight: 1.6, color: '#A29889' }}>The full case study and screens can be shared privately during an interview or portfolio review.</p>
              </div>
            </div>
            <div id="caseGrid">
              <aside id="caseAside" data-up="1">
                <div className="pd-kicker">CONFIDENTIAL</div>
                <h2 style={{ ...sx("margin:12px 0 0;font-family:'Sora',sans-serif;font-weight:600;line-height:1.12;letter-spacing:-0.02em"), fontSize: 'clamp(23px,2.8vw,31px)' }}>A look under the hood.</h2>
                <p style={sx('margin:14px 0 0;font-size:14.5px;line-height:1.7;color:#A29889')}>What I can share about {p.title} — the objective, my role and how the work came together, without breaking confidentiality.</p>
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
              <Hoverable as={Link} to="/contact" base="display:inline-flex;align-items:center;gap:9px;background:#F0661E;color:#12100E;font-weight:600;font-size:14px;border-radius:999px;padding:12px 22px;white-space:nowrap" hoverCss="background:#FF7A2E;color:#12100E">
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
