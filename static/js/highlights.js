(() => {
  document.querySelectorAll('[data-highlight-carousel]').forEach(section => {
    const track = section.querySelector('.highlights-grid');
    const controls = section.querySelector('.highlight-controls');
    const previous = controls.querySelector('[data-carousel-previous]');
    const next = controls.querySelector('[data-carousel-next]');
    const cards = Array.from(track.children);
    if (cards.length < 2) return;
        const update = () => {
      controls.hidden = track.scrollWidth <= track.clientWidth + 2;
      previous.disabled = track.scrollLeft <= 2;
      next.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 2;
    };
    const move = direction => {
      const step = cards[0].getBoundingClientRect().width + parseFloat(getComputedStyle(track).gap);
      track.scrollBy({left: direction * step, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth'});
    };
    previous.addEventListener('click', () => move(-1));
    next.addEventListener('click', () => move(1));
    track.addEventListener('scroll', update, {passive: true});
    new ResizeObserver(update).observe(track);
    update();
  });
})();
