const { ServerSign } = require('./23-02_DigitalSign');
const fs = require('fs');
let rs2 = fs.createReadStream('./txt/origin_data.txt');
const app = require('express')();

app.get('/resource', (req, res, next) =>
{
    res.statusCode = 200;
    rs2.pipe(res);
    rs2.on('close', () =>
    {
        console.log(rs2.bytesRead);
        res.end();
    });
});

app.get('/', (req, res, next) =>
{
    const ss = new ServerSign();
    const rs = fs.createReadStream('./txt/origin_data.txt');
    ss.getSignContext(rs, (signcontext) =>
    {
        res.writeHead(200, {'Content-Type': 'application/json'});
        res.end(JSON.stringify(signcontext));
    });
});

app.listen(8000, () =>
{
    console.log('Server is listening: 8000');
});