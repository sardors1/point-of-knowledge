# Point of Knowledge / Нуқтаи Дониш — Complete Frontend Prototype

Это расширенный frontend-прототип образовательной платформы.

## Уже реализовано

- Официальный логотип Point of Knowledge
- Login
- Регистрация с выбором роли:
  - Ученик
  - Родитель
  - Преподаватель
  - Администратор
- Demo authentication через localStorage
- RU / TJ / UZ / EN
- Светлая/тёмная тема
- Автоматическое определение темы устройства при первом запуске
- Responsive: ПК / планшет / смартфон
- PWA manifest
- Sidebar + мобильная навигация
- Student Dashboard
- Teacher Dashboard
- Parent Dashboard
- Admin Dashboard
- Курсы
- Расписание
- Оценки
- Посещаемость
- Домашние задания
- Тесты
- Достижения
- Leaderboard
- Новости
- Уведомления
- Пользователи / группы
- Профиль / настройки
- Демо-модальные формы
- Сохранение языка, темы, роли и состояния входа

## Запуск

Самый простой вариант — открыть `index.html` в браузере.

Для полноценного production-продукта следующим техническим этапом является backend:
- PostgreSQL
- серверная авторизация
- безопасные сессии/JWT
- реальные пользователи и роли
- email/SMS подтверждение
- хранение оценок, посещаемости, расписания и платежей
- загрузка файлов
- push/email уведомления
- API для будущего Android/iOS приложения.

Важно: текущая авторизация является только демонстрационной и не предназначена для реальных паролей/пользователей.

## Локальный запуск полного прототипа

Требуется Node.js 20+.

```bash
npm start
```

Откройте `http://localhost:3000`.

### Demo accounts

Все demo-пароли: `ChangeMe123!`

- admin@pointofknowledge.tj
- teacher@pointofknowledge.tj
- parent@pointofknowledge.tj
- student@pointofknowledge.tj

Перед реальным запуском эти пароли обязательно заменить через переменные окружения `POK_ADMIN_PASSWORD`, `POK_TEACHER_PASSWORD`, `POK_PARENT_PASSWORD`, `POK_STUDENT_PASSWORD` и подключить настоящую БД.
