const gamePeople=[
  {name:'马斯洛',answers:['需求层次理论','需要层次理论']},
  {name:'巴甫洛夫',answers:['经典条件作用','经典条件反射']},
  {name:'斯金纳',answers:['操作性条件作用','操作性条件反射']},
  {name:'班杜拉',answers:['社会学习理论','班杜拉社会学习理论']},
  {name:'皮亚杰',answers:['认知发展阶段理论','皮亚杰认知发展理论']}
];
const slots=[{x:6,y:9},{x:39,y:4},{x:74,y:12},{x:16,y:39},{x:57,y:35},{x:75,y:58}];
const bubbles=document.querySelector('#bubbles'),arena=document.querySelector('#arena');
let round=0,score=0,found=0,active=true;
function shuffle(items){return [...items].sort(()=>Math.random()-.5)}
function makeChoices(person){const wrong=shuffle(gamePeople.filter(p=>p!==person).flatMap(p=>p.answers.map(text=>({text,person:p.name}))));return shuffle([...person.answers.map(text=>({text,person:person.name})),...wrong.slice(0,4)])}
function setFeedback(message){document.querySelector('#feedback').textContent=message}
function burst(x,y){const colors=['#ff942e','#3478ed','#8cc6f1','#f6bf60'];for(let i=0;i<18;i++){const angle=i*Math.PI*2/18,distance=35+(i%3)*13;const spark=document.createElement('span');spark.className='spark';spark.style.setProperty('--x',x+'px');spark.style.setProperty('--y',y+'px');spark.style.setProperty('--dx',Math.cos(angle)*distance+'px');spark.style.setProperty('--dy',Math.sin(angle)*distance+'px');spark.style.setProperty('--spark',colors[i%colors.length]);arena.append(spark);setTimeout(()=>spark.remove(),900)}}
function revealName(x,y,name){const label=document.createElement('span');label.className='pop-label';label.style.left=x+'px';label.style.top=y+'px';label.textContent='提出者：'+name;arena.append(label);setTimeout(()=>label.remove(),1550)}
function selectBubble(button,choice){if(!active||button.disabled)return;button.disabled=true;const area=arena.getBoundingClientRect(),box=button.getBoundingClientRect(),x=box.left-area.left+box.width/2,y=box.top-area.top+box.height/2;const correct=choice.person===gamePeople[round].name;if(correct){button.classList.add('popped');burst(x,y);score++;found++;document.querySelector('#score').textContent=score;document.querySelector('#progress').textContent='找到 '+found+' / 2 个';setFeedback('答对了！烟花为你绽放。');if(found===2){active=false;document.querySelector('#nextRound').hidden=false;setFeedback('这位心理学家的两个说法都找到了！')}}else{button.classList.add('wrong');revealName(x,y,choice.person);setFeedback('这条理论对应的是'+choice.person+'。')}setTimeout(()=>button.remove(),210)}
function renderRound(){const person=gamePeople[round];found=0;active=true;document.querySelector('#round').textContent='第 '+(round+1)+' 位心理学家';document.querySelector('#progress').textContent='找到 0 / 2 个';document.querySelector('#personName').textContent=person.name;document.querySelector('#nextRound').hidden=true;setFeedback('');bubbles.replaceChildren();makeChoices(person).forEach((choice,index)=>{const button=document.createElement('button');button.type='button';button.className='bubble';button.dataset.slot=index;button.style.left=slots[index].x+'%';button.style.top=slots[index].y+'%';button.style.setProperty('--delay',(-index*.45)+'s');button.textContent=choice.text;button.setAttribute('aria-label','泡泡：'+choice.text);button.onclick=()=>selectBubble(button,choice);bubbles.append(button)})}
document.querySelector('#nextRound').onclick=()=>{round=(round+1)%gamePeople.length;renderRound()};renderRound();
