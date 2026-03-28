(function () {
  'use strict';
 
  function init() {
    // Only run on single post pages
    const postContent = document.querySelector('.post-content');
    if (!postContent) return;
 
    // Collect all h1, h2 and h3 headings that have an id
    const headings = Array.from(
      postContent.querySelectorAll('h1[id], h2[id], h3[id]')
    );
    if (headings.length < 2) return; // not worth showing TOC for 0-1 headings
 
    // ── Build sidebar DOM ─────────────────────────────────────
    const sidebar = document.createElement('nav');
    sidebar.className = 'toc-sidebar';
    sidebar.setAttribute('aria-label', 'Table of contents');
 
    const title = document.createElement('div');
    title.className = 'toc-sidebar-title';
    title.textContent = 'On this page';
    sidebar.appendChild(title);
 
    const list = document.createElement('ol');
    const linkMap = new Map(); // id → <a> element
 
    headings.forEach(function (h) {
      const li   = document.createElement('li');
      const a    = document.createElement('a');
      a.href     = '#' + h.id;
      a.textContent = h.textContent.replace(/#\s*$/, '').trim();
      a.dataset.id  = h.id;
 
      if (h.tagName === 'H3') {
        // Nest under last h2, or last h1 if no h2 yet
        const parentLi = list.querySelector(':scope > li:last-child');
        if (parentLi) {
          let subList = parentLi.querySelector('ol');
          if (!subList) {
            subList = document.createElement('ol');
            parentLi.appendChild(subList);
          }
          // Try to nest under last h2 inside this parent
          const lastH2Li = subList.querySelector('li:last-child');
          if (lastH2Li && lastH2Li.dataset.level === 'h2') {
            let subSubList = lastH2Li.querySelector('ol');
            if (!subSubList) {
              subSubList = document.createElement('ol');
              lastH2Li.appendChild(subSubList);
            }
            const subSubLi = document.createElement('li');
            subSubLi.appendChild(a);
            subSubList.appendChild(subSubLi);
          } else {
            const subLi = document.createElement('li');
            subLi.appendChild(a);
            subList.appendChild(subLi);
          }
          linkMap.set(h.id, a);
          return;
        }
      }
 
      if (h.tagName === 'H2') {
        // Nest under last h1
        const parentLi = list.querySelector(':scope > li:last-child');
        if (parentLi && parentLi.dataset.level === 'h1') {
          console.log("h2: i found h1!!")
          let subList = parentLi.querySelector('ol');
          if (!subList) {
            subList = document.createElement('ol');
            parentLi.appendChild(subList);
          }
          const subLi = document.createElement('li');
          subLi.dataset.level = 'h2';
          subLi.appendChild(a);
          subList.appendChild(subLi);
          linkMap.set(h.id, a);
          return;
        }
      }
 
      li.dataset.level = h.tagName.toLowerCase();
      li.appendChild(a);
      list.appendChild(li);
      linkMap.set(h.id, a);
    });
 
    sidebar.appendChild(list);
    document.body.appendChild(sidebar);
 
    // ── Smooth scroll on click ────────────────────────────────
    sidebar.addEventListener('click', function (e) {
      const a = e.target.closest('a[href^="#"]');
      if (!a) return;
      e.preventDefault();
      const target = document.getElementById(a.dataset.id);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Update URL without triggering scroll
        history.pushState(null, '', '#' + a.dataset.id);
      }
    });
 
    // ── Scroll-spy ─────────────────────────────────────────────
    let activeId = null;
    const OFFSET = 120; // px from top — accounts for sticky header
 
    function updateActive() {
      const scrollY = window.scrollY;
      let current  = headings[0].id; // default to first
 
      for (const h of headings) {
        const top = h.getBoundingClientRect().top + scrollY - OFFSET;
        if (scrollY >= top) current = h.id;
      }
 
      if (current === activeId) return;
      activeId = current;
 
      linkMap.forEach(function (a, id) {
        if (id === activeId) {
          a.classList.add('toc-active');
          // Scroll the sidebar so the active item is visible
          const liTop = a.offsetTop;
          const sideH = sidebar.clientHeight;
          const scrollT  = sidebar.scrollTop;
          if (liTop < scrollT + 20 || liTop > scrollT + sideH - 40) {
            sidebar.scrollTo({ top: liTop - sideH / 2, behavior: 'smooth' });
          }
        } else {
          a.classList.remove('toc-active');
        }
      });
    }
 
    window.addEventListener('scroll', updateActive, { passive: true });
    updateActive();
  }
 
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();