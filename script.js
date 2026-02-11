const eventDispatcher = new EventTarget();

const typingSequence = [
  { name: "ascii", element: ".ascii-text", delay: 1 },
  { name: "mainText", element: ".line", delay: 1 },
  { name: "projectHeaders", element: ".project-header-text", delay: 1 }
];

// Stores cached data for each group
const cachedElementData = {};

let currentDelay = 1;

document.addEventListener("DOMContentLoaded", () => {
  // Cache all text and hide it initially.
  typingSequence.forEach(groupConfig => {
    const elements = document.querySelectorAll(groupConfig.element);
    const texts = [];
    const links = [];

    elements.forEach(element => {
      texts.push(element.textContent);
      const a = element.querySelector('a');
      if (a) {
        links.push({ href: a.getAttribute('href'), text: a.textContent, target: a.getAttribute('target'), rel: a.getAttribute('rel') });
      } else {
        links.push(null);
      }
      element.textContent = "";
    });

    cachedElementData[groupConfig.name] = { elements, texts, links };
  });

  startTypingGroup(0);

  // Update width after everything is loaded.
  updateDividers();

  // Fade in non-ascii elements. ASCII will be typed line-by-line.
  [".skills-container", ".divider"].forEach(selector => {
    document.querySelectorAll(selector).forEach(element => {
      fadeIn(element, 2000);
    });
  });
});

/* ===================== */
/* Typewriter effect */
/* ===================== */

function startTypingGroup(groupIndex) {
  if (groupIndex >= typingSequence.length) {
    updateDividers();
    return;
  }

  const targetGroup = typingSequence[groupIndex].name;
  currentDelay = typingSequence[groupIndex].delay;
  typeGroupSequentially(
    targetGroup,
    () => startTypingGroup(groupIndex + 1)
  );
}

// Gets each group's cached data and starts text typing.
function typeGroupSequentially(groupName, onComplete = null) {
  const group = cachedElementData[groupName];
  if (!group) {
    return;
  }

  const { elements, texts, links } = group;

  // Special handling for ASCII art groups: type line-by-line quickly
  if (groupName === 'ascii') {
    function typeAsciiElement(index) {
      if (index >= elements.length) {
        const eventName = `finishedTyping_${groupName}`;
        eventDispatcher.dispatchEvent(new CustomEvent(eventName));
        if (onComplete) onComplete();
        return;
      }

      const element = elements[index];
      const fullText = texts[index] || "";
      typeAsciiArt(element, fullText, () => {
        // tiny gap between ascii blocks to keep overall time short
        setTimeout(() => typeAsciiElement(index + 1), 10);
      });
    }

    typeAsciiElement(0);
    return;
  }

  function typeNext(index) {
    if (index >= elements.length) {
      const eventName = `finishedTyping_${groupName}`;
      eventDispatcher.dispatchEvent(new CustomEvent(eventName));

      if (onComplete) {
        onComplete();
      }

      return;
    }

    const element = elements[index];
    const text = texts[index];

    const linkInfo = links ? links[index] : null;
    typeText(element, text, 0, false, () => {
      if (linkInfo) {
        const linkText = linkInfo.text || "";
        const href = linkInfo.href || "";
        const target = linkInfo.target ? ` target="${linkInfo.target}"` : "";
        const rel = linkInfo.rel ? ` rel="${linkInfo.rel}"` : "";
        const anchorHTML = `<a href="${href}"${target}${rel} style="color:inherit; text-decoration:none;">${linkText}</a>`;
        // Replace the first occurrence of the link text with the anchor HTML
        const current = element.textContent;
        const replaced = current.replace(linkText, anchorHTML);
        element.innerHTML = replaced;
      }
      setTimeout(() => typeNext(index + 1), currentDelay);
    });
  }

  typeNext(0);
}

function typeText(element, text, i = 0, isLastLine = false, onComplete) {
  if (i < text.length) {
    element.textContent += text.charAt(i);
    setTimeout(() => typeText(element, text, i + 1, isLastLine, onComplete), currentDelay);
  } else {
    if (onComplete) {
      onComplete();
    }
  }
}

/*******************************************************************************
 * ASCII BLOCK TYPING                                                                             
 ******************************************************************************/
// Types a pre-style ASCII block line-by-line. Keeps newlines between lines.
function typeAsciiArt(element, fullText, onComplete) {
  const lines = fullText.split('\n');
  // Ensure element is visible (CSS sets initial opacity:0)
  element.style.display = 'block';
  element.style.opacity = 1;
  element.style.whiteSpace = 'pre';
  element.textContent = "";
  // Fast typing: append chunks per animation frame for maximum speed while preserving effect
  function typeLineFast(line, cb) {
    let pos = 0;
    const chunkSize = 10; // characters appended per frame for speed

    function step() {
      if (pos >= line.length) {
        if (cb) cb();
        return;
      }
      element.textContent += line.slice(pos, pos + chunkSize);
      pos += chunkSize;
      requestAnimationFrame(step);
    }

    step();
  }

  function typeLine(i) {
    if (i >= lines.length) {
      if (onComplete) onComplete();
      return;
    }

    const line = lines[i];
    if (!line) {
      // empty line: just add newline and continue
      element.textContent += "\n";
      requestAnimationFrame(() => typeLine(i + 1));
      return;
    }

    typeLineFast(line, () => {
      element.textContent += "\n";
      // next line on next frame to keep it very fast
      requestAnimationFrame(() => typeLine(i + 1));
    });
  }

  typeLine(0);
}
/*******************************************************************************
 * ASCII BLOCK TYPING END                                                                            
 ******************************************************************************/

function addBlinkingCursor(element) {
  const cursor = document.createElement("span");
  cursor.classList.add("cursor");
  cursor.textContent = "_";
  element.appendChild(cursor);
}

/* ===================== */
/* Project entries */
/* ===================== */

// Types project lines for a specific project
function startTypingProjectLines(projectHeaderElement) {
  // Find the nearest .project container
  const projectContainer = projectHeaderElement.closest(".project");
  if (!projectContainer) {
    return;
  }

  //Find all .project-line elements inside that project
  const linesForProject = projectContainer.querySelectorAll(".project-line");

  // Cache their text and clear them before typing
  const textsForProject = Array.from(linesForProject).map(line => {
    const text = line.textContent;
    line.textContent = "";
    return text;
  });

  // Use existing typing logic for a subset
  typeGroupSequentiallySubset("projectLines", linesForProject, textsForProject);
}

// Helper for typing only a subset
function typeGroupSequentiallySubset(groupName, elements, texts) {
  function typeNext(index) {
    if (index >= elements.length) {
      const eventName = `finishedTyping_${groupName}`;
      eventDispatcher.dispatchEvent(new CustomEvent(eventName));
      return;
    }

    const element = elements[index];
    const text = texts[index];

    typeText(element, text, 0, false, () => {
      setTimeout(() => typeNext(index + 1), currentDelay);
    });
  }

  typeNext(0);
}

function toggleProject(headerElement, projectIndex) {
  const details = headerElement.nextElementSibling;
  const isOpening = !details.classList.contains("open");

  details.classList.toggle("open");

  // Dispatch event with element reference
  eventDispatcher.dispatchEvent(new CustomEvent("projectHeaderClicked", {
    detail: { index: projectIndex, opened: isOpening, headerElement }
  }));

  updateDividers();
}

// Reveal projects one by one after typing finishes
function showProjects() {
  const projects = document.querySelectorAll(".project");
  projects.forEach((project, i) => {
    setTimeout(() => {
      project.classList.add("visible");
      // Staggered reveal (in ms).
    }, i * 300);
  });
}

eventDispatcher.addEventListener("projectHeaderClicked", (e) => {
  const headerElement = e.detail?.headerElement;
  if (e.detail?.opened && headerElement) {
    startTypingProjectLines(headerElement);

    headerElement.scrollIntoView({ behavior: "smooth", block: "start" });
  }
});

eventDispatcher.addEventListener("finishedTyping_mainText", () => {
  showProjects();
});

/* ===================== */
/* ASCII art */
/* ===================== */
window.addEventListener("DOMContentLoaded", scaleAsciiText);
window.addEventListener("resize", scaleAsciiText);

function scaleAsciiText() {
  const elements = document.querySelectorAll(".ascii-text");

  if (elements.length === 0) {
    return;
  }

  const screenWidth = window.screen.width;
  let scale = 1;

  if (screenWidth < 500) {
    scale = 0.35;
  } else if (screenWidth < 1200) {
    scale = 0.9;
  }

  elements.forEach(element => {
    element.style.transform = `scale(${scale})`;
  });
}

function fadeIn(element, duration) {
  let opacity = 0;
  element.style.opacity = opacity;
  element.style.display = "block";

  const startTime = performance.now();

  function tick(currentTime) {
    const elapsed = currentTime - startTime;
    opacity = Math.min(elapsed / duration, 1);
    element.style.opacity = opacity;

    if (elapsed < duration) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

