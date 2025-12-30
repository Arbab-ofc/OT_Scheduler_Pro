# Hospital OT Scheduler Pro

A React + Vite SaaS-style web app for managing operating theatre schedules with Firebase (Auth/Firestore/Storage), Cloudinary document uploads, MUI/Tailwind UI, and real-time conflict-aware scheduling.

## Quick Links
- 🔗 Live board: Home page shows real-time schedules (fallback sample when unauthorized)
- 🔐 Auth: Email/password + Google; profile editing & password reset
- 🗂️ Docs: Inline document viewing (images/PDF) via Cloudinary
- 📅 Scheduling: Admin dashboards, status updates, conflict detection

## Tech Stack
![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white)
![React Router](https://img.shields.io/badge/React_Router-6-CA4245?logo=reactrouter&logoColor=white)
![MUI](https://img.shields.io/badge/MUI-5-007FFF?logo=mui&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer%20Motion-11-0055FF?logo=framer&logoColor=white)
![Firebase](https://img.shields.io/badge/Firebase-Auth%2FFirestore-FFCA28?logo=firebase&logoColor=black)
![Cloudinary](https://img.shields.io/badge/Cloudinary-Uploads-3448C5?logo=cloudinary&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React_Hook_Form-7-EC5990?logo=reacthookform&logoColor=white)
![Zod](https://img.shields.io/badge/Zod-Validation-3068B7)
![ESLint](https://img.shields.io/badge/ESLint-Linting-4B32C3?logo=eslint&logoColor=white)

- 🖥️ **Frontend**: React 18, Vite 5, React Router 6, MUI, Tailwind, Framer Motion
- 🎨 **UI/Styling**: MUI theme + Tailwind utilities, Space Grotesk/Inter fonts, react-icons
- 🔐 **Auth**: Firebase Auth (email/password + Google)
- 🔥 **Data**: Firestore (users, doctors, patients, schedules, activityLogs), Firebase Storage initialized
- ☁️ **Uploads**: Cloudinary unsigned uploads (images/PDF/docx) with inline previews
- 🧠 **Forms/Validation**: React Hook Form + Zod
- 📊 **Tables**: MUI Data Grid
- 📦 **Tooling**: ESLint, PostCSS, Tailwind, npm

## Project Structure
```
src/
  components/        # common UI, tables, modals, forms, cards
  pages/             # auth, admin, user, marketing
  context/           # Auth, Theme, User providers
  services/          # firebase, cloudinary, domain APIs, logger
  utils/             # helpers, validators, constants, sanitize
  styles/            # theme + global CSS
```

## Getting Started
1) Install deps: `npm install`
2) Env: copy `.env.local.example` to `.env.local` and fill values (see below)
3) Dev server: `npm run dev`
4) Build: `npm run build` and preview: `npm run preview`
5) Lint (optional): `npm run lint`

### Prerequisites
- Node.js 18+
- npm 9+
- Cloudinary account (for unsigned uploads)
- Firebase project with Auth + Firestore enabled

## Scripts
- `npm run dev` — start Vite dev server
- `npm run build` — production build
- `npm run preview` — preview built app
- `npm run lint` — ESLint over `src`

## Environment Variables
Create `.env.local` (never commit secrets):
```
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...

VITE_CLOUDINARY_CLOUD_NAME=dknu6pc0s
VITE_CLOUDINARY_UPLOAD_PRESET=hospital-managment
# Optional: if preset enforces a folder, set it; otherwise leave blank
VITE_CLOUDINARY_FOLDER=samples/ecommerce
```
Note: Cloudinary preset must be **unsigned** and allow pdf,jpg,jpeg,png,docx.

### Cloudinary preset setup (unsigned)
1) In Cloudinary Console → Settings → Upload → Upload presets → Create/Select `hospital-managment`.
2) Set **Signing mode** to **Unsigned**.
3) Allowed formats: add pdf, jpg, jpeg, png, docx.
4) (Optional) Folder: `samples/ecommerce` (or set `VITE_CLOUDINARY_FOLDER` to match).
5) Save and ensure the preset name matches `VITE_CLOUDINARY_UPLOAD_PRESET`.

### Firebase setup
1) Create a Firebase project.
2) Enable Auth providers: Email/Password and Google.
3) Firestore: create collections `users`, `doctors`, `patients`, `schedules`, `activityLogs` (will be created on first writes).
4) Add the web app config to your `.env.local`.
5) (Optional) Add custom claims for admins, or store `role` in the `users` document (app reads role from `users` collection).

## Firebase Setup
- Enable Email/Password and Google providers in Firebase Auth.
- Firestore collections: `users`, `doctors`, `patients`, `schedules`, `activityLogs`.
- Storage is not used for documents (Cloudinary handles docs), but Firebase Storage is initialized.

### Firestore Security Rules (example baseline)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid} {
      allow read, update: if request.auth != null && request.auth.uid == uid;
      allow create: if true; // public registration
    }

    match /schedules/{id} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }

    match /doctors/{id} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }

    match /patients/{id} {
      allow read: if request.auth != null;
      allow create, update, delete: if request.auth != null && request.auth.token.role == 'admin';
    }

    match /activityLogs/{id} {
      allow read, create: if request.auth != null && request.auth.token.role == 'admin';
    }
  }
}
```
Adjust roles/claims as needed; the app currently checks roles from the `users` doc.

## Core Features
- 🧭 Routing: Protected admin/user routes; dashboard redirect by role; 404 page.
- 🔐 Auth: Register, login, email verification, password reset (including unauthenticated reset), Google sign-in.
- 👤 Profile: Edit display name, phone, DOB, gender, blood group; request password reset; accessible from greeting and mobile menu.
- 📅 Scheduling:
  - Create schedules (admin) with validation and conflict detection hook.
  - Status changes (scheduled, confirmed, in-progress, completed, cancelled, postponed, emergency).
  - Postpone flow collects new start time (auto end time +1h).
  - Completion auto-stamps end time.
- 📊 Admin Dashboard: KPIs, upcoming surgeries table with status dropdown, live modals showing details/documents, document upload/delete per schedule.
- 🗂️ Documents: Cloudinary uploads per schedule; inline preview for images/PDFs; other files link out; per-document delete.
- 👓 User Views: User dashboard (filtered schedules), doctor directory, surgical info list.
- 🎨 UI: SaaS-style header/brand, dark mode toggle, Tailwind + MUI theme, animations.

### Admin workflow
- Create doctors/patients.
- Create schedules (auto end time +1h if missing).
- Change status, postpone (requires new start time), complete (auto stamps end time).
- Upload/delete documents per schedule (images/PDFs inline; other types link out).
- View KPIs and upcoming surgeries; open modal to inspect details/docs.

### User workflow
- Login/register, verify email, reset password.
- View own upcoming cases (by doctorId/patientId/nurse assignment).
- Browse doctors directory; view surgical info list.
- Edit profile details and request password reset.

## Cloudinary Usage
- Unsigned uploads to `https://api.cloudinary.com/v1_1/<cloud_name>/<resource>/upload` where `resource` is `image` or `raw` based on MIME type.
- Allowed types: pdf, jpg, jpeg, png, docx (max 10MB).
- Folder: uses `VITE_CLOUDINARY_FOLDER` if provided; otherwise preset folder.
- Stored fields per document: `documentName`, `documentURL`, `publicId`, `resourceType`, `format`, `uploadedAt`.

## Domain Service APIs (client-side wrappers)
- `src/services/api/doctor.api.js`
  - `createDoctor(data)`
  - `getAllDoctors(filters?)`
  - `getDoctorById(id)`
  - `updateDoctor(id, updates)`
- `src/services/api/patient.api.js`
  - `createPatient(data)`
  - `getAllPatients(filters?)`
  - `getPatientById(id)`
  - `updatePatient(id, updates)`
- `src/services/api/schedule.api.js`
  - `createSchedule(data)` (auto end time +1h if missing)
  - `updateSchedule(id, updates)`
  - `getScheduleById(id)` / `getAllSchedules(filters?, orderBy?)`
  - `updateScheduleStatus(id, status, extra?)` (auto end time on completed)
  - `checkOTAvailability(otRoomNumber, date, start, end)`
- `src/services/api/analytics.api.js`
  - `getOTUtilization()` (completion rate, recent events)

## Validation Schemas (Zod)
- Auth: email/password/displayName/role/phone/DOB/gender/bloodGroup
- Doctor: names/email/phone/specialization/license/department/availability/hours/status
- Patient: userId (optional), names/DOB/gender/bloodGroup/phone/email/emergencyContact/status
- Schedule: patientId/doctorId/anesthesiologistId/otRoomNumber/surgeryType/date/start/end (optional)/status/priority

## Accessibility & UX Notes
- Keyboard-focusable header buttons and nav links.
- Modal close button has aria-label; file inputs are native for accessibility.
- Color contrast follows Tailwind/MUI defaults; adjust in `styles/theme.js` and `styles/globals.css` as needed.

## Icons and Assets
- Icons from `react-icons` (Feather set) across header, tables, cards, and modals.
- Brand mark: gradient badge in header; fonts Space Grotesk + Inter.

## Troubleshooting
- **Cloudinary 401**: Ensure preset `hospital-managment` is unsigned and matches `VITE_CLOUDINARY_UPLOAD_PRESET`; set `VITE_CLOUDINARY_CLOUD_NAME`; optional folder env should match preset folder.
- **PDF fails to load**: PDFs are uploaded as `raw` and displayed via Google Docs viewer; ensure URL is accessible and not behind signed delivery.
- **Undefined Firestore fields**: Updates prune `undefined` before writes; check logs if errors persist.
- **Auth redirects**: Logged-in users hitting `/login` are redirected home.
- **Uploads succeed but not visible**: Confirm `documentURL` from Cloudinary is public (unsigned preset) and the stored doc has `publicId/resourceType/format` if needed. Re-upload after correcting preset/folder.

## Contact
- GitHub: https://github.com/Arbab-ofc
- LinkedIn: https://www.linkedin.com/in/arbab-ofc/
- Email: arbabprvt@gmail.com
