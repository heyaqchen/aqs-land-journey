(() => {
  const root=document.getElementById('chapter2-tour');
  const frame=document.getElementById('prototype-frame');
  const tabs=[...root.querySelectorAll('[data-tour-mode]')];
  const names=['平时练习','考场模拟','游戏模式','无限模式'];
  const files=['practice.html','exam.html','game.html','infinite.html'];
  const stage=document.getElementById('demo-stage');
  let active=0,started=false,pending=false,timer,preparedDocument=null;
  const viewport=document.createElement('div');viewport.className='phone-viewport';frame.before(viewport);viewport.append(frame);
  frame.setAttribute('scrolling','no');
  function fitPhone(){
    const width=viewport.clientWidth;if(!width)return;
    // Keep a stable mobile viewport. Each prototype fits its own content inside it.
    // Resizing the iframe to its document height creates a viewport/layout loop.
    viewport.style.height=(width*2)+'px';
    frame.style.setProperty('width','390px','important');
    frame.style.setProperty('height','780px','important');
    frame.style.position='absolute';frame.style.top='0';
    frame.style.left='0';
    frame.style.transform='scale('+(width/390)+')';
  }
  new ResizeObserver(fitPhone).observe(viewport);fitPhone();
  function replay(){
    clearTimeout(timer);fitPhone();pending=true;started=true;
    stage.textContent=names[active]+' · 模式入口';
    frame.title='AdvanCE 手机交互原型：'+names[active];
    frame.src='prototype/index.html?view=home&tour='+active+'&replay='+Date.now();
  }
  function select(index,focus=false,reload=true){
    active=Math.max(0,Math.min(3,index));
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===active));tab.tabIndex=i===active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=i!==active;});
    document.getElementById('previous-mode').disabled=active===0;
    const next=document.getElementById('next-mode');next.disabled=active===3;next.textContent=active===3?'已到最后一种模式':'下一模式：'+names[active+1];
    document.getElementById('mode-count').textContent='0'+(active+1)+' / 04';
    if(focus)tabs[active].focus();
    if(reload)replay();
  }
  function prepareDocument(){
    clearTimeout(timer);
    const doc=frame.contentDocument;if(!doc?.body||!doc.querySelector('main')||doc===preparedDocument)return;
    preparedDocument=doc;
    // Hosted static pages can use directory or extensionless URLs.
    const current=doc.querySelector('main[aria-label="AdvanCE 学习首页"]')?'index.html':(doc.location.pathname.split('/').pop()||'index').replace(/\.html$/,'')+'.html';
    const fitStyle=doc.createElement('style');
    fitStyle.textContent='html{overflow-x:hidden}body{max-width:100%;overflow-wrap:break-word}img{max-width:100%}.topbar,.topinner{max-width:100%}.pager{flex-wrap:wrap}select{max-width:100%}.tour-highlight{box-shadow:0 0 0 5px #ffb65a99,0 0 24px #ffb65a88!important;outline:2px solid #f69a28;outline-offset:5px}.tour-confirm{background:#ff942e!important;color:#fff!important;border-color:#ff942e!important;box-shadow:0 0 0 7px #ffb65a66,0 0 28px #ffb65aaa!important;animation:confirm-glow .6s ease-in-out infinite alternate}@keyframes confirm-glow{to{box-shadow:0 0 0 10px #ffb65a33,0 0 34px #ffb65abb}}@media(prefers-reduced-motion:reduce){.tour-confirm{animation:none}}';
    doc.head.append(fitStyle);
    function explain(text){stage.textContent=text;}
    if(current==='index.html'){
      pending=false;
      const button=doc.querySelector('[data-mode="'+names[active]+'"]');
      if(!button){stage.textContent='原型加载中，可点击重看模式入口';return;}
      button.classList.add('tour-highlight');
      explain('① 请点击亮起的「'+names[active]+'」模式按键');
      const confirm=doc.getElementById('confirm');
      doc.querySelectorAll('[data-mode]').forEach(choice=>choice.addEventListener('click',()=>{const index=names.indexOf(choice.dataset.mode);if(index>=0)select(index,false,false);doc.querySelectorAll('.tour-highlight').forEach(el=>el.classList.remove('tour-highlight'));confirm.classList.add('tour-confirm');explain('② 模式已选好，请点击亮起的「确认」进入');}));
    }else{
      const i=files.indexOf(current);
      if(i>=0)select(i,false,false);
      if([0,1,3].includes(i)){
        const stem=doc.getElementById('stem');stem.classList.add('tour-highlight');
        explain('③ 试试勾画：直接长按题干文字，再拖动划选。');
        let step='mark';
        doc.addEventListener('prototype-interaction',event=>{if(step==='mark'&&event.detail.type==='mark'){step='exclude';stem.classList.remove('tour-highlight');doc.querySelectorAll('.option').forEach(el=>el.classList.add('tour-highlight'));explain('④ 已完成勾画！长按一个选项将它排除，再次长按可恢复；键盘可按 Delete。');}else if(step==='exclude'&&event.detail.type==='exclude'){step='answer';doc.querySelectorAll('.tour-highlight').forEach(el=>el.classList.remove('tour-highlight'));explain(i===1?'⑤ 排除完成。现在选择保留的答案，继续作答；交卷后可查看报告。':'⑤ 排除完成。现在选择保留的答案并提交，继续体验解析和其他功能。');}});
      }else explain(i===2?'③ 请点击手机里的理论泡泡，体验配对游戏。':'可在手机内继续操作，或点击「重看模式入口」重新体验。');
    }
  }
  frame.addEventListener('load',prepareDocument);
  // The child announces DOM readiness; do not wait for every asset's load event.
  window.addEventListener('message',event=>{
    if(event.origin===location.origin&&event.source===frame.contentWindow&&event.data?.type==='advance-phone-ready')prepareDocument();
  });
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',event=>{let index;if(event.key==='ArrowRight')index=(i+1)%4;else if(event.key==='ArrowLeft')index=(i+3)%4;else if(event.key==='Home')index=0;else if(event.key==='End')index=3;if(index!==undefined){event.preventDefault();select(index,true);}});});
  document.getElementById('previous-mode').addEventListener('click',()=>select(active-1));
  document.getElementById('next-mode').addEventListener('click',()=>select(active+1));
  document.getElementById('replay-mode').addEventListener('click',replay);
  function route(){if(!root.hidden){if(!started)replay();}else{clearTimeout(timer);pending=false;started=false;frame.removeAttribute('src');}}
  window.addEventListener('hashchange',route);route();
})();


