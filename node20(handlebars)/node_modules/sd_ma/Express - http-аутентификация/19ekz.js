const auth = require('basic-auth');
const mycred = {
    name: 'user',
    pass: '123456'
};
module.exports = (req, res, next) => {
        let credentials = auth(req);
        if (!credentials) {
           res.status(401).append('WWW-Authenticate', 'Basic realm="Resurse-realm"').send('Access denied');
        } else if (!check(credentials, mycred)) {
            res.status(401).append('WWW-Authenticate', 'Basic realm="Resurse-realm"').send('Wrong Name or Password');
            console.log('wrong credential = ', credentials, mycred);
        } else next();
    }
        const check = (cr1, cr2) => {
            return cr1.name.toUpperCase() == cr2.name.toUpperCase() && cr1.pass == cr2.pass;
        };