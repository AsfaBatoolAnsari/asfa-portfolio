// <galaxy-bg> — vanilla web component (OGL/WebGL) star-field background.
// Attributes mirror kebab-case props. Colors tuned via hue-shift/saturation only.
(() => {
  if (customElements.get('galaxy-bg')) return;
  const VERT = `attribute vec2 uv;
attribute vec2 position;
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 0, 1);
}`;
  const FRAG = `precision highp float;
uniform float uTime;
uniform vec3 uResolution;
uniform vec2 uFocal;
uniform vec2 uRotation;
uniform float uStarSpeed;
uniform float uDensity;
uniform float uHueShift;
uniform float uSpeed;
uniform vec2 uMouse;
uniform float uGlowIntensity;
uniform float uSaturation;
uniform bool uMouseRepulsion;
uniform float uTwinkleIntensity;
uniform float uRotationSpeed;
uniform float uRepulsionStrength;
uniform float uMouseActiveFactor;
uniform float uAutoCenterRepulsion;
uniform bool uTransparent;
varying vec2 vUv;
#define NUM_LAYER 4.0
#define STAR_COLOR_CUTOFF 0.2
#define MAT45 mat2(0.7071, -0.7071, 0.7071, 0.7071)
#define PERIOD 3.0
float Hash21(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}
float tri(float x) { return abs(fract(x) * 2.0 - 1.0); }
float tris(float x) { float t = fract(x); return 1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0)); }
float trisn(float x) { float t = fract(x); return 2.0 * (1.0 - smoothstep(0.0, 1.0, abs(2.0 * t - 1.0))) - 1.0; }
vec3 hsv2rgb(vec3 c) {
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}
float Star(vec2 uv, float flare) {
  float d = length(uv);
  float m = (0.05 * uGlowIntensity) / d;
  float rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * flare * uGlowIntensity;
  uv *= MAT45;
  rays = smoothstep(0.0, 1.0, 1.0 - abs(uv.x * uv.y * 1000.0));
  m += rays * 0.3 * flare * uGlowIntensity;
  m *= smoothstep(1.0, 0.2, d);
  return m;
}
vec3 StarLayer(vec2 uv) {
  vec3 col = vec3(0.0);
  vec2 gv = fract(uv) - 0.5;
  vec2 id = floor(uv);
  for (int y = -1; y <= 1; y++) {
    for (int x = -1; x <= 1; x++) {
      vec2 offset = vec2(float(x), float(y));
      vec2 si = id + vec2(float(x), float(y));
      float seed = Hash21(si);
      float size = fract(seed * 345.32);
      float glossLocal = tri(uStarSpeed / (PERIOD * seed + 1.0));
      float flareSize = smoothstep(0.9, 1.0, size) * glossLocal;
      float red = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 1.0)) + STAR_COLOR_CUTOFF;
      float blu = smoothstep(STAR_COLOR_CUTOFF, 1.0, Hash21(si + 3.0)) + STAR_COLOR_CUTOFF;
      float grn = min(red, blu) * seed;
      vec3 base = vec3(red, grn, blu);
      float hue = atan(base.g - base.r, base.b - base.r) / (2.0 * 3.14159) + 0.5;
      hue = fract(hue + uHueShift / 360.0);
      float sat = length(base - vec3(dot(base, vec3(0.299, 0.587, 0.114)))) * uSaturation;
      float val = max(max(base.r, base.g), base.b);
      base = hsv2rgb(vec3(hue, sat, val));
      vec2 pad = vec2(tris(seed * 34.0 + uTime * uSpeed / 10.0), tris(seed * 38.0 + uTime * uSpeed / 30.0)) - 0.5;
      float star = Star(gv - offset - pad, flareSize);
      vec3 color = base;
      float twinkle = trisn(uTime * uSpeed + seed * 6.2831) * 0.5 + 1.0;
      twinkle = mix(1.0, twinkle, uTwinkleIntensity);
      star *= twinkle;
      col += star * size * color;
    }
  }
  return col;
}
void main() {
  vec2 focalPx = uFocal * uResolution.xy;
  vec2 uv = (vUv * uResolution.xy - focalPx) / uResolution.y;
  vec2 mouseNorm = uMouse - vec2(0.5);
  if (uAutoCenterRepulsion > 0.0) {
    vec2 centerUV = vec2(0.0, 0.0);
    float centerDist = length(uv - centerUV);
    vec2 repulsion = normalize(uv - centerUV) * (uAutoCenterRepulsion / (centerDist + 0.1));
    uv += repulsion * 0.05;
  } else if (uMouseRepulsion) {
    vec2 mousePosUV = (uMouse * uResolution.xy - focalPx) / uResolution.y;
    float mouseDist = length(uv - mousePosUV);
    vec2 repulsion = normalize(uv - mousePosUV) * (uRepulsionStrength / (mouseDist + 0.1));
    uv += repulsion * 0.05 * uMouseActiveFactor;
  } else {
    vec2 mouseOffset = mouseNorm * 0.1 * uMouseActiveFactor;
    uv += mouseOffset;
  }
  float autoRotAngle = uTime * uRotationSpeed;
  mat2 autoRot = mat2(cos(autoRotAngle), -sin(autoRotAngle), sin(autoRotAngle), cos(autoRotAngle));
  uv = autoRot * uv;
  uv = mat2(uRotation.x, -uRotation.y, uRotation.y, uRotation.x) * uv;
  vec3 col = vec3(0.0);
  for (float i = 0.0; i < 1.0; i += 1.0 / NUM_LAYER) {
    float depth = fract(i + uStarSpeed * uSpeed);
    float scale = mix(20.0 * uDensity, 0.5 * uDensity, depth);
    float fade = depth * smoothstep(1.0, 0.9, depth);
    col += StarLayer(uv * scale + i * 453.32) * fade;
  }
  if (uTransparent) {
    float alpha = length(col);
    alpha = smoothstep(0.0, 0.3, alpha);
    alpha = min(alpha, 1.0);
    gl_FragColor = vec4(col, alpha);
  } else {
    gl_FragColor = vec4(col, 1.0);
  }
}`;
  class GalaxyBg extends HTMLElement {
    connectedCallback() { if (this._booted) return; this._booted = true; this._boot(); }
    async _boot() {
      try {
        const { Renderer, Program, Mesh, Color, Triangle } = await import('https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm');
        if (!this.isConnected) return;
        const num = (n, d) => { const v = this.getAttribute(n); return v === null ? d : parseFloat(v); };
        const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
        const mob = innerWidth < 720;
        this.style.position = 'absolute'; this.style.inset = '0'; this.style.display = 'block'; this.style.pointerEvents = 'none';
        const starSpeed = num('star-speed', 0.5), speed = num('speed', 1) * (mob ? 0.8 : 1);
        const mouseInteraction = !mob && !rm && this.getAttribute('mouse') !== 'off';
        const renderer = new Renderer({ alpha: true, premultipliedAlpha: false, dpr: Math.min(devicePixelRatio || 1, 1) });
        const gl = this._gl = renderer.gl;
        gl.enable(gl.BLEND);
        gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        gl.clearColor(0, 0, 0, 0);
        let program;
        const resize = () => {
          renderer.setSize(this.offsetWidth || 1, this.offsetHeight || 1);
          if (program) program.uniforms.uResolution.value = new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height);
        };
        this._ro = new ResizeObserver(resize); this._ro.observe(this);
        resize();
        const geometry = new Triangle(gl);
        program = new Program(gl, {
          vertex: VERT, fragment: FRAG, uniforms: {
            uTime: { value: 0 },
            uResolution: { value: new Color(gl.canvas.width, gl.canvas.height, gl.canvas.width / gl.canvas.height) },
            uFocal: { value: new Float32Array([0.5, 0.5]) },
            uRotation: { value: new Float32Array([1.0, 0.0]) },
            uStarSpeed: { value: starSpeed },
            uDensity: { value: num('density', 1) },
            uHueShift: { value: num('hue-shift', 140) },
            uSpeed: { value: speed },
            uMouse: { value: new Float32Array([0.5, 0.5]) },
            uGlowIntensity: { value: num('glow-intensity', 0.3) },
            uSaturation: { value: num('saturation', 0) },
            uMouseRepulsion: { value: this.getAttribute('mouse-repulsion') !== 'off' },
            uTwinkleIntensity: { value: num('twinkle-intensity', 0.3) },
            uRotationSpeed: { value: num('rotation-speed', 0.1) },
            uRepulsionStrength: { value: num('repulsion-strength', 2) },
            uMouseActiveFactor: { value: 0.0 },
            uAutoCenterRepulsion: { value: num('auto-center-repulsion', 0) },
            uTransparent: { value: true }
          }
        });
        const mesh = new Mesh(gl, { geometry, program });
        gl.canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
        this.appendChild(gl.canvas);
        if (rm) { program.uniforms.uTime.value = 12; program.uniforms.uStarSpeed.value = 1.2 * starSpeed / 10; renderer.render({ scene: mesh }); return; }
        const tgt = { x: 0.5, y: 0.5 }, cur = { x: 0.5, y: 0.5 };
        let tgtA = 0, curA = 0;
        const surface = this.closest('section') || this.parentElement;
        this._onMove = (e) => { const r = this.getBoundingClientRect(); tgt.x = (e.clientX - r.left) / r.width; tgt.y = 1 - (e.clientY - r.top) / r.height; tgtA = 1; };
        this._onLeave = () => { tgtA = 0; };
        if (mouseInteraction && surface) { surface.addEventListener('mousemove', this._onMove); surface.addEventListener('mouseleave', this._onLeave); this._surface = surface; }
        this._visible = true;
        this._io = new IntersectionObserver((es) => { this._visible = es[0].isIntersecting; });
        this._io.observe(this);
        const update = (t) => {
          this._raf = requestAnimationFrame(update);
          if (!this._visible) return; // paused offscreen
          program.uniforms.uTime.value = t * 0.001;
          program.uniforms.uStarSpeed.value = (t * 0.001 * starSpeed) / 10.0;
          const lf = 0.05;
          cur.x += (tgt.x - cur.x) * lf; cur.y += (tgt.y - cur.y) * lf;
          curA += (tgtA - curA) * lf;
          program.uniforms.uMouse.value[0] = cur.x;
          program.uniforms.uMouse.value[1] = cur.y;
          program.uniforms.uMouseActiveFactor.value = curA;
          renderer.render({ scene: mesh });
        };
        this._raf = requestAnimationFrame(update);
      } catch (e) { /* no WebGL / CDN blocked — static glow fallback remains */ }
    }
    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
      if (this._surface) { this._surface.removeEventListener('mousemove', this._onMove); this._surface.removeEventListener('mouseleave', this._onLeave); }
      if (this._gl) {
        const c = this._gl.canvas;
        if (c && c.parentNode === this) this.removeChild(c);
        const ext = this._gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext();
        this._gl = null;
      }
      this._booted = false;
    }
  }
  customElements.define('galaxy-bg', GalaxyBg);
})();
