import { useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { Hoverable } from '../components/Hoverable';
import { sx } from '../lib/sx';
import { designs, findDesign, adjacent } from '../data/portfolio';
import './DesignDetail.css';

export default function DesignDetail() {
  const { slug } = useParams();
  useEffect(() => { window.scrollTo(0, 0); }, [slug]);

  const d = findDesign(slug) || designs[0];
  const { prev, next } = adjacent(designs, d ? d.slug : '');

  return (
    <div style={sx('position:relative;min-height:100vh;background:#0C0B0A;overflow-x:clip')}>
      <BackgroundBlobs />
      <Nav active="designs" />
      <main style={sx('position:relative;z-index:1;max-width:1080px;margin:0 auto;padding:clamp(120px,20vh,180px) clamp(16px,4vw,32px) 40px;box-sizing:border-box')}>
        <Hoverable as={Link} data-up="1" to="/designs" base="display:inline-flex;align-items:center;gap:8px;font-size:13.5px;color:#A29889" hoverCss="color:#F0661E">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6"></path></svg>
          Back to designs
        </Hoverable>

        {!d ? (
          <>
            <h1 style={sx("margin-top:40px;font-family:'Sora',sans-serif;font-weight:700;font-size:32px")}>Design not found</h1>
            <p style={sx('margin-top:12px;color:#A29889')}><Link to="/designs" style={{ color: '#F0661E' }}>Back to all designs</Link>.</p>
          </>
        ) : (
          <>
            <div data-up="1" style={sx("margin-top:26px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#F0661E")}>{d.category.toUpperCase()}</div>
            <h1 data-up="1" style={sx("margin:14px 0 0;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(32px,4.6vw,54px);line-height:1.08;letter-spacing:-0.025em")}>{d.title}</h1>
            <p data-up="1" style={sx('margin:18px 0 0;max-width:60ch;font-size:16.5px;line-height:1.7;color:#A29889')}>{d.description}</p>
            <div data-up="1" style={sx('margin-top:28px;aspect-ratio:16/10;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);background:linear-gradient(160deg,#2C2620,#1C1815)')}>
              <image-slot id={`dd-hero-${d.slug}`} src={d.image} shape="rect" placeholder="Paste image URL here"></image-slot>
            </div>
            <div id="dMeta" style={sx('margin-top:36px')}>
              <div className="glass" style={{ padding: 26 }}>
                <div style={sx("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;color:#F0661E")}>CREATIVE CONCEPT</div>
                <p style={sx('margin:12px 0 0;font-size:15px;line-height:1.7;color:#C9C0B4')}>{d.notes}</p>
              </div>
              <div className="glass" style={{ padding: 26 }}>
                <div style={sx("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;color:#F0661E")}>TOOLS</div>
                <div style={sx('display:flex;flex-wrap:wrap;gap:9px;margin-top:16px')}>
                  {(d.tools || []).map((t) => (
                    <span key={t} style={sx("border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:7px 14px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.1em;color:#C9C0B4")}>{t}</span>
                  ))}
                </div>
              </div>
            </div>
            <div className="glass" data-up="1" style={{ marginTop: 36, padding: 'clamp(26px,3.5vw,40px)' }}>
              <div style={sx("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.2em;color:#F0661E")}>SEE IT LIVE</div>
              <h2 style={{ ...sx("margin:12px 0 0;font-family:'Sora',sans-serif;font-weight:600;letter-spacing:-0.01em"), fontSize: 'clamp(20px,2.4vw,26px)' }}>{d.liveHeading || 'Watch this design in action'}</h2>
              <p style={sx('margin:10px 0 0;max-width:54ch;font-size:14.5px;line-height:1.65;color:#A29889')}>{d.liveNote || 'Full walkthroughs, interactions and process clips live on my channels — tap to view the complete design.'}</p>
              <div style={sx('display:flex;flex-wrap:wrap;gap:12px;margin-top:22px')}>
                {d.links && d.links.figma && (
                  <Hoverable as="a" href={d.links.figma} target="_blank" rel="noreferrer" base="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:11px 20px;font-size:14px;font-weight:500;color:#F5F1EA" hoverCss="border-color:rgba(240,102,30,0.6);color:#F0661E">
                    <span style={sx("font-family:'Sora',sans-serif;font-weight:700;font-size:13px;line-height:1")}>Fig</span>
                    Figma<span aria-hidden="true" style={{ color: '#F0661E' }}>↗</span>
                  </Hoverable>
                )}
                {(!d.links || d.links.linkedin) && (
                  <Hoverable as="a" href={d.links ? d.links.linkedin : '#'} target="_blank" rel="noreferrer" base="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:11px 20px;font-size:14px;font-weight:500;color:#F5F1EA" hoverCss="border-color:rgba(240,102,30,0.6);color:#F0661E">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 5 8.5a2.5 2.5 0 0 1-.02-5ZM3 9h4v12H3V9Zm6 0h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05 4.03 0 4.78 2.65 4.78 6.1V21h-4v-5.4c0-1.29-.02-2.95-1.8-2.95-1.8 0-2.08 1.4-2.08 2.85V21H9V9Z"></path></svg>
                    LinkedIn<span aria-hidden="true" style={{ color: '#F0661E' }}>↗</span>
                  </Hoverable>
                )}
                {(!d.links || d.links.youtube) && (
                  <Hoverable as="a" href={d.links ? d.links.youtube : '#'} target="_blank" rel="noreferrer" base="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:11px 20px;font-size:14px;font-weight:500;color:#F5F1EA" hoverCss="border-color:rgba(240,102,30,0.6);color:#F0661E">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23 12s0-3.8-.5-5.6a2.9 2.9 0 0 0-2-2C18.7 4 12 4 12 4s-6.7 0-8.5.4a2.9 2.9 0 0 0-2 2C1 8.2 1 12 1 12s0 3.8.5 5.6a2.9 2.9 0 0 0 2 2C5.3 20 12 20 12 20s6.7 0 8.5-.4a2.9 2.9 0 0 0 2-2C23 15.8 23 12 23 12ZM10 15.5v-7l6 3.5-6 3.5Z"></path></svg>
                    YouTube<span aria-hidden="true" style={{ color: '#F0661E' }}>↗</span>
                  </Hoverable>
                )}
                {(!d.links || d.links.instagram) && (
                  <Hoverable as="a" href={d.links ? d.links.instagram : '#'} target="_blank" rel="noreferrer" base="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:11px 20px;font-size:14px;font-weight:500;color:#F5F1EA" hoverCss="border-color:rgba(240,102,30,0.6);color:#F0661E">
                    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"></rect><circle cx="12" cy="12" r="3.6"></circle><circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none"></circle></svg>
                    Instagram<span aria-hidden="true" style={{ color: '#F0661E' }}>↗</span>
                  </Hoverable>
                )}
                {d.links && d.links.behance && (
                  <Hoverable as="a" href={d.links.behance} target="_blank" rel="noreferrer" base="display:inline-flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,0.14);background:rgba(255,255,255,0.05);border-radius:999px;padding:11px 20px;font-size:14px;font-weight:500;color:#F5F1EA" hoverCss="border-color:rgba(240,102,30,0.6);color:#F0661E">
                    <span style={sx("font-family:'Sora',sans-serif;font-weight:700;font-size:13px;line-height:1")}>Bē</span>
                    Behance<span aria-hidden="true" style={{ color: '#F0661E' }}>↗</span>
                  </Hoverable>
                )}
              </div>
            </div>
            <div style={sx('display:flex;align-items:center;justify-content:space-between;gap:16px;margin-top:56px;padding-top:26px;border-top:1px solid rgba(255,255,255,0.08)')}>
              {prev ? (
                <Hoverable as={Link} to={`/designs/${prev.slug}`} base="display:inline-flex;flex-direction:column;gap:4px" hoverCss="color:#F0661E">
                  <span style={sx("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.16em;color:#6E665C")}>← PREVIOUS</span>
                  <span style={sx("font-family:'Sora',sans-serif;font-weight:600;font-size:15px")}>{prev.title}</span>
                </Hoverable>
              ) : <span></span>}
              {next && (
                <Hoverable as={Link} to={`/designs/${next.slug}`} base="display:inline-flex;flex-direction:column;gap:4px;text-align:right;margin-left:auto" hoverCss="color:#F0661E">
                  <span style={sx("font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.16em;color:#6E665C")}>NEXT →</span>
                  <span style={sx("font-family:'Sora',sans-serif;font-weight:600;font-size:15px")}>{next.title}</span>
                </Hoverable>
              )}
            </div>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
}
