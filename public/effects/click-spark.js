/* Global click-spark — spawns the intro cursor's spark burst wherever the visitor clicks.
   Self-contained: one fixed, non-interactive canvas + a document click listener.
   Config lives in ONE place (SPARK below). Respects prefers-reduced-motion. */
(function () {
  if (window.__clickSparkReady) return;
  window.__clickSparkReady = true;

  var SPARK = {
    color: '#FFFFFF',   // white spark burst
    size: 16,           // line length of each spark
    radius: 22,         // how far sparks travel
    count: 8,           // sparks per click
    duration: 420,      // ms
    extraScale: 1.0,
    lineWidth: 2
  };

  if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function init() {
    if (document.getElementById('__clickSparkCanvas')) return;
    var canvas = document.createElement('canvas');
    canvas.id = '__clickSparkCanvas';
    canvas.setAttribute('aria-hidden', 'true');
    canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:2147483000;';
    document.body.appendChild(canvas);
    var ctx = canvas.getContext('2d');
    var dpr = Math.min(window.devicePixelRatio || 1, 2);

    function resize() {
      canvas.width = Math.floor(innerWidth * dpr);
      canvas.height = Math.floor(innerHeight * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
    resize();
    addEventListener('resize', resize, { passive: true });

    var sparks = [];
    var raf = 0;

    function easeOut(t) { return t * (2 - t); }

    function draw(now) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      sparks = sparks.filter(function (s) {
        var elapsed = now - s.t;
        if (elapsed >= SPARK.duration) return false;
        var p = easeOut(elapsed / SPARK.duration);
        var dist = p * SPARK.radius * SPARK.extraScale;
        var len = SPARK.size * (1 - p);
        var x1 = s.x + dist * Math.cos(s.a);
        var y1 = s.y + dist * Math.sin(s.a);
        var x2 = s.x + (dist + len) * Math.cos(s.a);
        var y2 = s.y + (dist + len) * Math.sin(s.a);
        ctx.strokeStyle = SPARK.color;
        ctx.lineWidth = SPARK.lineWidth;
        ctx.globalAlpha = 1 - p;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        return true;
      });
      ctx.globalAlpha = 1;
      if (sparks.length) { raf = requestAnimationFrame(draw); }
      else { raf = 0; }
    }

    addEventListener('pointerdown', function (e) {
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      var now = performance.now();
      for (var i = 0; i < SPARK.count; i++) {
        sparks.push({ x: e.clientX, y: e.clientY, a: (2 * Math.PI * i) / SPARK.count, t: now });
      }
      if (!raf) raf = requestAnimationFrame(draw);
    }, { passive: true });
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
