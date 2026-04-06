

# Custom Error Pages with Unique Templates, Videos, and Illustrations

## Overview
Replace the single shared `ErrorPage.tsx` with four distinct, visually rich error page templates. Each page gets its own unique theme, layout, background video, and animated SVG illustration.

## Design Per Error Code

### 404 — Lost in Space
- **Theme**: Deep space, dark navy/purple
- **Background video**: Looping stars/space video from Pexels (embedded via URL)
- **Illustration**: CSS-animated floating astronaut built with SVG (bobbing up/down, rotating)
- **Layout**: Split — astronaut on left, text on right (stacked on mobile)

### 403 — Locked Vault
- **Theme**: Dark red/crimson tones
- **Background**: Subtle animated gradient (no video — heavier feel)
- **Illustration**: SVG animated padlock with a "shake" deny animation on loop
- **Layout**: Centered with the lock icon above the error code

### 500 — Broken Machine
- **Theme**: Purple/pink glitch aesthetic
- **Background video**: Abstract glitch/static video from Pexels
- **Illustration**: SVG gear/cog set that spins, then one gear "breaks" and falls (CSS keyframes)
- **Layout**: Full-bleed video background with centered overlay card

### 503 — Under Maintenance
- **Theme**: Calm blue/cyan tones
- **Background**: Soft animated gradient waves
- **Illustration**: SVG construction crane with swinging hook animation
- **Layout**: Centered with a progress bar animation suggesting "coming back soon"

## Technical Approach

### Files to Create/Modify
1. **`src/pages/ErrorPage.tsx`** — Complete rewrite. Each error code renders a completely different template component
2. **`src/components/errors/Error404.tsx`** — Space-themed 404 with astronaut SVG + video background
3. **`src/components/errors/Error403.tsx`** — Vault-themed 403 with padlock SVG
4. **`src/components/errors/Error500.tsx`** — Glitch-themed 500 with broken gears SVG + video background
5. **`src/components/errors/Error503.tsx`** — Maintenance-themed 503 with crane SVG

### Video Integration
- Use HTML `<video>` tags with `autoPlay`, `muted`, `loop`, `playsInline` for background videos
- Source from Pexels free video URLs (direct MP4 links)
- Fallback to gradient backgrounds if video fails to load

### SVG Illustrations
- Inline SVG components animated with Framer Motion (`motion.path`, `motion.circle`, `motion.g`)
- Each illustration is 200-300px and themed to the error
- Astronaut: floating bob + slow rotation
- Padlock: idle wobble + periodic shake
- Gears: continuous spin, one gear detaches
- Crane: hook swings like a pendulum

### Shared Elements Across All Pages
- Organization logo watermark (existing)
- "Go Back Home" button
- "Try Again" button (500/503 only)
- Path display (404 only)
- Responsive: stacked on mobile, side-by-side on desktop where applicable
- Framer Motion entrance animations

### Performance
- Videos load lazily with `preload="none"` initially
- SVG animations use CSS `@keyframes` where possible (lighter than JS)
- Framer Motion only for entrance animations, not continuous loops

