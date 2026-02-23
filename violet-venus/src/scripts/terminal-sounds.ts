/**
 * Fallout terminal sounds from hyper-robco
 * https://github.com/smiley/hyper-robco
 *
 * Uses the same sound files as the Hyper RobCo terminal plugin
 * (Fallout 3/NV terminal UI sounds)
 */

const SOUNDS_PATH = "/sounds";

const SINGLE = [
  "ui_hacking_charsingle_01.wav",
  "ui_hacking_charsingle_02.wav",
  "ui_hacking_charsingle_03.wav",
  "ui_hacking_charsingle_04.wav",
  "ui_hacking_charsingle_05.wav",
  "ui_hacking_charsingle_06.wav",
];

const ARROW = ["ui_hacking_charscroll.wav", "ui_hacking_charscroll_lp.wav"];

const ENTER = [
  "ui_hacking_charenter_01.wav",
  "ui_hacking_charenter_02.wav",
  "ui_hacking_charenter_03.wav",
];

let _lastSingle = -1;
let _lastEnter = -1;

function getLastSingle(): number {
  let idx = Math.floor(Math.random() * SINGLE.length);
  if (idx === _lastSingle && SINGLE.length > 1) {
    idx = (idx + 1) % SINGLE.length;
  }
  _lastSingle = idx;
  return idx;
}

function getLastEnter(): number {
  let idx = Math.floor(Math.random() * ENTER.length);
  if (idx === _lastEnter && ENTER.length > 1) {
    idx = (idx + 1) % ENTER.length;
  }
  _lastEnter = idx;
  return idx;
}

function play(soundPath: string, volume = 0.25): void {
  if (typeof window === "undefined") return;
  try {
    const audio = new Audio(SOUNDS_PATH + "/" + soundPath);
    audio.volume = volume;
    audio.play().catch(() => {});
  } catch {
    // ignore
  }
}

/** Menu/button select - Fallout hacking charsingle */
export function playSelect(): void {
  const idx = getLastSingle();
  play(SINGLE[idx]);
}

/** View change / navigation - Fallout hacking charscroll */
export function playScreenChange(): void {
  play(ARROW[0]);
}

/** Enter/execute - Fallout hacking charenter */
export function playEnter(): void {
  const idx = getLastEnter();
  play(ENTER[idx]);
}

/** Power on - terminal startup */
export function playPowerOn(): void {
  play("poweron.mp3");
}

/** Power off - terminal shutdown / logout */
export function playPowerOff(): void {
  play("poweroff.mp3");
}

/** Typing character - for typewriter animations (lower volume, allows rapid fire) */
export function playTypingChar(): void {
  const idx = Math.floor(Math.random() * SINGLE.length);
  play(SINGLE[idx], 0.15);
}
