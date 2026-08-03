// <image-slot> — static image placeholder for production use.
// The original Claude Design component supported drag-drop authoring with a sidecar
// JSON file for persistence; none of that applies once this ships as a real site, so
// this is a minimal read-only replacement that keeps the same visual language (dashed
// ring + caption when empty) and the same attributes (id, shape, src, placeholder).
// Set the `src` attribute (a URL or data: URI) to show a real image; otherwise it
// renders the placeholder.
(() => {
  if (customElements.get('image-slot')) return;

  const icon =
    '<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">' +
    '<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/>' +
    '<path d="m21 15-5-5L5 21"/></svg>';

  const stylesheet =
    ':host{display:block;position:relative;width:100%;height:100%;aspect-ratio:3/2;' +
    '  font:13px/1.3 system-ui,-apple-system,sans-serif;color:rgba(245,241,234,.4)}' +
    '.frame{position:absolute;inset:0;overflow:hidden;background:rgba(255,255,255,.03)}' +
    '.frame img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;display:none}' +
    '.empty{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;' +
    '  justify-content:center;gap:6px;text-align:center;padding:12px;box-sizing:border-box;' +
    '  user-select:none}' +
    '.empty svg{opacity:.45}' +
    '.empty .cap{max-width:90%;font-weight:500;letter-spacing:.01em}' +
    '.ring{position:absolute;inset:0;pointer-events:none;border:1.5px dashed rgba(255,255,255,.14)}' +
    ':host([data-filled]) .ring,:host([data-filled]) .empty{display:none}';

  class ImageSlot extends HTMLElement {
    static get observedAttributes() {
      return ['shape', 'radius', 'mask', 'placeholder', 'src'];
    }
    constructor() {
      super();
      const root = this.attachShadow({ mode: 'open' });
      root.innerHTML =
        '<style>' + stylesheet + '</style>' +
        '<div class="frame" part="frame">' +
        '  <img part="image" alt="">' +
        '  <div class="empty" part="empty">' + icon + '<div class="cap"></div></div>' +
        '  <div class="ring" part="ring"></div>' +
        '</div>';
      this._img = root.querySelector('img');
      this._cap = root.querySelector('.cap');
      this._img.addEventListener('load', () => { this._img.style.display = 'block'; });
      this._img.addEventListener('error', () => { this._img.style.display = 'none'; this.removeAttribute('data-filled'); });
    }
    connectedCallback() { this._render(); }
    attributeChangedCallback() { this._render(); }
    _render() {
      const shape = (this.getAttribute('shape') || 'rounded').toLowerCase();
      const radius = this.getAttribute('radius');
      const mask = this.getAttribute('mask');
      const frame = this.shadowRoot.querySelector('.frame');
      if (mask) frame.style.clipPath = mask;
      else if (shape === 'circle') frame.style.borderRadius = '50%';
      else if (shape === 'pill') frame.style.borderRadius = '999px';
      else if (shape === 'rect') frame.style.borderRadius = '0';
      else frame.style.borderRadius = (radius || 12) + 'px';
      this._cap.textContent = this.getAttribute('placeholder') || 'Image';
      const src = this.getAttribute('src');
      if (src) { this._img.src = src; this.setAttribute('data-filled', ''); }
      else { this._img.removeAttribute('src'); this._img.style.display = 'none'; this.removeAttribute('data-filled'); }
    }
  }
  customElements.define('image-slot', ImageSlot);
})();
