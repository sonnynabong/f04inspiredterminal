/**
 * Fallout 4 Terminal - View switching & keyboard navigation
 */

import { playSelect, playScreenChange, playPowerOn, playPowerOff, playEnter } from "./terminal-sounds";
import { initBootTypingSounds, resetBootTypingAnimation } from "./boot-typing-sounds";

type View = "boot" | "home" | "archives" | "skills" | "about" | "comms";

const VIEW_IDS = ["boot-view", "home-view", "archives-view", "skills-view", "about-view", "comms-view"] as const;

const EXIT_DURATION = 250;
const ENTER_DURATION = 400;

function triggerCRTFlash(): void {
  const overlay = document.getElementById("crt-flash-overlay");
  if (!overlay) return;
  overlay.classList.remove("crt-flash");
  overlay.offsetHeight; // reflow
  overlay.classList.add("crt-flash");
  setTimeout(() => {
    overlay.classList.remove("crt-flash");
  }, 400);
}

function showView(view: View) {
  const targetId = `${view}-view`;
  const targetEl = document.getElementById(targetId);
  const currentView = document.body.getAttribute("data-view");
  const currentEl = currentView ? document.getElementById(`${currentView}-view`) : null;

  if (currentEl === targetEl) return;
  if (!targetEl) return;

  const fromBoot = currentView === "boot";
  const runEnter = () => {
    triggerCRTFlash();
    if (!fromBoot) playScreenChange();
    targetEl.style.display = "flex";

    if (view === "boot") {
      resetBootTypingAnimation();
      initBootTypingSounds();
    }

    targetEl.classList.add("view-enter");
    targetEl.offsetHeight; // force reflow
    setTimeout(() => {
      targetEl.classList.remove("view-enter");
    }, ENTER_DURATION);
  };

  if (currentEl) {
    currentEl.classList.add("view-exit");
    currentEl.style.pointerEvents = "none";
    setTimeout(() => {
      currentEl.classList.remove("view-exit");
      currentEl.style.display = "none";
      currentEl.style.pointerEvents = "";
      document.body.setAttribute("data-view", view);
      runEnter();
    }, EXIT_DURATION);
  } else {
    VIEW_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (el) el.style.display = "none";
    });
    document.body.setAttribute("data-view", view);
    runEnter();
  }
}

function init() {
  if (!document.body.getAttribute("data-view")) {
    document.body.setAttribute("data-view", "boot");
    initBootTypingSounds();
  }

  const terminalInput = document.getElementById("terminal-input") as HTMLInputElement | null;

  // Press feedback for touch devices (:active doesn't work well on mobile)
  document.addEventListener("touchstart", (e) => {
    const el = (e.target as HTMLElement).closest(".press-feedback");
    if (el) el.classList.add("press-active");
  }, { passive: true });
  document.addEventListener("touchend", (e) => {
    const el = (e.target as HTMLElement).closest(".press-feedback");
    if (el) el.classList.remove("press-active");
  }, { passive: true });
  document.addEventListener("touchcancel", (e) => {
    const el = (e.target as HTMLElement).closest(".press-feedback");
    if (el) el.classList.remove("press-active");
  }, { passive: true });

  // Use event delegation for reliable click handling (works with dynamically visible elements)
  document.addEventListener("click", (e) => {
    const target = e.target as HTMLElement;
    const enterBtn = target.closest("#enter-terminal");
    const logoutBtn = target.closest("#logout-btn");
    const backBtn = target.closest("#archives-back-btn, #skills-back-btn, #about-back-btn, #comms-back-btn");
    const navBtn = target.closest("[data-nav]");
    const projectBtn = target.closest("[data-project]");

    if (enterBtn) {
      e.preventDefault();
      playPowerOn();
      showView("home");
      return;
    }
    if (logoutBtn) {
      playPowerOff();
      showView("boot");
      return;
    }
    if (backBtn) {
      playSelect();
      showView("home");
      return;
    }
    if (navBtn) {
      playSelect();
      navBtn.classList.add("nav-item-active");
      setTimeout(() => navBtn.classList.remove("nav-item-active"), 300);
      const nav = (navBtn as HTMLElement).dataset.nav;
      if (nav === "projects") showView("archives");
      if (nav === "skills") showView("skills");
      if (nav === "about") showView("about");
      if (nav === "comms") showView("comms");
      return;
    }
    if (projectBtn && !projectBtn.classList.contains("opacity-50")) {
      playSelect();
      projectBtn.classList.add("nav-item-active");
      setTimeout(() => projectBtn.classList.remove("nav-item-active"), 300);
    }
  });

  // Keyboard: Any key on boot to continue
  document.addEventListener("keydown", (e) => {
    const view = document.body.getAttribute("data-view");
    if (view === "boot") {
      e.preventDefault();
      playPowerOn();
      showView("home");
    }
    if (e.key === "Escape") {
      if (view === "archives" || view === "skills" || view === "about" || view === "comms") showView("home");
      else if (view === "home") {
        playPowerOff();
        showView("boot");
      }
    }
  });

  // Command input - Enter to execute
  terminalInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      playEnter();
      const cmd = terminalInput?.value?.toUpperCase().trim();
      if (cmd === "PROJECTS" || cmd === "ARCHIVES") showView("archives");
      if (cmd === "SKILLS" || cmd === "SKILLS_DB") showView("skills");
      if (cmd === "ABOUT" || cmd === "ABOUT_USER") showView("about");
      if (cmd === "COMMS" || cmd === "COMMS_LINK") showView("comms");
      if (cmd === "HOME" || cmd === "EXIT") showView("home");
      if (cmd === "BOOT" || cmd === "LOGOUT") {
        playPowerOff();
        showView("boot");
      }
      terminalInput.value = "";
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
