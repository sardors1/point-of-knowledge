
const APP = document.getElementById("app");
const $ = (s)=>document.querySelector(s);
const store = {
  get(k,d=null){try{return JSON.parse(localStorage.getItem(k)) ?? d}catch{return d}},
  set(k,v){localStorage.setItem(k,JSON.stringify(v))}
};
const T={
ru:{welcome:"Добро пожаловать",signIn:"Вход в аккаунт",signSub:"Войдите, чтобы продолжить обучение",login:"Логин / Email / Телефон",password:"Пароль",remember:"Запомнить меня",forgot:"Забыли пароль?",enter:"Войти",noAccount:"Нет аккаунта?",register:"Зарегистрироваться",protected:"Ваши данные защищены",learn:"Учись. Развивайся. Достигай.",dashboard:"Главная",courses:"Мои курсы",schedule:"Расписание",grades:"Оценки",attendance:"Посещаемость",homework:"Домашние задания",tests:"Тесты",achievements:"Достижения",leaderboard:"Лидерборд",news:"Новости",notifications:"Уведомления",profile:"Профиль",settings:"Настройки",logout:"Выйти",student:"Ученик",teacher:"Преподаватель",parent:"Родитель",admin:"Администратор",avg:"Средняя оценка",att:"Посещаемость",rank:"Место в рейтинге",myCourses:"Мои курсы",recentGrades:"Последние оценки",scheduleToday:"Ближайшие занятия",announcements:"Новости и объявления",progress:"Прогресс",users:"Пользователи",groups:"Группы",payments:"Оплаты",statistics:"Статистика",children:"Мои дети",quick:"Быстрые действия",all:"Все",save:"Сохранить",cancel:"Отмена",create:"Создать",add:"Добавить",search:"Поиск...",newsTitle:"Новости и объявления",leaderTitle:"Лидерборд",coursesTitle:"Курсы",profileTitle:"Профиль",settingsTitle:"Настройки"},
tj:{welcome:"Хуш омадед",signIn:"Воридшавӣ ба ҳисоб",signSub:"Барои идомаи таҳсил ворид шавед",login:"Логин / Email / Телефон",password:"Парол",remember:"Маро дар хотир нигоҳ дор",forgot:"Паролро фаромӯш кардед?",enter:"Ворид шудан",noAccount:"Ҳисоб надоред?",register:"Бақайдгирӣ",protected:"Маълумоти шумо ҳифз шудааст",learn:"Бихон. Рушд кун. Ба даст ор.",dashboard:"Асосӣ",courses:"Курсҳои ман",schedule:"Ҷадвал",grades:"Баҳоҳо",attendance:"Ҳозиршавӣ",homework:"Вазифаи хонагӣ",tests:"Санҷишҳо",achievements:"Дастовардҳо",leaderboard:"Рейтинг",news:"Хабарҳо",notifications:"Огоҳиҳо",profile:"Профил",settings:"Танзимот",logout:"Баромадан",student:"Хонанда",teacher:"Омӯзгор",parent:"Волидайн",admin:"Маъмур",avg:"Баҳои миёна",att:"Ҳозиршавӣ",rank:"Ҷой дар рейтинг",myCourses:"Курсҳои ман",recentGrades:"Баҳои охирин",scheduleToday:"Дарсҳои наздик",announcements:"Хабарҳо ва эълонҳо",progress:"Пешрафт",users:"Истифодабарандагон",groups:"Гурӯҳҳо",payments:"Пардохтҳо",statistics:"Омор",children:"Фарзандони ман",quick:"Амалиёти зуд",all:"Ҳама",save:"Захира",cancel:"Бекор",create:"Эҷод",add:"Илова",search:"Ҷустуҷӯ...",newsTitle:"Хабарҳо ва эълонҳо",leaderTitle:"Рейтинг",coursesTitle:"Курсҳо",profileTitle:"Профил",settingsTitle:"Танзимот"},
uz:{welcome:"Xush kelibsiz",signIn:"Hisobga kirish",signSub:"O‘qishni davom ettirish uchun kiring",login:"Login / Email / Telefon",password:"Parol",remember:"Meni eslab qol",forgot:"Parolni unutdingizmi?",enter:"Kirish",noAccount:"Hisobingiz yo‘qmi?",register:"Ro‘yxatdan o‘tish",protected:"Ma’lumotlaringiz himoyalangan",learn:"O‘rgan. Rivojlan. Erish.",dashboard:"Bosh sahifa",courses:"Kurslarim",schedule:"Jadval",grades:"Baholar",attendance:"Davomat",homework:"Uy vazifasi",tests:"Testlar",achievements:"Yutuqlar",leaderboard:"Reyting",news:"Yangiliklar",notifications:"Bildirishnomalar",profile:"Profil",settings:"Sozlamalar",logout:"Chiqish",student:"O‘quvchi",teacher:"O‘qituvchi",parent:"Ota-ona",admin:"Administrator",avg:"O‘rtacha baho",att:"Davomat",rank:"Reytingdagi o‘rin",myCourses:"Kurslarim",recentGrades:"So‘nggi baholar",scheduleToday:"Yaqin darslar",announcements:"Yangiliklar va e’lonlar",progress:"Jarayon",users:"Foydalanuvchilar",groups:"Guruhlar",payments:"To‘lovlar",statistics:"Statistika",children:"Farzandlarim",quick:"Tezkor amallar",all:"Barchasi",save:"Saqlash",cancel:"Bekor qilish",create:"Yaratish",add:"Qo‘shish",search:"Qidirish...",newsTitle:"Yangiliklar va e’lonlar",leaderTitle:"Reyting",coursesTitle:"Kurslar",profileTitle:"Profil",settingsTitle:"Sozlamalar"},
en:{welcome:"Welcome",signIn:"Sign in",signSub:"Sign in to continue learning",login:"Login / Email / Phone",password:"Password",remember:"Remember me",forgot:"Forgot password?",enter:"Sign in",noAccount:"Don't have an account?",register:"Create account",protected:"Your data is protected",learn:"Learn. Grow. Achieve.",dashboard:"Dashboard",courses:"My courses",schedule:"Schedule",grades:"Grades",attendance:"Attendance",homework:"Homework",tests:"Tests",achievements:"Achievements",leaderboard:"Leaderboard",news:"News",notifications:"Notifications",profile:"Profile",settings:"Settings",logout:"Log out",student:"Student",teacher:"Teacher",parent:"Parent",admin:"Administrator",avg:"Average grade",att:"Attendance",rank:"Leaderboard rank",myCourses:"My courses",recentGrades:"Recent grades",scheduleToday:"Upcoming lessons",announcements:"News & announcements",progress:"Progress",users:"Users",groups:"Groups",payments:"Payments",statistics:"Statistics",children:"My children",quick:"Quick actions",all:"All",save:"Save",cancel:"Cancel",create:"Create",add:"Add",search:"Search...",newsTitle:"News & announcements",leaderTitle:"Leaderboard",coursesTitle:"Courses",profileTitle:"Profile",settingsTitle:"Settings"}
};
let lang=store.get("lang","ru"), role=store.get("role","student"), page=store.get("page","dashboard");
const tr=k=>T[lang][k]||T.ru[k]||k;
const roles={student:["🎓","student"],teacher:["👨‍🏫","teacher"],parent:["👨‍👩‍👧","parent"],admin:["🧑‍💼","admin"]};

function themeInit(){
  const saved=store.get("theme",null), dark=saved? saved==="dark":matchMedia("(prefers-color-scheme: dark)").matches;
  document.body.classList.toggle("dark",dark);
}
themeInit();


async function api(path, options={}){
  const token=store.get("token","");
  const headers={"Content-Type":"application/json",...(options.headers||{})};
  if(token) headers.Authorization=`Bearer ${token}`;
  const r=await fetch(path,{...options,headers});
  const d=await r.json().catch(()=>({}));
  if(!r.ok) throw new Error(d.error||"Request failed");
  return d;
}

function toast(msg){const t=$("#toast");t.textContent=msg;t.className="show";setTimeout(()=>t.className="",2200)}
function setLang(l){lang=l;store.set("lang",l);render()}
function setTheme(){const d=!document.body.classList.contains("dark");document.body.classList.toggle("dark",d);store.set("theme",d?"dark":"light")}
function esc(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}

function resetView(token){
APP.innerHTML=`<div class="auth"><section class="auth-brand"><div class="brand-inner"><img src="assets/logo.png"><h1>Point of Knowledge</h1><p>Нуқтаи Дониш</p><div class="tag">${tr("learn")}</div></div></section>
<section class="auth-form"><div class="auth-top"><div class="langs">${["ru","tj","uz","en"].map(l=>`<button class="${lang===l?"active":""}" data-lang="${l}">${l.toUpperCase()}</button>`).join("")}</div><button class="theme" id="theme">☼</button></div>
<div class="auth-card"><button class="link" id="back">← ${tr("signIn")}</button><h2 style="margin-top:18px">Новый пароль</h2><p class="sub">Введите новый пароль минимум из 8 символов.</p>
<form id="resetForm"><div class="field"><label>Новый пароль</label><div class="input"><input id="newPass" type="password" minlength="8" required placeholder="Минимум 8 символов"></div></div><div class="field"><label>Повторите пароль</label><div class="input"><input id="newPass2" type="password" minlength="8" required placeholder="Повторите пароль"></div></div><button class="primary">Изменить пароль</button></form></div></section></div>`;
$$('.langs button').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));$('#theme').onclick=setTheme;$('#back').onclick=loginView;
$('#resetForm').onsubmit=e=>{e.preventDefault();if($('#newPass').value!==$('#newPass2').value)return toast('Пароли не совпадают');api('/api/reset-password',{method:'POST',body:JSON.stringify({token:token,password:$('#newPass').value})}).then(d=>{toast(d.message||'Пароль изменён');setTimeout(loginView,800)}).catch(err=>toast(err.message))};
}

function forgotView(){
APP.innerHTML=`<div class="auth"><section class="auth-brand"><div class="brand-inner"><img src="assets/logo.png"><h1>Point of Knowledge</h1><p>Нуқтаи Дониш</p><div class="tag">${tr("learn")}</div></div></section>
<section class="auth-form"><div class="auth-top"><div class="langs">${["ru","tj","uz","en"].map(l=>`<button class="${lang===l?"active":""}" data-lang="${l}">${l.toUpperCase()}</button>`).join("")}</div><button class="theme" id="theme">☼</button></div>
<div class="auth-card"><button class="link" id="back">← ${tr("signIn")}</button><h2 style="margin-top:18px">Восстановление пароля</h2><p class="sub">Укажите email, который использовали при регистрации.</p>
<form id="forgotForm"><div class="field"><label>Email</label><div class="input"><input id="forgotEmail" type="email" required placeholder="example@email.com"></div></div><button class="primary">Отправить ссылку</button></form><div id="resetResult" style="margin-top:16px"></div></div></section></div>`;
$$('.langs button').forEach(b=>b.onclick=()=>setLang(b.dataset.lang));$('#theme').onclick=setTheme;$('#back').onclick=loginView;
$('#forgotForm').onsubmit=e=>{e.preventDefault();api('/api/forgot-password',{method:'POST',body:JSON.stringify({email:$('#forgotEmail').value})}).then(d=>{if(d.debugResetUrl){$('#resetResult').innerHTML='<div class="notice"><span>🔐</span><div class="grow"><strong>Тестовая ссылка восстановления</strong><p><a href="'+esc(d.debugResetUrl)+'">Открыть и задать новый пароль</a></p></div></div>'}else if(d.emailNotConfigured){$('#resetResult').innerHTML='<div class="notice"><span>ℹ️</span><div class="grow"><strong>Email пока не подключён</strong><p>Для отправки ссылок нужно добавить почтовый сервис в настройках Render.</p></div></div>'}else toast(d.message||'Проверьте email')}).catch(err=>toast(err.message))};
}

function loginView(){
APP.innerHTML=`<div class="auth">
<section class="auth-brand"><div class="brand-inner">
<img src="assets/logo.png"><h1>Point of Knowledge</h1><p>Нуқтаи Дониш</p>
<div class="tag">${tr("learn")}</div>
<div class="pillrow"><span class="pill">🎓 ${lang==="ru"?"Образование":lang==="tj"?"Маориф":lang==="uz"?"Ta’lim":"Education"}</span><span class="pill">🌱 ${lang==="ru"?"Развитие":lang==="tj"?"Рушд":lang==="uz"?"Rivojlanish":"Growth"}</span><span class="pill">🏆 ${lang==="ru"?"Успех":lang==="tj"?"Муваффақият":lang==="uz"?"Muvaffaqiyat":"Success"}</span></div>
</div></section>
<section class="auth-form">
<div class="auth-top"><div class="langs">${["ru","tj","uz","en"].map(l=>`<button class="${lang===l?"active":""}" data-lang="${l}">${l.toUpperCase()}</button>`).join("")}</div><button class="theme" id="theme">☼</button></div>
<div class="auth-card"><img class="mobile-logo" src="assets/logo.png">
<p class="eyebrow">${tr("welcome")}</p><h2>${tr("signIn")}</h2><p class="sub">${tr("signSub")}</p>
<form id="loginForm">
<div class="field"><label>${tr("login")}</label><div class="input">◯<input id="login" required placeholder="example@email.com"></div></div>
<div class="field"><label>${tr("password")}</label><div class="input">⌑<input id="pass" required type="password" placeholder="••••••••"><button class="eye" type="button" id="eye">◉</button></div></div>
<div class="row"><label><input type="checkbox" checked> ${tr("remember")}</label><button class="link" type="button" id="forgot">${tr("forgot")}</button></div>
<button class="primary">${tr("enter")}</button></form>
<div class="divider"><span>or</span></div><div class="register">${tr("noAccount")} <button class="link" id="reg">${tr("register")}</button></div>
<p class="security">🔒 ${tr("protected")}</p></div>
<div class="auth-foot">© 2026 Point of Knowledge · Нуқтаи Дониш</div>
</section></div>`;
$$(".langs button").forEach(b=>b.onclick=()=>setLang(b.dataset.lang));
$("#theme").onclick=setTheme;
$("#eye").onclick=()=>{$("#pass").type=$("#pass").type==="password"?"text":"password"};
$("#forgot").onclick=forgotView;
$("#reg").onclick=registerView;
$("#loginForm").onsubmit=e=>{e.preventDefault();api("/api/login",{method:"POST",body:JSON.stringify({login:$("#login").value,password:$("#pass").value})}).then(d=>{store.set("token",d.token);store.set("user",d.user);store.set("auth",true);role=d.user.role;page="dashboard";store.set("role",role);store.set("page",page);render()}).catch(err=>toast(err.message))};
}

function registerView(){
APP.innerHTML=`<div class="auth"><section class="auth-brand"><div class="brand-inner"><img src="assets/logo.png"><h1>Point of Knowledge</h1><p>Нуқтаи Дониш</p><div class="tag">${tr("learn")}</div></div></section>
<section class="auth-form"><div class="auth-top"><div class="langs">${["ru","tj","uz","en"].map(l=>`<button class="${lang===l?"active":""}" data-lang="${l}">${l.toUpperCase()}</button>`).join("")}</div><button class="theme" id="theme">☼</button></div>
<div class="auth-card"><button class="link" id="back">← ${tr("signIn")}</button><h2 style="margin-top:18px">Регистрация</h2><p class="sub">Выберите тип аккаунта</p>
<div class="list">
${["student","parent","teacher"].map(r=>`<button class="listrow secondary rolepick" data-role="${r}" style="width:100%;text-align:left"><span style="font-size:24px">${roles[r][0]}</span><span class="grow"><strong>${tr(r)}</strong><small>${r==="student"?"Обучение и личный прогресс":r==="parent"?"Контроль обучения детей":"Управление группами и уроками"}</small></span>→</button>`).join("")}
</div><p class="security">Регистрация администратора доступна только существующему администратору.</p></div></section></div>`;
$$(".langs button").forEach(b=>b.onclick=()=>setLang(b.dataset.lang));$("#theme").onclick=setTheme;$("#back").onclick=loginView;
$$(".rolepick").forEach(b=>b.onclick=()=>registrationForm(b.dataset.role));
}
function registrationForm(r){
APP.innerHTML=`<div class="auth"><section class="auth-brand"><div class="brand-inner"><img src="assets/logo.png"><h1>Point of Knowledge</h1><p>Нуқтаи Дониш</p></div></section>
<section class="auth-form"><div class="auth-top"><div class="langs">${["ru","tj","uz","en"].map(l=>`<button class="${lang===l?"active":""}" data-lang="${l}">${l.toUpperCase()}</button>`).join("")}</div><button class="theme" id="theme">☼</button></div>
<div class="auth-card"><button class="link" id="back">← Назад</button><h2 style="margin-top:18px">Создать аккаунт</h2><p class="sub">${tr(r)}</p>
<form id="regForm">
<div class="field"><label>Имя</label><div class="input"><input required></div></div>
<div class="field"><label>Фамилия</label><div class="input"><input required></div></div>
<div class="field"><label>Email / Телефон</label><div class="input"><input required></div></div>
<div class="field"><label>Пароль</label><div class="input"><input type="password" required></div></div>
<button class="primary">Создать аккаунт</button></form></div></section></div>`;
$$(".langs button").forEach(b=>b.onclick=()=>setLang(b.dataset.lang));$("#theme").onclick=setTheme;$("#back").onclick=registerView;
$("#regForm").onsubmit=e=>{e.preventDefault();const inputs=$("#regForm").querySelectorAll("input");api("/api/register",{method:"POST",body:JSON.stringify({name:(inputs[0].value+" "+inputs[1].value).trim(),email:inputs[2].value,password:inputs[3].value,role:r})}).then(()=>api("/api/login",{method:"POST",body:JSON.stringify({login:inputs[2].value,password:inputs[3].value})})).then(d=>{store.set("token",d.token);store.set("user",d.user);store.set("auth",true);role=d.user.role;page="dashboard";store.set("role",role);store.set("page",page);render()}).catch(err=>toast(err.message))};
}

const menuFor={
student:["dashboard","courses","schedule","grades","attendance","homework","tests","achievements","leaderboard","news","notifications","profile","settings"],
teacher:["dashboard","groups","grades","attendance","homework","tests","schedule","news","notifications","profile","settings"],
parent:["dashboard","children","grades","attendance","schedule","payments","news","notifications","profile","settings"],
admin:["dashboard","users","student","teacher","courses","groups","schedule","grades","attendance","news","notifications","payments","leaderboard","settings"]
};
const icons={dashboard:"⌂",courses:"▣",schedule:"◷",grades:"✓",attendance:"◌",homework:"✎",tests:"☑",achievements:"★",leaderboard:"♛",news:"▤",notifications:"♢",profile:"●",settings:"⚙",groups:"☷",users:"♙",student:"🎓",teacher:"👨‍🏫",children:"👨‍👩‍👧",payments:"₽"};

function navButton(k){return `<button class="${page===k?"active":""}" data-page="${k}"><span>${icons[k]||"•"}</span> ${tr(k)}</button>`}
function shell(content){
const [emoji,rname]=roles[role];
APP.innerHTML=`<div class="app-shell"><aside class="sidebar" id="sidebar"><div class="side-brand"><img src="assets/logo.png"><div><strong>POINT OF<br>KNOWLEDGE</strong><span>Нуқтаи Дониш</span></div></div><nav class="nav">${menuFor[role].map(navButton).join("")}</nav><div class="side-bottom"><div class="profile-mini"><div class="avatar">${emoji}</div><div><b style="font-size:11px">${role==="admin"?"Админ":role==="teacher"?"Анна":role==="parent"?"Саида":"Ахмад"}</b><small>${tr(rname)}</small></div></div><button class="secondary logout" id="logout">${tr("logout")}</button></div></aside>
<main class="main"><header class="topbar-app"><div class="left"><button class="hamb" id="hamb">☰</button><input class="search" placeholder="${tr("search")}"></div><div class="top-actions"><button class="iconbtn" id="theme">☼</button><button class="iconbtn" onclick="toast('Новых уведомлений: 3')">♢</button><div class="avatar">${emoji}</div></div></header><section class="content">${content}</section></main></div><nav class="mobile-nav">${menuFor[role].slice(0,5).map(k=>`<button class="${page===k?"active":""}" data-page="${k}"><b>${icons[k]}</b>${tr(k)}</button>`).join("")}</nav>`;
$$("[data-page]").forEach(b=>b.onclick=()=>{page=b.dataset.page;store.set("page",page);render()});
$("#hamb").onclick=()=>$("#sidebar").classList.toggle("open");$("#theme").onclick=setTheme;$("#logout").onclick=()=>{api("/api/logout",{method:"POST"}).catch(()=>{});store.set("auth",false);store.set("token","");store.set("user",null);loginView()};
}

function stats(){
if(role==="admin")return [["♙","245",tr("users")],["👨‍🏫","18",tr("teacher")+"s"],["▣","12",tr("courses")],["☷","26",tr("groups")]];
if(role==="teacher")return [["♙","48","Ученики"],["▣","4","Группы"],["✓","89%",tr("avg")],["◷","94%",tr("att")]];
if(role==="parent")return [["✓","92",tr("avg")],["◷","94%",tr("att")],["₽","2 500","Оплата"],["★","#3",tr("rank")]];
return [["✓","87/100",tr("avg")],["◷","94%",tr("att")],["♛","#4",tr("rank")],["★","8",tr("achievements")]];
}
function statCards(){return `<div class="grid stats">${stats().map(s=>`<div class="stat"><div class="ico">${s[0]}</div><b>${s[1]}</b><span>${s[2]}</span></div>`).join("")}</div>`}

function studentDash(){
return `<div class="welcome"><div><h1>${tr("welcome")}, Ахмад! 👋</h1><p>Сегодня у вас 2 занятия. Продолжайте двигаться вперёд.</p></div><button class="primary" style="width:auto" onclick="page='courses';render()">+ ${tr("courses")}</button></div>
${statCards()}<div class="grid two"><div class="card"><div class="card-head"><h3>${tr("myCourses")}</h3><button class="link" onclick="page='courses';render()">${tr("all")}</button></div>${[["English B2","82%","English · B2"],["Grammar Advanced","68%","Grammar"],["Speaking Club","91%","Speaking"]].map((x,i)=>`<div class="course"><div class="course-top"><strong>${x[0]}</strong><span class="badge">${x[2]}</span></div><div class="progress"><i style="width:${x[1]}"></i></div><div class="course-bottom"><span>${tr("progress")}</span><b>${x[1]}</b></div></div>`).join("")}</div>
<div class="card"><div class="card-head"><h3>${tr("scheduleToday")}</h3><span class="muted">12 мая</span></div>${[["10:00","English B2","Каб. 204"],["14:00","Grammar","Каб. 102"],["16:00","Speaking","Online"]].map(x=>`<div class="listrow"><b style="font-size:11px">${x[0]}</b><div class="grow"><strong>${x[1]}</strong><small>${x[2]}</small></div><span>›</span></div>`).join("")}</div></div>
<div class="grid two"><div class="card"><div class="card-head"><h3>${tr("recentGrades")}</h3><button class="link" onclick="page='grades';render()">${tr("all")}</button></div><table class="table"><tr><th>Курс</th><th>Тема</th><th>Оценка</th></tr><tr><td>English B2</td><td>Grammar</td><td class="score">92</td></tr><tr><td>English B2</td><td>Speaking</td><td class="score">95</td></tr><tr><td>Grammar</td><td>Unit 5</td><td class="score">88</td></tr></table></div>
<div class="card"><div class="card-head"><h3>${tr("announcements")}</h3><button class="link" onclick="page='news';render()">${tr("all")}</button></div><div class="notice"><span>📢</span><div class="grow"><strong>Новое расписание на май</strong><p>Обновлено расписание занятий на следующую неделю.</p></div></div><div class="notice"><span>🎓</span><div class="grow"><strong>Поздравляем учеников!</strong><p>Итоги месячного рейтинга уже опубликованы.</p></div></div></div></div>`;
}
function teacherDash(){
return `<div class="welcome"><div><h1>${tr("welcome")}, Анна! 👋</h1><p>Ваши группы и задачи на сегодня.</p></div></div>${statCards()}<div class="grid two"><div class="card"><div class="card-head"><h3>${tr("groups")}</h3><button class="link">${tr("all")}</button></div><div class="list">${["English B2 · группа A","English B2 · группа B","Grammar Advanced","Speaking Club"].map((x,i)=>`<div class="listrow"><div class="avatar">${i+1}</div><div class="grow"><strong>${x}</strong><small>${[12,15,11,10][i]} учеников · следующее занятие 10:00</small></div><button class="link">Открыть</button></div>`).join("")}</div></div><div class="card"><div class="card-head"><h3>${tr("quick")}</h3></div><div class="actions"><button class="secondary">✓ Выставить оценки</button><button class="secondary">✎ Создать задание</button><button class="secondary">◷ Отметить посещение</button><button class="secondary">☑ Создать тест</button></div></div></div>`;
}
function parentDash(){
return `<div class="welcome"><div><h1>${tr("welcome")}, Саида! 👋</h1><p>Контроль обучения ваших детей в одном месте.</p></div></div>${statCards()}<div class="grid two"><div class="card"><div class="card-head"><h3>${tr("children")}</h3></div><div class="list">${["Ахмад Юсуфов","Алия Юсуфова"].map((x,i)=>`<div class="listrow"><div class="avatar">${i===0?"А":"А"}</div><div class="grow"><strong>${x}</strong><small>${i===0?"English B2":"English A2"} · прогресс ${i===0?"82%":"76%"}</small></div><span class="score">${i===0?"92":"90"}</span></div>`).join("")}</div></div><div class="card"><div class="card-head"><h3>${tr("announcements")}</h3></div><div class="notice"><span>📢</span><div class="grow"><strong>Родительское собрание</strong><p>В пятницу в 18:00 в актовом зале.</p></div></div><div class="notice"><span>💳</span><div class="grow"><strong>Напоминание об оплате</strong><p>Следующий платёж до 15 мая.</p></div></div></div></div>`;
}
function adminDash(){
return `<div class="welcome"><div><h1>${tr("welcome")}, Админ! 👋</h1><p>Обзор работы Point of Knowledge.</p></div><button class="primary" style="width:auto" onclick="openModal('Добавить пользователя')">+ ${tr("add")}</button></div>${statCards()}<div class="grid two"><div class="card"><div class="card-head"><h3>${tr("statistics")}</h3><span class="muted">Последние 7 дней</span></div><div class="chart">${[58,74,62,86,70,94,81].map((v,i)=>`<div class="bar" style="height:${v}%"><span>${["Пн","Вт","Ср","Чт","Пт","Сб","Вс"][i]}</span></div>`).join("")}</div></div><div class="card"><div class="card-head"><h3>Последние события</h3></div><div class="list">${["Новый ученик зарегистрирован","Создан курс IELTS","Оплата получена","Новое объявление опубликовано"].map((x,i)=>`<div class="listrow"><span>${["👤","📚","💳","📢"][i]}</span><div class="grow"><strong>${x}</strong><small>Сегодня · ${10+i}:2${i}</small></div></div>`).join("")}</div></div></div>`;
}
function dashboard(){return role==="student"?studentDash():role==="teacher"?teacherDash():role==="parent"?parentDash():adminDash()}

function coursesPage(){
const items=role==="admin"?["English B2","IELTS","IT Basics","Grammar Advanced","Speaking Club","Русский язык"]:["English B2","Grammar Advanced","Speaking Club","IELTS"];
return `<div class="section-title"><h2>${tr("coursesTitle")}</h2><button class="primary" style="width:auto" onclick="openModal('${tr("create")}')">+ ${tr("create")}</button></div><div class="filters"><button class="filter active">${tr("all")}</button><button class="filter">English</button><button class="filter">IT</button><button class="filter">Languages</button></div><div class="page-grid" style="margin-top:15px">${items.map((x,i)=>`<div class="course-card"><div class="cover">${["🇬🇧","🎯","💻","📘","🗣️","🇷🇺"][i%6]}</div><h3>${x}</h3><p>${i%2?"Практика, домашние задания и регулярная проверка прогресса.":"Полный курс с занятиями, материалами и тестированием."}</p><div class="course-bottom"><span>${10+i*2} уроков</span><span class="score">${70+i*4}%</span></div><div class="actions" style="margin-top:12px"><button class="primary" style="width:auto;padding:9px 12px">Открыть</button></div></div>`).join("")}</div>`;
}
function genericPage(){
const titles={groups:"Группы",users:"Пользователи",student:"Ученики",teacher:"Преподаватели",children:tr("children"),grades:tr("grades"),attendance:tr("attendance"),schedule:tr("schedule"),homework:tr("homework"),tests:tr("tests"),achievements:tr("achievements"),leaderboard:tr("leaderTitle"),news:tr("newsTitle"),notifications:tr("notifications"),payments:tr("payments"),profile:tr("profileTitle"),settings:tr("settingsTitle")};
const title=titles[page]||tr(page);
if(page==="leaderboard")return `<div class="section-title"><h2>${title}</h2><div class="filters"><button class="filter active">${tr("all")}</button><button class="filter">По курсу</button><button class="filter">За месяц</button></div></div><div class="card"><table class="table"><tr><th>#</th><th>Ученик</th><th>Курс</th><th>Баллы</th><th>Посещаемость</th></tr>${["Рахимов Алим","Сафарова Мадина","Шарипов Фарид","Ахмад Юсуфов","Джумаев Назар"].map((x,i)=>`<tr><td>${i+1}</td><td><b>${x}</b></td><td>${["English B2","English B2","IT Basics","English B2","IELTS"][i]}</td><td class="score">${985-i*25}</td><td>${98-i*2}%</td></tr>`).join("")}</table></div>`;
if(page==="news"||page==="notifications")return `<div class="section-title"><h2>${title}</h2><button class="primary" style="width:auto" onclick="openModal('${tr("create")}')">+ ${tr("create")}</button></div><div class="card">${["Новое расписание на май","Родительское собрание","Поздравляем учеников месяца!","Обновление учебных материалов"].map((x,i)=>`<div class="notice"><span>${["📢","👨‍👩‍👧","🏆","📚"][i]}</span><div class="grow"><strong>${x}</strong><p>Подробная информация и важные обновления для учащихся, родителей и преподавателей.</p></div><small class="muted">Сегодня</small></div>`).join("")}</div>`;
if(page==="grades"||page==="attendance")return `<div class="section-title"><h2>${title}</h2><button class="primary" style="width:auto" onclick="openModal('${tr("add")}')">+ ${tr("add")}</button></div><div class="card"><table class="table"><tr><th>Ученик</th><th>Курс</th><th>Тема</th><th>${page==="grades"?"Оценка":"Статус"}</th></tr>${["Ахмад Юсуфов","Алия Юсуфова","Фарид Шарипов","Мадина Сафарова","Назар Джумаев"].map((x,i)=>`<tr><td>${x}</td><td>English B2</td><td>${["Grammar","Speaking","Unit 5","Vocabulary","Final"][i]}</td><td class="${page==="grades"?"score":""}">${page==="grades"?[92,95,88,90,86][i]:["Присутствует","Присутствует","Отсутствует","Присутствует","Присутствует"][i]}</td></tr>`).join("")}</table></div>`;
return `<div class="section-title"><h2>${title}</h2><button class="primary" style="width:auto" onclick="openModal('${tr("create")}')">+ ${tr("create")}</button></div><div class="card"><div class="empty">Раздел <b>${title}</b> подготовлен. Здесь будут полноценные данные, фильтры, поиск и действия после подключения backend.</div></div>`;
}

function openModal(title){
const m=document.createElement("div");m.className="modal show";m.innerHTML=`<div class="modal-card"><div class="modal-head"><h3>${esc(title)}</h3><button class="close">×</button></div><p class="muted" style="margin:12px 0 18px">Демо-форма. В production данные будут сохраняться в базе данных.</p><div class="field"><label>Название</label><div class="input"><input></div></div><div class="field"><label>Описание</label><div class="input"><input></div></div><div class="actions"><button class="secondary closeBtn">${tr("cancel")}</button><button class="primary" style="width:auto">${tr("save")}</button></div></div>`;
document.body.appendChild(m);m.querySelector(".close").onclick=()=>m.remove();m.querySelector(".closeBtn").onclick=()=>m.remove();
}

function appPage(){
let content=page==="dashboard"?dashboard():page==="courses"?coursesPage():genericPage();
shell(content);
}
function render(){
const u=store.get("user",null); if(u) role=u.role;
if(!store.get("auth",false)||!store.get("token",null)) return loginView();
appPage();
}
const resetToken=new URLSearchParams(location.search).get("reset");
if(resetToken) resetView(resetToken); else render();
