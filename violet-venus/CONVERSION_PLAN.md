# Fallout 4 Terminal – Astro Conversion Plan

## Original Files

| File | Purpose |
|------|---------|
| `stitch_terminal_home_screen/terminal_system_boot_screen/code.html` | Boot/loader screen |
| `stitch_terminal_home_screen/terminal_home_screen/code.html` | Main terminal with menu |
| `stitch_terminal_home_screen/terminal_project_archives/code.html` | Project archives subpage |

## Architecture (Single Page)

```
index.astro
├── CRTEffects.astro        (scanlines, vignette, grid)
├── BootScreen.astro        (boot view)
├── home-view              (main terminal)
│   ├── TerminalHeader.astro
│   ├── MainMenu.astro
│   ├── HomeContent.astro
│   └── TerminalFooter.astro
└── archives-view          (project archives)
    └── ProjectArchives.astro
```

## Fallout 4 Terminal Animations

| Animation | Implementation |
|-----------|----------------|
| Typewriter boot | `.typing-1` to `.typing-5` with stepped `width` animation |
| Cursor blink | `.cursor-blink` keyframe |
| CRT flicker | `.animate-flicker` on boot screen |
| Scanline overlay | `.crt-overlay` repeating gradient |
| Scanline bar | Moving gradient bar (10s loop) |
| Progress bar | `.progress-bar-fill` stepped fill |
| Phosphor glow | `.text-glow` text-shadow |
| Power-on effect | Keyframes available (`powerOn`, `phosphorGlow`) |

## View Flow

1. **Boot** → Click "Enter Terminal" or any key → **Home**
2. **Home** → Click [ PROJECTS ] or EXECUTE → **Archives**
3. **Archives** → Click BACK or ESC → **Home**
4. **Home** → Click LOGOUT or ESC → **Boot**

## Tech Stack

- Astro 5
- Tailwind CSS v4
- Vanilla TS for view switching (no React/Vue)
