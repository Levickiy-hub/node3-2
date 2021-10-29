const express = require('express'),
    app = express(),
    bodyParser = require('body-parser'),
    jwt = require('jsonwebtoken'),
    randToken = require('rand-token')
DB = require('./db');
const cookieParser = require('cookie-parser');

const redis = require("redis");
const client = redis.createClient('//redis-14560.c100.us-east-1-4.ec2.cloud.redislabs.com:14560',
    { password: 'kJW9uUj9U407golH7rJqeQn1yV0aczep'});

const tokenKey = '412x-as12-vf32-12ds';
let refreshTokens = []

const getAppCookies = (req) => {
    // We extract the raw cookies from the request headers
    const rawCookies = req.headers.cookie.split('; ');
    // rawCookies = ['myapp=secretcookie, 'analytics_cookie=beacon;']

    const parsedCookies = {};
    rawCookies.forEach(rawCookie => {
        const parsedCookie = rawCookie.split('=');
        // parsedCookie = ['myapp', 'secretcookie'], ['analytics_cookie', 'beacon']
        parsedCookies[parsedCookie[0]] = parsedCookie[1];
    });
    return parsedCookies;
};

function generateRefreshToken(user, token) {
    let flag = true;
    refreshTokens.map((item, index) => {
        if (item.user === user) {
            flag = false;
            refreshTokens[index].refreshToken = token;
            return;
        }
    })
    if (flag) refreshTokens.push({ user: user, refreshToken: token })
}

function updateRefreshToken(token, refreshToken) {
    let flag = false;
    refreshTokens.map((item, index) => {
        if (item.refreshToken === token) {
            flag = true;
            refreshTokens[index].refreshToken = refreshToken;
            return;
        }
    })
    return flag;
}

app.use(bodyParser.json());

app.use((req, res, next) => {
    if (req.headers.authorization) {
        jwt.verify(req.headers.authorization.split(' ')[1], tokenKey, (err, payload) => {
            if (err) {
                next();
            } else if (payload) {
                req.payload = payload;
                next();
            }
        })
    }
    next();
})

app.post('/api/auth', (req, res) => {
    console.log(req.body);
    DB.getUser({ login: req.body.login, password: req.body.password })
        .then((user) => {
            console.log(user);
            if (user[0] !== undefined && user[0] !== null) {
                var refreshToken = jwt.sign({ id: user[0].id, login: user[0].login }, tokenKey, { expiresIn: '24h' });
                let token = jwt.sign({ id: user[0].id, login: user[0].login }, tokenKey, { expiresIn: '10m' });
                res.cookie('access-token', token, {
                    maxAge: 60000 * 10
                })

                generateRefreshToken(user[0].login, refreshToken)
                res.cookie('refresh-token', refreshToken, {
                    maxAge: 86400000,
                    path: '/'
                })
                return res.status(200).json({
                    id: user[0].id,
                    login: user[0].login,
                    token: token
                })
            }
            return res.status(404).json({ message: "User not found" });
        })
        .catch((error) => {
            console.log(error);
            return res.status(404).json({ message: error });
        })
    //return res.status(404).json({message:"User not found"});
})


app.get('/login', (req, res) => {
    if (req.payload) {
        res.redirect('/user')
    } else {
        res.sendFile(__dirname + '/index2.html')
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('access-token');
    res.clearCookie('refresh-token');
    res.redirect('/login')
})

app.get('/resource', (req, res) => {
    console.log(req.headers);
    if (req.headers.cookie) {
        let userRefreshToken = getAppCookies(req)['access-token'];
        let token = jwt.decode(userRefreshToken);

        console.log(token);
        if (token !== null) {
            res.send('RESOURCE')
        } else {
           res.redirect('/login')
        }
    } else {
        res.redirect('/login')
    }
})


app.get('/register',(req,res)=>{
    res.sendFile(__dirname + '/register.html')
})

app.post('/api/register',(req,res)=>{
    console.log(req.body.login);
    if(req.body.login!==undefined&& req.body.password!==undefined&& req.body.age!==undefined){
        DB.createUser({login:req.body.login,password:req.body.password,age:req.body.age})
        .then((user)=>{
            console.log(user);
            res.send(JSON.stringify(user));
        })
        .catch((error)=>{
            console.log(error);
            res.send(JSON.stringify(error));
        })
    }else{
        return res.status(401).json({ message: "Data is not exist" })
    }
})

app.listen(3000);
//redis part on refresh token
client.on("error", function (error) {
    console.error(error);
});

function banRefreshToken(user, token) {
    let history = null;
    client.get(user, (err, value) => {
        let arr = JSON.parse(value);
        if(arr!==null){
            arr.push(token);
            client.set(user, JSON.stringify(arr), redis.print)
        }else{
            client.set(user,JSON.stringify([token]), redis.print);
        }
    });
}

app.get('/refresh-token', (req, res) => {
    console.log(req.headers);
    if (req.headers.cookie) {
        let userRefreshToken = getAppCookies(req)['refresh-token'];
        let token = jwt.decode(userRefreshToken);

        console.log(token);
        if (token !== null) {
            var refreshToken = jwt.sign({ id: token.id, login: token.login }, tokenKey, { expiresIn: '24h' });

            updateRefreshToken(userRefreshToken, refreshToken)

            banRefreshToken(token.login, userRefreshToken);
            let newToken = jwt.sign({ id: token.id, login: token.login }, tokenKey, { expiresIn: '10m' });
            res.cookie('access-token', newToken, {
                maxAge: 60000 * 10
            })

            res.cookie('refresh-token', refreshToken, {
                maxAge: 86400000,
                path: '/'
            })
            return res.status(200).json({
                id: token.id,
                login: token.login,
                token: newToken
            })
        } else {
            return res.status(401).json({ message: "Token is not valid" })
        }
    } else {
        return res.status(401).json({ message: "Token is not valid" })
    }

})
