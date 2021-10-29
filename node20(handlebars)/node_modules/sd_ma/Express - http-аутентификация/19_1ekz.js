const app = require("express")();
const myauth = require('./19ekz');

app.use(myauth);
app.get('/', (req, res)=>{
res.send('hello');
});
app.listen (3000);