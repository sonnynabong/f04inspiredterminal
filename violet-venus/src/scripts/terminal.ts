/**
 * Fallout 4 Terminal - View switching & keyboard navigation
 */

type View = "boot" | "home" | "archives" | "skills" | "about" | "comms";

const VIEW_IDS = ["boot-view", "home-view", "archives-view", "skills-view", "about-view", "comms-view"] as const;

function showView(view: View) {
  VIEW_IDS.forEach((id) => {
    const el = document.getElementById(id);
    if (el) el.style.display = id === `${view}-view` ? "flex" : "none";
  });
  document.body.setAttribute("data-view", view);
}

function init() {
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
  enterBtn?.addEventListener("click", () => showView("home"));

  // Logout goes back to boot
  logoutBtn?.addEventListener("click", () => showView("boot"));

  // Back to home
  archivesBackBtn?.addEventListener("click", () => showView("home"));
  skillsBackBtn?.addEventListener("click", () => showView("home"));
  aboutBackBtn?.addEventListener("click", () => showView("home"));
  commsBackBtn?.addEventListener("click", () => showView("home"));

  // Main menu nav
  navButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const nav = (btn as HTMLElement).dataset.nav;
      if (nav === "projects") showView("archives");
      if (nav === "skills") showView("skills");
      if (nav === "about") showView("about");
      if (nav === "comms") showView("comms");
    });
  });

  // Project selection in archives - could filter detail view
  projectButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const project = (btn as HTMLElement).dataset.project;
      if (project && !btn.classList.contains("opacity-50")) {
        // Could update detail panel - for now just visual feedback
      }
    });
  });

  // Keyboard: Any key on boot to continue
  document.addEventListener("keydown", (e) => {
    const view = document.body.getAttribute("data-view");
    if (view === "boot") {
      e.preventDefault();
      showView("home");
    }
    if (e.key === "Escape") {
      if (view === "archives" || view === "skills" || view === "about" || view === "comms") showView("home");
      else if (view === "home") showView("boot");
    }
  });

  // Command input - Enter to execute
  terminalInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      const cmd = terminalInput?.value?.toUpperCase().trim();
      if (cmd === "PROJECTS" || cmd === "ARCHIVES") showView("archives");
      if (cmd === "SKILLS" || cmd === "SKILLS_DB") showView("skills");
      if (cmd === "ABOUT" || cmd === "ABOUT_USER") showView("about");
      if (cmd === "COMMS" || cmd === "COMMS_LINK") showView("comms");
      if (cmd === "HOME" || cmd === "EXIT") showView("home");
      if (cmd === "BOOT" || cmd === "LOGOUT") showView("boot");
      terminalInput.value = "";
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
