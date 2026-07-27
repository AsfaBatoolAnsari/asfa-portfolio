// <grainient-bg> — vanilla web component (OGL, WebGL2) warped grain-gradient background.
// Attribute names mirror kebab-case props; defaults match the site's footer usage.
(() => {
  if (customElements.get('grainient-bg')) return;
  const hexToRgb = (hex) => {
    const r = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!r) return [1, 1, 1];
    return [parseInt(r[1], 16) / 255, parseInt(r[2], 16) / 255, parseInt(r[3], 16) / 255];
  };
  const VERT = `#version 300 es
in vec2 position;
void main() {
  gl_Position = vec4(position, 0.0, 1.0);
}`;
  const FRAG = `#version 300 es
precision highp float;
uniform vec2 iResolution;
uniform float iTime;
uniform float uTimeSpeed;
uniform float uColorBalance;
uniform float uWarpStrength;
uniform float uWarpFrequency;
uniform float uWarpSpeed;
uniform float uWarpAmplitude;
uniform float uBlendAngle;
uniform float uBlendSoftness;
uniform float uRotationAmount;
uniform float uNoiseScale;
uniform float uGrainAmount;
uniform float uGrainScale;
uniform float uGrainAnimated;
uniform float uContrast;
uniform float uGamma;
uniform float uSaturation;
uniform vec2 uCenterOffset;
uniform float uZoom;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform vec3 uColor3;
out vec4 fragColor;
#define S(a,b,t) smoothstep(a,b,t)
mat2 Rot(float a){float s=sin(a),c=cos(a);return mat2(c,-s,s,c);}
vec2 hash(vec2 p){p=vec2(dot(p,vec2(2127.1,81.17)),dot(p,vec2(1269.5,283.37)));return fract(sin(p)*43758.5453);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.0-2.0*f);float n=mix(mix(dot(-1.0+2.0*hash(i+vec2(0.0,0.0)),f-vec2(0.0,0.0)),dot(-1.0+2.0*hash(i+vec2(1.0,0.0)),f-vec2(1.0,0.0)),u.x),mix(dot(-1.0+2.0*hash(i+vec2(0.0,1.0)),f-vec2(0.0,1.0)),dot(-1.0+2.0*hash(i+vec2(1.0,1.0)),f-vec2(1.0,1.0)),u.x),u.y);return 0.5+0.5*n;}
void mainImage(out vec4 o, vec2 C){
  float t=iTime*uTimeSpeed;
  vec2 uv=C/iResolution.xy;
  float ratio=iResolution.x/iResolution.y;
  vec2 tuv=uv-0.5+uCenterOffset;
  tuv/=max(uZoom,0.001);
  float degree=noise(vec2(t*0.1,tuv.x*tuv.y)*uNoiseScale);
  tuv.y*=1.0/ratio;
  tuv*=Rot(radians((degree-0.5)*uRotationAmount+180.0));
  tuv.y*=ratio;
  float frequency=uWarpFrequency;
  float ws=max(uWarpStrength,0.001);
  float amplitude=uWarpAmplitude/ws;
  float warpTime=t*uWarpSpeed;
  tuv.x+=sin(tuv.y*frequency+warpTime)/amplitude;
  tuv.y+=sin(tuv.x*(frequency*1.5)+warpTime)/(amplitude*0.5);
  vec3 colLav=uColor1;
  vec3 colOrg=uColor2;
  vec3 colDark=uColor3;
  float b=uColorBalance;
  float s=max(uBlendSoftness,0.0);
  mat2 blendRot=Rot(radians(uBlendAngle));
  float blendX=(tuv*blendRot).x;
  float edge0=-0.3-b-s;
  float edge1=0.2-b+s;
  float v0=0.5-b+s;
  float v1=-0.3-b-s;
  vec3 layer1=mix(colDark,colOrg,S(edge0,edge1,blendX));
  vec3 layer2=mix(colOrg,colLav,S(edge0,edge1,blendX));
  vec3 col=mix(layer1,layer2,S(v0,v1,tuv.y));
  vec2 grainUv=uv*max(uGrainScale,0.001);
  if(uGrainAnimated>0.5){grainUv+=vec2(iTime*0.05);}
  float grain=fract(sin(dot(grainUv,vec2(12.9898,78.233)))*43758.5453);
  col+=(grain-0.5)*uGrainAmount;
  col=(col-0.5)*uContrast+0.5;
  float luma=dot(col,vec3(0.2126,0.7152,0.0722));
  col=mix(vec3(luma),col,uSaturation);
  col=pow(max(col,0.0),vec3(1.0/max(uGamma,0.001)));
  col=clamp(col,0.0,1.0);
  o=vec4(col,1.0);
}
void main(){
  vec4 o=vec4(0.0);
  mainImage(o,gl_FragCoord.xy);
  fragColor=o;
}`;
  class GrainientBg extends HTMLElement {
    connectedCallback() { if (this._booted) return; this._booted = true; this._boot(); }
    async _boot() {
      try {
        const { Renderer, Program, Mesh, Triangle } = await import('https://cdn.jsdelivr.net/npm/ogl@1.0.11/+esm');
        if (!this.isConnected) return;
        const num = (n, d) => { const v = this.getAttribute(n); return v === null ? d : parseFloat(v); };
        const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
        this.style.position = 'absolute'; this.style.inset = '0'; this.style.display = 'block'; this.style.overflow = 'hidden'; this.style.pointerEvents = 'none';
        const renderer = new Renderer({ webgl: 2, alpha: true, antialias: false, dpr: Math.min(devicePixelRatio || 1, 2) });
        const gl = this._gl = renderer.gl;
        const canvas = gl.canvas;
        canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
        this.appendChild(canvas);
        const geometry = new Triangle(gl);
        const program = new Program(gl, {
          vertex: VERT, fragment: FRAG, uniforms: {
            iTime: { value: 0 },
            iResolution: { value: new Float32Array([1, 1]) },
            uTimeSpeed: { value: num('time-speed', 0.25) },
            uColorBalance: { value: num('color-balance', 0) },
            uWarpStrength: { value: num('warp-strength', 1) },
            uWarpFrequency: { value: num('warp-frequency', 5) },
            uWarpSpeed: { value: num('warp-speed', 2) },
            uWarpAmplitude: { value: num('warp-amplitude', 50) },
            uBlendAngle: { value: num('blend-angle', 0) },
            uBlendSoftness: { value: num('blend-softness', 0.05) },
            uRotationAmount: { value: num('rotation-amount', 500) },
            uNoiseScale: { value: num('noise-scale', 2) },
            uGrainAmount: { value: num('grain-amount', 0.1) },
            uGrainScale: { value: num('grain-scale', 2) },
            uGrainAnimated: { value: this.getAttribute('grain-animated') === 'true' ? 1 : 0 },
            uContrast: { value: num('contrast', 1.35) },
            uGamma: { value: num('gamma', 1) },
            uSaturation: { value: num('saturation', 1) },
            uCenterOffset: { value: new Float32Array([num('center-x', 0), num('center-y', 0)]) },
            uZoom: { value: num('zoom', 0.9) },
            uColor1: { value: new Float32Array(hexToRgb(this.getAttribute('color1') || '#ab6636')) },
            uColor2: { value: new Float32Array(hexToRgb(this.getAttribute('color2') || '#2e1809')) },
            uColor3: { value: new Float32Array(hexToRgb(this.getAttribute('color3') || '#682c03')) }
          }
        });
        const mesh = new Mesh(gl, { geometry, program });
        const setSize = () => {
          const rect = this.getBoundingClientRect();
          renderer.setSize(Math.max(1, Math.floor(rect.width)), Math.max(1, Math.floor(rect.height)));
          const res = program.uniforms.iResolution.value;
          res[0] = gl.drawingBufferWidth;
          res[1] = gl.drawingBufferHeight;
          renderer.render({ scene: mesh });
        };
        this._ro = new ResizeObserver(setSize);
        this._ro.observe(this);
        setSize();
        if (rm) { program.uniforms.iTime.value = 8; renderer.render({ scene: mesh }); return; } // reduced motion: static frame
        let raf = 0, isVisible = true, isPageVisible = !document.hidden;
        const t0 = performance.now();
        const loop = (t) => {
          program.uniforms.iTime.value = (t - t0) * 0.001;
          renderer.render({ scene: mesh });
          raf = this._raf = requestAnimationFrame(loop);
        };
        const tryStart = () => { if (isVisible && isPageVisible && raf === 0) raf = this._raf = requestAnimationFrame(loop); };
        const tryStop = () => { if (raf !== 0) { cancelAnimationFrame(raf); raf = this._raf = 0; } };
        this._io = new IntersectionObserver(([e]) => { isVisible = e.isIntersecting; isVisible ? tryStart() : tryStop(); }, { threshold: 0 });
        this._io.observe(this);
        this._onVis = () => { isPageVisible = !document.hidden; isPageVisible ? tryStart() : tryStop(); };
        document.addEventListener('visibilitychange', this._onVis);
        tryStart();
      } catch (e) { /* no WebGL2 / CDN blocked — dark footer base remains */ }
    }
    disconnectedCallback() {
      if (this._raf) cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
      if (this._io) this._io.disconnect();
      if (this._onVis) document.removeEventListener('visibilitychange', this._onVis);
      if (this._gl) {
        const c = this._gl.canvas;
        if (c && c.parentNode === this) this.removeChild(c);
        const ext = this._gl.getExtension('WEBGL_lose_context'); if (ext) ext.loseContext();
        this._gl = null;
      }
      this._booted = false;
    }
  }
  customElements.define('grainient-bg', GrainientBg);
})();
