const eventDispatcher = new EventTarget();

const mainTypingSequence = [
  { name: "mainText", selector: ".line", nextEvent: "finishedTypingMainText" },
  { name: "projectHeaders", selector: ".project-header-text", nextEvent: "finishedTypingProjectHeaders" },
  { name: "projectLines", selector: ".project-line", nextEvent: "finishedTypingProjectLines" },
];
// Store cached data for each group
const groups = {};
const typingOrder = ["mainText", "projectHeaders"];

const CHAR_TYPE_DELAY = 1;
const LINE_TYPE_DELAY = 1;

document.addEventListener("DOMContentLoaded", () => {
  // Cache all text and hide it initially.
  mainTypingSequence.forEach(groupConfig => {
    const elements = document.querySelectorAll(groupConfig.selector);
    const texts = [];
    elements.forEach(element => {
      texts.push(element.textContent);
      if (groupConfig.name !== "projectLines") {
        element.textContent = "";
      }
    });
    groups[groupConfig.name] = { elements, texts };
  });

  startTypingSequence();

  // Auto open most recent project.
  // const firstProject = document.querySelectorAll(".project")[0];
  // if (firstProject) {
  //   toggleProject(firstProject.querySelector(".project-header"), 0);
  // }

  updateDividers();
});

/* ===================== */
/* Typewriter effect */
/* ===================== */

function startTypingSequence(index = 0) {
  // TODO - blinking cursor must be added to last text that is typed out. This must be dynamic.
  // and it should be done in a way that we "move it around" from line to line. Maybe we can keep a ref to it somehow, so that
  // we can remove it before we append it to another element.
  if (index >= typingOrder.length) {
    // const lastGroupName = typingOrder[typingOrder.length - 1];
    // const lastGroup = groups[lastGroupName];
    // const lastElement = lastGroup.elements[lastGroup.elements.length - 1];
    // addBlinkingCursor(lastElement);

    updateDividers();
    return;
  }

  const current = typingOrder[index];
  typeGroupSequentially(current, () => startTypingSequence(index + 1));
}

function typeGroupSequentially(groupName, onComplete = null) {
  const group = groups[groupName];
  if (!group) {
    return;
  }

  const { elements, texts } = group;

  function typeNext(index) {
    if (index >= elements.length) {

      eventDispatcher.dispatchEvent(new CustomEvent(`finishedTyping_${groupName}`));

      if (onComplete) {
        onComplete();
      }

      return;
    }

    const element = elements[index];
    const text = texts[index];

    typeText(element, text, 0, false, () => {
      setTimeout(() => typeNext(index + 1), LINE_TYPE_DELAY);
    });
  }

  typeNext(0);
}

function typeText(element, text, i = 0, isLastLine = false, onComplete) {
  if (i < text.length) {
    element.textContent += text.charAt(i);
    setTimeout(() => typeText(element, text, i + 1, isLastLine, onComplete), CHAR_TYPE_DELAY);
  } else {
    if (onComplete) {
      onComplete();
    }
  }
}

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
  if (!projectContainer) return;

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
      eventDispatcher.dispatchEvent(new CustomEvent(`finishedTyping_${groupName}`));
      return;
    }

    const element = elements[index];
    const text = texts[index];

    typeText(element, text, 0, false, () => {
      setTimeout(() => typeNext(index + 1), LINE_TYPE_DELAY);
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

  // Optional direct trigger (you can keep this OR rely on event listener)
  if (isOpening) {
    startTypingProjectLines(headerElement);
  }

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
  // Retrieve header
  const headerElement = e.detail?.headerElement;
  if (e.detail?.opened && headerElement) {
    // Pass actual DOM element
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
