const JsonRPCSever = require('jsonrpc-server-http-nats');
const server = new JsonRPCSever();

const bin_validator = (param)=>{
    console.log('validation', param);
    if(!Array.isArray(param))   throw new Error('ожидается массив');
    param.forEach(p=>{if(!isFinite(p))    throw new Error ('ожидается число')});
    return param;
}

const sumTo = (params) => {
    let sum = 0;
    params.map(param => sum += param);
    return sum;
}

const mulTo = (params)=> {
    let mul = 1;
    params.map(param => mul *= param);
    return mul;
}

server.on('div', bin_validator, (params, channel, resp) => {resp(null, params[0]/params[1]);});
server.on('proc', bin_validator, (params, channel, resp) => {resp(null, params[0]/params[1]*100);});
server.on('sum', bin_validator, (params, channel, resp) => {resp(null, sumTo(params));});
server.on('mul', bin_validator, (params, channel, resp) => {resp(null, mulTo(params));});

server.listenHttp({host:'127.0.0.1', port:3000}, ()=>{console.log('JSON-RPC Server')});

//sample: {"jsonrpc": "2.0", "method": "sum", "id": 1, "params": [5,6,7,3,4,5,6,7,8,2,4]}