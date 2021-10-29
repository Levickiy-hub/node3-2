const http = require('http');
const url = require('url');
const fs = require('fs');
const httpStatus = require('http-status');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('nodeJs', 'root', '12345', {
    dialect: 'mysql',
    host: 'localhost',
    port: '3306',
    logging: false
});
const {Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium} = require('./Module').ORM(sequelize);
Faculty.hasMany(Pulpit, {as:'faculty_pulpits', foreignKey:'faculty', sourceKey: 'faculty'});
Pulpit.hasMany(Teacher, {as:'pulpit_teachers', foreignKey:'pulpit', sourceKey: 'pulpit'});


const server = http.createServer();
const connection = sequelize.authenticate();
const notFound = (res) => {
    res.statusCode = 404;
    res.end(httpStatus['404_MESSAGE']);
};

const GET_HANDLER = (req, res) =>{
    if(url.parse(req.url, true).pathname === '/'){
        fs.readFile('./index.html', 'utf-8', (err, data)=>{
            res.writeHead(200, {'Content-Type':'text/html'});
            res.end(data);
        })
    }
    else if(url.parse(req.url, true).pathname.split("/")[1] === 'transaction'){
        connection
            .then(() => {
                console.log('Connection successful');
                return sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED})
                    .then((t) =>{
                        return Faculty.create({faculty: 'FIT', faculty_name: 'TEST_TRANSACTION'}, {transaction: t})
                            .then((r)=>{
                                return Pulpit.create({pulpit: 'PFIT', pulpit_name: 'TEST_TRANSACTION', faculty:'FIT'}, {transaction: t});
                            })
                            .then((r)=>{
                                // Faculty.findAll().then(Faculty => PrintInfo(Faculty));
                                // Pulpit.findAll().then(Pulpit => PrintInfo(Pulpit));
                                setTimeout(()=>{
                                    console.log('--rollback');
                                    return t.rollback();
                                }, 10000);
                            })
                            .catch((e) =>{console.log("-- Error rollback", e.name); return t.rollback();
                            });
                    });

            });
    }
    else if(url.parse(req.url, true).pathname.split("/")[1] === 'api'){
        if(url.parse(req.url, true).pathname.split("/")[2]==='auditoriumsgt60'){
            connection.then(()=>{
                Auditorium.scope('largeAuditorium').findAll().then(Auditorium => {
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify(Auditorium));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='faculties'){
            if(!url.parse(req.url, true).pathname.split("/")[3]){
                connection.then(()=>{
                    Faculty.findAll({attributes:[['faculty', 'Факультет'],['faculty_name', 'Наименование факультета']]}).then(Faculty => {
                        res.writeHead(200, {'Content-Type':'application/json'});
                        res.end(JSON.stringify(Faculty));
                    });
                });
            }
            else {
                if(url.parse(req.url, true).pathname.split("/")[4]==='pulpits'){
                    let code = decodeURIComponent(url.parse(req.url, true).pathname.split("/")[3]);
                    console.log(code);
                    connection.then(()=>{
                        Faculty.findAll({where:{faculty: `${code}`}, include:[{model: Pulpit, as:'faculty_pulpits', required: true}]} ).then(faculty => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(faculty));
                        });
                    });
                }
                //----------------------------------------------------------------------------------------------
                else if(url.parse(req.url, true).pathname.split("/")[4]==='teachers'){
                    let code = decodeURIComponent(url.parse(req.url, true).pathname.split("/")[3]);
                    connection.then( async ()=>{
                        Faculty.findAll({attributes: ['faculty'], where: {faculty : `${code}`}, include: [
                                {
                                    model: Pulpit, as:'faculty_pulpits', required: true, attributes: ['pulpit'],
                                    include: {model: Teacher, as: 'pulpit_teachers', required: true, attributes: ['teacher_name'] }
                                },
                            ]
                        }).then((faculty)=>{
                            res.writeHead(200,{'Content_Type':'application/json'});
                            res.end(JSON.stringify(faculty));
                        })

                    });
                }
                //----------------------------------------------------------------------------------------------
                else notFound(res);
            }

        }

        else if(url.parse(req.url, true).pathname.split("/")[2]==='pulpits'){
            connection.then(()=>{
                Pulpit.findAll().then(Pulpit => {
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify(Pulpit));
                });
            })
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='subjects'){
            connection.then(()=>{
                Subject.findAll({attributes:[['subject', 'Предмет'],['subject_name', 'Наименование предмета'], ['pulpit', 'Кафедра']]}).then(Subject => {
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify(Subject));
                });
            })
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='auditoriumstypes'){
            connection.then(()=>{
                Auditorium_type.findAll({attributes:[['auditorium_type', 'Тип аудитории'],['auditorium_typename', 'Наименование типа аудитории']]}).then(Auditorium_type => {
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify(Auditorium_type));
                });
            })
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='auditoriums'){
            connection.then(()=>{
                Auditorium.findAll({attributes:[['auditorium', 'Аудитория'],['auditorium_name', 'Наименование аудитории'], ['auditorium_capacity', 'Вместимость аудитории'], ['auditorium_type', 'Тип аудитории']]}).then(Auditorium => {
                    res.writeHead(200, {'Content-Type':'application/json'});
                    res.end(JSON.stringify(Auditorium));
                });
            })
        }
        else notFound(res);
    }
    else notFound(res);
}

const POST_HANDLER = (req, res) =>{
    if(url.parse(req.url, true).pathname.split("/")[1] === 'api'){
        if(url.parse(req.url, true).pathname.split("/")[2]==='faculties'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                Faculty.create({faculty: `${data.faculty}`, faculty_name: `${data.faculty_name}`})
                    .then(newFaculty => {
                        res.writeHead(200, {'Content-Type':'application/json'});
                        res.end(JSON.stringify(newFaculty));
                    })
                    .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='pulpits'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Pulpit.create({pulpit: `${data.pulpit}`, pulpit_name: `${data.pulpit_name}`, faculty: `${data.faculty}`})
                        .then(newPulpit => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(newPulpit));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='subjects'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Subject.create({subject: `${data.subject}`, subject_name: `${data.subject_name}`, pulpit: `${data.pulpit}`})
                        .then(newSubject => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(newSubject));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='auditoriumstypes'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Auditorium_type.create({ auditorium_type: `${data.auditorium_type}`,  auditorium_typename: `${data.auditorium_typename}`})
                        .then(newAuditoriumType => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(newAuditoriumType));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='auditoriums'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Auditorium.create({ auditorium: `${data.auditorium}`,  auditorium_name: `${data.auditorium_name}`,  auditorium_capacity: `${data.auditorium_capacity}`, auditorium_type: `${data.auditorium_type}` })
                        .then(newAuditorium => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(newAuditorium));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else notFound(res);
    }
}


const PUT_HANDLER = (req, res) =>{
    if(url.parse(req.url, true).pathname.split("/")[1] === 'api'){
        if(url.parse(req.url, true).pathname.split("/")[2]==='faculties'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Faculty.update({faculty_name: `${data.faculty_name}`}, {where: {faculty: `${data.faculty}`}})
                        .then(newFaculty => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(newFaculty));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='pulpits'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Pulpit.update({pulpit_name: `${data.pulpit_name}`}, {where: {pulpit: `${data.pulpit}`}})
                        .then(newPulpit => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(newPulpit));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='subjects'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Subject.update({subject_name: `${data.subject_name}`, pulpit: `${data.pulpit}`}, {where: {subject: `${data.subject}`}})
                        .then(newSubject => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(newSubject));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='auditoriumstypes'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Auditorium_type.update({auditorium_typename: `${data.auditorium_typename}`}, {where: {auditorium_type: `${data.auditorium_type}`}})
                        .then(newAuditoriumType => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(newAuditoriumType));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='auditoriums'){
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Auditorium.update({ auditorium_name: `${data.auditorium_name}`,  auditorium_capacity: `${data.auditorium_capacity}`}, {where: {auditorium: `${data.auditorium}`}})
                        .then(newAuditorium => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(newAuditorium));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else notFound(res);
    }
}


const DELETE_HANDLER = (req, res) =>{
    if(url.parse(req.url, true).pathname.split("/")[1] === 'api'){
        if(url.parse(req.url, true).pathname.split("/")[2]==='faculties'){
            let code = url.parse(req.url, true).pathname.split("/")[3];
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Faculty.destroy({where: {faculty: `${code}`}})
                        .then(destroyFaculty => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(destroyFaculty));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='pulpits'){
            let code = url.parse(req.url, true).pathname.split("/")[3];
                connection.then(()=>{
                    Pulpit.destroy({where: {pulpit: `${code}`}})
                        .then(destroyPulpit => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(destroyPulpit));
                        })
                        .catch(err => console.log('Error', err.message));
                });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='subjects'){
            let code = url.parse(req.url, true).pathname.split("/")[3];
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Subject.destroy({where: {subject: `${code}`}})
                        .then(destroySubject => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(destroySubject));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='auditoriumstypes'){
            let code = url.parse(req.url, true).pathname.split("/")[3];
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Auditorium_type.destroy({where: {auditorium_type: `${code}`}})
                        .then(destroyAuditoriumType => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(destroyAuditoriumType));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else if(url.parse(req.url, true).pathname.split("/")[2]==='auditoriums'){
            let code = url.parse(req.url, true).pathname.split("/")[3];
            let data="";
            req.on('data', (chunk)=>data+=chunk);
            req.on('end', ()=>{
                data = JSON.parse(data);
                connection.then(()=>{
                    Auditorium.destroy({where: {auditorium: `${code}`}})
                        .then(destroyAuditorium => {
                            res.writeHead(200, {'Content-Type':'application/json'});
                            res.end(JSON.stringify(destroyAuditorium));
                        })
                        .catch(err => console.log('Error', err.message));
                });
            });
        }
        else notFound(res);
    }
}

let handler = (req, res)=>{
    switch (req.method){
        case 'GET':
            GET_HANDLER(req, res);
            break;
        case 'POST':
            POST_HANDLER(req, res);
            break;
        case 'PUT':
            PUT_HANDLER(req, res);
            break;
        case 'DELETE':
            DELETE_HANDLER(req, res);
            break;
    }
}

server.on('request', handler);
server.listen(3000);

