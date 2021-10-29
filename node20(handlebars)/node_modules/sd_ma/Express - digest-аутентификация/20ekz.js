const app = require('express')()
const passport = require('passport')
const DigestStrategy = require('passport-http').DigestStrategy
const {getCredential, varPassword} = require('./20_1ekz')
const session = require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: '123'
  })

  app.use(session);
  app.use(passport.initialize());
  app.use(passport.session());

passport.use(new DigestStrategy({qop: 'auth'}, (user, done) => {
    let rc = null
    let cr = getCredential(user)
    if(!cr) rc = done(null, false)
    else rc = done(null, cr.username, cr.password)
    return rc
}))

passport.serializeUser((user, done)=>{
    done(null, user);
  })
  passport.deserializeUser((user, done)=>{
    done(null, user);
  })

app.get('/', (req, res, next) => {
    if(req.session.logout && req.headers['authorization']) {
        req.session.logout = false
        delete req.headers['authorization']
    }
    next()
}, passport.authenticate('digest'), (req, res, next) => {
    if(req.session.logout == undefined)
    req.session.logout = false
    next()
})
.get('/', (req, res)=>{
    console.log('authenticated')
    res.end('authenticated')
})
app.listen(3000)