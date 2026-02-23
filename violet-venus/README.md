# Fallout 4 Inspired Terminal

A single-page Astro app replicating the RobCo Industries terminal from Fallout 4.

## Structure

- **Boot Screen** – Typewriter boot sequence, loading bar, CRT effects
- **Main Terminal** – Welcome message, project cards, main menu
- **Project Archives** – Archived projects list with detail view
- **Skills DB** – Skill categories with proficiency levels
- **About User** – Profile, identity, location, bio
- **Comms Link** – Contact links (GitHub, LinkedIn, email)

## Run

```bash
npm run dev    # Development server
npm run build  # Production build
npm run preview # Preview production build
```

## Features

- **Fallout 4 terminal animations**: Typewriter boot text, flicker, scanlines, cursor blink
- **CRT effects**: Scanline overlay, vignette, phosphor glow
- **Single-page navigation**: Boot → Home → Archives (no page reload)
- **Keyboard support**: Any key on boot to continue, ESC to go back, command input

## Commands (in terminal footer)

- `PROJECTS` / `ARCHIVES` – Open project archives
- `SKILLS` / `SKILLS_DB` – Open skills database
- `ABOUT` / `ABOUT_USER` – Open about profile
- `COMMS` / `COMMS_LINK` – Open contact links
- `HOME` / `EXIT` – Return to main terminal
- `BOOT` / `LOGOUT` – Return to boot screen

## Sound Effects

Terminal sound effects are from [hyper-robco](https://github.com/smiley/hyper-robco) by smiley (Fallout 3/NV terminal UI sounds, GPL-3.0).
