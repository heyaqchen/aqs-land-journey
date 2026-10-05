const onboardingPages=[
  {title:'欢迎来到 Advance!',description:'这不仅仅是一个刷题工具。它能懂你的学习状态，但不会打扰你。',icon:'<path d="M31 47c-6 2-10 8-10 16v17c0 8 6 14 14 14h43c8 0 14-6 14-14V57c0-7-5-12-11-12" fill="#e9f2ff"/><rect x="27" y="31" width="16" height="29" rx="8" fill="#fff"/><rect x="43" y="27" width="16" height="32" rx="8" fill="#fff"/><rect x="59" y="28" width="16" height="31" rx="8" fill="#fff"/><rect x="75" y="34" width="14" height="26" rx="7" fill="#fff"/><path d="M29 68c7-10 15-14 26-12l14 3c6 1 10 6 9 12-1 6-6 10-12 10H55" fill="#fff"/><path d="M21 66h-8m79 0h8M56 14v-7" stroke="#ff942e" stroke-width="3"/>'},
  {title:'题干勾画',description:'长按题干 0.5 秒后拖动，划出重点。像用荧光笔一样。',icon:'<rect x="9" y="21" width="98" height="75" rx="10" fill="#fff"/><path d="M22 38h69M22 52h70M22 67h59M22 81h37"/><path d="M21 70c15-4 31-4 47-2" stroke="#ff942e" stroke-width="9" opacity=".5"/><path d="M75 99V58a7 7 0 0 1 14 0v25l5-5c3-3 8-2 10 1l7 13-8 16H84Z" fill="#e9f2ff"/><path d="M69 46c2-5 6-8 11-9m-17 1c4-7 11-11 18-11" stroke="#ff942e" stroke-width="2"/>'},
  {title:'选项排除',description:'长按选项，划掉你确定不对的。再次长按可以撤销。',icon:'<rect x="8" y="18" width="100" height="82" rx="11" fill="#fff"/><circle cx="26" cy="41" r="6"/><path d="M42 41h49"/><circle cx="26" cy="69" r="6"/><path d="M42 69h49"/><path d="M40 61 93 77" stroke="#ff942e" stroke-width="4"/><path d="M79 104V75a7 7 0 0 1 14 0v14l4-3c4-3 9-1 11 3l5 12" fill="#e9f2ff"/><path d="M80 54c-5 3-8 8-9 13" stroke="#ff942e" stroke-width="2"/>'},
  {title:'你只管答题',description:'系统会默默感知你的节奏，在你疲劳时给你最恰当的帮助。',icon:'<path d="M77 17a37 37 0 1 0 22 62A37 37 0 0 1 77 17Z" fill="#e9f2ff"/><path d="m28 23 2 6 6 2-6 2-2 6-2-6-6-2 6-2Zm70 10 2 5 5 2-5 2-2 5-2-5-5-2 5-2Z" fill="#ff942e" stroke="#ff942e"/><path d="M33 73c7 4 15 4 22 0m3-12c5 3 10 3 15 0"/><path d="M40 88c10 5 22 5 32 0" stroke="#ff942e"/>'}
];

function showOnboarding(profile,preview=false){
  let page=0;
  const entry=document.querySelector('#entry');
  entry.classList.add('onboarding-entry');
  function finish(save){
    if(save&&!preview){
      const messages=[...entry.querySelectorAll('.future-row')].map(row=>({text:row.querySelector('input').value.trim(),category:row.querySelector('select').value})).filter(item=>item.text);
      // 正式产品中，这些留言应存入后端；后续检测到用户处于 C/D 状态时，以非阻塞的方式适时呈现。
      // 当前仅为本机原型：不进行状态判断，也不主动推送留言。
      localStorage.setItem('advance-future-messages',JSON.stringify(messages));
    }
    if(!preview)localStorage.setItem('advance-onboarding-seen','1');
    entry.classList.remove('onboarding-entry');
    enterHome(profile);
  }
  function row(index){return '<div class="future-row"><input type="text" maxlength="100" aria-label="写给未来自己的第 '+(index+1)+' 条话" placeholder="写一句想对自己说的话"><select aria-label="第 '+(index+1)+' 条话的类别"><option value="安抚">安抚</option><option value="轻松">轻松</option><option value="激励">激励</option></select><button type="button" class="remove-message" aria-label="删除这条留言">×</button></div>'}
  function render(){
    const last=page===4,item=onboardingPages[page];
    entry.innerHTML='<section class="onboarding '+(last?'onboarding-message-page':'')+'" aria-label="新用户引导"><div class="onboarding-top"><div class="onboarding-brand">AdvanCE<b>!</b></div><button type="button" class="onboarding-skip">跳过</button></div><div class="onboarding-main">'+(last?'<div class="onboarding-icon" aria-hidden="true"><svg viewBox="0 0 116 116"><circle cx="58" cy="58" r="20" fill="#fff5e8" stroke="#ff942e"/><path d="M58 6v16m0 72v16M6 58h16m72 0h16M21 21l12 12m50 50 12 12m0-74L83 33M33 83 21 95" stroke="#ff942e"/><path d="M48 57h1m18 0h1M48 68c6 6 14 6 20 0" stroke="#3478ed"/></svg></div><h1>给未来的自己留几句话</h1><p class="onboarding-description">你可以为未来的自己留几句话，当系统感觉你需要的时候，会悄悄递给你。</p><div class="future-rows">'+row(0)+'</div><button type="button" class="add-message">＋ 添加一条</button><p class="message-count">可添加 1–3 条，每条都能选择类别。</p>':'<div class="onboarding-icon" aria-hidden="true"><svg viewBox="0 0 116 116">'+item.icon+'</svg></div><h1>'+item.title+'</h1><p class="onboarding-description">'+item.description+'</p>')+'</div><div class="onboarding-bottom"><div class="onboarding-dots" aria-label="第 '+(page+1)+' 步，共 5 步">'+Array.from({length:5},(_,i)=>'<span class="'+(i===page?'active':'')+'"></span>').join('')+'</div><button type="button" class="onboarding-primary">'+(last?'开始学习':'下一步')+'</button>'+(last?'<button type="button" class="onboarding-later">暂时跳过</button>':page>0?'<button type="button" class="onboarding-back">上一步</button>':'')+'</div></section>';
    entry.querySelector('.onboarding-skip').onclick=()=>finish(false);
    entry.querySelector('.onboarding-primary').onclick=()=>{if(last)finish(true);else{page++;render()}};
    if(last){
      const rows=entry.querySelector('.future-rows'),add=entry.querySelector('.add-message');
      function update(){add.disabled=rows.children.length>=3;entry.querySelectorAll('.future-row').forEach((r,i)=>{r.querySelector('input').setAttribute('aria-label','写给未来自己的第 '+(i+1)+' 条话');r.querySelector('select').setAttribute('aria-label','第 '+(i+1)+' 条话的类别');r.querySelector('.remove-message').hidden=rows.children.length===1})}
      add.onclick=()=>{if(rows.children.length<3){rows.insertAdjacentHTML('beforeend',row(rows.children.length));update();rows.lastElementChild.querySelector('input').focus()}};
      rows.onclick=e=>{if(e.target.matches('.remove-message')&&rows.children.length>1){e.target.closest('.future-row').remove();update()}};
      entry.querySelector('.onboarding-later').onclick=()=>finish(false);
      update();
    }else if(page>0)entry.querySelector('.onboarding-back').onclick=()=>{page--;render()};
  }
  render();
}
