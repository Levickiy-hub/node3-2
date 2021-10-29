const app = require('express')();
const bodyParser = require('body-parser');
const Sequelize = require('sequelize');
const redis = require('redis');
const jwt = require('jsonwebtoken');
const {Ability, AbilityBuilder} = require('casl');
const cookieParser = require('cookie-parser');

const redisClient = redis.createClient('//redis-18666.c240.us-east-1-3.ec2.cloud.redislabs.com:18666', {password:'dXC8KnbhCDRM2VRccPvV1ur2Sy0FOTu9'});

const sequelize = new Sequelize('lab_24', 'root', '12345', {
    dialect: 'mysql',
    host: 'localhost',
    port: '3306',
    logging: false
});

const Model = Sequelize.Model;
class UsersCASL extends Model{}
UsersCASL.init (
    {
        id:	{type: Sequelize.INTEGER, autoIncrement: true, primaryKey:true},
        username: {type: Sequelize.STRING, allowNull:false},
        email: {type: Sequelize.STRING, allowNull:false},
        password: {type: Sequelize.STRING, allowNull:false},
        role: {type: Sequelize.STRING, allowNull:false}
    },
    {sequelize, Users:'UsersCASL', tableName:'UsersCASL'}
);

class Repos extends Model{}
Repos.init (
    {
        id: { type: Sequelize.INTEGER, autoIncrement: true, primaryKey: true },
        name: { type: Sequelize.STRING, allowNull: false },
        authorId: { type: Sequelize.INTEGER, allowNull: false }    
    },
    {sequelize, Users:'Repos', tableName:'Repos'}
);

class Commits extends Model{}
Commits.init (
    {
        id:	{type: Sequelize.INTEGER, autoIncrement: true, primaryKey:true},
        message: {type: Sequelize.STRING, allowNull:false},
        repoId:	{type: Sequelize.INTEGER, allowNull: false}
    },
    {sequelize, Users:'Commits', tableName:'Commits'}
);

UsersCASL.hasMany(Repos, {foreignKey: 'authorId'});
Repos.belongsTo(UsersCASL, {foreignKey: 'authorId'});

Repos.hasMany(Commits, {foreignKey: 'repoId'});
Commits.belongsTo(Repos, {foreignKey: 'repoId'});

const accessKey = 'my token key';
const refreshKey = 'my refresh key';
var oldRefreshKeyCount = 0;

app.use(cookieParser('my cookie key'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use((req, res, next) =>
{
    const {rules, can} = AbilityBuilder.extract();
    if (req.cookies.accessToken)
    {
        jwt.verify(req.cookies.accessToken, accessKey, (err, payload) =>
        {
            if (err) next();
            else if(payload)
            {
                req.payload = payload;
                if (req.payload.role === 'admin')
                {
                    can(['read', 'create', 'update'], ['Repos', 'Commits'], {authorId: req.payload.id});
                    can('read', 'UsersCASL', {id: req.payload.id});
                    can('manage', 'all');
                }
                if (req.payload.role === 'user')
                {
                    can(['read', 'create', 'update'], ['Repos', 'Commits'], {authorId: req.payload.id});
                    can('read', 'UsersCASL', {id: req.payload.id});
                }
            }
        });
    }
    else
    {
        req.payload = {id: 0};
        can('read', ['Repos', 'Commits'], {authorId: req.payload.id});

    }
    req.ability = new Ability(rules);
    next();
});

app.get('/login', (req, res) =>
{
    res.sendFile(__dirname + '/login.html');
});

app.get('/register', (req, res) =>
{
    res.sendFile(__dirname + '/register.html');
});

app.post('/login', async (req, res) =>
{
   const candidate = await UsersCASL.findOne({
       where:
       {
           username: req.body.username,
           password: req.body.password
       }
   });
   if (candidate)
   {
       const accessToken = jwt.sign({id: candidate.id, username: candidate.username, role: candidate.role}, accessKey, {expiresIn: 10 * 60});
       const refreshToken = jwt.sign({id: candidate.id, username: candidate.username, role: candidate.role}, refreshKey, {expiresIn: 24 * 60 * 60});
       res.cookie('accessToken', accessToken, {
           httpOnly: true,
           sameSite: 'strict'
       });
       res.cookie('refreshToken', refreshToken, {
           httpOnly: true,
           sameSite: 'strict'
       });
       res.redirect('/resource');
   }
   else
   {
       res.redirect('/login');
   }
});

app.post('/register', async (req, res) =>
{
   const candidate = await UsersCASL.findOne({
       where:
       {
           username: req.body.username
       }
   });
   if (candidate) res.redirect('/register');
   else
   {
       await UsersCASL.create({
           username: req.body.username,
           email: req.body.email,
           password: req.body.password,
           role: req.body.role
       });
       res.redirect('/login');
   }
});

app.get('/resource', (req, res) =>
{
    if (req.payload && req.payload.id !== 0) res.status(200).send(`Resource ${req.payload.id}-${req.payload.username}-${req.payload.role}`);
    else res.status(401).send('Non authorized');
});

app.get('/refresh-token', (req, res) =>
{
    if (req.cookies.refreshToken)
    {
        jwt.verify(req.cookies.refreshToken, refreshKey,async (err, payload) =>
        {
            if (err) console.log(err.message);
            else if(payload)
            {
                redisClient.on('ready', () => console.log('ready'));
                redisClient.on('error', (err) => console.log(`error: ${err}`));
                redisClient.on('connect', () => console.log('connect'));
                redisClient.on('end', () => console.log('end'));
                redisClient.set(oldRefreshKeyCount, req.cookies.refreshToken, () => console.log('set old refresh token'));
                redisClient.get(oldRefreshKeyCount, (err, result) => console.log('added old refresh token:', result));
                oldRefreshKeyCount++;
                redisClient.quit();
                const candidate = await UsersCASL.findOne({
                    where:
                    {
                        id: payload.id
                    }
                });
                const newAccessToken = jwt.sign({id: candidate.id, username: candidate.username, role: candidate.role}, accessKey, {expiresIn: 10 * 60});
                const newRefreshToken = jwt.sign({id: candidate.id, username: candidate.username, role: candidate.role}, refreshKey, {expiresIn: 24 * 60 * 60});
                res.cookie('accessToken', newAccessToken, {
                    httpOnly: true,
                    sameSite: 'strict'
                });
                res.cookie('refreshToken', newRefreshToken, {
                    path: '/refresh-token'
                });
                res.redirect('/resource');
            }
        });
    }
    else res.status(401).send('Please, authorize');
});

app.get('/logout', (req, res) =>
{
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.redirect('/login');
});

/////////////////////////////////////////////

app.get('/api/ability', (req, res) =>
{
   res.status(200).send(req.ability.rules);
});

app.get('/api/user', async (req, res) =>
{
    try
    {
        req.ability.throwUnlessCan('manage', 'all');
        const users = await UsersCASL.findAll({
            attributes: ['id', 'username', 'email', 'role']
        });
        res.status(200).json(users);
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
});

app.get('/api/user/:id', async (req, res) =>
{
   try
   {
       req.ability.throwUnlessCan('read', new UsersCASL({id: Number(req.params.id)}));
       const user = await UsersCASL.findOne({
           where:
           {
               id: req.params.id
           },
           attributes: ['id', 'username', 'email', 'role']
       });
       if (user) res.status(200).json(user);
       else res.status(404).send('User is not found');
   } catch(err) {
       res.status(500).send(err.message);
   }
});

app.get('/api/repos', async (req, res) =>
{
   try
   {
       req.ability.throwUnlessCan('manage', 'all');
       const repos = await Repos.findAll();
       res.status(200).json(repos);
   } catch(err) {
       res.status(500).send(err.message);
   }
});

app.get('/api/repos/:id', async (req,res) =>
{
    try
    {
        req.ability.throwUnlessCan('read', await Repos.findByPk(req.params.id));
        const repo = await Repos.findOne({
            where:
            {
                id: req.params.id
            }
        });
        if (repo) res.status(200).json(repo);
        else res.status(404).send('Repo is not found');
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
});

app.post('/api/repos', async (req, res) =>
{
    try
    {
        req.ability.throwUnlessCan('create', 'Repos');
        const repo = await Repos.create({
           name: req.body.name,
           authorId: req.payload.id
        });
        res.status(201).json(repo);
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
});

app.put('/api/repos/:id', async (req, res) =>
{
    try
    {
        req.ability.throwUnlessCan('update', await Repos.findByPk(req.params.id));
        await Repos.update({
            name: req.body.name
        }, {
            where:
            {
                id: req.params.id
            }
        });
        res.status(201).send('Repo is updated');
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
});

app.delete('/api/repos/:id', async (req, res) =>
{
    try
    {
        req.ability.throwUnlessCan('manage', 'all');
        await Repos.destroy({
            where:
            {
                id: req.params.id
            }
        });
        res.status(201).send('Repo is deleted');
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
});

app.get('/api/repos/:id/commits', async (req, res) =>
{
    try
    {
        req.ability.throwUnlessCan('read', await Repos.findByPk(req.params.id));
        const commits = await Commits.findAll({
           include:
           [{
               model: Repos,
               required: true,
               where:
               {
                   id: req.params.id
               },
               attributes: []
           }]
        });
        res.status(200).json(commits);
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
});

app.get('/api/repos/:id/commits/:commitId', async (req, res) =>
{
    try
    {
        req.ability.throwUnlessCan('read', await Repos.findByPk(req.params.id));
        const commit = await Commits.findOne({
            where:
                {
                id: req.params.commitId
            },
            include:
            [{
                model: Repos,
                required: true,
                where:
                {
                    id: req.params.id
                },
                attributes: []
            }]
        });
        if (commit) res.status(200).json(commit);
        else res.status(404).send('Commit is not found');
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
});

app.post('/api/repos/:id/commits', async (req, res) =>
{
    try
    {
        req.ability.throwUnlessCan('create', await Repos.findByPk(req.params.id));
        const commit = await Commits.create({
           message: req.body.message,
           repoId: req.params.id
        });
        res.status(201).send(commit);
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
});

app.put('/api/repos/:id/commits/:commitId', async (req, res) =>
{
    try
    {
        req.ability.throwUnlessCan('update', await Repos.findByPk(req.params.id));
        await Commits.update({
            message: req.body.message
        },{
            where:
            {
                id: req.params.commitId
            },
            include:
            [{
                model: Repos,
                required: true,
                where:
                {
                    id: req.params.id
                },
                attributes: []
            }]
        });
        res.status(200).send('Commit is updated');
    }
    catch(err)
    {
        res.status(500).send(err.message);
    }
});

app.delete('/api/repos/:id/commits/:commitId', async (req, res) =>
{
    try
    {
        req.ability.throwUnlessCan('manage', 'all');
        await Commits.destroy({
            where:
            {
                id: req.params.commitId
            },
            include: [{
                model: Repos,
                required: true,
                where:
                {
                    id: req.params.id
                },
                attributes: []
            }]
        });
        res.status(200).send('Commit is deleted');
    } catch(err) {
        res.status(500).send(err.message);
    }
});

//Incorrect URL
/*app.use((req, res, next) =>
{
   res.status(404).send('Incorrect Method or URL');
});*/

sequelize.sync().then(() =>
{
    app.listen(3000, () => console.log("Server is running on http://localhost:3000/"));
}).catch(error => console.log(error));