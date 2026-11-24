(() => {
  const title = document.querySelector('.bio-title');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!title || reducedMotion.matches) return;
  const fullTitle = title.textContent;
  const fragment = document.createDocumentFragment();
  for (const [index, letter] of Array.from(fullTitle).entries()) {
    const span = document.createElement('span');
    span.className = 'title-letter';
    span.textContent = letter;
    span.setAttribute('aria-hidden', 'true');
    span.style.setProperty('--letter-index', index);
    fragment.appendChild(span);
  }
  title.setAttribute('aria-label', fullTitle);
  title.replaceChildren(fragment);
  document.body.classList.add('bio-motion');
  if (!('IntersectionObserver' in window)) return;
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.remove('reveal-pending');
      observer.unobserve(entry.target);
    }
  }, { threshold: 0.01 });
  for (const paragraph of document.querySelectorAll('.bio-content > p')) {
    paragraph.classList.add('reveal-pending');
    observer.observe(paragraph);
  }
  reducedMotion.addEventListener('change', event => {
    if (!event.matches) return;
    document.body.classList.remove('bio-motion');
    observer.disconnect();
  });
})();
