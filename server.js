const http = require('http');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;
const DB = path.join(ROOT, 'data', 'db.json');
const sessions = new Map();
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.webmanifest': 'application/manifest+json; charset=utf-8',
  '.ico': 'image/x-icon'
};

function uuid() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = crypto.randomBytes(1)[0] % 16;
    var v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function readDB() { return fs.readFile(DB, 'utf8').then(function(s) { return JSON.parse(s); }); }
function writeDB(db) { return fs.writeFile(DB, JSON.stringify(db, null, 2), 'utf8'); }

function send(res, status, data, headers) {
  headers = headers || {};
  var isString = typeof data === 'string';
  var body = isString ? data : JSON.stringify(data);
  res.writeHead(status, Object.assign({
    'Content-Type': isString ? 'text/plain; charset=utf-8' : 'application/json; charset=utf-8',
    'Cache-Control': 'no-store'
  }, headers));
  res.end(body);
}
function json(res, status, obj) { send(res, status, obj); }
function body(req) {
  return new Promise(function(resolve) {
    var s = '';
    req.on('data', function(c) { s += c; });
    req.on('end', function() {
      try { resolve(s ? JSON.parse(s) : {}); } catch (e) { resolve({}); }
    });
  });
}
function hashPassword(password, salt) {
  salt = salt || crypto.randomBytes(16).toString('hex');
  var hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return { salt: salt, hash: hash };
}
function verify(password, user) {
  if (!user || !user.salt || !user.hash) return false;
  var a = Buffer.from(crypto.scryptSync(password, user.salt, 64).toString('hex'));
  var b = Buffer.from(user.hash);
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}
function token() { return crypto.randomBytes(32).toString('hex'); }
function sha256(value) { return crypto.createHash('sha256').update(String(value)).digest('hex'); }
function validPassword(password) { return typeof password === 'string' && password.length >= 8; }
function publicResetUrl(req, rawToken) {
  var proto = String(req.headers['x-forwarded-proto'] || 'https').split(',')[0].trim();
  var host = req.headers.host || 'localhost:3000';
  return proto + '://' + host + '/?reset=' + encodeURIComponent(rawToken);
}
function sendResetEmail(to, resetUrl) {
  var key = process.env.RESEND_API_KEY;
  var from = process.env.MAIL_FROM;
  if (!key || !from || typeof fetch !== 'function') return Promise.resolve(false);
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: from,
      to: [to],
      subject: 'Point of Knowledge — восстановление пароля',
      html: '<p>Вы запросили восстановление пароля Point of Knowledge.</p><p><a href="' + resetUrl + '">Сбросить пароль</a></p><p>Ссылка действует 15 минут.</p>'
    })
  }).then(function(r) { return r.ok; }).catch(function() { return false; });
}
function auth(req) {
  var h = req.headers.authorization || '';
  if (h.indexOf('Bearer ') !== 0) return null;
  return sessions.get(h.slice(7)) || null;
}
function safeUser(u) { return { id: u.id, name: u.name, email: u.email, role: u.role }; }

function seedPasswords() {
  return readDB().then(function(db) {
    var changed = false;
    db.users.forEach(function(u) {
      if (!u.hash) {
        var key = 'POK_' + String(u.role).toUpperCase() + '_PASSWORD';
        var password = process.env[key] || 'ChangeMe123!';
        var p = hashPassword(password);
        u.salt = p.salt;
        u.hash = p.hash;
        changed = true;
      }
    });
    return changed ? writeDB(db) : null;
  });
}

function handle(req, res) {
  var parsed;
  try { parsed = new URL(req.url, 'http://' + (req.headers.host || 'localhost')); }
  catch (e) { return send(res, 400, 'Bad request'); }

  var pathname = parsed.pathname;

  if (pathname === '/api/health') return json(res, 200, { ok: true, service: 'Point of Knowledge', time: new Date().toISOString() });

  if (pathname === '/api/login' && req.method === 'POST') {
    return body(req).then(function(b) {
      return readDB().then(function(db) {
        var login = String(b.login || '').toLowerCase();
        var u = db.users.find(function(x) { return String(x.email).toLowerCase() === login; });
        if (!u || !verify(String(b.password || ''), u)) return json(res, 401, { error: 'Неверный логин или пароль' });
        var t = token();
        sessions.set(t, safeUser(u));
        return json(res, 200, { token: t, user: safeUser(u) });
      });
    });
  }

  if (pathname === '/api/register' && req.method === 'POST') {
    return body(req).then(function(b) {
      return readDB().then(function(db) {
        var email = String(b.email || '').trim().toLowerCase();
        var role = ['student', 'teacher', 'parent'].indexOf(b.role) >= 0 ? b.role : 'student';
        if (!email || !b.password || !b.name) return json(res, 400, { error: 'Заполните имя, email и пароль' });
        if (db.users.some(function(u) { return u.email === email; })) return json(res, 409, { error: 'Пользователь уже существует' });
        var p = hashPassword(String(b.password));
        var u = { id: uuid(), name: String(b.name).trim(), email: email, role: role, salt: p.salt, hash: p.hash, createdAt: new Date().toISOString() };
        db.users.push(u);
        return writeDB(db).then(function() { return json(res, 201, { user: safeUser(u) }); });
      });
    });
  }

  if (pathname === '/api/forgot-password' && req.method === 'POST') {
    return body(req).then(function(b) {
      var email = String(b.email || '').trim().toLowerCase();
      if (!email) return json(res, 400, { error: 'Укажите email' });
      return readDB().then(function(db) {
        var u = db.users.find(function(x) { return String(x.email).toLowerCase() === email; });
        if (!u) return json(res, 200, { ok: true, message: 'Если аккаунт существует, инструкции отправлены на email.' });
        var raw = token();
        u.resetTokenHash = sha256(raw);
        u.resetExpiresAt = Date.now() + 15 * 60 * 1000;
        return writeDB(db).then(function() {
          var url = publicResetUrl(req, raw);
          return sendResetEmail(u.email, url).then(function(sent) {
            var out = { ok: true, message: 'Если аккаунт существует, инструкции отправлены на email.' };
            if (!sent && process.env.RESET_DEBUG === 'true') out.debugResetUrl = url;
            if (!sent && process.env.RESET_DEBUG !== 'true' && !process.env.RESEND_API_KEY) out.emailNotConfigured = true;
            return json(res, 200, out);
          });
        });
      });
    });
  }

  if (pathname === '/api/reset-password' && req.method === 'POST') {
    return body(req).then(function(b) {
      var raw = String(b.token || '');
      var password = String(b.password || '');
      if (!raw || !validPassword(password)) return json(res, 400, { error: 'Нужен действующий код и пароль минимум 8 символов' });
      return readDB().then(function(db) {
        var now = Date.now();
        var u = db.users.find(function(x) { return x.resetTokenHash === sha256(raw) && Number(x.resetExpiresAt || 0) > now; });
        if (!u) return json(res, 400, { error: 'Ссылка восстановления недействительна или истекла' });
        var p = hashPassword(password);
        u.salt = p.salt;
        u.hash = p.hash;
        delete u.resetTokenHash;
        delete u.resetExpiresAt;
        return writeDB(db).then(function() { return json(res, 200, { ok: true, message: 'Пароль изменён. Теперь войдите.' }); });
      });
    });
  }

  if (pathname === '/api/me' && req.method === 'GET') {
    var me = auth(req);
    return me ? json(res, 200, { user: me }) : json(res, 401, { error: 'Unauthorized' });
  }
  if (pathname === '/api/logout' && req.method === 'POST') {
    var h = (req.headers.authorization || '').replace(/^Bearer /, '');
    if (h) sessions.delete(h);
    return json(res, 200, { ok: true });
  }
  if (pathname === '/api/courses' && req.method === 'GET') {
    if (!auth(req)) return json(res, 401, { error: 'Unauthorized' });
    return readDB().then(function(db) { return json(res, 200, { courses: db.courses }); });
  }
  if (pathname === '/api/news' && req.method === 'GET') {
    if (!auth(req)) return json(res, 401, { error: 'Unauthorized' });
    return readDB().then(function(db) { return json(res, 200, { news: db.news }); });
  }
  if (pathname === '/api/news' && req.method === 'POST') {
    var admin = auth(req);
    if (!admin || admin.role !== 'admin') return json(res, 403, { error: 'Admin only' });
    return body(req).then(function(b) {
      return readDB().then(function(db) {
        var n = { id: uuid(), title: String(b.title || 'Без названия'), body: String(b.body || ''), createdAt: new Date().toISOString() };
        db.news.unshift(n);
        return writeDB(db).then(function() { return json(res, 201, { news: n }); });
      });
    });
  }

  var file = pathname === '/' ? '/index.html' : pathname;
  var filePath = path.normalize(path.join(ROOT, file));
  if (filePath.indexOf(ROOT) !== 0) return send(res, 403, 'Forbidden');
  return fs.readFile(filePath).then(function(data) {
    var ext = path.extname(filePath);
    res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
    res.end(data);
  }).catch(function() { send(res, 404, 'Not found'); });
}

seedPasswords().then(function() {
  http.createServer(function(req, res) {
    Promise.resolve(handle(req, res)).catch(function(e) {
      console.error(e);
      json(res, 500, { error: 'Server error' });
    });
  }).listen(PORT, function() {
    console.log('Point of Knowledge running on http://localhost:' + PORT);
  });
}).catch(function(e) {
  console.error('Startup error:', e);
  process.exit(1);
});
