/**
 * Typing sounds synced to boot screen animations
 * Plays charsingle at intervals during each typing line
 */

import { playTypingChar } from "./terminal-sounds";

/** Boot sequence: [delayMs, durationMs] for each of the 5 typing lines */
const BOOT_TYPING = [
  [200, 500],   // typing-1: BOOTING LOADER V4.2.1...
  [800, 1000],  // typing-2: MEMORY CHECK: 640KB OK
  [2000, 1000], // typing-3: ESTABLISHING LINK TO CENTRAL MAINFRAME...
  [3200, 500],  // typing-4: LOADING BIOS...
  [3800, 500],  // typing-5: [PROTECTRON PROTOCOLS ACTIVE]
] as const;

const TYPING_CLASSES = ["typing-1", "typing-2", "typing-3", "typing-4", "typing-5"];
const TYPING_INTERVAL_MS = 90;

function scheduleTypingSounds(): void {
  BOOT_TYPING.forEach(([delay, duration]) => {
    const count = Math.max(3, Math.floor(duration / TYPING_INTERVAL_MS));

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        playTypingChar();
      }, delay + i * TYPING_INTERVAL_MS);
    }
  });
}

/** Reset boot screen animations so they replay (for logout -> boot) */
export function resetBootTypingAnimation(): void {
  const bootView = document.getElementById("boot-view");
  if (!bootView) return;

  const resetAnimation = (el: Element, ...classes: string[]) => {
    if (!(el instanceof HTMLElement)) return;
    classes.forEach((cls) => el.classList.remove(cls));
    void el.offsetHeight; // reflow
    classes.forEach((cls) => el.classList.add(cls));
  };

  TYPING_CLASSES.forEach((cls) => {
    const el = bootView.querySelector(`.${cls}`);
    if (el) resetAnimation(el, cls);
  });

  const progressFill = bootView.querySelector(".progress-bar-fill");
  if (progressFill) resetAnimation(progressFill, "progress-bar-fill");

  bootView.querySelectorAll(".fade-in-delayed").forEach((el) => {
    resetAnimation(el, "fade-in-delayed");
  });
}

export function initBootTypingSounds(): void {
  scheduleTypingSounds();
}
