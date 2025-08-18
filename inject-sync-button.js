// inject-sync-button.js — floating button + hijack 'Releases' clicks
(function(){
  function makeBtn(){
    if (document.getElementById('nn-sync-btn')) return;
    const a=document.createElement('a'); a.id='nn-sync-btn';
    a.textContent='Releases (Sync)'; a.href='/releases-sync.html';
    a.style.cssText='position:fixed;right:16px;bottom:16px;background:#6c76ff;color:#fff;padding:10px 12px;border-radius:12px;font-family:system-ui,Segoe UI,Arial;z-index:9999;text-decoration:none;box-shadow:0 8px 20px rgba(0,0,0,.4)';
    document.body.appendChild(a);
  }
  function hijack(){
    const els = Array.from(document.querySelectorAll('a,button')).filter(el => (el.textContent||'').trim().toLowerCase()==='releases');
    els.forEach(el => { el.addEventListener('click', (e)=>{ e.preventDefault(); location.href='/releases-sync.html'; }, {capture:true}); });
  }
  if (document.readyState==='loading') document.addEventListener('DOMContentLoaded', ()=>{ makeBtn(); hijack(); });
  else { makeBtn(); hijack(); }
})();