(function () {
  'use strict';
 
  function init() {
    if (!document.querySelector('.post-single')) return;
 
    const bar = document.createElement('div');
    bar.id = 'reading-progress-bar';
    document.body.prepend(bar);
 
    function update() {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      if (docHeight <= 0) return;
      bar.style.width = Math.min(100, (scrollTop / docHeight) * 100) + '%';
    }
 
    window.addEventListener('scroll', update, { passive: true });
    update();
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();