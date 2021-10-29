const express = require('express');
const userRoute = require('./app/routes/index')();
const ORM = require('./app/db/index');

const app = express();
const PORT = 3000;

app.use(express.json())
app.use('/api', userRoute);

ORM.sequelize.sync()
    .then(() => {
        app.listen(PORT, () => console.log('READY'));
    })
    .catch((err) => {
        console.log('SYNC ERROR');
})
