import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Nav } from '../components/Nav';
import { Footer } from '../components/Footer';
import { BackgroundBlobs } from '../components/BackgroundBlobs';
import { sx } from '../lib/sx';
import { designs } from '../data/portfolio';
import './Designs.css';

export default function Designs() {
  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={sx('position:relative;min-height:100vh;background:#0C0B0A;overflow-x:clip')}>
      <BackgroundBlobs />
      <Nav active="designs" />
      <main style={sx('position:relative;z-index:1;max-width:1180px;margin:0 auto;padding:clamp(120px,20vh,180px) clamp(16px,4vw,32px) 40px;box-sizing:border-box')}>
        <div style={sx('display:flex;flex-direction:column;align-items:center;text-align:center')}>
          <div data-up="1" style={sx("display:inline-flex;align-items:center;gap:9px;border:1px solid rgba(255,255,255,0.12);background:rgba(255,255,255,0.05);border-radius:999px;padding:8px 18px;font-family:'JetBrains Mono',monospace;font-size:10.5px;letter-spacing:0.22em;color:#C9C0B4")}>
            <span style={sx('width:6px;height:6px;border-radius:50%;background:#F0661E;box-shadow:0 0 10px rgba(240,102,30,0.9)')}></span>
            DESIGN SHOWCASE
          </div>
          <h1 data-up="1" style={sx("margin:20px 0 0;font-family:'Sora',sans-serif;font-weight:700;font-size:clamp(34px,5vw,60px);line-height:1.08;letter-spacing:-0.025em")}>
            Designs &amp; <span style={{ color: '#F0661E' }}>experiments.</span>
          </h1>
          <p data-up="1" style={sx('margin:18px 0 0;max-width:56ch;font-size:16px;line-height:1.7;color:#A29889')}>
            Motion studies, UI explorations and visual experiments — the playground where ideas get tested.
          </p>
        </div>
        <div id="dGrid" style={sx('margin-top:clamp(36px,5vw,52px)')}>
          {designs.map((d) => (
            <Link key={d.slug} data-proj="1" to={`/designs/${d.slug}`}>
              <div data-pmedia="1" style={sx('position:relative;aspect-ratio:4/3;border-radius:14px;overflow:hidden;background:linear-gradient(160deg,#2C2620,#1C1815)')}>
                <image-slot id={`design-list-${d.slug}`} shape="rect" placeholder={`Drop the ${d.title} preview`}></image-slot>
              </div>
              <div style={sx('padding:16px 8px 8px')}>
                <div style={sx("font-family:'JetBrains Mono',monospace;font-size:9.5px;letter-spacing:0.22em;color:#F0661E")}>{d.category.toUpperCase()}</div>
                <div style={sx("margin-top:6px;font-family:'Sora',sans-serif;font-weight:600;font-size:17px;letter-spacing:-0.01em")}>{d.title}</div>
                <div data-vlink="1" style={sx('margin-top:12px;font-size:13.5px;font-weight:500;color:#C9C0B4')}>View design <span aria-hidden="true">↗</span></div>
              </div>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
