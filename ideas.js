(() => {
 const root=document.getElementById('chapter2-ideas'),frame=document.getElementById('reflection-frame'),viewport=frame.parentElement;
 let current='plans',started=false;
 function fit(){const scale=viewport.clientWidth/390;viewport.style.height=(780*scale)+'px';frame.style.transform='scale('+scale+')';}
 new ResizeObserver(fit).observe(viewport);
 function display(page){current=page;started=true;root.querySelectorAll('[data-reflection]').forEach(button=>button.setAttribute('aria-pressed',String(button.dataset.reflection===page)));frame.title=(page==='plans'?'计划表':'每日总结')+'交互原型';frame.src='prototype/'+page+'.html';}
 root.querySelectorAll('[data-reflection]').forEach(button=>button.addEventListener('click',()=>display(button.dataset.reflection)));
 root.querySelectorAll('[data-idea-section]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.ideaSection).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'})));
 function route(){if(!root.hidden&&!started)display(current);}
 window.addEventListener('hashchange',route);route();
})();
