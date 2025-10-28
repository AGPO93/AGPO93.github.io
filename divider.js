// TODO - typewriter effect should handle dividers too.
function updateDividers() {
  const dividers = document.querySelectorAll('.divider');

  dividers.forEach(divider => {
    const width = divider.clientWidth || divider.parentElement.clientWidth;

    const charWidth = getCharacterWidth(divider);
    const totalChars = Math.floor(width / charWidth);

    divider.textContent = '='.repeat(totalChars);
  });
}

// Helper to measure size of a single character in the current font
function getCharacterWidth(element) {
  const temp = document.createElement('span');
  temp.textContent = '=';
  temp.style.visibility = 'hidden';
  element.appendChild(temp);

  const width = temp.getBoundingClientRect().width;
  temp.remove();

  return width;
}

window.addEventListener('resize', updateDividers);
