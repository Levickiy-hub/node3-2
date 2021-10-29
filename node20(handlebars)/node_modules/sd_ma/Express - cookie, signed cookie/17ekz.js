const express = require("express");
const app = express();
const cookieparser = require('cookie-parser');

app.use(cookieparser('qwerty'));

app.get('/', (req, res) => {
    let id = req.signedCookies.id;
    console.log('cookies: ', req.signedCookies);
    res.cookie('id', id, {signed: true}).send('<h1>cookie<h1>');
});
app.get('/c', (req, res) => {
    res.cookie('id', '12345').send('<h1>cookie<h1>');
    console.log('cookies: ', req.cookies);
});
app.get('/clear-cookie', (req, res) => {
    res.clearCookie('id');
    res.send('<h1>clear-cookie<h1>');
})

app.listen(3000);