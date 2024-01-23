export function lockBodyScroll() {
  const paddingOffset = `${window.innerWidth - document.body.offsetWidth}`;
  document.body.style.paddingRight = `${paddingOffset}px`
  document.body.style.overflow = 'hidden'
}


export function unlockBodyScroll() {
  document.body.style.paddingRight = ''
  document.body.style.overflow = ''
}
