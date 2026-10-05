(() => {
 const dialog=document.getElementById('manuscript-viewer'),image=document.getElementById('manuscript-image'),zoom=document.getElementById('manuscript-zoom');let index=0;
 const descriptions=['AdvanCE 首页与每日总结页的手绘草稿','AdvanCE 产品结构、刷题流程和功能联想的手绘草稿'];
 function render(){image.src='assets/manuscript-'+(index+1)+'.jpg';image.alt=descriptions[index];document.getElementById('manuscript-count').textContent='手稿 0'+(index+1)+' / 02';dialog.classList.remove('original-size');zoom.textContent='查看原尺寸';zoom.setAttribute('aria-pressed','false');dialog.querySelector('.manuscript-canvas').scrollTo(0,0);}
 document.querySelectorAll('[data-manuscript]').forEach(button=>button.addEventListener('click',()=>{index=Number(button.dataset.manuscript);render();dialog.showModal();}));
 zoom.addEventListener('click',()=>{const original=dialog.classList.toggle('original-size');zoom.textContent=original?'适应屏幕':'查看原尺寸';zoom.setAttribute('aria-pressed',String(original));});
 document.getElementById('manuscript-other').addEventListener('click',()=>{index=1-index;render();});document.getElementById('manuscript-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',event=>{if(event.target===dialog){const box=dialog.getBoundingClientRect();if(event.clientX<box.left||event.clientX>box.right||event.clientY<box.top||event.clientY>box.bottom)dialog.close();}});
})();
