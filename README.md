# Shiksha Saathi

Create a premium, modern, professional, government-standard examination website using:

Next.js (App Router)

React

Tailwind CSS

Supabase (Database only)

Framer Motion animations

Fully responsive

SEO optimized

Clean folder structure

🌟 WEBSITE DETAILS
Name:

Bharat Ratan Baba Sahib Dr. Bhimrao Ambedkar Ji Shiksha Sudhar Samiti

Tagline:

Empowering Education Through Excellence

Subheading:

Organizing and facilitating student examinations with integrity and innovation

🎨 DESIGN REQUIREMENTS (VERY IMPORTANT)

The website must look:

Government official

Institutional

Premium

Elegant

Trustworthy

Not generic

Not template-like

Not AI-looking

🎨 Color Palette

Royal Blue (#0B3D91)

Deep Saffron (#F4A300)

White

Soft Gray background

Gold hover accents

Typography

Headings → Playfair Display

Body → Poppins

UI Features

Glassmorphism cards

Gold borders

Smooth hover animations

Soft shadows

Constitution manuscript texture overlay

Elegant dividers

Premium footer

Subtle watermark background of Dr. B.R. Ambedkar silhouette

🏠 HOME PAGE STRUCTURE
Hero Section

Premium background image

Large heading

Tagline

Two animated buttons:

View Exam Details

Register Now

🎯 EXAM GROUP STRUCTURE
Group 1

Classes: 6, 7, 8
Duration: 2 Hours

Group 2

Classes: 9, 10, 11, 12
Duration: 3 Hours

Display grouping clearly.

Exam Date:
Between 10–14 April 2026

🎯 ROLL NUMBER GENERATION LOGIC (VERY IMPORTANT)

Roll number must auto-generate per class.

Format:
{class}{001 sequential}

Examples:

Class 6 → 6001, 6002
Class 7 → 7001
Class 8 → 8001
Class 9 → 9001
Class 10 → 10001
Class 11 → 11001
Class 12 → 12001

Each class must maintain its own counter.

Use table:
roll_counters

Fields:

class

last_number

Logic:

On registration, fetch class

Get last_number

Increment

Generate roll number

Save to registrations

📝 REGISTRATION PAGE (/register)

Premium centered card layout.

Fields:

Name

Father’s Name

Class (6–12)

Phone (10 digit validation)

Village dropdown:
Ahmadpur Nayagaon
Kamalpur
Anwarpur
Kanvi
Nizampur
Dehpa
Others

Before showing form:
Check registration_status from site_settings.

States:

Not Started → Show message

Open → Show form

Closed → Show “Registration is currently closed.”

On submit:

Save data

Generate roll number

Redirect to Admit Card page

🎟 ADMIT CARD PAGE (AUTO AFTER REGISTRATION)

Design must look like:

Government hall ticket

Royal blue header

Gold frame border

Watermark of Dr. Ambedkar

Clean typography

QR code (contains roll number)

Premium layout

Display:

Samiti Name

Group (Auto detect)

Student Name

Father’s Name

Class

Roll Number (Large & Bold)

Exam Date

Duration

Office:
Pradhan Office, Nayagaon

Contact:
9917917438
bijanderk3@gmail.com

At bottom show:

⚠️ Important:
Please take a screenshot or download this Admit Card and keep it safe for examination and result checking.

Buttons:

Download PDF

Download Image

Print

Make design extremely premium and official.

📊 RESULT PAGE (/result)

Search by:

Roll Number
OR

Name + Father Name

Before showing result:
Check result_status.

Possible states:

Not Declared
→ Show: “Result will be declared soon.”

Available
→ Show result

Viewing Period Ended
→ Show: “Result viewing period has ended.”

Also check:

result_publish_date

result_expiry_date

Auto enable/disable based on date/time.

📊 RESULT DISPLAY DESIGN

Premium result card with:

Student Name

Roll Number

Class

Subject-wise Marks

Total

Percentage

Grade

PASS/FAIL Badge

Green badge → PASS
Red badge → FAIL

Watermark:
Official Result – BBDBASS Samiti

🔐 ADMIN PANEL (NO LOGIN SYSTEM)

Route:
/admin

Admin does NOT need Supabase auth.

Instead:

When admin visits /admin:
Show password entry screen.

Admin must enter secret password to access dashboard.

Password should be stored in environment variable:
ADMIN_SECRET_KEY

If correct → allow access
If wrong → show error

No public login system.

🛠 ADMIN FEATURES
1️⃣ Registration Control

Dropdown:

Not Started

Open

Closed

2️⃣ Result Control

Dropdown:

Not Declared

Available

Viewing Period Ended

Also set:

Result Publish Date

Result Expiry Date

3️⃣ Add Marks

Admin can:

Search student by roll number

Enter subject1–subject4 marks

Auto calculate total

Auto calculate percentage

Auto assign grade

Save result

4️⃣ Manage Students

View all registrations

Edit

Delete

Export CSV

5️⃣ Upload Section

Upload syllabus PDFs

Upload gallery images

🗄 DATABASE STRUCTURE
registrations

id

roll_number

name

father_name

class

group

phone

village

created_at

roll_counters

class (primary key)

last_number

results

id

roll_number

subject1

subject2

subject3

subject4

total

percentage

grade

status

site_settings

registration_status

result_status

result_publish_date

result_expiry_date

📞 FOOTER

Pradhan Office, Nayagaon
📞 9917917438
📧 bijanderk3@gmail.com

© 2026 Bharat Ratan Baba Sahib Dr. Bhimrao Ambedkar Ji Shiksha Sudhar Samiti. All rights reserved.

🔥 FINAL INSTRUCTION

The final website must look:

Premium

Institutional

Government-standard

Elegant

Clean

Highly professional

Trustworthy

Smooth animated

Perfect spacing

Not template style

Not AI generic

Add refined micro-interactions and subtle animation polish.

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://shiksha-suvidha-portal.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/fb3934e6-52d2-43ee-801a-10025826f908).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
