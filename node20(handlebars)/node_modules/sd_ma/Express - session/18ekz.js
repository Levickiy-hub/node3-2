const express = require("express");
const app = express();
const cookiesecret = '1234567890';
const session = require('express-session')
    ({
        resave: false, // пересохранять ли, если нет изм.
        saveUninitialized: false, // сохранять ли пустые
        secret: cookiesecret, // ДЛЯ ПОДПИСИ
        // key: 'myid',      // имя ключа
        // store = тип хранилища (Mem, DB)
        // cookie = path, domain, secure,
    });

app.use(session);

app.get('/', (req, res) => {
    //Глобальная isFinite() функция определяет, является ли переданное значение конечным числом.
    if (!req.session.num) req.session.num = 1;
    else req.session.num++;
    console.log('num= ', req.session.num);
    res.send(`num= ${req.session.num}`);
});

app.listen(3000);