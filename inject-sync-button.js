// inject-sync-button.js — adds a floating button and hijacks any 'Releases' nav click
(function(){
  function makeBtn(){
    const btn = document.createElement('a');
    btn.textContent = 'Releases (Sync)';
    btn.href = '/releases-sync.html';
    btn.style.cssText = 'position:fixed;right:16px;bottom:16px;background:#6c76ff;color:#fff;padding:10px 12px;border-radius:12px;font-family:system-ui,Segoe UI,Arial;z-index:9999;text-decoration:none;box-shadow:0 8px 20px rgba(0,0,0,.4)';
    document.body.appendChild(btn);
  }
  function hijackNav(){
    const els = Array.from(document.querySelectorAll('a,button')).filter(el => (el.textContent||'').trim().toLowerCase() === 'releases');
    els.forEach(el => { el.addEventListener('click', (e) => { e.preventDefault(); location.href = '/releases-sync.html'; }, {capture:true}); });
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { makeBtn(); hijackNav(); });
  else { makeBtn(); hijackNav(); }
})();