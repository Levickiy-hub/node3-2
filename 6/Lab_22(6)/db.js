const Sequelize = require('sequelize');

const sequelize =  new Sequelize('node_js', 'root', '12345', {
  dialect: 'mysql',
  host: 'localhost',
  port: '3306',
  define: {
    timestamps: false
  },
  pool:{
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

const User = sequelize.define('user',{
  id:{
    type: Sequelize.INTEGER,
    autoIncrement: true,
    primaryKey: true,
    allowNull: false
  },
  login:{
    type: Sequelize.STRING,
    allowNull: false
  },
  password:{
    type: Sequelize.STRING,
    allowNull: false
  },
  age:{
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

async function getUser(user){
  let res = await User.findAll({where:{login:user.login,password:user.password}})
  return res;
}

async function createUser(user){
  console.log('DB create user: ',user);
  let res =await User.create(user);
  return res;
}

sequelize.sync({force: true}).then(result=>{ }).catch(err=> console.log(err));

module.exports.getUser = getUser;
module.exports.createUser = createUser;
