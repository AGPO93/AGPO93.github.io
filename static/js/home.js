import { typewriter } from "./typewriter.js";

const steps = [...document.querySelectorAll("[data-typewriter]")].map((root) => ({
  root,
  cps: Number(root.dataset.cps) || undefined,
}));
if (steps.length) typewriter(steps);
