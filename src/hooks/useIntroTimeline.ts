import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

interface Options {
  playIntro?: boolean;
  introSpeed?: number;
}

const $ = (id: string) => document.getElementById(id);

/** Ports the home page's cinematic GSAP opening sequence (logo reveal -> Figma-style
 * workspace -> a scripted cursor draws a frame -> the hero assembles -> the frame
 * becomes the real, interactive hero) plus everything that only makes sense once the
 * intro has finished: the scroll-triggered nav, scroll-reveal animations, the skill-bar
 * fill, and the services sticky card-stack. This hook owns the entire lifecycle so
 * Home.tsx itself can stay focused on markup. */
export function useIntroTimeline({ playIntro = true, introSpeed = 1.1 }: Options = {}) {
  const location = useLocation();
  const doneRef = useRef(false);
  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const rafRef = useRef(0);
  const sparkRafRef = useRef(0);
  const sparksRef = useRef<{ x: number; y: number; angle: number; startTime: number }[]>([]);
  const obsRef = useRef<IntersectionObserver | null>(null);
  const skObsRef = useRef<IntersectionObserver | null>(null);
  const onScrollRef = useRef<(() => void) | null>(null);
  const onResizeRef = useRef<(() => void) | null>(null);
  const svcCardsRef = useRef<HTMLElement[]>([]);
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    const CLICK_SPARK = { color: '#ffffff', size: 17, radius: 20, count: 8, duration: 400, extraScale: 1 };

    const clearSparks = () => {
      if (sparkRafRef.current) { cancelAnimationFrame(sparkRafRef.current); sparkRafRef.current = 0; }
      sparksRef.current = [];
      const cv = $('sparkCv') as HTMLCanvasElement | null;
      if (cv && cv.width) cv.getContext('2d')?.clearRect(0, 0, cv.width, cv.height);
    };

    const spark = (x: number, y: number) => {
      if (reducedMotionRef.current) return;
      const cv = $('sparkCv') as HTMLCanvasElement | null;
      if (!cv) return;
      if (cv.width !== innerWidth || cv.height !== innerHeight) { cv.width = innerWidth; cv.height = innerHeight; }
      const C = CLICK_SPARK, now = performance.now();
      for (let i = 0; i < C.count; i++) sparksRef.current.push({ x, y, angle: (2 * Math.PI * i) / C.count, startTime: now });
      if (sparkRafRef.current) return;
      const ctx = cv.getContext('2d')!;
      const draw = (ts: number) => {
        ctx.clearRect(0, 0, cv.width, cv.height);
        sparksRef.current = sparksRef.current.filter((s) => {
          const el = ts - s.startTime;
          if (el >= C.duration) return false;
          const t = el / C.duration, eased = t * (2 - t);
          const d = eased * C.radius * C.extraScale, ll = C.size * (1 - eased);
          ctx.strokeStyle = C.color; ctx.lineWidth = 2; ctx.beginPath();
          ctx.moveTo(s.x + d * Math.cos(s.angle), s.y + d * Math.sin(s.angle));
          ctx.lineTo(s.x + (d + ll) * Math.cos(s.angle), s.y + (d + ll) * Math.sin(s.angle));
          ctx.stroke();
          return true;
        });
        if (sparksRef.current.length) { sparkRafRef.current = requestAnimationFrame(draw); }
        else { sparkRafRef.current = 0; ctx.clearRect(0, 0, cv.width, cv.height); }
      };
      sparkRafRef.current = requestAnimationFrame(draw);
    };

    const SVC_STACK = { stackOffset: 24, itemScale: 0.03, baseScale: 0.85, depthScale: 0.04 };
    const updateStack = () => {
      const sec = $('services');
      if (!sec) return;
      if (!svcCardsRef.current.length || !svcCardsRef.current[0].isConnected) {
        svcCardsRef.current = Array.from(document.querySelectorAll<HTMLElement>('[data-svc-card]'));
      }
      const cards = svcCardsRef.current, n = cards.length;
      if (!n) return;
      if (reducedMotionRef.current) { cards.forEach((c) => { c.style.transform = ''; c.style.zIndex = ''; }); return; }
      // Read the pinned viewport's own rendered height rather than assuming
      // it equals innerHeight — on desktop #svcSticky is 100svh so this is
      // identical to before, but on mobile it's shrunk to fit the card stack
      // (see Home.css), and this keeps the "cards fully settle" moment and
      // the sticky's own natural release point perfectly in sync regardless
      // of that height, instead of leaving a dead scroll gap or a mismatch.
      const stickyEl = $('svcSticky');
      const vh = stickyEl ? stickyEl.offsetHeight : innerHeight, C = SVC_STACK;
      const docTop = (el: HTMLElement | null) => { let y = 0; let cur: HTMLElement | null = el; while (cur) { y += cur.offsetTop; cur = cur.offsetParent as HTMLElement | null; } return y; };
      const total = Math.max(1, sec.offsetHeight - vh);
      const p = Math.min(1, Math.max(0, (scrollY - docTop(sec)) / total));
      const topFloat = p * (n - 1);
      cards.forEach((card, i) => {
        const t = i === 0 ? 1 : Math.min(1, Math.max(0, topFloat - (i - 1)));
        const e = 1 - Math.pow(1 - t, 3);
        const ty = (1 - e) * vh * 0.92 + C.stackOffset * i;
        const depth = Math.max(0, topFloat - i);
        const scale = Math.max(C.baseScale + i * C.itemScale, 1 - depth * C.depthScale);
        card.style.transform = 'translate3d(0,' + ty.toFixed(2) + 'px,0) scale(' + scale.toFixed(4) + ')';
        card.style.zIndex = String(10 + i);
      });
    };

    const scrollToId = (id: string) => {
      const el = $(id);
      if (el) scrollTo({ top: el.getBoundingClientRect().top + scrollY - 76, behavior: 'smooth' });
    };

    const applyFinishedState = () => {
      const stage = $('stage'); if (stage) stage.style.display = 'none';
      const hn = $('heroNav'); if (hn) hn.style.display = 'none';
      const pn = $('pageNav'); if (pn) { pn.style.opacity = '1'; pn.style.visibility = 'visible'; pn.style.pointerEvents = 'auto'; }
      const fw = $('fw'), inner = $('inner'), chrome = $('chrome');
      if (fw) fw.style.cssText = 'position:absolute;inset:0;overflow:hidden;z-index:2;background:transparent';
      if (inner) inner.style.cssText = 'position:relative;width:100%;height:100%;background:transparent';
      if (chrome) chrome.style.display = 'none';
      const sb = $('selB'); if (sb) sb.style.opacity = '0';
      const g = $('guides'); if (g) g.style.opacity = '0';
      const site = $('site'); if (site) site.style.pointerEvents = '';
    };

    const finish = () => {
      if (doneRef.current) return;
      doneRef.current = true;
      if (tlRef.current) { tlRef.current.kill(); tlRef.current = null; }
      clearSparks();
      const fw = $('fw'), inner = $('inner');
      gsap.killTweensOf([fw, inner, '#cur', '#tb']);
      gsap.set(['#heroNav', '#chip', '#desc', '#btnP', '#btnG', '#scrollI', '#m1a', '#m1b', '#about', '#designs'], { clearProps: 'transform,opacity,visibility,filter' });
      const bp = $('btnP'); if (bp) { bp.style.backgroundColor = ''; bp.style.filter = ''; bp.style.boxShadow = '0 10px 28px rgba(240,102,30,0.35), inset 0 1px 0 rgba(255,255,255,0.28)'; }
      applyFinishedState();
      const scrollI = $('scrollI'); if (scrollI && innerHeight < 660) scrollI.style.display = 'none';
      document.documentElement.style.overflow = '';

      svcCardsRef.current = Array.from(document.querySelectorAll<HTMLElement>('[data-svc-card]'));
      const onScroll = () => {
        const pn = $('pageNav'); if (!pn) return;
        pn.dataset.scrolled = scrollY > 24 ? '1' : '0';
        let cur = 'hero';
        ['hero', 'about', 'services', 'projects', 'designs', 'contact'].forEach((s) => {
          const el = $(s);
          if (el && el.getBoundingClientRect().top <= innerHeight * 0.4) cur = s;
        });
        pn.querySelectorAll<HTMLElement>('[data-sec]').forEach((a) => { a.style.color = a.dataset.sec === cur ? '#F0661E' : '#A29889'; });
        updateStack();
      };
      onScrollRef.current = onScroll;
      addEventListener('scroll', onScroll, { passive: true });
      onScroll();

      // Without this, resizing the window across the 900px services
      // breakpoint (no accompanying scroll) leaves the last scroll-computed
      // transform/scale stuck on the cards after CSS drops them back to
      // position:static, visibly misplacing them in the mobile stacked list.
      const onResize = () => updateStack();
      onResizeRef.current = onResize;
      addEventListener('resize', onResize);

      const els = document.querySelectorAll<HTMLElement>('[data-rv]');
      const anim = !reducedMotionRef.current;
      if (anim) els.forEach((el) => {
        const k = el.dataset.rv;
        if (k === 'left') gsap.set(el, { x: -30, autoAlpha: 0 });
        else if (k === 'right') gsap.set(el, { x: 30, autoAlpha: 0 });
        else gsap.set(el, { y: 26, autoAlpha: 0 });
      });
      obsRef.current = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          obsRef.current?.unobserve(e.target);
          if (!anim) { (e.target as HTMLElement).style.opacity = '1'; (e.target as HTMLElement).style.transform = 'none'; return; }
          const target = e.target as HTMLElement;
          const d = Number(target.dataset.rvi || 0) * 0.08, k = target.dataset.rv;
          if (k === 'mask') gsap.fromTo(target, { clipPath: 'inset(0 100% 0 0)' }, { clipPath: 'inset(0 0% 0 0)', y: 0, autoAlpha: 1, duration: 0.95, ease: 'power3.out', delay: d, clearProps: 'clipPath' });
          else if (k === 'left' || k === 'right') gsap.to(target, { x: 0, autoAlpha: 1, duration: 0.85, ease: 'power3.out', delay: d });
          else gsap.to(target, { y: 0, autoAlpha: 1, duration: 0.8, ease: 'power3.out', delay: d });
        });
      }, { threshold: 0.15 });
      els.forEach((el, i) => { el.dataset.rvi = String(i % 6); obsRef.current!.observe(el); });

      const bars = Array.from(document.querySelectorAll<HTMLElement>('[data-pct]'));
      const sg = $('skillsGrid');
      if (bars.length && sg) {
        if (reducedMotionRef.current) bars.forEach((b) => { b.style.width = (b.dataset.pct || '0') + '%'; });
        else {
          let filled = false;
          skObsRef.current = new IntersectionObserver((es) => {
            if (!es[0].isIntersecting || filled) return;
            filled = true;
            gsap.to(bars, { width: (_i: number, el: HTMLElement) => (el.dataset.pct || '0') + '%', duration: 1.15, ease: 'power3.out', stagger: 0.12, delay: 0.3 });
            skObsRef.current?.disconnect();
          }, { threshold: 0.3 });
          skObsRef.current.observe(sg);
        }
      }

      // hash-link support: nav links from other pages point at /#about, /#services
      if (location.hash) {
        const id = location.hash.slice(1);
        requestAnimationFrame(() => scrollToId(id));
      }
    };

    const init = () => {
      const rm = reducedMotionRef.current = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (playIntro === false) { finish(); return; }
      const vw = innerWidth, vh = innerHeight, m = vw < 720;
      document.documentElement.style.overflow = 'hidden';
      scrollTo(0, 0);
      const site = $('site'); if (site) site.style.pointerEvents = 'none';

      const heroBits = ['heroNav', 'chip', 'desc', 'btnP', 'btnG', 'scrollI'].map($);
      gsap.set(heroBits, { autoAlpha: 0 });
      gsap.set(['#m1a', '#m1b'], { yPercent: 112 });
      if (!rm) gsap.set(['#about', '#designs'], { autoAlpha: 0 });

      if (rm) {
        const t = gsap.timeline({ onComplete: finish });
        t.fromTo('#lg', { opacity: 0 }, { opacity: 1, duration: 0.6 }).to('#lg', { opacity: 0, duration: 0.5 }, '+=0.7');
        tlRef.current = t;
        return;
      }

      const s = m ? 0.7 : 0.62, k = 1 / s, cy = m ? 0.44 : 0.46;
      const W = s * vw, H = s * vh, x0 = (0.5 - s / 2) * vw, y0 = (cy - s / 2) * vh;
      const fw = $('fw'), inner = $('inner'), chrome = $('chrome');
      gsap.set(fw, { left: x0, top: y0, right: 'auto', bottom: 'auto', width: 0, height: 0, borderRadius: 12, backgroundColor: '#131110', boxShadow: '0 30px 90px rgba(0,0,0,0.55)', willChange: 'left,top,width,height,transform' });
      gsap.set(chrome, { left: x0, top: y0, right: 'auto', bottom: 'auto', width: 0, height: 0, borderColor: '#F0661E', willChange: 'left,top,width,height' });
      gsap.set(inner, { width: vw, height: vh, scale: s });
      gsap.set('#frameTag', { opacity: 0 });

      const tbFrame = $('tb2')!;
      const r2 = tbFrame.getBoundingClientRect();
      const tx = r2.left + r2.width / 2 - 8, ty = r2.top + r2.height / 2 - 6;
      const selTo = (el: HTMLElement, label: string) => {
        const r = el.getBoundingClientRect(), ri = inner!.getBoundingClientRect(), sc = ri.width / (inner as HTMLElement).offsetWidth, p = 8;
        gsap.set('#selB', { left: (r.left - ri.left) / sc - p, top: (r.top - ri.top) / sc - p, width: r.width / sc + p * 2, height: r.height / sc + p * 2 });
        const lbl = $('selLbl'); if (lbl) lbl.textContent = label;
      };
      const click = (t: gsap.core.Timeline, at: number) => {
        t.to('#cur', { scale: 0.88, duration: 0.09, transformOrigin: '4px 3px' }, at)
          .to('#cur', { scale: 1, duration: 0.16 }, at + 0.09)
          .call(() => spark(Number(gsap.getProperty('#cur', 'x')) + 4, Number(gsap.getProperty('#cur', 'y')) + 3), undefined, at);
      };

      const tl = gsap.timeline({ defaults: { ease: 'power3.out' }, onComplete: finish });
      tlRef.current = tl;

      // S1 — logo "written" reveal: soft-edged mask wipes left -> right
      const lg = $('lg') as HTMLImageElement, mkImg = 'linear-gradient(100deg,#000 46%,rgba(0,0,0,0) 54%)';
      lg.style.webkitMaskImage = mkImg; (lg.style as any).maskImage = mkImg;
      lg.style.webkitMaskSize = '260% 100%'; (lg.style as any).maskSize = '260% 100%';
      lg.style.webkitMaskRepeat = 'no-repeat'; (lg.style as any).maskRepeat = 'no-repeat';
      const mp = { p: 100 }, pen = $('lgPen')!;
      const setMP = () => {
        const v = mp.p + '% 0%';
        lg.style.webkitMaskPosition = v; (lg.style as any).maskPosition = v;
        const fx = Math.max(0, Math.min(100, 100 - mp.p));
        pen.style.left = fx + '%'; pen.style.top = '50%';
      };
      setMP();
      tl.set('#lg', { opacity: 1 }, 0)
        .fromTo('#lgPen', { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.2, ease: 'power2.out' }, 0.15)
        .to(mp, { p: 0, duration: 0.95, ease: 'power2.inOut', onUpdate: setMP }, 0.15)
        .to('#lgPen', { opacity: 0, scale: 0.5, duration: 0.28, ease: 'power2.in' }, 1.02)
        .to('#lgGlow', { opacity: 1, duration: 0.8, ease: 'sine.inOut' }, 0.4)
        .to('#skipBtn', { opacity: 1, duration: 0.4 }, 0.8)
        .to('#lg', { opacity: 0, filter: 'blur(4px)', duration: 0.45, ease: 'power2.in' }, 1.55)
        .to('#lgGlow', { opacity: 0, duration: 0.45 }, 1.55)
        .to('#stage', { backgroundColor: 'rgba(12,11,10,0)', duration: 0.7, ease: 'sine.inOut' }, 1.8)
        .set('#lgS', { display: 'none' }, 2.1)
        .to('#grid', { opacity: 0.5, duration: 0.6, ease: 'sine.inOut' }, 2.0)
        .fromTo('#tb', { y: 16, opacity: 0 }, { y: 0, opacity: 1, duration: 0.55, ease: 'power3.out' }, 2.15);

      // S4 — cursor enters, picks frame tool
      tl.set('#cur', { x: vw + 40, y: vh * 0.32, opacity: 1 }, 2.5)
        .to('#cur', { motionPath: { path: [{ x: vw * 0.7, y: vh * 0.55 }, { x: tx + 60, y: ty - 46 }, { x: tx, y: ty }], curviness: 1.3 }, duration: 0.95, ease: 'power2.inOut' }, 2.5)
        .to(tbFrame, { backgroundColor: 'rgba(255,255,255,0.09)', duration: 0.15 }, 3.42);
      click(tl, 3.68);
      tl.to(tbFrame, { backgroundColor: '#F0661E', color: '#12100E', duration: 0.18 }, 3.75)
        .to('#tb1', { backgroundColor: 'rgba(0,0,0,0)', color: '#D8D2C8', duration: 0.18 }, 3.75);

      // S5 — drag out the frame
      tl.to('#cur', { motionPath: { path: [{ x: tx - vw * 0.12, y: ty - vh * 0.3 }, { x: x0, y: y0 }], curviness: 1.1 }, duration: 0.6, ease: 'power2.inOut' }, 4.05);
      click(tl, 4.7);
      const dim = { w: 0, h: 0 }, dimsEl = $('dims')!;
      tl.set(['#dims'], { opacity: 1 }, 4.75)
        .set('#frameTag', { opacity: 1 }, 4.78)
        .to([fw, chrome], { width: W, height: H, duration: 1.25, ease: 'power2.inOut' }, 4.75)
        .to('#cur', { x: x0 + W, y: y0 + H, duration: 1.25, ease: 'power2.inOut' }, 4.75)
        .to(dim, { w: W, h: H, duration: 1.25, ease: 'power2.inOut', onUpdate: () => { dimsEl.textContent = Math.round(dim.w / s) + ' × ' + Math.round(dim.h / s); } }, 4.75)
        .to('#dims', { opacity: 0, duration: 0.3 }, 6.2)
        .fromTo(['#hd1', '#hd2', '#hd3', '#hd4'], { scale: 0 }, { scale: 1, duration: 0.3, ease: 'back.out(1.6)', stagger: 0.04 }, 6.0);

      // S6 — assemble the hero UI
      const A = 6.25;
      if (!m) tl.to('#guides', { opacity: 1, duration: 0.25, ease: 'sine.inOut' }, A).to('#guides', { opacity: 0, duration: 0.5 }, A + 0.9);
      tl.fromTo('#heroNav', { y: -16 }, { y: 0, autoAlpha: 1, duration: 0.55, ease: 'expo.out' }, A + 0.05);
      if (!m) tl.call(() => { const hn = $('heroNav'); if (hn) selTo(hn, 'navigation'); }, undefined, A + 0.08).to('#selB', { opacity: 1, duration: 0.12 }, A + 0.08);
      tl.fromTo('#chip', { scale: 0.92 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: 'back.out(1.2)' }, A + 0.45)
        .to('#m1a', { yPercent: 0, duration: 0.7, ease: 'expo.out' }, A + 0.62)
        .to('#m1b', { yPercent: 0, duration: 0.7, ease: 'expo.out' }, A + 0.74);
      if (!m) tl.call(() => { const m1a = $('m1a'); if (m1a?.parentElement?.parentElement) selTo(m1a.parentElement.parentElement, 'heading / h1'); }, undefined, A + 0.72);
      tl.fromTo('#desc', { filter: 'blur(8px)' }, { filter: 'blur(0px)', autoAlpha: 1, duration: 0.55, ease: 'power2.out' }, A + 1.3)
        .fromTo(['#btnP', '#btnG'], { y: 18 }, { y: 0, autoAlpha: 1, duration: 0.5, ease: 'power3.out', stagger: 0.1 }, A + 1.55);
      if (!m) tl.call(() => { const bp = $('btnP'); if (bp) selTo(bp, 'button / primary'); }, undefined, A + 1.62);
      tl.to('#selB', { opacity: 0, duration: 0.25 }, A + 2.05);

      // S7 — cursor clicks the primary CTA
      const B = A + 2.15;
      tl.call(() => {
        const btn = $('btnP')!;
        const r = btn.getBoundingClientRect();
        gsap.to('#cur', { motionPath: { path: [{ x: r.left - 60, y: r.top + r.height + 50 }, { x: r.left + r.width * 0.55, y: r.top + r.height * 0.55 }], curviness: 1.2 }, duration: 0.65, ease: 'power2.inOut' });
      }, undefined, B);
      tl.to('#btnP', { filter: 'brightness(1.14)', scale: 1.03, duration: 0.18 }, B + 0.62)
        .to('#btnP', { scale: 0.96, duration: 0.1 }, B + 0.82)
        .to('#btnP', { scale: 1, filter: 'brightness(1)', boxShadow: '0 0 0 10px rgba(240,102,30,0)', duration: 0.35 }, B + 0.92)
        .fromTo('#btnP', { boxShadow: '0 0 0 0px rgba(240,102,30,0.35)' }, { boxShadow: '0 0 0 14px rgba(240,102,30,0)', duration: 0.5, ease: 'power2.out' }, B + 0.92);
      click(tl, B + 0.8);

      // S8 — hold, chrome recedes
      const C = B + 1.35;
      tl.to(['#cur', '#tb', '#grid'], { autoAlpha: 0, duration: 0.45, ease: 'sine.inOut' }, C)
        .to('#tb', { y: 14, duration: 0.45, ease: 'sine.inOut' }, C)
        .to(['#hd1', '#hd2', '#hd3', '#hd4', '#frameTag'], { opacity: 0, duration: 0.35 }, C)
        .to(chrome, { borderColor: 'rgba(240,102,30,0)', duration: 0.4 }, C + 0.1)
        .to('#skipBtn', { opacity: 0, duration: 0.3 }, C);

      // S9 — the frame becomes the hero
      const D = C + 0.55;
      tl.set(fw, { transformOrigin: '0 0' }, D)
        .to(fw, { x: -x0, y: -y0, scale: k, borderRadius: 0, boxShadow: '0 0 0 rgba(0,0,0,0)', duration: 1.0, ease: 'expo.inOut' }, D)
        .to(['#about', '#designs'], { autoAlpha: 1, duration: 0.6, ease: 'sine.inOut' }, D + 0.7);

      tl.timeScale((m ? 1.55 : 1.06) * (introSpeed || 1));
    };

    let raf = 0;
    let n = 0;
    const wait = () => {
      if (window.gsap === undefined) (window as any).gsap = gsap; // some effect scripts probe window.gsap
      init();
    };
    // gsap/MotionPathPlugin are bundled (imported above), no CDN wait needed — start on next frame
    // so the DOM (refs by id) is guaranteed painted.
    raf = requestAnimationFrame(wait);
    rafRef.current = raf;

    const skipHandler = () => { if (tlRef.current && !doneRef.current) tlRef.current.timeScale(9); };
    const skipBtn = $('skipBtn');
    skipBtn?.addEventListener('click', skipHandler);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (tlRef.current) tlRef.current.kill();
      if (sparkRafRef.current) cancelAnimationFrame(sparkRafRef.current);
      if (obsRef.current) obsRef.current.disconnect();
      if (skObsRef.current) skObsRef.current.disconnect();
      if (onScrollRef.current) removeEventListener('scroll', onScrollRef.current);
      if (onResizeRef.current) removeEventListener('resize', onResizeRef.current);
      skipBtn?.removeEventListener('click', skipHandler);
      document.documentElement.style.overflow = '';
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
