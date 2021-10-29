const express = require('express');
const bodyParser = require('body-parser');
const hbs = require('hbs');
const mainRouter = require('./main-router');

const app = express();
app.set('view engine', 'hbs');

hbs.registerPartials(`${__dirname}/views/partials`);

hbs.registerHelper('getList', (context) => context.map((item) => `
        <div class="ph-item" onclick="Change(this)">
          <span id="list-fio">${item.name}</span>
          <span id="list-number">${item.number}</span>
        </div>`).join('\n'));

app.set('views', './views');

app.use(express.static('./views/static'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/', mainRouter);

module.exports = app;
