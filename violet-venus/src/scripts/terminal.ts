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
  const enterBtn = document.getElementById("enter-terminal");
  const logoutBtn = document.getElementById("logout-btn");
  const archivesBackBtn = document.getElementById("archives-back-btn");
  const skillsBackBtn = document.getElementById("skills-back-btn");
  const aboutBackBtn = document.getElementById("about-back-btn");
  const commsBackBtn = document.getElementById("comms-back-btn");
  const navButtons = document.querySelectorAll("[data-nav]");
  const projectButtons = document.querySelectorAll("[data-project]");
  const terminalInput = document.getElementById("terminal-input") as HTMLInputElement | null;

  // Enter terminal from boot screen
  enterBtn?.addEventListener("click", () => {
    playPowerOn();
    showView("home");
  });

  // Logout goes back to boot
  logoutBtn?.addEventListener("click", () => {
    playPowerOff();
    showView("boot");
  });

  // Back to home
  [archivesBackBtn, skillsBackBtn, aboutBackBtn, commsBackBtn].forEach((btn) => {
    btn?.addEventListener("click", () => {
      playSelect();
      showView("home");
    });
  });

  // Main menu nav
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      playSelect();
      btn.classList.add("nav-item-active");
      setTimeout(() => btn.classList.remove("nav-item-active"), 300);
      const nav = (btn as HTMLElement).dataset.nav;
      if (nav === "projects") showView("archives");
      if (nav === "skills") showView("skills");
      if (nav === "about") showView("about");
      if (nav === "comms") showView("comms");
    });
  });

  // Project selection in archives - visual feedback
  projectButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const project = (btn as HTMLElement).dataset.project;
      if (project && !btn.classList.contains("opacity-50")) {
        playSelect();
        btn.classList.add("nav-item-active");
        setTimeout(() => btn.classList.remove("nav-item-active"), 300);
      }
    });
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
