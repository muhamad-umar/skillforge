window.SF = {
  toast(msg,type='info'){
    const t=document.createElement('div');
    t.textContent=msg;
    t.style.cssText=`position:fixed;top:24px;right:24px;background:${type==='error'?'#EF4444':type==='success'?'#22C55E':'#1E3A8A'};color:#fff;padding:12px 18px;border-radius:12px;box-shadow:0 10px 30px rgba(0,0,0,.2);z-index:9999;animation:slideInRight .3s ease`;
    document.body.appendChild(t);setTimeout(()=>t.remove(),2800);
  }
};
