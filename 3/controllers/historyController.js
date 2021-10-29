const HistoryController = require('../models/mainModel').histories

module.exports = {
    getAllHistory: async (req, res) => {
        let History = await HistoryController.findAll();
        res.writeHead(200, {'Content-Type':'application/json'});
        res.end(JSON.stringify(History));
    },

    addHistory: async (req, res) =>{
        let data="";
        req.on('data', (chunk)=>data+=chunk);
        req.on('end', async ()=>{
            data = JSON.parse(data);

            let History = await HistoryController.findOne({where: {Id: data.Id}});
            if(History){
                res.status(500).send('Такого диалога с таким кодом уже существует');
            }else{
                let newHistory = await HistoryController.create({ Id: `${data.Id}`, id_house: `${data.id_house}`, id_client: `${data.id_client}`, check_in: `${data.check_in}`, Eviction: `${data.Eviction}`})
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(newHistory));
            }
        });
    },

    editHistory: async (req, res)=>{
        let data ="";
        req.on('data', (chunk)=>data+=chunk);
        req.on('end', async ()=>{
            data = JSON.parse(data);

            let History = await HistoryController.findOne({where: {Id: data.Id}});
            if (History) {
                let editedHistory = await HistoryController.update({ id_house: `${data.id_house}`, id_client: `${data.id_client}`, check_in: `${data.check_in}`, Eviction: `${data.Eviction}` }, { where: { Id: `${data.Id}` } });
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(editedHistory));
            }
            else{
                res.status(500).send('Диалога с таким кодом не существует');
            }
        });
    },

    deleteHistory: async (req, res)=>{
        let data ="";
        req.on('data', (chunk)=>data+=chunk);
        req.on('end', async ()=>{
            data = JSON.parse(data);
            let History = await HistoryController.findOne({where: {Id: data.Id}});
            if(History){
                let deletedHistory = await  HistoryController.destroy({where: {Id: `${data.Id}`}});
                res.writeHead(200, {'Content-Type':'application/json'});
                res.end(JSON.stringify(deletedHistory));
            }
            else{
                res.status(500).send('Диалога с таким кодом не существует');
            }
        });
    }
}
