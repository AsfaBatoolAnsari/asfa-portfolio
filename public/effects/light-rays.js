// <light-rays> — vanilla web component (WebGL) volumetric light-ray background.
// Attributes mirror kebab-case props; defaults match the site's footer usage.
(() => {
  if (customElements.get('light-rays')) return;
  const hexToRgb = (hex) => {
    const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return m ? [parseInt(m[1], 16) / 255, parseInt(m[2], 16) / 255, parseInt(m[3], 16) / 255] : [1, 1, 1];
  };
  const anchorDir = (origin, w, h) => {
    const o = 0.2;
    switch (origin) {
      case 'top-left': return { anchor: [0, -o * h], dir: [0, 1] };
      case 'top-right': return { anchor: [w, -o * h], dir: [0, 1] };
      case 'left': return { anchor: [-o * w, 0.5 * h], dir: [1, 0] };
      case 'right': return { anchor: [(1 + o) * w, 0.5 * h], dir: [-1, 0] };
      case 'bottom-left': return { anchor: [0, (1 + o) * h], dir: [0, -1] };
      case 'bottom-center': return { anchor: [0.5 * w, (1 + o) * h], dir: [0, -1] };
      case 'bottom-right': return { anchor: [w, (1 + o) * h], dir: [0, -1] };
      default: return { anchor: [0.5 * w, -o * h], dir: [0, 1] };
    }
  };
  const VERT = `attribute vec2 position;
varying vec2 vUv;
void main(){ vUv = position * 0.5 + 0.5; gl_Position = vec4(position, 0.0, 1.0); }`;
  const FRAG = `precision highp float;
uniform float iTime; uniform vec2 iResolution;
uniform vec2 rayPos; uniform vec2 rayDir; uniform vec3 raysColor;
uniform float raysSpeed; uniform float lightSpread; uniform float rayLength;
uniform float pulsating; uniform float fadeDistance; uniform float saturation;
uniform vec2 mousePos; uniform float mouseInfluence; uniform float noiseAmount; uniform float distortion;
varying vec2 vUv;
float noise(vec2 st){ return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123); }
float rayStrength(vec2 raySource, vec2 rayRefDirection, vec2 coord, float seedA, float seedB, float speed){
  vec2 sourceToCoord = coord - raySource;
  vec2 dirNorm = normalize(sourceToCoord);
  float cosAngle = dot(dirNorm, rayRefDirection);
  float distortedAngle = cosAngle + distortion * sin(iTime * 2.0 + length(sourceToCoord) * 0.01) * 0.2;
  float spreadFactor = pow(max(distortedAngle, 0.0), 1.0 / max(lightSpread, 0.001));
  float distance = length(sourceToCoord);
  float maxDistance = iResolution.x * rayLength;
  float lengthFalloff = clamp((maxDistance - distance) / maxDistance, 0.0, 1.0);
  float fadeFalloff = clamp((iResolution.x * fadeDistance - distance) / (iResolution.x * fadeDistance), 0.5, 1.0);
  float pulse = pulsating > 0.5 ? (0.8 + 0.2 * sin(iTime * speed * 3.0)) : 1.0;
  float baseStrength = clamp(
    (0.45 + 0.15 * sin(distortedAngle * seedA + iTime * speed)) +
    (0.3 + 0.2 * cos(-distortedAngle * seedB + iTime * speed)), 0.0, 1.0);
  return baseStrength * lengthFalloff * fadeFalloff * spreadFactor * pulse;
}
void mainImage(out vec4 fragColor, in vec2 fragCoord){
  vec2 coord = vec2(fragCoord.x, iResolution.y - fragCoord.y);
  vec2 finalRayDir = rayDir;
  if (mouseInfluence > 0.0){
    vec2 mouseScreenPos = mousePos * iResolution.xy;
    vec2 mouseDirection = normalize(mouseScreenPos - rayPos);
    finalRayDir = normalize(mix(rayDir, mouseDirection, mouseInfluence));
  }
  vec4 rays1 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 36.2214, 21.11349, 1.5 * raysSpeed);
  vec4 rays2 = vec4(1.0) * rayStrength(rayPos, finalRayDir, coord, 22.3991, 18.0234, 1.1 * raysSpeed);
  fragColor = rays1 * 0.5 + rays2 * 0.4;
  if (noiseAmount > 0.0){ float n = noise(coord * 0.01 + iTime * 0.1); fragColor.rgb *= (1.0 - noiseAmount + noiseAmount * n); }
  float brightness = 1.0 - (coord.y / iResolution.y);
  fragColor.x *= 0.1 + brightness * 0.8;
  fragColor.y *= 0.3 + brightness * 0.6;
  fragColor.z *= 0.5 + brightness * 0.5;
  if (saturation != 1.0){ float gray = dot(fragColor.rgb, vec3(0.299, 0.587, 0.114)); fragColor.rgb = mix(vec3(gray), fragColor.rgb, saturation); }
  fragColor.rgb *= raysColor;
}
void main(){ vec4 color; mainImage(color, gl_FragCoord.xy); gl_FragColor = color; }`;

  const num = (v, d) => { const n = parseFloat(v); return isNaN(n) ? d : n; };
  const compile = (gl, type, src) => {
    const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.warn('light-rays shader', gl.getShaderInfoLog(s)); }
    return s;
  };

  class LightRays extends HTMLElement {
    connectedCallback() {
      if (this._init) return;
      this._init = true;
      this.style.display = 'block';
      this.style.width = '100%';
      this.style.height = '100%';
      this.style.position = 'relative';
      this.style.pointerEvents = 'none';
      this.style.overflow = 'hidden';
      this._mouse = { x: 0.5, y: 0.5 };
      this._smooth = { x: 0.5, y: 0.5 };
      this._visible = false;
      this._io = new IntersectionObserver((e) => {
        this._visible = e[0].isIntersecting;
        if (this._visible) this._start(); else this._stop();
      }, { threshold: 0.05 });
      this._io.observe(this);
      if (this._attr('follow-mouse', '1') !== '0') {
        this._onMove = (ev) => {
          const r = this.getBoundingClientRect();
          this._mouse = { x: (ev.clientX - r.left) / r.width, y: (ev.clientY - r.top) / r.height };
        };
        window.addEventListener('mousemove', this._onMove, { passive: true });
      }
    }
    disconnectedCallback() {
      this._stop();
      if (this._io) this._io.disconnect();
      if (this._onMove) window.removeEventListener('mousemove', this._onMove);
      this._teardownGL();
    }
    _attr(name, d) { const v = this.getAttribute(name); return v == null ? d : v; }
    async _start() {
      if (this._raf || this._booting) return;
      this._booting = true;
      if (!this._visible || !this.isConnected) { this._booting = false; return; }
      const canvas = document.createElement('canvas');
      canvas.style.cssText = 'width:100%;height:100%;display:block';
      const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: false }) || canvas.getContext('experimental-webgl');
      if (!gl) { this._booting = false; return; }
      this.appendChild(canvas);
      this._canvas = canvas; this._gl = gl;
      const prog = gl.createProgram();
      gl.attachShader(prog, compile(gl, gl.VERTEX_SHADER, VERT));
      gl.attachShader(prog, compile(gl, gl.FRAGMENT_SHADER, FRAG));
      gl.bindAttribLocation(prog, 0, 'position');
      gl.linkProgram(prog);
      gl.useProgram(prog);
      const buf = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buf);
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
      gl.enableVertexAttribArray(0);
      gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
      this._prog = prog;
      const loc = (n) => gl.getUniformLocation(prog, n);
      const U = {
        iTime: loc('iTime'), iResolution: loc('iResolution'), rayPos: loc('rayPos'), rayDir: loc('rayDir'),
        raysColor: loc('raysColor'), raysSpeed: loc('raysSpeed'), lightSpread: loc('lightSpread'), rayLength: loc('rayLength'),
        pulsating: loc('pulsating'), fadeDistance: loc('fadeDistance'), saturation: loc('saturation'),
        mousePos: loc('mousePos'), mouseInfluence: loc('mouseInfluence'), noiseAmount: loc('noiseAmount'), distortion: loc('distortion'),
      };
      const followMouse = this._attr('follow-mouse', '1') !== '0';
      const col = hexToRgb(this._attr('rays-color', '#ffffff'));
      const cfg = {
        raysSpeed: num(this._attr('rays-speed'), 1), lightSpread: num(this._attr('light-spread'), 1),
        rayLength: num(this._attr('ray-length'), 2), pulsating: this._attr('pulsating', '0') !== '0' ? 1 : 0,
        fadeDistance: num(this._attr('fade-distance'), 1), saturation: num(this._attr('saturation'), 1),
        mouseInfluence: num(this._attr('mouse-influence'), 0.1), noiseAmount: num(this._attr('noise-amount'), 0),
        distortion: num(this._attr('distortion'), 0),
      };
      const origin = this._attr('rays-origin', 'top-center');
      let W = 1, H = 1;
      const place = () => {
        const dpr = Math.min(devicePixelRatio, 2);
        const r = this.getBoundingClientRect();
        const wCSS = r.width || this.offsetWidth || 1, hCSS = r.height || this.offsetHeight || 1;
        canvas.width = Math.max(1, Math.floor(wCSS * dpr));
        canvas.height = Math.max(1, Math.floor(hCSS * dpr));
        gl.viewport(0, 0, canvas.width, canvas.height);
        W = canvas.width; H = canvas.height;
      };
      this._place = place;
      this._ro = new ResizeObserver(place); this._ro.observe(this);
      if (this.parentElement) this._ro.observe(this.parentElement);
      addEventListener('resize', place, { passive: true });
      this._onResize = place;
      place();
      const t0 = performance.now();
      const loop = (t) => {
        if (!this._gl) return;
        gl.useProgram(prog);
        gl.uniform1f(U.iTime, (t - t0) * 0.001);
        gl.uniform2f(U.iResolution, W, H);
        const { anchor, dir } = anchorDir(origin, W, H);
        gl.uniform2f(U.rayPos, anchor[0], anchor[1]);
        gl.uniform2f(U.rayDir, dir[0], dir[1]);
        gl.uniform3f(U.raysColor, col[0], col[1], col[2]);
        gl.uniform1f(U.raysSpeed, cfg.raysSpeed);
        gl.uniform1f(U.lightSpread, cfg.lightSpread);
        gl.uniform1f(U.rayLength, cfg.rayLength);
        gl.uniform1f(U.pulsating, cfg.pulsating);
        gl.uniform1f(U.fadeDistance, cfg.fadeDistance);
        gl.uniform1f(U.saturation, cfg.saturation);
        if (followMouse && cfg.mouseInfluence > 0) {
          const s = 0.92;
          this._smooth.x = this._smooth.x * s + this._mouse.x * (1 - s);
          this._smooth.y = this._smooth.y * s + this._mouse.y * (1 - s);
          gl.uniform2f(U.mousePos, this._smooth.x, this._smooth.y);
        } else { gl.uniform2f(U.mousePos, 0.5, 0.5); }
        gl.uniform1f(U.mouseInfluence, cfg.mouseInfluence);
        gl.uniform1f(U.noiseAmount, cfg.noiseAmount);
        gl.uniform1f(U.distortion, cfg.distortion);
        gl.drawArrays(gl.TRIANGLES, 0, 3);
        this._raf = requestAnimationFrame(loop);
      };
      this._raf = requestAnimationFrame(loop);
      this._booting = false;
    }
    _stop() { if (this._raf) { cancelAnimationFrame(this._raf); this._raf = 0; } }
    _teardownGL() {
      this._stop();
      if (this._ro) { this._ro.disconnect(); this._ro = null; }
      if (this._onResize) { removeEventListener('resize', this._onResize); this._onResize = null; }
      if (this._gl) {
        try {
          this._gl.getExtension('WEBGL_lose_context')?.loseContext();
          if (this._canvas && this._canvas.parentNode) this._canvas.parentNode.removeChild(this._canvas);
        } catch (e) {}
        this._gl = null; this._canvas = null; this._prog = null;
      }
    }
  }
  customElements.define('light-rays', LightRays);
})();
