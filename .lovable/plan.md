

# Feature Enhancement Plan: Making the Examination Portal Best-in-Class

## 1. Dark/Light Mode Toggle
Add a theme switcher using `next-themes` (already installed) so users can toggle between dark and light modes. A sun/moon icon will appear next to the language toggle in the header.

## 2. FAQ Accordion Section on Home Page
Add an interactive FAQ section with common questions about the exam (registration process, exam dates, result checking, exam center info, etc.) using the existing Accordion component. Fully translated in both EN and HI.

## 3. Testimonials/Social Proof Section on Home Page
Add an auto-scrolling testimonial carousel featuring student success stories and parent feedback, using the existing Embla Carousel. Builds trust and engagement.

## 4. WhatsApp Share Button on Admit Card and Result
Add a "Share on WhatsApp" button so students can quickly share their admit card details or results with family. Very relevant for the target rural audience.

## 5. Duplicate Registration Prevention
Before registering, check if a student with the same name + father's name + class already exists. Show a warning if duplicate found, preventing accidental double registrations.

## 6. Student Search/Filter in Admin Panel
Add a search bar in the Students tab so admins can quickly filter students by name, roll number, or village instead of scrolling through the entire list.

## 7. Bulk Marks Entry in Admin Panel
Add a "Bulk Marks" tab where the admin can see all students without marks and quickly enter marks for multiple students in a table format, speeding up data entry.

## 8. Dashboard Stats Cards in Admin Panel
Show summary statistics at the top of the admin dashboard: total registrations, total results entered, pass/fail ratio, and registration status -- giving a quick overview.

## 9. Animated 404 Page
Redesign the NotFound page with the premium design system, logo watermark, and animated elements consistent with the rest of the site.

## 10. Contact Us / Help Section in Footer
Add a "Need Help?" floating button or a small contact section that links to WhatsApp directly for quick student support.

---

## Technical Details

### Files to Create
- `src/components/ThemeToggle.tsx` -- Theme switcher component
- `src/components/FAQSection.tsx` -- FAQ accordion for home page
- `src/components/TestimonialsSection.tsx` -- Testimonial carousel

### Files to Modify
- `src/pages/Index.tsx` -- Add FAQ and Testimonials sections
- `src/pages/NotFound.tsx` -- Premium redesign
- `src/pages/Admin.tsx` -- Add search filter, dashboard stats, bulk marks tab
- `src/pages/Register.tsx` -- Add duplicate check before submission
- `src/pages/AdmitCard.tsx` -- Add WhatsApp share button
- `src/pages/ResultDetail.tsx` -- Add WhatsApp share button
- `src/components/layout/Header.tsx` -- Add dark/light mode toggle
- `src/lib/i18n.tsx` -- Add translations for all new features (FAQ, testimonials, etc.)
- `src/index.css` -- Add dark mode CSS variables and theme styles
- `tailwind.config.ts` -- Ensure dark mode class strategy is configured

### Key Technical Considerations
- Dark mode will use `class` strategy via `next-themes` for SSR compatibility
- Duplicate registration check uses an efficient Supabase query with `.ilike()` matching
- Admin search uses client-side filtering for instant results
- WhatsApp share uses the `https://wa.me/?text=` URL scheme (works on mobile and desktop)
- All new text content will have both English and Hindi translations

