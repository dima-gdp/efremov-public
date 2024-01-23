export default function useScroll() {
  function scrollTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return {
    scrollTop,
  }
}
