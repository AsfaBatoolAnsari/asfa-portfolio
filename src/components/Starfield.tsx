import { useEffect, useRef } from 'react';

interface StarColor {
  r: number;
  g: number;
  b: number;
}

interface StarfieldProps {
  starCount?: number;
  waveFrequency?: number;
  starEscapeWidth?: number;
  starColor?: StarColor;
  maxOpacity?: number;
  rotationSpeed?: number;
  waveSpeed?: number;
}

interface Star {
  orbital: number;
  opacity: number;
  position: { x: number; y: number };
  rotation: number;
  realPosition: { x: number; y: number };
  rSpeed: number;
  waveSpeed1: number;
  waveSpeed2: number;
  wave1: number;
  wave2: number;
}

/** Lightweight canvas star swirl for decorative section backgrounds. Draws directly
 * into a Uint32 pixel buffer (one pixel per star) rather than per-star canvas draw
 * calls, so cost scales with star count, not with fancy per-star rendering — kept
 * modest here on purpose since this sits behind scrollable content. */
export function Starfield({
  starCount = 1400,
  waveFrequency = 14,
  starEscapeWidth = 260,
  starColor = { r: 240, g: 102, b: 30 },
  maxOpacity = 220,
  rotationSpeed = 0.0004,
  waveSpeed = 0.006,
}: StarfieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;
    const context = canvas.getContext('2d');
    if (!context) return;

    const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let size = { x: 0, y: 0 };
    let imagedata!: ImageData, data!: Uint32Array;
    let stars: Star[] = [];
    const startTime = Date.now();
    let currentTime = 0;
    let raf = 0;
    let visible = true;

    const setSize = () => {
      size.x = container.clientWidth;
      size.y = container.clientHeight;
      canvas.width = size.x;
      canvas.height = size.y;
      imagedata = context.createImageData(size.x, size.y);
      data = new Uint32Array(imagedata.data.buffer);
      stars = [];
    };

    const rotate = (cx: number, cy: number, x: number, y: number, radians: number) => {
      const cos = Math.cos(radians), sin = Math.sin(radians);
      return { x: cos * (x - cx) + sin * (y - cy) + cx, y: cos * (y - cy) - sin * (x - cx) + cy };
    };

    const STAR_PX = 2; // draw each star as a small block, not a single pixel — much easier to see
    const brightness = (orbital: number) => Math.min(255, Math.floor((1 - orbital / starEscapeWidth) * maxOpacity * 0.7 + maxOpacity * 0.4 + Math.random() * 60));

    const plot = (cx: number, cy: number, value: number) => {
      const x0 = Math.floor(cx), y0 = Math.floor(cy);
      for (let dy = 0; dy < STAR_PX; dy++) {
        for (let dx = 0; dx < STAR_PX; dx++) {
          const idx = (y0 + dy) * size.x + (x0 + dx);
          if (idx >= 0 && idx < data.length) data[idx] = value;
        }
      }
    };

    const createStar = () => {
      const orbital = (Math.random() * (starEscapeWidth / 2) + 1 + Math.random() * (starEscapeWidth / 2) + starEscapeWidth) / 2;
      const opacity = brightness(orbital);
      const rotation = Math.PI * (Math.random() * 2);
      const basePos = { x: size.x / 2, y: size.y / 2 + orbital };
      const position = rotate(size.x / 2, size.y / 2, basePos.x, basePos.y, rotation);
      stars.push({
        orbital, opacity, position, rotation, realPosition: { ...position },
        rSpeed: Math.random() * rotationSpeed + opacity / 20000,
        waveSpeed1: Math.random() * waveSpeed, waveSpeed2: Math.random() * waveSpeed,
        wave1: 0, wave2: 0,
      });
    };

    const drawStar = (star: Star) => {
      plot(star.realPosition.x + star.wave2, star.realPosition.y + star.wave1, 0);

      star.wave1 = Math.sin(currentTime * star.waveSpeed1) * waveFrequency;
      star.wave2 = Math.sin(currentTime * star.waveSpeed2) * waveFrequency;
      star.realPosition = rotate(size.x / 2, size.y / 2, star.position.x, star.position.y, star.rSpeed * currentTime);
      star.opacity = brightness(star.orbital);

      const value = (star.opacity << 24) | (starColor.b << 16) | (starColor.g << 8) | starColor.r;
      plot(star.realPosition.x + star.wave2, star.realPosition.y + star.wave1, value);
    };

    const render = () => {
      raf = requestAnimationFrame(render);
      if (!visible) return;
      currentTime = (Date.now() - startTime) / 10;
      if (stars.length < starCount) {
        for (let i = 0; i < Math.min(80, starCount - stars.length); i++) createStar();
      }
      for (const star of stars) drawStar(star);
      context.putImageData(imagedata, 0, 0);
    };

    setSize();
    if (reduced) {
      for (let i = 0; i < starCount; i++) createStar();
      for (const star of stars) drawStar(star);
      context.putImageData(imagedata, 0, 0);
    } else {
      raf = requestAnimationFrame(render);
    }

    const io = new IntersectionObserver((entries) => { visible = entries[0].isIntersecting; });
    io.observe(container);
    const ro = new ResizeObserver(setSize);
    ro.observe(container);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [starCount, waveFrequency, starEscapeWidth, starColor, maxOpacity, rotationSpeed, waveSpeed]);

  return (
    <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
      <canvas ref={canvasRef} style={{ display: 'block', width: '100%', height: '100%' }} />
    </div>
  );
}
