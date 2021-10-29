const express = require('express');
const bodyParser = require('body-parser');


const userRoutes = require('./routes/userRoute')();
const historyRoutes = require('./routes/historyRoute')();
const houseRoutes = require('./routes/houseRoute')();
let app = express();


app.use(bodyParser.urlencoded({extended: false}))
app.use('/user/', userRoutes);
app.use('/history/', historyRoutes);
app.use('/house/', houseRoutes);
app.use((err, req, res, next) =>{
    res.status(500).send(err);
})

app.listen(3000, ()=> console.log('Server running at port 3000'));
