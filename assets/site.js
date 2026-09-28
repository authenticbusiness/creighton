/* Machine-authored by Codex/OpenAI. Static content works without this progressive enhancement. */
(() => {
  'use strict';
  const node = document.querySelector('#portfolio-data');
  if (!node) return;
  const photos = JSON.parse(node.textContent);
  const featured = document.querySelector('.featured');
  if (!featured) return;
  const image = document.querySelector('#featured-image');
  const title = document.querySelector('#photo-title');
  const caption = document.querySelector('#photo-caption');
  const status = document.querySelector('#photo-status');
  const enlarge = document.querySelector('.enlarge');
  const previous = document.querySelector('.previous');
  const next = document.querySelector('.next');
  const thumbs = [...document.querySelectorAll('.thumbnail-grid a[data-photo-id]')];
  const dialog = document.querySelector('.lightbox');
  const byId = new Map(photos.map((photo, i) => [photo.id, i]));
  let current = byId.get(featured.dataset.photoId) ?? 0;
  function updateDialog() {
    if (!dialog || !dialog.open) return;
    const photo = photos[current];
    dialog.querySelector('figure > img').src = photo.image;
    dialog.querySelector('figure > img').alt = photo.title;
    dialog.querySelector('.lightbox-title').textContent = photo.title;
    dialog.querySelector('.lightbox-caption').textContent = photo.caption;
    dialog.querySelector('.lightbox-caption').hidden = !photo.caption;
  }
  function select(index, announce = true) {
    current = (index + photos.length) % photos.length;
    const photo = photos[current];
    image.src = photo.image;
    image.alt = photo.title;
    image.width = photo.width;
    image.height = photo.height;
    title.textContent = photo.title;
    caption.textContent = photo.caption;
    caption.hidden = !photo.caption;
    enlarge.href = photo.image;
    enlarge.setAttribute('aria-label', `Enlarge ${photo.title}`);
    featured.dataset.photoId = photo.id;
    document.querySelector('.story-context').hidden = !photo.id.startsWith('new-external-');
    document.title = `${photo.title} · Creighton Photography`;
    previous.href = photos[(current - 1 + photos.length) % photos.length].page;
    next.href = photos[(current + 1) % photos.length].page;
    thumbs.forEach(thumb => {
      if (thumb.dataset.photoId === photo.id) thumb.setAttribute('aria-current', 'true');
      else thumb.removeAttribute('aria-current');
    });
    if (announce) status.textContent = `${photo.title}. Photograph ${current + 1} of ${photos.length}.`;
    try { sessionStorage.setItem('creighton-0.3-last-photo', photo.id); } catch (_) { /* file access may disable storage */ }
    updateDialog();
  }
  const normalClick = event => event.button === 0 && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey;
  thumbs.forEach(thumb => thumb.addEventListener('click', event => {
    if (!normalClick(event)) return;
    event.preventDefault();
    select(byId.get(thumb.dataset.photoId));
    const bounds = featured.getBoundingClientRect();
    if (bounds.bottom < 100) featured.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
  }));
  [[previous, -1], [next, 1]].forEach(([link, delta]) => link.addEventListener('click', event => {
    if (!normalClick(event)) return;
    event.preventDefault(); select(current + delta);
  }));
  if (dialog && typeof dialog.showModal === 'function') {
    enlarge.addEventListener('click', event => {
      if (!normalClick(event)) return;
      event.preventDefault(); dialog.showModal(); updateDialog();
    });
    dialog.querySelector('.lightbox-close').addEventListener('click', () => dialog.close());
    dialog.querySelector('.lightbox-prev').addEventListener('click', () => select(current - 1));
    dialog.querySelector('.lightbox-next').addEventListener('click', () => select(current + 1));
    dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
    dialog.addEventListener('close', () => enlarge.focus());
  }
  document.addEventListener('keydown', event => {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey || event.target.closest('input,textarea,select,[contenteditable=true]')) return;
    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
      event.preventDefault(); select(current + (event.key === 'ArrowLeft' ? -1 : 1));
    }
  });
  let touchStart = null;
  document.querySelector('.photo-stage').addEventListener('touchstart', event => {
    if (event.touches.length === 1) touchStart = { x: event.touches[0].clientX, y: event.touches[0].clientY };
  }, { passive: true });
  document.querySelector('.photo-stage').addEventListener('touchend', event => {
    if (!touchStart || event.changedTouches.length !== 1) return;
    const dx = event.changedTouches[0].clientX - touchStart.x;
    const dy = event.changedTouches[0].clientY - touchStart.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) select(current + (dx < 0 ? 1 : -1));
    touchStart = null;
  }, { passive: true });
  if (document.body.dataset.random === 'true') {
    let prior;
    try { prior = byId.get(sessionStorage.getItem('creighton-0.3-last-photo')); } catch (_) { /* random selection still works without storage */ }
    select(CreightonSelection.chooseStart(photos.length, prior), false);
  }
})();
