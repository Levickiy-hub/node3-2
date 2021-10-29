const express = require('express');
const userRoute = require('./app/routes/index')();

const app = express();
const PORT = 3000;

app.use(express.json())
app.use('/api', userRoute);
app.listen(PORT, () => console.log('READY'));
