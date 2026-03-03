

# Feature Enhancement Plan

Building on the existing plan from `.lovable/plan.md`, here are all the features to implement:

## 1. Dark/Light Mode Toggle
Add a sun/moon toggle in the header using `next-themes`. Configure Tailwind for `class` dark mode strategy. Add dark mode CSS variables in `index.css`.

## 2. FAQ Section on Home Page
Add an accordion FAQ section with 6-8 common questions about registration, exam process, results, and eligibility. Fully bilingual (EN/HI).

## 3. Testimonials Carousel on Home Page
Auto-scrolling testimonial cards with student/parent quotes using Embla Carousel. Adds social proof and trust.

## 4. WhatsApp Share on Admit Card & Result
Add a "Share on WhatsApp" button using `wa.me/?text=` URL scheme on both `AdmitCard.tsx` and `ResultDetail.tsx`. Critical for the rural target audience.

## 5. Duplicate Registration Prevention
Before inserting in `Register.tsx`, query Supabase for matching name + father_name + class. Show a warning toast if duplicate found.

## 6. Admin Dashboard Stats
Show cards at the top of Admin panel: total registrations, total results, pass/fail count, current registration status.

## 7. Admin Student Search/Filter
Add a search input in the Students tab to filter by name, roll number, or village in real-time (client-side).

## 8. Animated 404 Page
Redesign `NotFound.tsx` with the premium design system -- logo watermark, gradient background, animated elements, and a proper "Go Home" button.

## 9. Floating WhatsApp Help Button
A fixed-position WhatsApp icon button in the bottom-right corner across all pages, linking to the contact number.

## 10. Exam Countdown Timer on Home Page
A live countdown to the exam date (10 April 2026) showing days, hours, minutes, seconds. Creates urgency and engagement.

---

## Technical Summary

**New files:**
- `src/components/ThemeToggle.tsx`
- `src/components/FAQSection.tsx`
- `src/components/TestimonialsSection.tsx`
- `src/components/WhatsAppButton.tsx`
- `src/components/CountdownTimer.tsx`

**Modified files:**
- `src/lib/i18n.tsx` -- Add translations for FAQ, testimonials, countdown, WhatsApp, 404
- `src/index.css` -- Dark mode CSS variables
- `tailwind.config.ts` -- `darkMode: "class"`
- `src/App.tsx` -- Wrap with ThemeProvider, add WhatsAppButton
- `src/components/layout/Header.tsx` -- Add theme toggle
- `src/pages/Index.tsx` -- Add FAQ, Testimonials, Countdown sections
- `src/pages/NotFound.tsx` -- Premium redesign
- `src/pages/Register.tsx` -- Duplicate check before submit
- `src/pages/AdmitCard.tsx` -- WhatsApp share button
- `src/pages/ResultDetail.tsx` -- WhatsApp share button
- `src/pages/Admin.tsx` -- Stats cards + search filter

