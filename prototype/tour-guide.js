(() => {
  if (window.frameElement?.id !== 'prototype-frame') return;
  if (document.getElementById('advance-tour-highlights')) return;
  const names = ['平时练习', '考场模拟', '游戏模式', '无限模式'];
  const files = ['practice.html', 'exam.html', 'game.html', 'infinite.html'];
  const home = document.querySelector('main[aria-label="AdvanCE 学习首页"]');
  const style = document.createElement('style');
  style.id = 'advance-tour-highlights';
  style.textContent = `
    .tour-highlight { outline: 3px solid #f59b2e!important; outline-offset: 3px; box-shadow: 0 0 0 6px #ffb65a60,0 0 20px #ffb65a60!important; }
    .tour-confirm { background: #ff942e!important; color: white!important; border-color: #ff942e!important; outline: 3px solid #ef9b36!important; outline-offset: 4px; box-shadow: 0 0 0 8px #ffb65a55!important; animation: advance-confirm-glow 1s ease-in-out infinite alternate; }
    @keyframes advance-confirm-glow { to { box-shadow: 0 0 0 11px #ffb65a30,0 0 22px #ffb65a90; } }
    @media(prefers-reduced-motion:reduce) { .tour-confirm { animation: none; } }
  `;
  document.head.append(style);
  function clear() {
    document.querySelectorAll('.tour-highlight,.tour-confirm').forEach(element => element.classList.remove('tour-highlight', 'tour-confirm'));
  }
  function explain(text, mode) {
    // A local hint remains usable even before the outer page receives the message.
    if (home) document.getElementById('status').textContent = text;
    parent.postMessage({ type: 'advance-tour-step', text, mode }, location.origin);
  }
  if (home) {
    let active = Number(window.frameElement.dataset.activeMode || 0);
    if (!Number.isInteger(active) || active < 0 || active > 3) active = 0;
    document.querySelector(`[data-mode="${names[active]}"]`).classList.add('tour-highlight');
    explain(`① 请点击亮起的「${names[active]}」模式按键`, active);
    document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
      active = names.indexOf(button.dataset.mode);
      clear();
      document.getElementById('confirm').classList.add('tour-confirm');
      explain('② 模式已选好，请点击亮起的「确认」进入', active);
    }));
    return;
  }
  const file = location.pathname.split('/').pop().replace(/\.html$/, '') + '.html';
  const mode = files.indexOf(file);
  const stem = document.getElementById('stem');
  if ([0, 1, 3].includes(mode) && stem) {
    let step = 'mark';
    stem.classList.add('tour-highlight');
    explain('③ 试试勾画：直接长按题干文字，再拖动划选。', mode);
    document.addEventListener('prototype-interaction', event => {
      if (step === 'mark' && event.detail?.type === 'mark') {
        step = 'exclude';
        clear();
        document.querySelectorAll('.option').forEach(option => option.classList.add('tour-highlight'));
        explain('④ 已完成勾画！长按一个选项将它排除，再次长按可恢复；键盘可按 Delete。', mode);
      } else if (step === 'exclude' && event.detail?.type === 'exclude') {
        step = 'answer';
        clear();
        explain(mode === 1 ? '⑤ 排除完成。现在选择保留的答案，继续作答；交卷后可查看报告。' : '⑤ 排除完成。现在选择保留的答案并提交，继续体验解析和其他功能。', mode);
      }
    });
  } else if (mode === 2) {
    const arena = document.querySelector('.arena');
    arena?.classList.add('tour-highlight');
    arena?.addEventListener('click', clear, { once: true });
    explain('③ 请点击手机里的理论泡泡，体验配对游戏。', mode);
  }
})();
