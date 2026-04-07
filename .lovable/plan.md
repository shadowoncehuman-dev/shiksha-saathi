

# Exam Notice System + Enhanced Registration Feedback + Offline Page + Hindi Translations

## Overview
Add an admin-manageable exam notice system (cancelled/rescheduled), a no-internet offline page, visually rich registration success/failed screens, and Hindi translations for all new text. When exam is cancelled/rescheduled, the Register page hides the form entirely and shows only the notice.

## 1. Database Migration
Add two columns to `site_settings`:
```sql
ALTER TABLE site_settings ADD COLUMN exam_notice TEXT DEFAULT NULL;
ALTER TABLE site_settings ADD COLUMN exam_notice_type TEXT DEFAULT 'info';
```
`exam_notice_type` values: `info`, `warning`, `cancelled`, `rescheduled`. When null, no notice shown.

## 2. Exam Notice Banner (`src/components/ExamNoticeBanner.tsx`)
- Fetches `exam_notice` + `exam_notice_type` from `site_settings`
- Color-coded: red for cancelled, orange for rescheduled, yellow for warning, blue for info
- Animated icon (AlertTriangle/Calendar/Info) + message text
- Dismissible via sessionStorage (except on Register page when cancelled/rescheduled)
- Used on: **Index.tsx** (below hero), **Result.tsx** (above search), **Register.tsx** (above form)

## 3. Register Page Logic Change (`src/pages/Register.tsx`)
- Fetch `exam_notice` and `exam_notice_type` alongside `registration_status`
- **If `exam_notice_type` is `cancelled` or `rescheduled`**: hide the registration form entirely, show a full themed notice page (similar to the "Not Started"/"Closed" block but with the exam notice message, a prominent icon, and no form)
- If notice is `info` or `warning`: show banner above form but allow registration

## 4. Registration Success Screen (`src/components/RegistrationSuccess.tsx`)
- Full-screen green/emerald themed page (replaces toast + navigate)
- Animated checkmark SVG (circle draws in, checkmark appears)
- Confetti-like CSS particle animation
- Displays roll number prominently, student name, class, group
- Buttons: "Download Admit Card" + "Go Home"

## 5. Registration Failed Screen (`src/components/RegistrationFailed.tsx`)
- Red themed overlay with animated X-mark SVG + shake effect
- Error message display
- "Try Again" + "Go Home" buttons

## 6. Offline Detector (`src/components/OfflineDetector.tsx`)
- Listens to `online`/`offline` window events + `navigator.onLine`
- Full-screen overlay when offline: dark gradient, animated WiFi-off SVG with fading signal waves
- Auto-dismisses when connection restores
- Added to `App.tsx` wrapping everything

## 7. Admin Panel — Exam Notice Management
Add to Settings tab in `Admin.tsx`:
- Text input for exam notice message
- Dropdown for notice type (Info/Warning/Cancelled/Rescheduled)
- Save + Clear buttons
- Update `SiteSettings` type in `src/lib/supabase.ts`

## 8. Hindi Translations (`src/lib/i18n.tsx`)
Add keys for:
- Offline page: title, subtitle
- Registration success: title, rollLabel, downloadAdmitCard
- Registration failed: title, tryAgain
- Exam notice types: cancelled, rescheduled, warning, info
- Admin notice labels

## Files to Create
- `src/components/ExamNoticeBanner.tsx`
- `src/components/RegistrationSuccess.tsx`
- `src/components/RegistrationFailed.tsx`
- `src/components/OfflineDetector.tsx`

## Files to Modify
- `src/pages/Register.tsx` — fetch exam notice, conditionally hide form, use success/failed components
- `src/pages/Index.tsx` — add ExamNoticeBanner
- `src/pages/Result.tsx` — add ExamNoticeBanner
- `src/pages/Admin.tsx` — add exam notice management in Settings tab
- `src/App.tsx` — add OfflineDetector
- `src/lib/i18n.tsx` — add all new translation keys (en + hi)
- `src/lib/supabase.ts` — update SiteSettings type
- Migration: add `exam_notice` + `exam_notice_type` columns to `site_settings`

