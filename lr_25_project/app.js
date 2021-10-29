const express = require('express')
const app = express()
const https = require('https')
const fs = require('fs')
const port = 3000

let options =
{
    key: fs.readFileSync('./securrity_/RS-LAB25-LVS.pem'),
    cert: fs.readFileSync('./securrity_/RS-LVS-CRT.pem')
};

app.get('/', (req, res) =>
{
    res.send("hello from https")
})

https.createServer(options, app).listen(port, () =>
{
    console.log(`https://localhost:${port}/`);
});