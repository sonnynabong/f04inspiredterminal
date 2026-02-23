# Fallout 4 Inspired Terminal

A single-page Astro app replicating the RobCo Industries terminal from Fallout 4.

## Structure

- **Boot Screen** – Typewriter boot sequence, loading bar, CRT effects
- **Main Terminal** – Welcome message, project cards, main menu
- **Project Archives** – Archived projects list with detail view

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
- `HOME` / `EXIT` – Return to main terminal
- `BOOT` / `LOGOUT` – Return to boot screen
