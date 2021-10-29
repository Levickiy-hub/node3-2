const app =require('express')();
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const session = require('express-session')({resave:false,saveUninitialized:false,secret:'123124asd'});

passport.use(new GoogleStrategy({
    clientID:'334998116020-3n6lgam9adimn5r04vsl55covj5unfkj.apps.googleusercontent.com',
    clientSecret:'NDlTHokdWE8CoKfum49Va-Af',
    callbackURL: 'http://localhost:3000/auth/google/callback'
},
    (token, refreshToken, profile, done) => {
    done(null,{profile:profile,token:token});
}
));

passport.serializeUser((user,done)=>{
    console.log('serialize:',user.profile.displayName);
    done(null,user);
})

passport.deserializeUser((user,done)=>{
    console.log('deserialize:',user.profile.displayName);
    done(null,user);
})

app.use(session);
app.use(passport.initialize());
app.use(passport.session());

app.get('/login',(req,res)=>{
    res.sendFile(__dirname + '/login.html');
})

app.get('/auth/google',passport.authenticate('google',{scope:['profile']}));   

app.get('/auth/google/callback',passport.authenticate('google',{failureRedirect:'/error'}),
    (req,res)=>{
        res.redirect('/resource');
    }
)

app.get('/resource',(req,res,next)=>{
    if(req.user){
        res.status(200).send(`RESOURCE ok google ${req.user.profile.displayName}`);
    }else{
        res.redirect('/error');
    }
})

app.get('/logout',(req,res)=>{
    req.logout();
    res.redirect('/login');
})

app.get('/error',(req,res,next)=>{
    res.status(404).send('failure google');
})
app.get('/*', (req, res, next) => {
    res.status(404).send('error');
})

app.listen(3000);