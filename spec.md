# Specification

## Summary
**Goal:** Build Blood Connect, a mobile-first emergency blood donor-receiver platform with donor search, SOS requests, eligibility checking, a dashboard, and an admin panel.

**Planned changes:**
- User registration with role selection (Donor or Receiver), collecting name, blood group, phone, city, age, and optional last donation date; duplicate phone numbers rejected
- Smart Donor Search screen: filter by blood group and city, results sorted by most recent activity, "Available Now" badge for donors active within 24 hours, each card showing name, blood group, city, phone, and a WhatsApp contact button (wa.me deep link with pre-filled message)
- Home screen with a large red SOS Emergency Request button that confirms before submitting and creates an emergency request record (blood group, city, timestamp) in the backend
- Rule-based AI Eligibility Checker: step-by-step questionnaire (age, weight, last donation date, health conditions checkboxes), displays Eligible or Not Eligible with reason and next recommended donation date
- Dashboard screen showing total donor count, nearby donors list (matched by city), and 5 most recent emergency requests
- Admin panel at /admin (no auth): paginated user list with deactivate button, all emergency requests listed; deactivated users hidden from search
- Backend (Motoko actor) storing all user profiles, emergency requests, and deactivation status
- Clean medical theme: white/light-gray backgrounds, red (#DC2626) accent, min 16px body text, min 48px button height, mobile-first layout (max 430px), Blood Connect logo in header

**User-visible outcome:** Users can register as donors or receivers, search for matching blood donors by blood group and city, contact donors via WhatsApp, trigger SOS emergency requests, check their donation eligibility step-by-step, and view a dashboard of platform activity. Admins can manage users and view emergency requests via /admin.
