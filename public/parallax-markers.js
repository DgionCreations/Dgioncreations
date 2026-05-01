/* ----- Image parallax fallback (for browsers without animation-timeline) ----- */
(function () {
  const supportsViewTimeline = CSS.supports('animation-timeline: view()');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (supportsViewTimeline || reduceMotion) return;

  const images = document.querySelectorAll('[data-img]');
  if (!images.length) return;

  const visible = new Set();
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) visible.add(e.target);
        else visible.delete(e.target);
      });
      if (visible.size) schedule();
    },
    { rootMargin: '20% 0px 20% 0px', threshold: 0 }
  );
  images.forEach((img) => io.observe(img));

  let ticking = false;
  function schedule() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }

  function update() {
    ticking = false;
    if (!visible.size) return;
    const vh = window.innerHeight;
    const range = window.innerWidth < 720 ? 12 : 22;
    visible.forEach((img) => {
      const r = img.parentElement.getBoundingClientRect();
      const progress = (vh - r.top) / (vh + r.height);
      const clamped = Math.max(0, Math.min(1, progress));
      const y = -range * clamped;
      img.style.setProperty('--parallax-y', y + '%');
    });
    if (visible.size) schedule();
  }

  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  schedule();
})();
