/**
 * Fades in project image after the page title (h1) finishes typing
 */
function fadeInImageAfterTitle() {
  const img = document.getElementById('project-image');
  const h1 = document.querySelector('h1');
  
  if (img && h1) {
    const observer = new MutationObserver(() => {
      // Once h1 has content and is done being typed, fade in image
      if (h1.textContent && h1.style.opacity !== '0') {
        img.style.opacity = '1';
        observer.disconnect();
      }
    });
    observer.observe(h1, { childList: true, characterData: true, subtree: true });
  }
}
