const redis = require('redis');

let config = {
    "host": "redis-14560.c100.us-east-1-4.ec2.cloud.redislabs.com",
    "port": 14560,
    "no_ready_check": true,
    "auth_pass": "kJW9uUj9U407golH7rJqeQn1yV0aczep"
}

const client = redis.createClient(config);

client
    .on('ready', () => { console.log('Client is ready'); })
    .on('error', (err) => { console.log("Error: " + err); })
    .on('end', () => { console.log("End of connection"); })
    .on('ready', () => {
        console.log('Redis connected');

        Promise.resolve()
            .then(() => Set(client, 10000))
            .then(() => Get(client, 10000))
            .then(() => Del(client,10000))
            .then(() => Set2(client, 10000))
            .then(() => Incr(client, 10000))
            .then(() => Decr(client, 10000))
            .then(() => Del2(client, 10000))
            .then(() => HSet(client, 10000))
            .then(() => HGet(client, 10000))
            .then(() => Del3(client, 10000));
    });

function Set(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        let param = `s${i}`;
        client.set(param, param, (err) => { if (err) console.log("Error msg: " + err); });
    }
    console.log(`Task 2: Set time for ${count} queries: ${Date.now() - timer} ms`);
}

function Get(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        let param = `s${i}`;
        client.get(param, (err, msg) => { if (err) console.log("Error msg: " + err);})
    }
    console.log(`Task 2: Get time for ${count} queries: ${Date.now() - timer} ms`);

}

function Del(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        let param = `s${i}`;
        client.del(param, (err) => { if (err) console.log("Error msg: " + err); });
    }
    console.log(`Task 2: Del time for ${count} queries: ${Date.now() - timer} ms`);
}
//////////////////////////////////////////////////////////////////////////////////

function Incr(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        client.incr(`s${i}`, (err) => { if (err) console.log("Error msg: " + err); });
    }
    console.log(`Task 3: Incr time for ${count} queries: ${Date.now() - timer} ms`);
}

function Decr(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        client.decr(`s${i}`, (err) => { if (err) console.log("Error msg: " + err); });
    }
    console.log(`Task 3: Decr time for ${count} queries: ${Date.now() - timer} ms`);
}

function Set2(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        client.set(`s${i}`, i, (err) => { if (err) console.log("Error msg: " + err); });
    }
    console.log(`Task 3: Set time for ${count} queries: ${Date.now() - timer} ms`);
}

function Del2(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        client.del(`s${i}`, (err) => { if (err) console.log("Error msg: " + err); });
    }
    console.log(`Task 3: Del time for ${count} queries: ${Date.now() - timer} ms`);
}
/////////////////////////////////////////////////////////////////////////////////////////////

function HSet(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        let param = `4s${i}`;
        client.set(param, param, (err) => { if (err) console.log("Error msg: " + err); });
    }
    console.log(`Task 4: HSet time for ${count} queries: ${Date.now() - timer} ms`);
}

function HGet(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        let param = `4s${i}`;
        client.get(param, (err) => { if (err) console.log("Error msg: " + err); });
    }
    console.log(`Task 4: HGet time for ${count} queries: ${Date.now() - timer} ms`);

}

function Del3(client, count) {
    let timer = Date.now();
    for (var i = 0; i < count; i++) {
        let param = `4s${i}`;
        client.del(param, (err) => { if (err) console.log("Error msg: " + err); });
    }
    console.log(`Task 4: Del time for ${count} queries: ${Date.now() - timer} ms`);
}
//////////////////////////////////////
const pub = redis.createClient(config);
const sub = redis.createClient(config);

sub.on('message', (chanel, message) => { console.log(`Message: ${message}|From ${chanel}`); });
sub.on('subscribe', (chanel, count) => { console.log(`Subscribers: ${count}|From ${chanel}`); });

sub.subscribe('chanel1');
setTimeout(() => { sub.unsubscribe('chanel1'); sub.quit() }, 60000);

pub.publish('chanel1', 'pub-msg1');
let i = 0;
setInterval(() => { i++; pub.publish('chanel1', `pub-msg${i}`); }, 2000);
setTimeout(() => { pub.quit(); }, 55000);