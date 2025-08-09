
let toastEl: HTMLDivElement | null = null
export function showToast(message: string) {
  if (!toastEl) {
    toastEl = document.createElement('div')
    toastEl.style.position = 'fixed'
    toastEl.style.right = '16px'
    toastEl.style.bottom = '16px'
    toastEl.style.zIndex = '9999'
    document.body.appendChild(toastEl)
  }
  const el = document.createElement('div')
  el.textContent = message
  el.style.background = 'rgba(16,185,129,0.12)'
  el.style.border = '1px solid rgba(16,185,129,0.5)'
  el.style.color = '#d1fae5'
  el.style.padding = '10px 12px'
  el.style.marginTop = '8px'
  el.style.borderRadius = '12px'
  el.style.fontSize = '13px'
  el.style.boxShadow = '0 8px 30px rgba(0,0,0,0.2)'
  toastEl!.appendChild(el)
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .25s'; setTimeout(()=>el.remove(), 250) }, 1500)
}
