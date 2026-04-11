

# Invigilator Dashboard + Duplicate Prevention + Student Data Insert

## Overview
Create the Invigilator page (3 tabs: Search, All Students, QR Scanner — no Attendance tab), strengthen duplicate prevention, insert ~40 class 6 and ~72 class 9 students, and update passwords.

## 1. Database Changes

### Unique index on registrations
```sql
CREATE UNIQUE INDEX idx_unique_registration 
ON registrations (LOWER(TRIM(name)), LOWER(TRIM(father_name)), class);
```

### Insert student data
- **Class 6, Village "Ahmadpur Nayagaon", Group "Group 1"**: ~40 students (Vinam s/o Chunni Lal through Vishakha d/o Raju). Roll numbers start from 6037 onward (current last_number is 36).
- **Class 9, Village "Ahmadpur Nayagaon", Group "Group 2"**: ~72 students (Payal d/o Nanhe Singh through Khushi d/o Sansarpal). Roll numbers start from 9005 onward (current last_number is 4).
- Parse "s/o" / "d/o" to split student name and father name.
- Students without marks in the results table will be treated as absent (no action needed now — the result system already handles missing entries).

## 2. Secrets
- Add `INVIGILATOR_PASSWORD` secret with value `exam2026`
- Update `ADMIN_PASSWORD` secret to `april14`

## 3. Edge Function: `validate-invigilator`
- File: `supabase/functions/validate-invigilator/index.ts`
- Same pattern as `validate-admin`, checks against `INVIGILATOR_PASSWORD`

## 4. Invigilator Page (`src/pages/Invigilator.tsx`)

### Password Gate
- Password input, validates via `validate-invigilator` edge function

### Tab 1: Student Search
- Search by roll number or name (partial match via ilike)
- Results as cards showing all student details
- Click to edit name, father_name, class, village, phone (roll_number read-only)

### Tab 2: All Students
- Paginated table of all registrations
- Filter by class, group, village
- Inline edit with save to DB

### Tab 3: QR Scanner
- Install `html5-qrcode` package
- Scan QR → parse JSON → cross-verify against `registrations` table
- Green/red result indicator with student details

## 5. Enhanced Duplicate Prevention (`src/pages/Register.tsx`)
- **Server-side block**: In `onSubmit`, before inserting, query for exact match (case-insensitive name + father_name + class). If found, show error and block submission.
- **Phone spam check**: Warn if same phone has 3+ registrations.
- DB unique index as final safety net.

## 6. Route & Dependencies
- Add `/invigilator` to `AnimatedRoutes.tsx` (lazy loaded)
- Install `html5-qrcode`

## 7. i18n Translations
Add Hindi/English keys for invigilator UI (login, search, tabs, edit, QR status).

## Files to Create
- `src/pages/Invigilator.tsx`
- `supabase/functions/validate-invigilator/index.ts`
- Migration: unique index on registrations

## Files to Modify
- `src/components/AnimatedRoutes.tsx` — add route
- `src/pages/Register.tsx` — server-side duplicate block in onSubmit
- `src/lib/i18n.tsx` — invigilator translations

## Data Operations (via insert tool)
- Insert ~40 class 6 students with generated roll numbers (6037–6076)
- Insert ~72 class 9 students with generated roll numbers (9005–9076)
- Update roll_counters for class 6 and class 9

