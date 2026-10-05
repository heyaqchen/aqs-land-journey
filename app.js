const views=[...document.querySelectorAll('main > section')];
function positionPet(){const hero=document.getElementById('home');if(hero.hidden)return;const s=Math.max(hero.clientWidth/1325,hero.clientHeight/1080),offset=(hero.clientWidth-1325*s)/2;const target=document.getElementById('pet');Object.assign(target.style,{left:(offset+430*s)+'px',top:(110*s)+'px',width:(405*s)+'px',height:(112*s)+'px'});const caption=document.querySelector('.pet-caption');caption.style.left=(offset+648*s)+'px';caption.style.top='calc('+(115*s)+'px - 0.3cm)';}
function show(){const id=location.hash.slice(1)||'home';const active=views.find(view=>view.id===id)||views[0];for(const view of views)view.hidden=view!==active;document.title=active.id==='home'?"welcome to aq's world":active.getAttribute('aria-label')+" · aq's world";window.scrollTo(0,0);positionPet();const heading=active.querySelector('h1');if(heading&&active.id!=='home')heading.focus({preventScroll:true});}
const notice=document.getElementById('notice');document.getElementById('close').addEventListener('click',()=>notice.close());notice.addEventListener('click',event=>{if(event.target===notice)notice.close()});window.addEventListener('hashchange',show);window.addEventListener('resize',positionPet);show();
document.addEventListener('click',event=>{const link=event.target.closest('a[href^="#"]');if(!link)return;event.preventDefault();const next=link.getAttribute('href');if(location.hash===next||(!location.hash&&next==='#'))show();else location.hash=next;});
for(const button of document.querySelectorAll('[data-go]'))button.addEventListener('click',()=>{location.hash=button.dataset.go;show();});

// Keep the S-shaped route clear of text at every viewport size.
function layoutJourney(){
 const root=document.getElementById('journey');if(root.hidden)return;
 const track=root.querySelector('.timeline'),nodes=[...track.querySelectorAll('.milestone')],w=track.clientWidth,mobile=w<=1800;
 const copyWidth=mobile?Math.min(w*.82,1100):Math.min(w*.32,680);track.style.setProperty('--copy-width',copyWidth+'px');
 const heights=nodes.map(n=>n.querySelector('.node-copy').getBoundingClientRect().height);
 let ys,xs,h,d,tapers;
 if(mobile){
  ys=[190];for(let i=1;i<6;i++)ys.push(ys[i-1]+heights[i-1]+(i===4?235:170));h=ys[5]+heights[5]+85;xs=Array(6).fill(w*.525);
  const l=w*.08,r=w*.95;d=`M ${w} ${ys[0]} H ${l+25}`;
  for(let i=0;i<5;i++){const atLeft=i%2===0,a=atLeft?l:r,other=atLeft?r-25:l+25,y=ys[i],end=ys[i+1];d+=` Q ${a} ${y} ${a} ${y+35} V ${end-35} Q ${a} ${end} ${atLeft?a+25:a-25} ${end} H ${other}`;}
  d+=` H ${w}`;tapers='';
 }else{
  ys=[200];ys.push(ys[0]+Math.max(heights[0],heights[1])+190);ys.push(ys[1]+Math.max(heights[2],heights[3])+195);h=ys[2]+Math.max(heights[4],heights[5])+110;
  const l=w*.04643,r=w*.95357,le=w*.1357,re=w*.8643,a=ys[0],b=ys[1],c=ys[2];
  d=`M ${w-100} ${a} H ${le} Q ${l} ${a} ${l} ${a+80} V ${b-80} Q ${l} ${b} ${le} ${b} H ${re} Q ${r} ${b} ${r} ${b+80} V ${c-80} Q ${r} ${c} ${re} ${c} H 100`;
  tapers=`M ${w} ${a} Q ${w-50} ${a} ${w-100} ${a-2.5} V ${a+2.5} Q ${w-50} ${a} ${w} ${a} Z M 0 ${c} Q 50 ${c} 100 ${c-2.5} V ${c+2.5} Q 50 ${c} 0 ${c} Z`;
  xs=[w*.70,w*.35,w*.35,w*.70,w*.70,w*.35];ys=[ys[0],ys[0],ys[1],ys[1],ys[2],ys[2]];
 }
 track.style.height=h+'px';const svg=track.querySelector('.route');svg.setAttribute('viewBox',`0 0 ${w} ${h}`);svg.innerHTML=`<path d="${d}" fill="none" stroke="currentColor" stroke-width="${mobile?3:5}"/><path d="${tapers}" fill="currentColor"/>`;
 nodes.forEach((n,i)=>{n.style.left=xs[i]+'px';n.style.top=ys[i]+'px'});
 const walking=track.querySelector('.walking'),cat=track.querySelector('.sliding'),running=track.querySelector('.running');
 for(const img of [walking,cat,running])img.style.bottom='auto';
 walking.style.top=(ys[0]-walking.getBoundingClientRect().height-5)+'px';
 cat.style.width=mobile?'100px':'';cat.style.left=(w*(mobile?.08:.04643))+'px';cat.style.top=(mobile?ys[0]+heights[0]+75:(ys[0]+ys[2])/2)+'px';
 // The drawing ends at pixel 964 of the 1024px asset; align its feet to the route.
 running.style.top=(ys[4]-running.getBoundingClientRect().height*(964/1024)+1)+'px';
}
const journeyObserver=new ResizeObserver(()=>layoutJourney());journeyObserver.observe(document.querySelector('.timeline'));
window.addEventListener('hashchange',()=>{layoutJourney();loadResume()});window.addEventListener('resize',layoutJourney);
for(const img of document.querySelectorAll('.story-art'))img.addEventListener('load',layoutJourney);
document.fonts.ready.then(layoutJourney);
function loadResume(){if(!document.getElementById('resume').hidden){const frame=document.querySelector('.resume-viewer');if(frame&&!frame.getAttribute('src'))frame.setAttribute('src',frame.dataset.src);}}
const resumeEntry=document.querySelector('[data-download="resume"]');resumeEntry.addEventListener('click',()=>{loadResume();const a=document.createElement('a');a.href=document.querySelector('.download-pdf').getAttribute('href');a.download='简历.pdf';document.body.appendChild(a);a.click();a.remove();});
layoutJourney();loadResume();



