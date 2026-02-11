

# 🏛️ Bharat Ratan Baba Sahib Dr. Bhimrao Ambedkar Ji Shiksha Sudhar Samiti — Examination Portal

## Overview
A premium, government-standard examination website for organizing and facilitating student examinations. Built with React, Tailwind CSS, Supabase (external), and Framer Motion.

---

## 🎨 Design & Branding
- **Color scheme**: Royal Blue (#0B3D91), Deep Saffron (#F4A300), White, Soft Gray, Gold accents
- **Typography**: Playfair Display for headings, Poppins for body text
- **Visual elements**: Glassmorphism cards, gold borders, constitution manuscript texture overlay, Dr. B.R. Ambedkar silhouette watermark, elegant dividers, soft shadows
- **Animations**: Framer Motion for smooth page transitions, hover effects, and micro-interactions

---

## 📄 Pages & Features

### 1. Home Page (`/`)
- **Hero section** with premium background, organization name, tagline, and two animated CTA buttons (View Exam Details, Register Now)
- **Exam Groups section** clearly displaying Group 1 (Classes 6-8, 2 hrs) and Group 2 (Classes 9-12, 3 hrs)
- **Exam date**: 10–14 April 2026
- **About section** with organizational information
- Premium footer with contact details and copyright

### 2. Registration Page (`/register`)
- Checks `registration_status` from `site_settings` before showing the form
- Shows appropriate messages for "Not Started" or "Closed" states
- Premium centered card form with fields: Name, Father's Name, Class (6-12 dropdown), Phone (10-digit validation), Village (dropdown with predefined villages + Others)
- On submit: saves data, auto-generates roll number via Supabase edge function, redirects to admit card

### 3. Admit Card Page (`/admit-card`)
- Government hall ticket design with royal blue header, gold frame border, Dr. Ambedkar watermark
- Displays: Samiti name, Group, Student Name, Father's Name, Class, Roll Number (large & bold), Exam Date, Duration, Office address, Contact info
- QR code encoding full student details (name, roll, class, etc.)
- Warning message to save/download the admit card
- Buttons: Download PDF, Download Image, Print

### 4. Result Page (`/result`)
- Search by Roll Number OR Name + Father's Name
- Checks `result_status`, `result_publish_date`, and `result_expiry_date` before showing results
- Shows appropriate messages for "Not Declared" or "Viewing Period Ended" states
- **Result card**: Student Name, Roll Number, Class, Subject-wise Marks (Subject 1-4), Total, Percentage, Grade, PASS/FAIL badge (green/red), official watermark

### 5. Admin Panel (`/admin`)
- **Password-protected** via Supabase edge function (admin password stored as a Supabase secret)
- **Dashboard features**:
  - Registration control (Not Started / Open / Closed dropdown)
  - Result control (Not Declared / Available / Viewing Period Ended dropdown) with publish & expiry date pickers
  - Add marks: search student by roll number, enter Subject 1-4 marks, auto-calculate total/percentage/grade, save
  - Manage students: view all registrations, edit, delete, export CSV
  - Upload section: syllabus PDFs and gallery images (using Supabase Storage)

---

## 🗄️ Database (Supabase)

### Tables
- **registrations**: id, roll_number, name, father_name, class, group, phone, village, created_at
- **roll_counters**: class (PK), last_number — for sequential roll number generation per class
- **results**: id, roll_number, subject1-4 marks, total, percentage, grade, status
- **site_settings**: registration_status, result_status, result_publish_date, result_expiry_date

### Edge Functions
- **validate-admin**: Validates admin password against stored secret
- **generate-roll-number**: Atomically increments roll counter and returns new roll number for a given class

### Roll Number Format
- `{class}{sequential 3-digit number}` — e.g., 6001, 7001, 10001, 12001

---

## 🌐 Responsive & SEO
- Fully responsive design for mobile, tablet, and desktop
- SEO-optimized with proper meta tags, structured headings, and semantic HTML
- Fast loading with optimized assets

