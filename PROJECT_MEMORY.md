# Point of Knowledge — project memory

## Current baseline
- Live educational platform on Render.
- Stable working release: v4.0.0.
- Stack: Node.js 22, vanilla HTML/CSS/JS, JSON data store in `data/db.json`.
- Login uses username or phone + password; email is not the primary login.
- Roles: admin, teacher, parent, student.
- Languages: RU / TJ / UZ / EN.
- Green-accent responsive UI, light/dark theme.
- Existing CRUD: users, students, teachers, courses, enrollments, groups, schedule, grades, attendance, homework, tests, news, notifications, payments.
- Audit log exists.

## v4.1 improvements
- Server-side role permission map.
- Blocked accounts are rejected at authentication middleware.
- Teacher data visibility is scoped to assigned courses.
- Parent → child relationships are stored explicitly in `parentChildren`.
- Parent bootstrap now includes linked children, their courses and relevant academic records.
- Admin can link a parent to a student through the API and UI.
- Parent dashboard has a real children page with course and grade summary.
- Generic collection GET endpoints now apply role-based visibility instead of returning unrestricted data.
- Deleting a user also removes parent-child relationships.
- Last active admin cannot be demoted.

## Next planned stages
1. PostgreSQL migration after v4.1 is validated on Live.
2. Full relational groups/classes/lessons model.
3. Real attendance and gradebook workflow.
4. Parent portal with child selector.
5. Notifications center and audit improvements.
6. Analytics, export and PWA enhancements.
