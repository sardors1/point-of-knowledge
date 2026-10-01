import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import {fileURLToPath} from 'node:url';

const __dirname=path.dirname(fileURLToPath(import.meta.url));
const PORT=process.env.PORT||3000;
const DB=path.join(__dirname,'data','db.json');
const sessions=new Map();
const MIME={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.json':'application/json','.png':'image/png','.webmanifest':'application/manifest+json'};

async function readDB(){return JSON.parse(await fs.readFile(DB,'utf8'))}
async function writeDB(db){await fs.writeFile(DB,JSON.stringify(db,null,2))}
function send(res,status,data,headers={}){const body=typeof data==='string'?data:JSON.stringify(data);res.writeHead(status,{'Content-Type':typeof data==='string'?'text/plain; charset=utf-8':'application/json; charset=utf-8','Cache-Control':'no-store',...headers});res.end(body)}
function json(res,status,obj){send(res,status,obj)}
async function body(req){let s='';for await(const c of req)s+=c;try{return s?JSON.parse(s):{}}catch{return {}}}
function hashPassword(password,salt=crypto.randomBytes(16).toString('hex')){const hash=crypto.scryptSync(password,salt,64).toString('hex');return {salt,hash}}
function verify(password,u){if(!u?.salt||!u?.hash)return false;return crypto.timingSafeEqual(Buffer.from(crypto.scryptSync(password,u.salt,64).toString('hex')),Buffer.from(u.hash))}
function token(){return crypto.randomBytes(32).toString('hex')}
function auth(req){const h=req.headers.authorization||'';if(!h.startsWith('Bearer '))return null;const u=sessions.get(h.slice(7));return u||null}
function safeUser(u){return {id:u.id,name:u.name,email:u.email,role:u.role}}
async function seedPasswords(){const db=await readDB();let changed=false;for(const u of db.users){if(!u.hash){const p=hashPassword(process.env[`POK_${u.role.toUpperCase()}_PASSWORD`]||'ChangeMe123!');u.salt=p.salt;u.hash=p.hash;changed=true}}if(changed)await writeDB(db)}

const server=http.createServer(async(req,res)=>{
  try{
    const url=new URL(req.url,`http://${req.headers.host}`);
    if(url.pathname==='/api/health')return json(res,200,{ok:true,service:'Point of Knowledge',time:new Date().toISOString()});
    if(url.pathname==='/api/login'&&req.method==='POST'){
      const b=await body(req), db=await readDB();const u=db.users.find(x=>x.email.toLowerCase()===String(b.login||'').toLowerCase());
      if(!u||!verify(String(b.password||''),u))return json(res,401,{error:'Неверный логин или пароль'});
      const t=token();sessions.set(t,safeUser(u));return json(res,200,{token:t,user:safeUser(u)});
    }
    if(url.pathname==='/api/register'&&req.method==='POST'){
      const b=await body(req),db=await readDB();const email=String(b.email||'').trim().toLowerCase();const role=['student','teacher','parent'].includes(b.role)?b.role:'student';
      if(!email||!b.password||!b.name)return json(res,400,{error:'Заполните имя, email и пароль'});
      if(db.users.some(u=>u.email===email))return json(res,409,{error:'Пользователь уже существует'});
      const p=hashPassword(String(b.password));const u={id:crypto.randomUUID(),name:String(b.name).trim(),email,role,salt:p.salt,hash:p.hash,createdAt:new Date().toISOString()};db.users.push(u);await writeDB(db);return json(res,201,{user:safeUser(u)});
    }
    if(url.pathname==='/api/me'&&req.method==='GET'){const u=auth(req);if(!u)return json(res,401,{error:'Unauthorized'});return json(res,200,{user:u})}
    if(url.pathname==='/api/logout'&&req.method==='POST'){const h=(req.headers.authorization||'').replace(/^Bearer /,'');if(h)sessions.delete(h);return json(res,200,{ok:true})}
    if(url.pathname==='/api/courses'&&req.method==='GET'){const u=auth(req);if(!u)return json(res,401,{error:'Unauthorized'});const db=await readDB();return json(res,200,{courses:db.courses})}
    if(url.pathname==='/api/news'&&req.method==='GET'){const u=auth(req);if(!u)return json(res,401,{error:'Unauthorized'});const db=await readDB();return json(res,200,{news:db.news})}
    if(url.pathname==='/api/news'&&req.method==='POST'){const u=auth(req);if(!u||u.role!=='admin')return json(res,403,{error:'Admin only'});const b=await body(req),db=await readDB();const n={id:crypto.randomUUID(),title:String(b.title||'Без названия'),body:String(b.body||''),createdAt:new Date().toISOString()};db.news.unshift(n);await writeDB(db);return json(res,201,{news:n})}

    let file=url.pathname==='/'?'/index.html':url.pathname;
    const filePath=path.normalize(path.join(__dirname,file));
    if(!filePath.startsWith(__dirname))return send(res,403,'Forbidden');
    const data=await fs.readFile(filePath);const ext=path.extname(filePath);res.writeHead(200,{'Content-Type':MIME[ext]||'application/octet-stream'});res.end(data);
  }catch(e){console.error(e);json(res,500,{error:'Server error'})}
});
await seedPasswords();server.listen(PORT,()=>console.log(`Point of Knowledge running on http://localhost:${PORT}`));
