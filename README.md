# Point of Knowledge — Нуқтаи Дониш

Functional educational platform prototype for students, teachers, parents and administrators.

## Included
- RU / TJ / UZ / EN
- automatic light/dark theme + manual switch
- login, registration, logout, password reset API
- profiles and profile editing
- admin user management: create/edit/block/delete
- course management: create/edit/delete, assign teacher
- student enrollment and move-to-course workflow
- course student list and remove enrollment
- CRUD pages for groups, schedule, grades, attendance, homework, tests, news, notifications and payments
- responsive desktop/mobile navigation
- Node.js 22 server and JSON data store

## Demo accounts
All demo accounts use `ChangeMe123!` unless you set role-specific environment passwords.
- `admin` — `+992900000001`
- `teacher` — `+992900000002`
- `parent` — `+992900000003`
- `student` — `+992900000004`
Older deployed databases may still contain legacy email fields; the current interface and new accounts use only username + phone.

## Local
```bash
npm start
```
Open http://localhost:3000

## Render
Build command: `npm install`
Start command: `npm start`
Runtime: Node 22.x (from `.node-version` / `package.json`).

### Production note
The current JSON store is suitable for prototype/testing. Render Web Services use ephemeral local storage, so real production deployment should migrate the data layer to PostgreSQL before storing real student records, grades, payments or documents.


## v4 roadmap update
- Authentication uses unique username + phone number (email is no longer shown as an account identifier).
- Login accepts username or phone.
- Admin action history (audit log) tracks security and CRUD changes.
- Global search filters visible users, courses and records.
- Legacy email login is accepted only for backward compatibility with older databases.
