const app = require('express')();
const passport = require('passport');
const DigestStrategy = require('passport-http').DigestStrategy;
const {getCredential,verPassword} = require('./basicModule');
const session = require('express-session')(
    {
        resave: false,
        saveUninitialized: false,
        secret: '123456789'
    });

passport.use(new DigestStrategy({qop:'auth'},(user,done)=>{
    let rc =null;
    let cr =getCredential(user);
    if(!cr){
        rc=done(null,false);
    }else{
        rc= done(null,cr.user,cr.password);
    }
    return rc;

},(params,done)=>{
    console.log('Params = ',params);
    done(null,true);
}))

passport.serializeUser((user, done) => {
    console.log('serializeUser', user);
    done(null, user);
})

passport.deserializeUser((user, done) => {
    console.log('deserializeUser', user);
    done(null, user);
})

app.use(session);
app.use(passport.initialize());
app.use(passport.session());


app.get('/login', (req, res, next) => {
    if (req.session.logout && req.headers['authorization']) {
        req.session.logout = false;
        delete req.headers['authorization'];
    }
    next();
},
    passport.authenticate('digest'), (req, res, next) => { next(); })
    .get('/resource', (req, res, next) => {
        req.isAuthenticated() ? res.send('RESOURCE') : res.redirect("/login");
    })
    .get('/logout', function (req, res) {
        req.session.logout = true;
        res.redirect('/login')
    })
    .get('/login', function (req, res) {
        if(req.isAuthenticated())res.redirect('RESOURCE') ;
    })
    .get('/*',(req,res)=>{
        res.status(404);
        res.send('Error');
    })

app.listen(3000);




