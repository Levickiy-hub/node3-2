const router = require('express').Router();
const db = require('./db/db');

router.route('/').get((req, res) => {
  res.render('index', {
    layout: null,
    list: db.findAll(),
    mainButtons: true,
  });
});

router.route('/Add').get((req, res) => {
  res.render('index', {
    layout: null,
    list: db.findAll(),
    updateField: true,
    addButtons: true,
  });
});

router.route('/Update').get((req, res) => {
  res.render('index', {
    layout: null,
    list: db.findAll(),
    updateField: true,
    updateButtons: true,
  });
});

router.route('/Add').post((req, res) => {
  console.log('add');

  db.Add(req.body);

  res.render('index', {
    layout: null,
    list: db.findAll(),
    updateField: true,
    addButtons: true,
  });
});

router.route('/Update').post(async (req, res) => {
  console.log('update');

  await db.Update(req.body);
  console.log('update end router');
  res.render('index', {
    layout: null,
    updateField: true,
    list: db.findAll(),
    updateButtons: true,
  });
});

router.route('/Delete').post((req, res) => {
  console.log('del');

  db.Delete(req.body.number);

  res.render('index', {
    layout: null,
    updateField: true,
    list: db.findAll(),
    updateButtons: true,
  });
});

module.exports = router;
