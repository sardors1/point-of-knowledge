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
- admin@pointofknowledge.tj
- teacher@pointofknowledge.tj
- parent@pointofknowledge.tj
- student@pointofknowledge.tj

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
