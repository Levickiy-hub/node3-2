const HouseController = require('../models/mainModel').houses

module.exports = {
    getAllHouse: async (req, res) => {
        let house = await HouseController.findAll();
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(house));
    },

    addHouse: async (req, res) =>{
        let data="";
        req.on('data', (chunk)=>data+=chunk);
        req.on('end', async ()=>{
            data = JSON.parse(data);

            let house = await HouseController.findOne({where: {Id: data.Id}});
            if(house){
                res.status(500).send('Сообщение с таким кодом уже существует');
            } else {
                let newhouse = await HouseController.create({ Id: `${data.Id}`, address: `${data.address}`, price: `${data.price}`, busy: 0, info: `${data.info}`, Id_owner: `${data.Id_owner}` });
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(newhouse));
            }
        });
    },

    editHouse: async (req, res)=>{
        let data ="";
        req.on('data', (chunk)=>data+=chunk);
        req.on('end', async ()=>{
            data = JSON.parse(data);

            let house = await HouseController.findOne({where: {Id: data.Id}});
            if(house){
                let editedhouse = await HouseController.update({ address: `${data.adress}`, price: `${data.price}`, busy: 0, info: `${data.info}`, Id_owner: `${data.Id_owner}` }, {where: {Id: `${data.Id}`}});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(editedhouse));
            }
            else{
                res.status(500).send('Сообщения с таким кодом не существует');
            }
        });
    },

    deleteHouse: async (req, res)=>{
        let data ="";
        req.on('data', (chunk)=>data+=chunk);
        req.on('end', async ()=>{
            data = JSON.parse(data);
            let house = await HouseController.findOne({where: {Id: data.Id}});
            if(house){
                let deletedhouse = await  HouseController.destroy({where: {Id: `${data.Id}`}});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(deletedhouse));
            }
            else{
                res.status(500).send('Сообщения с таким кодом не существует');
            }
        });
    }
}

