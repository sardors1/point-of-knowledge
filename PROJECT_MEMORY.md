# Point of Knowledge — Project Memory

## Current baseline
- Production deployment: Render Web Service.
- Repository: `sardors1/point-of-knowledge`.
- Runtime: Node.js 22.
- Data store: `data/db.json` (prototype; PostgreSQL recommended for real production data).
- Core CRUD is already working for users, students, teachers, courses, enrollments and learning records.
- Responsive UI with RU/TJ/UZ/EN and light/dark themes.
- Logout, profiles, dashboard and mobile navigation are implemented.

## Identity decision
The primary account identifiers are:
1. `username` — unique, 3–32 chars: letters, numbers, `_`, `.`, `-`.
2. `phone` — unique normalized phone number.
3. password.
Email is not shown in the current UI and is not required for new accounts. Legacy email fields/login may remain only to avoid breaking older deployed data.

## v4 improvements in this build
- Login by username or phone.
- Registration requires username + phone.
- Profile and admin user management use username + phone.
- Audit log for login, registration and CRUD/security actions.
- Admin History page.
- Global client-side search across visible tables/cards.
- Basic login rate limiting: 5 failed attempts per key triggers a 10-minute cooldown.
- `lastLoginAt` tracking.
- Existing demo users migrated to usernames and demo phone numbers.

## Product direction
Continue improving in this order:
1. Role/permission matrix and least-privilege enforcement.
2. PostgreSQL migration for production persistence.
3. Groups and schedule as first-class relational entities.
4. Attendance, grades, homework and tests linked by IDs rather than display names.
5. Notifications and event center.
6. Analytics and reporting.
7. Export to XLSX/PDF.
8. Parent ↔ child relationships.
9. File/document storage.
10. Backups, restore workflow, monitoring and automated tests.
11. Stronger authentication: session rotation, optional 2FA/SMS verification, password recovery provider.
12. Final UI/UX polish and accessibility.

## Working rule
Never remove a working feature without a migration path. Before large changes, create a Git commit/tag or backup so the last working deployment can be restored.
