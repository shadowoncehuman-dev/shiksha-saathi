

# Make the Site More Premium Looking

A comprehensive visual upgrade across all pages to elevate the design to a luxury, editorial aesthetic.

## Changes Overview

### 1. Enhanced Global Styles (`src/index.css`)
- Add smooth scroll behavior and better selection colors
- Add new utility classes: `glass-morphism`, `premium-gradient-text`, `luxury-border` with animated gradient borders
- Add subtle noise texture overlay for depth
- Improve dark mode card shadows with colored glow effects
- Add new keyframes: `glow-pulse`, `slide-up`, `scale-in` for micro-interactions

### 2. Header Polish (`src/components/layout/Header.tsx`)
- Add a thin gold accent line at the top of the page (1px gradient bar)
- Increase header height slightly with more breathing room
- Add subtle glass-morphism effect with frosted glass border
- Improve nav link hover states with underline animation (not just color change)
- Polish the language toggle and theme toggle with refined styling

### 3. Footer Upgrade (`src/components/layout/Footer.tsx`)
- Add decorative gold divider ornament between content and copyright
- Improve spacing and typography hierarchy
- Add subtle hover animations on contact icons

### 4. Homepage (`src/pages/Index.tsx`)
- Hero: Add animated gradient mesh background overlay for depth
- Hero: Improve CTA buttons with glass-morphism hover states
- Stats section: Add gold accent lines between stats, animated counters with glow
- Countdown Timer: Redesign with glass cards, gold accents, and subtle glow animation
- Exam Groups cards: Add shimmer border effect on hover
- About section: Add icon background glow effect
- Gallery preview: Add overlay text with elegant typography treatment
- CTA section: Add decorative ornaments

### 5. Countdown Timer (`src/components/CountdownTimer.tsx`)
- Redesign cards with glass-morphism + gold border accent
- Add pulsing glow effect on the numbers
- Add colon separators between time units
- Larger, more dramatic typography

### 6. Testimonials (`src/components/TestimonialsSection.tsx`)
- Add gradient quote mark icon
- Improve card design with left gold accent border
- Better avatar placeholder with gradient background

### 7. FAQ Section (`src/components/FAQSection.tsx`)
- Add number indicators for each question
- Improve accordion styling with smoother transitions
- Gold accent on expanded state

### 8. Inner Pages (ExamDetails, Register, Result, Team, Gallery, Documents)
- Add consistent premium hero banners with decorative elements
- ExamDetails: Add subtle pattern background, improve card header gradients
- Documents: Add category icons, improve card hover states
- Team: Add subtle parallax effect on hover, golden frame on photos
- Gallery: Improve lightbox with backdrop blur

### 9. WhatsApp Button
- Add pulse ring animation for attention
- Improve shadow with green glow

### 10. Tailwind Config
- Add new animation utilities (`glow-pulse`, `float`, `scale-in`)

## Technical Approach
- All changes are CSS/styling and JSX structure only -- no logic changes
- Uses existing Tailwind + Framer Motion stack
- Maintains dark mode compatibility throughout
- Focus on micro-interactions, better shadows, gold accents, glass-morphism, and refined typography spacing

## Files to Modify
1. `src/index.css` -- new utility classes and global polish
2. `tailwind.config.ts` -- new animations/keyframes
3. `src/components/layout/Header.tsx` -- glass-morphism, accent bar
4. `src/components/layout/Footer.tsx` -- ornaments, polish
5. `src/pages/Index.tsx` -- hero mesh, card upgrades, section polish
6. `src/components/CountdownTimer.tsx` -- glass card redesign
7. `src/components/TestimonialsSection.tsx` -- gold accent cards
8. `src/components/FAQSection.tsx` -- numbered, gold-accented
9. `src/components/WhatsAppButton.tsx` -- pulse ring
10. `src/pages/ExamDetails.tsx` -- premium hero + cards
11. `src/pages/Downloads.tsx` -- card polish
12. `src/pages/Team.tsx` -- golden frames
13. `src/pages/Gallery.tsx` -- lightbox polish

