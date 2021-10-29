const express = require('express');
const app = express();
const fs = require('fs');

app.post('/append', (req, res) => {

    res.append('Example', 'x=1;y=2;z=3;'); // добавить заголовок
    res.send('<h1>post/properties</h1>');
})
app.get('/attachmentTxt', (req, res)=>{
    res.attachment ('File.txt');
    res.send('qqqq\nwerty\n12345\n'); // добавить заголовок
})
app.get('/attachmentJpg', (req, res)=>{
    res.attachment ('1.jpg');
    let rs= fs.ReadStream('./1.jpg');
    rs.pipe(res);
    // добавить заголовок
})
app.post('/download', (req, res)=>{
        res.download('./1.jpg');
})
app.get('/redirect', (req, res)=>{
    res.redirect('redirect/qwerty');
})
app.get('/redirect/qwerty', (req, res)=>{
    res.send('redirect/qwerty');
})
const server = app.listen(3000);



