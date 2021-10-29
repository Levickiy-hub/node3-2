const express = require('express');
const bodyParser = require("body-parser");

const app = express();

const wasmCode = new Uint8Array([0,97,115,109,1,0,0,0,1,135,128,128,128,0,1,96,2,127,127,1,127,3,130,128,128,128,0,1,0,4,132,128,128,128,0,1,112,0,0,5,131,128,128,128,0,1,0,1,6,129,128,128,128,0,0,7,144,128,128,128,0,2,6,109,101,109,111,114,121,2,0,3,115,117,109,0,0,10,141,128,128,128,0,1,135,128,128,128,0,0,32,1,32,0,106,11])
const wasmImports = {};
const wasmModule = new WebAssembly.Module(wasmCode);
const wasmInstance = new WebAssembly.Instance(wasmModule, wasmImports);

app.use(bodyParser.urlencoded({extended: false}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
})

app.get('/sum', (req, res) => {
    res.type('html').send(
        `sum(18,20) = ${wasmInstance.exports.sum(18,20)} </br>`
    );
})

app.get('/:name', (req, res) => {
    const func = req.params.name;

    if(wasmInstance.exports[func]){
        res.send(wasmInstance.exports[func](18,20).toString());
    }
    res.sendStatus(404);
});

app.post('/count', (req, res) => {
    const first = req.body.first;
    const second = req.body.second;

    res.type('html').send(
        `sum(${first}, ${second}) = ${wasmInstance.exports.sum(first, second)}`
    );
})

app.listen(3000, () => { console.log('READY'); });
