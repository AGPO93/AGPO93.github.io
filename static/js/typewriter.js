const DEFAULT_CPS = 60;
const DEFAULT_MAX_MS = 2500;

// Reveals the text inside each step's element one character at a time, one step after
// another. Text that hasn't been typed yet stays in the layout as invisible text, so the
// page never reflows while typing. Resolves when finished or skipped (click or any key).
// steps: [{ root, cps, maxMs }]
export function typewriter(steps) {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return Promise.resolve();

  const queue = steps.map(({ root, cps = DEFAULT_CPS, maxMs = DEFAULT_MAX_MS }) => {
    const parts = [];
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
    const textNodes = [];
    for (let node = walker.nextNode(); node; node = walker.nextNode()) {
      if (node.nodeValue.trim()) textNodes.push(node);
    }
    for (const node of textNodes) {
      const pending = document.createElement("span");
      pending.style.visibility = "hidden";
      pending.textContent = node.nodeValue;
      node.after(pending);
      parts.push({ node, pending, text: node.nodeValue });
      node.nodeValue = "";
    }
    const total = parts.reduce((sum, part) => sum + part.text.length, 0);
    return { parts, total, duration: Math.min((total / cps) * 1000, maxMs) };
  }).filter((step) => step.total);

  const show = (step, count) => {
    for (const part of step.parts) {
      const shown = Math.min(count, part.text.length);
      part.node.nodeValue = part.text.slice(0, shown);
      part.pending.textContent = part.text.slice(shown);
      count -= shown;
    }
  };

  return new Promise((resolve) => {
    let index = 0;
    let start = performance.now();
    let frame;

    const finish = () => {
      cancelAnimationFrame(frame);
      removeEventListener("pointerdown", finish);
      removeEventListener("keydown", finish);
      for (const step of queue) {
        show(step, step.total);
        step.parts.forEach((part) => part.pending.remove());
      }
      resolve();
    };
    const tick = (now) => {
      const step = queue[index];
      const progress = Math.min((now - start) / step.duration, 1);
      show(step, Math.floor(progress * step.total));
      if (progress < 1) {
        frame = requestAnimationFrame(tick);
      } else if (++index < queue.length) {
        start = now;
        frame = requestAnimationFrame(tick);
      } else {
        finish();
      }
    };

    if (!queue.length) return finish();
    addEventListener("pointerdown", finish);
    addEventListener("keydown", finish);
    frame = requestAnimationFrame(tick);
  });
}
