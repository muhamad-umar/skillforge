const body=document.querySelector('.chat .body');
const input=document.querySelector('.composer input');
const send=document.querySelector('.composer button');
function add(role,text){
  const b=document.createElement('div');b.className='bubble '+role;b.textContent=text;
  body.appendChild(b);body.scrollTop=body.scrollHeight;return b;
}
function reply(){
  const t=document.createElement('div');t.className='bubble ai';t.innerHTML='<span class="typing"><span></span><span></span><span></span></span>';
  body.appendChild(t);body.scrollTop=body.scrollHeight;
  setTimeout(()=>{t.innerHTML='Great question! Here\'s a concise explanation, and a quest you might enjoy. ⚡';},900);
}
function submit(){
  const v=input.value.trim();if(!v)return;add('me',v);input.value='';reply();
}
send?.addEventListener('click',submit);
input?.addEventListener('keydown',e=>{if(e.key==='Enter')submit()});
document.querySelectorAll('.suggested .s').forEach(s=>s.addEventListener('click',()=>{input.value=s.textContent;submit();}));
