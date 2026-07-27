// <magic-rings> — vanilla web component (three.js) concentric glowing-ring background.
// Attributes mirror kebab-case props; defaults match the site's About-v2 usage.
(() => {
  if (customElements.get('magic-rings')) return;
  const VERT = `void main() { gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`;
  const FRAG = `precision highp float;
uniform float uTime, uAttenuation, uLineThickness;
uniform float uBaseRadius, uRadiusStep, uScaleRate;
uniform float uOpacity, uNoiseAmount, uRotation, uRingGap;
uniform float uFadeIn, uFadeOut;
uniform float uMouseInfluence, uHoverAmount, uHoverScale, uParallax, uBurst;
uniform vec2 uResolution, uMouse;
uniform vec3 uColor, uColorTwo;
uniform int uRingCount;
const float HP = 1.5707963;
const float CYCLE = 3.45;
float fade(float t) { return t < uFadeIn ? smoothstep(0.0, uFadeIn, t) : 1.0 - smoothstep(uFadeOut, CYCLE - 0.2, t); }
float ring(vec2 p, float ri, float cut, float t0, float px) {
  float t = mod(uTime + t0, CYCLE);
  float r = ri + t / CYCLE * uScaleRate;
  float d = abs(length(p) - r);
  float a = atan(abs(p.y), abs(p.x)) / HP;
  float th = max(1.0 - a, 0.5) * px * uLineThickness;
  float h = (1.0 - smoothstep(th, th * 1.5, d)) + 1.0;
  d += pow(cut * a, 3.0) * r;
  return h * exp(-uAttenuation * d) * fade(t);
}
void main() {
  float px = 1.0 / min(uResolution.x, uResolution.y);
  vec2 p = (gl_FragCoord.xy - 0.5 * uResolution.xy) * px;
  float cr = cos(uRotation), sr = sin(uRotation);
  p = mat2(cr, -sr, sr, cr) * p;
  p -= uMouse * uMouseInfluence;
  float sc = mix(1.0, uHoverScale, uHoverAmount) + uBurst * 0.3;
  p /= sc;
  vec3 c = vec3(0.0);
  float rcf = max(float(uRingCount) - 1.0, 1.0);
  for (int i = 0; i < 10; i++) {
    if (i >= uRingCount) break;
    float fi = float(i);
    vec2 pr = p - fi * uParallax * uMouse;
    vec3 rc = mix(uColor, uColorTwo, fi / rcf);
    c = mix(c, rc, vec3(ring(pr, uBaseRadius + fi * uRadiusStep, pow(uRingGap, fi), i == 0 ? 0.0 : 2.95 * fi, px)));
  }
  c *= 1.0 + uBurst * 2.0;
  float n = fract(sin(dot(gl_FragCoord.xy + uTime * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
  c += (n - 0.5) * uNoiseAmount;
  gl_FragColor = vec4(c, max(c.r, max(c.g, c.b)) * uOpacity);
}`;
  class MagicRings extends HTMLElement {
    connectedCallback() { if (this._booted) return; this._booted = true; this._boot(); }
    async _boot() {
      try {
        const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.161.0/build/three.module.js');
        if (!this.isConnected) return;
        const num = (n, d) => { const v = this.getAttribute(n); return v === null ? d : parseFloat(v); };
        const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.style.position = 'absolute'; this.style.inset = '0'; this.style.width = '100%'; this.style.height = '100%'; this.style.display = 'block'; this.style.pointerEvents = 'none';
        let renderer;
        try { renderer = new THREE.WebGLRenderer({ alpha: true }); } catch (e) { return; }
        if (!renderer.capabilities.isWebGL2) { renderer.dispose(); return; }
        renderer.setClearColor(0x000000, 0);
        this._renderer = renderer;
        const blur = num('blur', 0.5);
        renderer.domElement.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block' + (blur ? ';filter:blur(' + blur + 'px)' : '');
        this.appendChild(renderer.domElement);
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-0.5, 0.5, 0.5, -0.5, 0.1, 10);
        camera.position.z = 1;
        const uniforms = {
          uTime: { value: 0 },
          uAttenuation: { value: num('attenuation', 12.5) },
          uResolution: { value: new THREE.Vector2() },
          uColor: { value: new THREE.Color(this.getAttribute('color') || '#b64b00') },
          uColorTwo: { value: new THREE.Color(this.getAttribute('color-two') || '#9c4000') },
          uLineThickness: { value: num('line-thickness', 1.5) },
          uBaseRadius: { value: num('base-radius', 0.35) },
          uRadiusStep: { value: num('radius-step', 0.1) },
          uScaleRate: { value: num('scale-rate', 0.15) },
          uRingCount: { value: Math.min(Math.round(num('ring-count', 9)), 10) },
          uOpacity: { value: num('opacity', 1) },
          uNoiseAmount: { value: num('noise-amount', 0.02) },
          uRotation: { value: num('rotation', 0) * Math.PI / 180 },
          uRingGap: { value: num('ring-gap', 1.5) },
          uFadeIn: { value: num('fade-in', 0.5) },
          uFadeOut: { value: num('fade-out', 0.5) },
          uMouse: { value: new THREE.Vector2(0, 0) },
          uMouseInfluence: { value: 0 },
          uHoverAmount: { value: 0 },
          uHoverScale: { value: num('hover-scale', 1.2) },
          uParallax: { value: num('parallax', 0.05) },
          uBurst: { value: 0 }
        };
        const material = new THREE.ShaderMaterial({ vertexShader: VERT, fragmentShader: FRAG, uniforms, transparent: true });
        scene.add(new THREE.Mesh(new THREE.PlaneGeometry(1, 1), material));
        const resize = () => {
          const w = this.clientWidth || 1, h = this.clientHeight || 1, dpr = Math.min(devicePixelRatio, 2);
          renderer.setSize(w, h); renderer.setPixelRatio(dpr);
          uniforms.uResolution.value.set(w * dpr, h * dpr);
        };
        resize();
        this._ro = new ResizeObserver(resize); this._ro.observe(this);
        const speed = num('speed', 0.6);
        if (rm) { uniforms.uTime.value = 1.2; renderer.render(scene, camera); return; } // reduced motion: one static frame
        this._visible = true;
        this._io = new IntersectionObserver((es) => { this._visible = es[0].isIntersecting; });
        this._io.observe(this);
        const animate = (t) => {
          this._raf = requestAnimationFrame(animate);
          if (!this._visible) return; // paused offscreen
          uniforms.uTime.value = t * 0.001 * speed;
          renderer.render(scene, camera);
        };
        this._raf = requestAnimationFrame(animate);
      } catch (e) { /* no WebGL2 / CDN blocked — the static orange glow fallback remains */ }
    }
    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
      if (this._renderer) {
        const c = this._renderer.domElement;
        this._renderer.dispose();
        if (c && c.parentNode === this) this.removeChild(c);
        this._renderer = null;
      }
      this._booted = false;
    }
  }
  customElements.define('magic-rings', MagicRings);
})();
