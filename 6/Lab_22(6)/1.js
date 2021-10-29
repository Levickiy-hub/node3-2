const express = require('express'),
app = express(),
bodyParser = require('body-parser'),
session=require('express-session'),
passport =require('passport'),
localStrategy = require('passport-local').Strategy,
users = require('./users');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(session({secret:"asdasd", resave: true,saveUninitialized:true}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user,done)=>{
    done(null,user);
})


passport.deserializeUser((user,done)=>{
    done(null,user);
})

passport.use(new localStrategy((username,password,done)=>{
    for(let user of users){
        if(user.login===username&&user.password===password){
            return done(null,user);
        }
    }
    return done(null,false,{message:"WRONG"});
}));

app.get('/login',(req,res)=>{
    res.sendFile(__dirname+'/index.html');
})


app.post('/login',passport.authenticate('local',{successRedirect:'/home',failureRedirect:'/login'}));

app.get('/home',(req,res,next)=>{
    if(req.user){
        next();
    }else{
        res.redirect('/login');
    }
},(req,res)=>{
    res.send('Hello');
})

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/login')
})

app.get('/resource',(req,res)=>{
    if(req.session.passport===undefined||req.session.passport.user===undefined){
        res.redirect('/login');
        return;
    }
    console.log(req.session);
    res.send('work');
})


app.get('/*',(req,res)=>{
    res.status(401);
    res.send('Error');
})

app.listen(3000);
