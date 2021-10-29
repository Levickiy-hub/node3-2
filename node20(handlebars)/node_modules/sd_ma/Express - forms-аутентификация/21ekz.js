const express = require('express');
const app = express();
const fs = require('fs');
const cp = require('cookie-parser');

app.use(cp());
app.use(express.urlencoded({
    extended: true
}));

app.get('/login', (req, res, next) => {
    console.log('/login');
    const rs = fs.ReadStream('./index.html');
    rs.pipe(res);
});

app.post('/login', (req, res) => {
    // сгенерировали токен
    res.cookie('token', 'xxx-yyy-zzz').redirect('/resource');
});

app.get('/resource', (req, res) => {
    // проверяем валидность токена
    if (req.cookies.token == 'xxx-yyy-zzz') res.send('resource');
    else res.redirect('/login');
});

app.listen(3000);