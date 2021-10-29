const users = require('../Ekz/users.json')

const getCredential = (username) => {
    let u = users.find( e => { return e.username.toUpperCase() == username.toUpperCase()})
    return u
}

const verifyPassword = (pass1, pass2) => {
    let k =0
    return pass1==pass2
}

module.exports = {
    getCredential: getCredential,
    verifyPassword: verifyPassword
}
