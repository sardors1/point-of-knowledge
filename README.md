# Point of Knowledge 4.1

Educational center platform for Point of Knowledge / Нуқтаи Дониш.

## 4.1 highlights
- Username + phone login (email is not required as a login).
- Roles: Admin, Teacher, Parent, Student.
- Server-side role permissions and blocked-account protection.
- Teacher data is scoped to assigned courses.
- Explicit Parent → Student relationships.
- Parent portal with linked children and academic summary.
- Admin can link parents to students.
- CRUD for users, courses, enrollments and educational records.
- Audit log for important administrative actions.
- RU / TJ / UZ / EN.
- Responsive desktop/mobile UI with light/dark mode.

## Local
```bash
npm start
```

## Demo accounts
- admin / +992900000001
- teacher / +992900000002
- parent / +992900000003
- student / +992900000004

Default demo password: `ChangeMe123!`

## Production roadmap
The current stable branch still uses JSON persistence for compatibility with the working v4 deployment. PostgreSQL migration is planned after this v4.1 validation so the Live release is not broken during the transition.
