/**
 * post-enhancements.js
 * 1. Wraps tables in a scrollable div so they don't overflow on mobile
 * 2. Adds click-to-zoom lightbox for post images
 * Place at: static/js/post-enhancements.js
 */
(function () {
  'use strict';

  function init() {
    const content = document.querySelector('.post-content');
    if (!content) return;

    // ── 1. WRAP TABLES ────────────────────────────────────────
    content.querySelectorAll('table').forEach(function (table) {
      // Skip if already wrapped
      if (table.parentElement && table.parentElement.classList.contains('table-wrapper')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });

    // ── 2. IMAGE LIGHTBOX ─────────────────────────────────────
    // Build overlay DOM once
    let overlay = document.getElementById('img-lightbox');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = 'img-lightbox';
      overlay.setAttribute('role', 'dialog');
      overlay.setAttribute('aria-modal', 'true');
      overlay.setAttribute('aria-label', 'Image viewer');

      const closeBtn = document.createElement('button');
      closeBtn.id = 'img-lightbox-close';
      closeBtn.setAttribute('aria-label', 'Close');
      closeBtn.innerHTML = '&times;';
      overlay.appendChild(closeBtn);

      const img = document.createElement('img');
      img.alt = '';
      overlay.appendChild(img);

      document.body.appendChild(overlay);

      function closeLightbox() {
        overlay.classList.remove('open');
        document.body.style.overflow = '';
        img.src = '';
      }

      closeBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        closeLightbox();
      });
      overlay.addEventListener('click', function (e) {
        if (e.target !== img) closeLightbox();
      });
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeLightbox();
      });
    }

    const lightboxImg = overlay.querySelector('img');

    // Attach click handlers to all post images (skip linked images)
    content.querySelectorAll('img').forEach(function (img) {
      // Don't attach if the image is already inside an <a> tag
      if (img.closest('a')) return;
      img.addEventListener('click', function () {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt || '';
        overlay.classList.add('open');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();