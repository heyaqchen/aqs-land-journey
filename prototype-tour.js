(() => {
  const root=document.getElementById('chapter2-tour');
  const frame=document.getElementById('prototype-frame');
  const tabs=[...root.querySelectorAll('[data-tour-mode]')];
  const names=['平时练习','考场模拟','游戏模式','无限模式'];
  const files=['practice.html','exam.html','game.html','infinite.html'];
  const stage=document.getElementById('demo-stage');
  let active=0,started=false;
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
    fitPhone();started=true;frame.dataset.activeMode=String(active);
    stage.textContent='① 请点击亮起的「'+names[active]+'」模式按键';
    frame.title='AdvanCE 手机交互原型：'+names[active];
    frame.src='prototype/index.html?view=home&tour='+active+'&replay='+Date.now();
  }
  function select(index,focus=false,reload=true){
    active=Math.max(0,Math.min(3,index));
    frame.dataset.activeMode=String(active);
    tabs.forEach((tab,i)=>{tab.setAttribute('aria-selected',String(i===active));tab.tabIndex=i===active?0:-1;document.getElementById(tab.getAttribute('aria-controls')).hidden=i!==active;});
    document.getElementById('previous-mode').disabled=active===0;
    const next=document.getElementById('next-mode');next.disabled=active===3;next.textContent=active===3?'已到最后一种模式':'下一模式：'+names[active+1];
    document.getElementById('mode-count').textContent='0'+(active+1)+' / 04';
    if(focus)tabs[active].focus();
    if(reload)replay();
  }
  // Child pages own highlights; the parent only mirrors the current instruction.
  window.addEventListener('message',event=>{
    if(event.origin!==location.origin||event.source!==frame.contentWindow||root.hidden)return;
    const data=event.data;
    if(data?.type!=='advance-tour-step'||typeof data.text!=='string'||data.text.length>500)return;
    if(Number.isInteger(data.mode)&&data.mode>=0&&data.mode<4)select(data.mode,false,false);
    stage.textContent=data.text;
  });
  tabs.forEach((tab,i)=>{tab.addEventListener('click',()=>select(i));tab.addEventListener('keydown',event=>{let index;if(event.key==='ArrowRight')index=(i+1)%4;else if(event.key==='ArrowLeft')index=(i+3)%4;else if(event.key==='Home')index=0;else if(event.key==='End')index=3;if(index!==undefined){event.preventDefault();select(index,true);}});});
  document.getElementById('previous-mode').addEventListener('click',()=>select(active-1));
  document.getElementById('next-mode').addEventListener('click',()=>select(active+1));
  document.getElementById('replay-mode').addEventListener('click',replay);
  function route(){if(!root.hidden){if(!started)replay();}else{started=false;frame.removeAttribute('src');}}
  window.addEventListener('hashchange',route);route();
})();


