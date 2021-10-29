const UserController = require('../models/mainModel').users

module.exports = {
    getAllUsers: async (req, res) => {
        let users = await UserController.findAll();
            res.writeHead(200, {'Content-Type':'application/json'});
            res.end(JSON.stringify(users));
    },

    addUsers: async (req, res) =>{
        let data="";
        req.on('data', (chunk)=>data+=chunk);
        req.on('end', async ()=>{
            data = JSON.parse(data);

            let user = await UserController.findOne({where: {Id: data.Id}});
            if(user){
                res.status(500).send('Пользователя с таким кодом уже существует');
            }else{
                let newUser = await UserController.create({Id: `${data.Id}`, Name: `${data.userName}`});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(newUser));
            }
        });
    },

    editUser: async (req, res)=>{
        let data ="";
        req.on('data', (chunk)=>data+=chunk);
        req.on('end', async ()=>{
           data = JSON.parse(data);

           let user = await UserController.findOne({where: {Id: data.Id}});
           if(user){
               let editedUser = await UserController.update({ Name: `${data.userName}` }, { where: { Id: data.Id } });
               res.writeHead(200, {'Content-Type':'application/json'});
               res.end(JSON.stringify(editedUser));
           }
           else{
               res.status(500).send('Пользователя с таким кодом не существует');
           }
        });
    },

    deleteUser: async (req, res)=>{
        let data ="";
        req.on('data', (chunk)=>data+=chunk);
        req.on('end', async ()=>{
            data = JSON.parse(data);
            let user = await UserController.findOne({where: {ID: data.Id}});
            if(user){
                let deletedUser = await  UserController.destroy({where: {Id: `${data.Id}`}});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(deletedUser));
            }
            else{
                res.status(500).send('Пользователя с таким кодом не существует');
            }
        });
    }
}
