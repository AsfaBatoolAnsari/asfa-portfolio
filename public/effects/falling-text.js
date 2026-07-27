// <falling-text> — vanilla web component (Matter.js physics) for a heading whose words drop and settle.
// text attr uses **bold** markers for highlighted words; trigger = scroll (starts when 10% visible).
// Attributes: text, font-size, gravity, stiffness (mouseConstraintStiffness), highlight-color.
(() => {
  if (customElements.get('falling-text')) return;
  class FallingTextEl extends HTMLElement {
    connectedCallback() {
      if (this._init) return; this._init = true;
      this.style.display = 'block';
      this.style.position = 'relative';
      this.style.overflow = 'hidden';
      const text = this.getAttribute('text') || '';
      const fs = this.getAttribute('font-size') || '2rem';
      const hlColor = this.getAttribute('highlight-color') || '#F0661E';
      // tokenize: **phrase** => each word highlighted; stray punctuation merges into the previous word
      const tokens = [];
      text.split(/(\*\*[^*]+\*\*)/g).forEach((seg) => {
        const m = seg.match(/^\*\*([^*]+)\*\*$/);
        (m ? m[1] : seg).split(/\s+/).filter(Boolean).forEach((w) => {
          if (!m && /^[.,;:!?]+$/.test(w) && tokens.length) tokens[tokens.length - 1].w += w;
          else tokens.push({ w, h: !!m });
        });
      });
      const target = document.createElement('div');
      target.style.cssText = 'font-size:' + fs + ';line-height:1.5;text-align:center;height:100%;display:flex;flex-wrap:wrap;align-content:center;justify-content:center;column-gap:0.3em;row-gap:0.16em;padding:0 3%;box-sizing:border-box';
      tokens.forEach((t) => {
        const s = document.createElement('span');
        s.textContent = t.w;
        s.style.cssText = 'display:inline-block;white-space:nowrap;user-select:none;-webkit-user-select:none;' + (t.h ? 'color:' + hlColor + ';text-shadow:0 0 26px rgba(240,102,30,0.35)' : '');
        target.appendChild(s);
      });
      this._target = target;
      this.appendChild(target);
      const cv = document.createElement('div');
      cv.style.cssText = 'position:absolute;inset:0;z-index:0;pointer-events:none';
      this._cvBox = cv;
      this.appendChild(cv);
      if (matchMedia('(prefers-reduced-motion: reduce)').matches) return; // reduced motion: static heading
      this._io = new IntersectionObserver((es) => {
        if (es[0].isIntersecting) { this._io.disconnect(); this._start(); }
      }, { threshold: 0.1 });
      this._io.observe(this);
    }
    async _start() {
      if (this._started) return; this._started = true;
      let Matter;
      try { Matter = (await import('https://cdn.jsdelivr.net/npm/matter-js@0.20.0/+esm')).default; } catch (e) { return; }
      if (!this.isConnected) return;
      const { Engine, Render, World, Bodies, Runner, Mouse, MouseConstraint } = Matter;
      const containerRect = this.getBoundingClientRect();
      const width = containerRect.width, height = containerRect.height;
      if (width <= 0 || height <= 0) return;
      const engine = this._engine = Engine.create();
      engine.world.gravity.y = parseFloat(this.getAttribute('gravity') || '1');
      const render = this._render = Render.create({
        element: this._cvBox, engine,
        options: { width, height, background: 'transparent', wireframes: false }
      });
      render.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%';
      const bo = { isStatic: true, render: { fillStyle: 'transparent' } };
      const floor = Bodies.rectangle(width / 2, height + 25, width, 50, bo);
      const leftWall = Bodies.rectangle(-25, height / 2, 50, height, bo);
      const rightWall = Bodies.rectangle(width + 25, height / 2, 50, height, bo);
      const ceiling = Bodies.rectangle(width / 2, -25, width, 50, bo);
      const wordSpans = this._target.querySelectorAll('span');
      const wordBodies = [...wordSpans].map((elem) => {
        const rect = elem.getBoundingClientRect();
        const x = rect.left - containerRect.left + rect.width / 2;
        const y = rect.top - containerRect.top + rect.height / 2;
        const body = Bodies.rectangle(x, y, rect.width, rect.height, {
          render: { fillStyle: 'transparent' }, restitution: 0.8, frictionAir: 0.01, friction: 0.2
        });
        Matter.Body.setVelocity(body, { x: (Math.random() - 0.5) * 5, y: 0 });
        Matter.Body.setAngularVelocity(body, (Math.random() - 0.5) * 0.05);
        return { elem, body };
      });
      wordBodies.forEach(({ elem, body }) => {
        elem.style.position = 'absolute';
        elem.style.left = body.position.x + 'px';
        elem.style.top = body.position.y + 'px';
        elem.style.transform = 'translate(-50%, -50%)';
      });
      const mouse = Mouse.create(this);
      const mouseConstraint = MouseConstraint.create(engine, {
        mouse, constraint: { stiffness: parseFloat(this.getAttribute('stiffness') || '0.2'), render: { visible: false } }
      });
      render.mouse = mouse;
      // don't hijack page scroll: drop Matter's wheel handlers; on touch devices drop touch handlers too
      ['mousewheel', 'DOMMouseScroll', 'wheel'].forEach((ev) => mouse.element.removeEventListener(ev, mouse.mousewheel));
      if (matchMedia('(pointer: coarse)').matches) {
        mouse.element.removeEventListener('touchstart', mouse.mousedown);
        mouse.element.removeEventListener('touchmove', mouse.mousemove);
        mouse.element.removeEventListener('touchend', mouse.mouseup);
      }
      World.add(engine.world, [floor, leftWall, rightWall, ceiling, mouseConstraint, ...wordBodies.map((wb) => wb.body)]);
      const runner = this._runner = Runner.create();
      Runner.run(runner, engine);
      Render.run(render);
      const updateLoop = () => {
        this._raf = requestAnimationFrame(updateLoop);
        wordBodies.forEach(({ body, elem }) => {
          elem.style.left = body.position.x + 'px';
          elem.style.top = body.position.y + 'px';
          elem.style.transform = 'translate(-50%, -50%) rotate(' + body.angle + 'rad)';
        });
        Matter.Engine.update(engine);
      };
      updateLoop();
      this._Matter = Matter;
    }
    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._io) this._io.disconnect();
      const M = this._Matter;
      if (M) {
        if (this._render) { M.Render.stop(this._render); if (this._render.canvas && this._render.canvas.parentNode) this._render.canvas.parentNode.removeChild(this._render.canvas); }
        if (this._runner) M.Runner.stop(this._runner);
        if (this._engine) { M.World.clear(this._engine.world); M.Engine.clear(this._engine); }
      }
      this._init = false; this._started = false;
    }
  }
  customElements.define('falling-text', FallingTextEl);
})();
