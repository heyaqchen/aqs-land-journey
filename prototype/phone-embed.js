(() => {
  // Only the portfolio tour uses whole-page scaling; standalone prototypes and
  // the separate plans/summary previews retain their existing layouts.
  if (window.frameElement?.id !== 'prototype-frame') return;
  const page = location.pathname.split('/').pop().replace(/\.html$/, '') || 'index';
  document.documentElement.classList.add('phone-embedded');
  document.body.dataset.phonePage = page;

  const canvas = document.createElement('div');
  canvas.id = 'phone-page';
  const content = [...document.body.children].filter(element => !['SCRIPT', 'STYLE', 'LINK', 'DIALOG'].includes(element.tagName));
  canvas.append(...content);
  document.body.prepend(canvas);

  let scheduled = 0;
  let ready = false;
  function fit() {
    scheduled = 0;
    if (!ready) return;
    // offset/scroll sizes are untransformed. The fixed canvas is independent of
    // the viewport height, so fitting cannot change the size being measured.
    const width = Math.max(390, canvas.offsetWidth, canvas.scrollWidth);
    const height = Math.max(1, canvas.offsetHeight, canvas.scrollHeight);
    const scale = Math.min(1, (innerWidth - 8) / width, (innerHeight - 12) / height);
    canvas.style.transform = `scale(${scale})`;
    canvas.style.left = `${(innerWidth - width * scale) / 2}px`;
    canvas.style.visibility = 'visible';
  }
  function schedule() {
    if (!scheduled) scheduled = requestAnimationFrame(fit);
  }
  const resize = new ResizeObserver(schedule);
  resize.observe(canvas);
  const mutations = new MutationObserver(records => {
    if (records.some(record => record.target !== canvas)) schedule();
  });
  mutations.observe(canvas, { subtree: true, childList: true, characterData: true, attributes: true, attributeFilter: ['class', 'style', 'hidden', 'open'] });
  window.addEventListener('resize', schedule);
  document.addEventListener('load', schedule, true);
  document.fonts.ready.then(schedule);

  const sheet = document.createElement('link');
  sheet.rel = 'stylesheet';
  sheet.href = 'phone-fit.css?v=20261011-canvas';
  sheet.addEventListener('load', () => {
    ready = true;
    fit();
    parent.postMessage({ type: 'advance-phone-ready' }, location.origin);
  }, { once: true });
  document.head.append(sheet);
})();
