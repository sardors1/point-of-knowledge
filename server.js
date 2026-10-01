const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 3000);
const DB = path.join(ROOT, 'data', 'db.json');
const sessions = new Map();
const MIME = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.png': 'image/png', '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.ico': 'image/x-icon'
};

const ROLES = ['student', 'teacher', 'parent', 'admin'];
const COLLECTIONS = ['enrollments','groups', 'schedule', 'grades', 'attendance', 'homework', 'tests', 'news', 'notifications', 'payments'];

function uuid() { return crypto.randomUUID(); }
function now() { return new Date().toISOString(); }
async function readDB() { return JSON.parse(await fs.readFile(DB, 'utf8')); }
async function writeDB(db) { await fs.mkdir(path.dirname(DB), { recursive: true }); await fs.writeFile(DB, JSON.stringify(db, null, 2), 'utf8'); }
function send(res, status, data, headers = {}) {
  const body = typeof data === 'string' ? data : JSON.stringify(data);
  res.writeHead(status, Object.assign({ 'Content-Type': typeof data === 'string' ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }, headers));
  res.end(body);
}
const json = (res, status, data) => send(res, status, data);
function readBody(req) {
  return new Promise((resolve) => {
    let s = '';
    req.on('data', c => { s += c; if (s.length > 2_000_000) req.destroy(); });
    req.on('end', () => { try { resolve(s ? JSON.parse(s) : {}); } catch { resolve({}); } });
  });
}
function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return { salt, hash: crypto.scryptSync(String(password), salt, 64).toString('hex') };
}
function verify(password, user) {
  if (!user?.salt || !user?.hash) return false;
  const a = Buffer.from(crypto.scryptSync(String(password), user.salt, 64).toString('hex'));
  const b = Buffer.from(user.hash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function validPassword(p) { return typeof p === 'string' && p.length >= 8; }
function token() { return crypto.randomBytes(32).toString('hex'); }
function sha256(v) { return crypto.createHash('sha256').update(String(v)).digest('hex'); }
function safeUser(u) {
  return { id: u.id, name: u.name, email: u.email, role: u.role, phone: u.phone || '', bio: u.bio || '', avatar: u.avatar || '', status: u.status || 'active', createdAt: u.createdAt, courseIds: u.courseIds || [] };
}
function auth(req) {
  const h = req.headers.authorization || '';
  return h.startsWith('Bearer ') ? sessions.get(h.slice(7)) || null : null;
}
function requireAuth(req, res) { const u = auth(req); if (!u) { json(res, 401, { error: 'Unauthorized' }); return null; } return u; }
function requireAdmin(req, res) { const u = requireAuth(req, res); if (!u) return null; if (u.role !== 'admin') { json(res, 403, { error: 'Только администратор' }); return null; } return u; }
function publicResetUrl(req, raw) { const proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim(); return `${proto}://${req.headers.host || 'localhost:3000'}/?reset=${encodeURIComponent(raw)}`; }
async function sendResetEmail(to, url) {
  const key = process.env.RESEND_API_KEY, from = process.env.MAIL_FROM;
  if (!key || !from) return false;
  try {
    const r = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${key}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [to], subject: 'Point of Knowledge — восстановление пароля', html: `<p>Восстановление пароля Point of Knowledge.</p><p><a href="${url}">Сбросить пароль</a></p><p>Ссылка действует 15 минут.</p>` }) });
    return r.ok;
  } catch { return false; }
}
function pick(obj, keys) { const out = {}; keys.forEach(k => { if (obj[k] !== undefined) out[k] = obj[k]; }); return out; }
function ensureArray(db, key) { if (!Array.isArray(db[key])) db[key] = []; }

async function seed() {
  const db = await readDB();
  ensureArray(db, 'users'); ensureArray(db, 'courses');
  COLLECTIONS.forEach(k => ensureArray(db, k));
  db.users.forEach(u => {
    if (!u.hash) { const p = hashPassword(process.env[`POK_${String(u.role).toUpperCase()}_PASSWORD`] || 'ChangeMe123!'); u.salt = p.salt; u.hash = p.hash; }
    u.courseIds = Array.isArray(u.courseIds) ? u.courseIds : [];
    u.status = u.status || 'active'; u.phone = u.phone || ''; u.bio = u.bio || '';
  });
  db.courses.forEach(c => { c.category = c.category || 'General'; c.lessons = Number(c.lessons || 0); c.teacherId = c.teacherId || ''; c.description = c.description || ''; });
  const teacher = db.users.find(u => u.role === 'teacher');
  if (teacher) db.courses.slice(0, 2).forEach(c => { if (!c.teacherId) c.teacherId = teacher.id; });
  const student = db.users.find(u => u.role === 'student');
  if (student && !db.enrollments.length) {
    db.courses.slice(0, 2).forEach((course, idx) => { db.enrollments.push({ id: uuid(), userId: student.id, courseId: course.id, progress: idx ? 74 : 82, joinedAt: now() }); if (!student.courseIds.includes(course.id)) student.courseIds.push(course.id); });
  }
  if (!db.groups.length && teacher) db.groups.push({id:uuid(),name:'English B2 · группа A',courseName:db.courses[0]?.title||'English B2',teacherName:teacher.name,createdAt:now()},{id:uuid(),name:'IELTS · группа B',courseName:db.courses[1]?.title||'IELTS',teacherName:teacher.name,createdAt:now()});
  if (!db.schedule.length) db.schedule.push({id:uuid(),date:'2026-10-02',time:'10:00',courseName:db.courses[0]?.title||'English B2',room:'204',createdAt:now()},{id:uuid(),date:'2026-10-02',time:'14:00',courseName:db.courses[1]?.title||'IELTS',room:'102',createdAt:now()});
  if (!db.grades.length && student) db.grades.push({id:uuid(),studentName:student.name,courseName:db.courses[0]?.title||'English B2',topic:'Grammar',score:92,createdAt:now()},{id:uuid(),studentName:student.name,courseName:db.courses[0]?.title||'English B2',topic:'Speaking',score:95,createdAt:now()});
  if (!db.attendance.length && student) db.attendance.push({id:uuid(),date:'2026-10-01',studentName:student.name,courseName:db.courses[0]?.title||'English B2',status:'Присутствует',createdAt:now()});
  if (!db.homework.length) db.homework.push({id:uuid(),title:'Grammar Unit 5',courseName:db.courses[0]?.title||'English B2',dueDate:'2026-10-04',createdAt:now()});
  if (!db.tests.length) db.tests.push({id:uuid(),title:'English B2 — Unit 5',courseName:db.courses[0]?.title||'English B2',questions:20,createdAt:now()});
  if (!db.notifications.length) db.notifications.push({id:uuid(),title:'Новое расписание',body:'Расписание на эту неделю обновлено.',createdAt:now()});
  if (!db.payments.length && student) db.payments.push({id:uuid(),studentName:student.name,amount:500,status:'Оплачено',createdAt:now()});
  await writeDB(db);
}

function matchesSearch(obj, q) { if (!q) return true; return JSON.stringify(obj).toLowerCase().includes(String(q).toLowerCase()); }
function collectionForUser(db, user) {
  if (user.role === 'admin') return db;
  const ownCourseIds = user.role === 'teacher' ? db.courses.filter(c => c.teacherId === user.id).map(c => c.id) : (user.courseIds || []);
  const users = user.role === 'teacher' ? db.users.filter(u => u.id === user.id || (u.role === 'student' && (u.courseIds || []).some(id => ownCourseIds.includes(id)))) : db.users.filter(u => u.id === user.id);
  const courses = db.courses.filter(c => ownCourseIds.includes(c.id));
  const enrollments = db.enrollments.filter(e => user.role === 'teacher' ? ownCourseIds.includes(e.courseId) : e.userId === user.id);
  const allowedStudents = new Set(users.filter(u => u.role === 'student').map(u => u.id));
  const filterRows = (key) => {
    if (user.role === 'teacher') return (db[key] || []).filter(r => ownCourseIds.includes(r.courseId) || ownCourseIds.includes((courses.find(c => c.title === r.courseName) || {}).id) || allowedStudents.has(r.userId));
    if (user.role === 'student') return (db[key] || []).filter(r => r.userId === user.id || r.studentId === user.id || r.studentName === user.name);
    return [];
  };
  return Object.assign({}, db, { users, courses, enrollments, groups: user.role === 'teacher' ? db.groups.filter(g => ownCourseIds.includes((courses.find(c => c.title === g.courseName) || {}).id) || g.teacherName === user.name) : [], schedule: user.role === 'teacher' ? db.schedule.filter(x => ownCourseIds.includes((courses.find(c => c.title === x.courseName) || {}).id)) : db.schedule.filter(x => ownCourseIds.includes((courses.find(c => c.title === x.courseName) || {}).id)), grades: filterRows('grades'), attendance: filterRows('attendance'), homework: user.role === 'student' ? db.homework.filter(x => ownCourseIds.includes((courses.find(c => c.title === x.courseName) || {}).id)) : db.homework.filter(x => ownCourseIds.includes((courses.find(c => c.title === x.courseName) || {}).id)), tests: user.role === 'student' ? db.tests.filter(x => ownCourseIds.includes((courses.find(c => c.title === x.courseName) || {}).id)) : db.tests.filter(x => ownCourseIds.includes((courses.find(c => c.title === x.courseName) || {}).id)), news: db.news, notifications: db.notifications, payments: user.role === 'student' ? db.payments.filter(x => x.studentName === user.name) : [] });
}


async function handle(req, res) {
  let url; try { url = new URL(req.url, `http://${req.headers.host || 'localhost'}`); } catch { return send(res, 400, 'Bad request'); }
  const p = url.pathname;
  if (p === '/api/health') return json(res, 200, { ok: true, service: 'Point of Knowledge', time: now() });

  if (p === '/api/login' && req.method === 'POST') {
    const b = await readBody(req); const db = await readDB(); const login = String(b.login || '').trim().toLowerCase();
    const u = db.users.find(x => String(x.email).toLowerCase() === login && x.status !== 'blocked');
    if (!u || !verify(b.password || '', u)) return json(res, 401, { error: 'Неверный логин или пароль' });
    const t = token(); sessions.set(t, safeUser(u)); return json(res, 200, { token: t, user: safeUser(u) });
  }
  if (p === '/api/register' && req.method === 'POST') {
    const b = await readBody(req); const db = await readDB(); const email = String(b.email || '').trim().toLowerCase();
    if (!b.name || !email || !validPassword(b.password)) return json(res, 400, { error: 'Имя, email и пароль минимум 8 символов обязательны' });
    if (db.users.some(u => u.email === email)) return json(res, 409, { error: 'Пользователь уже существует' });
    const role = ROLES.includes(b.role) && b.role !== 'admin' ? b.role : 'student'; const hp = hashPassword(b.password);
    const u = { id: uuid(), name: String(b.name).trim(), email, role, phone: String(b.phone || ''), bio: '', status: 'active', courseIds: [], salt: hp.salt, hash: hp.hash, createdAt: now() };
    db.users.push(u); await writeDB(db); const t = token(); sessions.set(t, safeUser(u)); return json(res, 201, { token: t, user: safeUser(u) });
  }
  if (p === '/api/forgot-password' && req.method === 'POST') {
    const b = await readBody(req); const email = String(b.email || '').trim().toLowerCase(); if (!email) return json(res, 400, { error: 'Укажите email' });
    const db = await readDB(); const u = db.users.find(x => x.email === email); const out = { ok: true, message: 'Если аккаунт существует, инструкции отправлены на email.' };
    if (!u) return json(res, 200, out);
    const raw = token(); u.resetTokenHash = sha256(raw); u.resetExpiresAt = Date.now() + 15 * 60 * 1000; await writeDB(db);
    const sent = await sendResetEmail(email, publicResetUrl(req, raw)); if (!sent && process.env.RESET_DEBUG === 'true') out.debugResetUrl = publicResetUrl(req, raw); return json(res, 200, out);
  }
  if (p === '/api/reset-password' && req.method === 'POST') {
    const b = await readBody(req); if (!b.token || !validPassword(b.password)) return json(res, 400, { error: 'Пароль минимум 8 символов' });
    const db = await readDB(); const u = db.users.find(x => x.resetTokenHash === sha256(b.token) && Number(x.resetExpiresAt) > Date.now()); if (!u) return json(res, 400, { error: 'Ссылка недействительна или истекла' });
    const hp = hashPassword(b.password); u.salt = hp.salt; u.hash = hp.hash; delete u.resetTokenHash; delete u.resetExpiresAt; await writeDB(db); return json(res, 200, { ok: true });
  }

  const me = p === '/api/me' || p.startsWith('/api/');
  if (p === '/api/me' && req.method === 'GET') { const u = requireAuth(req, res); return u ? json(res, 200, { user: u }) : undefined; }
  if (p === '/api/logout' && req.method === 'POST') { const h = (req.headers.authorization || '').replace(/^Bearer /, ''); if (h) sessions.delete(h); return json(res, 200, { ok: true }); }

  if (p === '/api/bootstrap' && req.method === 'GET') {
    const u = requireAuth(req, res); if (!u) return; const db = await readDB(); const view = collectionForUser(db, u);
    return json(res, 200, { user: safeUser(db.users.find(x => x.id === u.id)), stats: { users: db.users.length, students: db.users.filter(x => x.role === 'student').length, teachers: db.users.filter(x => x.role === 'teacher').length, courses: db.courses.length, groups: db.groups.length }, courses: view.courses, users: view.users.map(safeUser), enrollments: view.enrollments, groups: view.groups || [], schedule: view.schedule || [], grades: view.grades || [], attendance: view.attendance || [], homework: view.homework || [], tests: view.tests || [], news: view.news || [], notifications: view.notifications || [], payments: view.payments || [] });
  }

  if (p === '/api/profile' && req.method === 'PATCH') {
    const u = requireAuth(req, res); if (!u) return; const b = await readBody(req); const db = await readDB(); const meUser = db.users.find(x => x.id === u.id); if (!meUser) return json(res, 404, { error: 'Пользователь не найден' });
    Object.assign(meUser, pick(b, ['name','phone','bio','avatar'])); if (b.email && String(b.email).trim().toLowerCase() !== meUser.email) { const email = String(b.email).trim().toLowerCase(); if (db.users.some(x => x.id !== meUser.id && x.email === email)) return json(res, 409, { error: 'Email уже используется' }); meUser.email = email; }
    if (b.password) { if (!validPassword(b.password)) return json(res, 400, { error: 'Пароль минимум 8 символов' }); const hp = hashPassword(b.password); meUser.salt = hp.salt; meUser.hash = hp.hash; }
    await writeDB(db); const fresh = safeUser(meUser); for (const [k,v] of sessions) if (v.id === meUser.id) sessions.set(k, fresh); return json(res, 200, { user: fresh });
  }

  // Users
  if (p === '/api/users' && req.method === 'GET') {
    const u = requireAdmin(req, res); if (!u) return; const db = await readDB(); const q = url.searchParams.get('q') || ''; const role = url.searchParams.get('role') || '';
    return json(res, 200, { users: db.users.filter(x => (!role || x.role === role) && matchesSearch(x, q)).map(safeUser) });
  }
  if (p === '/api/users' && req.method === 'POST') {
    const admin = requireAdmin(req, res); if (!admin) return; const b = await readBody(req); const db = await readDB(); const email = String(b.email || '').trim().toLowerCase();
    if (!b.name || !email || !ROLES.includes(b.role)) return json(res, 400, { error: 'Имя, email и роль обязательны' }); if (db.users.some(x => x.email === email)) return json(res, 409, { error: 'Email уже используется' });
    const hp = hashPassword(validPassword(b.password) ? b.password : 'ChangeMe123!'); const u = { id: uuid(), name: String(b.name).trim(), email, role: b.role, phone: String(b.phone || ''), bio: String(b.bio || ''), status: b.status || 'active', courseIds: [], salt: hp.salt, hash: hp.hash, createdAt: now() };
    db.users.push(u); if (Array.isArray(b.courseIds)) b.courseIds.forEach(id => { if (db.courses.some(c => c.id === id)) { u.courseIds.push(id); db.enrollments.push({ id: uuid(), userId: u.id, courseId: id, progress: 0, joinedAt: now() }); } }); await writeDB(db); return json(res, 201, { user: safeUser(u) });
  }
  const userMatch = p.match(/^\/api\/users\/([^/]+)$/);
  if (userMatch) {
    const id = decodeURIComponent(userMatch[1]); const admin = requireAdmin(req, res); if (!admin) return; const db = await readDB(); const u = db.users.find(x => x.id === id); if (!u) return json(res, 404, { error: 'Пользователь не найден' });
    if (req.method === 'GET') return json(res, 200, { user: safeUser(u), enrollments: db.enrollments.filter(e => e.userId === id) });
    if (req.method === 'PATCH') { const b = await readBody(req); Object.assign(u, pick(b, ['name','phone','bio','avatar','status'])); if (b.role && ROLES.includes(b.role)) u.role = b.role; if (b.email) { const email = String(b.email).trim().toLowerCase(); if (db.users.some(x => x.id !== id && x.email === email)) return json(res, 409, { error: 'Email уже используется' }); u.email = email; } if (b.password) { if (!validPassword(b.password)) return json(res, 400, { error: 'Пароль минимум 8 символов' }); const hp = hashPassword(b.password); u.salt = hp.salt; u.hash = hp.hash; } await writeDB(db); return json(res, 200, { user: safeUser(u) }); }
    if (req.method === 'DELETE') { if (id === admin.id) return json(res, 400, { error: 'Нельзя удалить текущего администратора' }); db.users = db.users.filter(x => x.id !== id); db.enrollments = db.enrollments.filter(e => e.userId !== id); db.grades = db.grades.filter(e => e.userId !== id); db.attendance = db.attendance.filter(e => e.userId !== id); await writeDB(db); return json(res, 200, { ok: true }); }
  }

  // Courses
  if (p === '/api/courses' && req.method === 'GET') { const u = requireAuth(req,res); if (!u) return; const db=await readDB(); return json(res,200,{courses:collectionForUser(db,u).courses}); }
  if (p === '/api/courses' && req.method === 'POST') {
    const admin = requireAdmin(req,res); if(!admin)return; const b=await readBody(req); if(!b.title)return json(res,400,{error:'Название курса обязательно'}); const db=await readDB(); const c={id:uuid(),title:String(b.title),category:String(b.category||'General'),description:String(b.description||''),lessons:Number(b.lessons||0),teacherId:String(b.teacherId||''),createdAt:now()}; db.courses.push(c); await writeDB(db); return json(res,201,{course:c});
  }
  const courseMatch=p.match(/^\/api\/courses\/([^/]+)$/);
  if(courseMatch){const id=decodeURIComponent(courseMatch[1]); const admin=requireAdmin(req,res);if(!admin)return;const db=await readDB();const c=db.courses.find(x=>x.id===id);if(!c)return json(res,404,{error:'Курс не найден'});if(req.method==='PATCH'){const b=await readBody(req);Object.assign(c,pick(b,['title','category','description','teacherId']));if(b.lessons!==undefined)c.lessons=Number(b.lessons)||0;await writeDB(db);return json(res,200,{course:c});}if(req.method==='DELETE'){db.courses=db.courses.filter(x=>x.id!==id);db.enrollments=db.enrollments.filter(e=>e.courseId!==id);db.users.forEach(u=>u.courseIds=(u.courseIds||[]).filter(x=>x!==id));await writeDB(db);return json(res,200,{ok:true});}}

  // Enrollment / move student to another course
  if (p === '/api/enrollments' && req.method === 'GET') { const u=requireAuth(req,res);if(!u)return;const db=await readDB();return json(res,200,{enrollments:collectionForUser(db,u).enrollments}); }
  if (p === '/api/enrollments' && req.method === 'POST') { const admin=requireAdmin(req,res);if(!admin)return;const b=await readBody(req);const db=await readDB();const user=db.users.find(x=>x.id===b.userId),course=db.courses.find(x=>x.id===b.courseId);if(!user||user.role!=='student')return json(res,400,{error:'Выберите ученика'});if(!course)return json(res,400,{error:'Выберите курс'});if(db.enrollments.some(e=>e.userId===user.id&&e.courseId===course.id))return json(res,409,{error:'Ученик уже записан на этот курс'});const e={id:uuid(),userId:user.id,courseId:course.id,progress:0,joinedAt:now()};db.enrollments.push(e);user.courseIds=Array.from(new Set([...(user.courseIds||[]),course.id]));await writeDB(db);return json(res,201,{enrollment:e}); }
  const enMatch=p.match(/^\/api\/enrollments\/([^/]+)$/); if(enMatch&&req.method==='DELETE'){const admin=requireAdmin(req,res);if(!admin)return;const db=await readDB();const e=db.enrollments.find(x=>x.id===decodeURIComponent(enMatch[1]));if(!e)return json(res,404,{error:'Запись не найдена'});db.enrollments=db.enrollments.filter(x=>x.id!==e.id);const u=db.users.find(x=>x.id===e.userId);if(u)u.courseIds=(u.courseIds||[]).filter(id=>id!==e.courseId);await writeDB(db);return json(res,200,{ok:true});}

  // Generic CRUD collections
  const cm=p.match(/^\/api\/(groups|schedule|grades|attendance|homework|tests|news|notifications|payments)(?:\/([^/]+))?$/);
  if(cm){const collection=cm[1],id=cm[2]?decodeURIComponent(cm[2]):null;const u=requireAuth(req,res);if(!u)return;const db=await readDB();if(req.method==='GET'){let rows=db[collection]||[];if(collection==='news'||collection==='notifications') rows=rows.slice().sort((a,b)=>String(b.createdAt||'').localeCompare(String(a.createdAt||'')));return json(res,200,{[collection]:rows});}if(u.role!=='admin'&&!(u.role==='teacher'&&['grades','attendance','homework','tests','groups','schedule'].includes(collection)))return json(res,403,{error:'Недостаточно прав'});if(req.method==='POST'){const b=await readBody(req);const row=Object.assign({id:uuid(),createdAt:now()},b);db[collection].push(row);await writeDB(db);return json(res,201,{[collection.slice(0,-1)]:row});}if(req.method==='PATCH'&&id){const row=db[collection].find(x=>x.id===id);if(!row)return json(res,404,{error:'Запись не найдена'});Object.assign(row,await readBody(req));await writeDB(db);return json(res,200,{ok:true,row});}if(req.method==='DELETE'&&id){db[collection]=db[collection].filter(x=>x.id!==id);await writeDB(db);return json(res,200,{ok:true});}}

  const file = p === '/' ? '/index.html' : p; const filePath=path.normalize(path.join(ROOT,file)); if(!filePath.startsWith(ROOT))return send(res,403,'Forbidden');
  try{const data=await fs.readFile(filePath);res.writeHead(200,{'Content-Type':MIME[path.extname(filePath)]||'application/octet-stream'});res.end(data);}catch{send(res,404,'Not found');}
}

seed().then(()=>{http.createServer((req,res)=>Promise.resolve(handle(req,res)).catch(e=>{console.error(e);if(!res.headersSent)json(res,500,{error:'Server error'});})).listen(PORT,'0.0.0.0',()=>console.log(`Point of Knowledge running on http://0.0.0.0:${PORT}`));}).catch(e=>{console.error(e);process.exit(1);});
