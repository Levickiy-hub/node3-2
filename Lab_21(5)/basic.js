const app = require('express')();
const passport = require('passport');
const BasicStrategy = require('passport-http').BasicStrategy;
const { getCredential, verPassword } = require('./basicModule');
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: '123124'
});

passport.use(new BasicStrategy((user, password, done) => {
    let rc = null;
    let cr = getCredential(user, password);
    if (!cr) {
        rc = done(null, false, { message: "incorrect username" });
    }
    else if (!verPassword(cr.password, password)) {
        rc = done(null, false, { message: "incorrect password" })
    } else {
        rc = done(null, user);
    }
    return rc;
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
    passport.authenticate('basic'), (req, res, next) => { next(); })
    .get('/resource', (req, res, next) => {
        req.isAuthenticated() ? res.send('RESOURCE') : res.redirect("/login");
    })
    .get('/logout', function (req, res) {
        req.session.logout = true;
        res.redirect('/login')
    })
    .get('/*',(req,res)=>{
        res.send('Error');
    })

app.listen(3000);