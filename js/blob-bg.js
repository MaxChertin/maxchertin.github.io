(function () {
  'use strict';
 
  function init() {
    const canvas = document.getElementById('blob-canvas');
    if (!canvas) { console.warn('[blob-bg] canvas#blob-canvas not found'); return; }
 
    const ctx = canvas.getContext('2d');
 
    // Warm amber / orange blob palette — speeds bumped ~30%
    const BLOBS = [
      { x: 0.15, y: 0.20, r: 0.38, color: [249, 115,  22], opacity: 0.07,  speed: 0.00024, phase: 0.00 },
      { x: 0.78, y: 0.55, r: 0.32, color: [251, 146,  60], opacity: 0.055, speed: 0.00018, phase: 1.40 },
      { x: 0.45, y: 0.82, r: 0.28, color: [251, 191,  36], opacity: 0.045, speed: 0.00026, phase: 2.80 },
      { x: 0.88, y: 0.18, r: 0.24, color: [234, 106,  10], opacity: 0.040, speed: 0.00021, phase: 0.90 },
      { x: 0.28, y: 0.65, r: 0.20, color: [253, 186, 116], opacity: 0.035, speed: 0.00031, phase: 3.70 },
    ];
 
    let W, H, dpr;
    let animId;
    // Restore t from sessionStorage so blobs don't reset on navigation
    let t = +(sessionStorage.getItem('blob_t') || 0);
 
    function resize() {
      dpr = window.devicePixelRatio || 1;
      W   = window.innerWidth;
      H   = window.innerHeight;
      canvas.width        = Math.floor(W * dpr);
      canvas.height       = Math.floor(H * dpr);
      canvas.style.width  = W + 'px';
      canvas.style.height = H + 'px';
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    }
 
    function drawBlob(b) {
      const ox = Math.sin(t * b.speed        + b.phase)       * 0.10;
      const oy = Math.cos(t * b.speed * 0.7  + b.phase + 1.2) * 0.08;
      const pulse = 1 + Math.sin(t * b.speed * 1.8 + b.phase) * 0.07;
 
      const cx = (b.x + ox) * W;
      const cy = (b.y + oy) * H;
      const radius = b.r * Math.min(W, H) * pulse;
 
      const [r, g, bv] = b.color;
      const g2 = ctx.createRadialGradient(cx, cy, 0, cx, cy, radius);
      g2.addColorStop(0,    `rgba(${r},${g},${bv},${b.opacity})`);
      g2.addColorStop(0.45, `rgba(${r},${g},${bv},${(b.opacity * 0.45).toFixed(4)})`);
      g2.addColorStop(1,    `rgba(${r},${g},${bv},0)`);
 
      ctx.beginPath();
      ctx.arc(cx, cy, radius, 0, Math.PI * 2);
      ctx.fillStyle = g2;
      ctx.fill();
    }
 
    function frame() {
      ctx.clearRect(0, 0, W, H);
      for (const b of BLOBS) drawBlob(b);
      t++;
      // Save position every 60 frames (~1s) so it survives page navigation
      if (t % 60 === 0) {
        try { sessionStorage.setItem('blob_t', t); } catch (_) {}
      }
      animId = requestAnimationFrame(frame);
    }
 
    resize();
    window.addEventListener('resize', function () {
      cancelAnimationFrame(animId);
      resize();
      frame();
    });
    frame();
  }
 
  // Run immediately — script is at end of body so DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();