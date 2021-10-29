const JsonRPCSever = require('jsonrpc-server-http-nats');
const server = new JsonRPCSever();

function Validation(param){
    if(!Array.isArray(param)){
        throw new Error('Wait for a array');
    }
    param.forEach((p) => {
        if(!isFinite(p)) {
            throw new Error ('Wait for a number')
        }
    });
    return param;
}

function sum(param) {
    let sum = 0;
    for (let i=0; i < param.length; i++){
        sum += param[i];
    }
    return sum;
}

function subtraction(param) {
    let sub = 100;
    for (let i=0; i < param.length; i++){
        sub -= param[i];
    }
    return sub;
}

server.on('sum', Validation, (params, channel, resp) => {resp(null, sum(params));});
server.on('sub', Validation, (params, channel, resp) => {resp(null, subtraction(params));});

server.listenHttp({host:'127.0.0.1', port:3000}, ()=>{console.log('READY')});

// POST
// {
//     "jsonrpc": "2.0",
//     "method": "sum",
//     "id": 3,
//     "params": [1,2,3,4,5,6,7,8,8,9,10,12,13,14]
// }
