const http = require('http');
const Sequelize = require('sequelize');
const sequelize = new Sequelize('nodeJs', 'root', '12345', {
    dialect: 'mysql',
    host: 'localhost',
    port: '3307',
    logging: false
});
const {Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium} = require('./Module').ORM(sequelize);

function PrintInfo(table){
    let k=0;
    console.log('-------------------------------------------------');
    table.forEach(el =>{console.log(++k, el.dataValues);});

}
const connection = sequelize.authenticate();
connection
    .then(() => {
        console.log('Connection successful');
        //Faculty.findAll({attributes:[['faculty', 'Факультет'],['faculty_name', 'Наименование факультета']]}).then(Faculty => PrintInfo(Faculty));
        // Pulpit.findAll({attributes:[[Sequelize.fn('COUNT', Sequelize.col('pulpit')), 'Кол-во кафедр']]}).then(Pulpit => PrintInfo(Pulpit));
        // Teacher.findAll({where:{teacher:'УРБ'}, attributes:[['teacher_name', 'Преподаватель'],['pulpit', 'Кафедра']]}).then(Teacher => PrintInfo(Teacher));
        // Teacher.findAll( {where: {[Sequelize.Op.or]:[{pulpit:'ИСиТ'},{pulpit: 'ЛВ'}]}, attributes:[['teacher_name', 'Преподаватель'],['pulpit', 'Кафедра']]}).then(Teacher => PrintInfo(Teacher));
        // Subject.findAll({order:[['subject', 'DESC'],['subject_name', 'ASC']]}).then(Subject => PrintInfo(Subject));
        // Auditorium_type.findAll().then(Auditorium_type => PrintInfo(Auditorium_type));
        // Auditorium.findAll({where:{auditorium_capacity:{[Sequelize.Op.and]: [{[Sequelize.Op.gt]:30}, {[Sequelize.Op.lt]:90}]}}}).then(Auditorium => PrintInfo(Auditorium));
        // Auditorium.findAll({attributes:[['auditorium_type', 'Тип аудитории'],[Sequelize.fn('sum', Sequelize.col('auditorium_capacity')), 'Суммарная вместимость']], group:['auditorium_type']}).then(Auditorium => PrintInfo(Auditorium));


        // Pulpit.findAll().then(Pulpit => PrintInfo(Pulpit));
        // Faculty.findAll().then(Faculty => PrintInfo(Faculty));


        Faculty.hasMany(Pulpit, {as:'faculty_pulpits', foreignKey:'faculty', sourceKey: 'faculty'})
        Faculty.findAll({where:{faculty:'ЛХФ'}, include:[{model: Pulpit, as:'faculty_pulpits', required: true}]} ).then(p => {
            p.forEach(el =>{
                console.log(el.dataValues.faculty, el.dataValues.faculty_name);
                el.dataValues.faculty_pulpits.forEach(elp =>{
                    console.log('--', elp.dataValues.pulpit, elp.dataValues.pulpit_name);
                });
        })});


        // Faculty.create({faculty: 'ИТT', faculty_name: 'Информационных технологий технологий'})
        //     .then(newFaculty => console.log(newFaculty.dataValues))
        //     .catch(err => console.log('Error', err.message));
        // Faculty.findAll().then(Faculty => PrintInfo(Faculty));


        // Faculty.update({faculty_name: 'TEST'}, {where: {faculty: 'ИТT'}})
        //     .then(newFaculty => console.log('Result: ', newFaculty))
        //     .catch(err => console.log('Error', err.message));


        // Faculty.destroy({where: {faculty: 'ИТT'}})
        //     .then(newFaculty => console.log('Result: ', newFaculty))
        //     .catch(err => console.log('Error', err.message));


        //Auditorium.findAll().then(Auditorium => PrintInfo(Auditorium));
        // let auditorium =
        //Auditorium.scope('largeAuditorium').findAll().then(Auditorium => PrintInfo(Auditorium));
        // auditorium.forEach(el =>{
        //     console.log(el.dataValues);
        // })

        // Faculty.create({faculty: 'ИТT', faculty_name: 'Информационных технологий технологий'})
        //     .then(newFaculty => console.log(newFaculty.dataValues))
        //     .catch(err => console.log('Error', err.message));
        // Faculty.findAll().then(Faculty => PrintInfo(Faculty));

        // Faculty.findAll().then(Faculty => PrintInfo(Faculty));
        // Pulpit.findAll().then(Pulpit => PrintInfo(Pulpit));
        // Pulpit.destroy({where: {pulpit: 'ПИ'}})
        //     .then(newPulpit => console.log('Result: ', newPulpit))
        //     .catch(err => console.log('Error', err.message));
        // Faculty.destroy({where: {faculty: 'ИТТ'}})
        //     .then(newFaculty => console.log('Result: ', newFaculty))
        //     .catch(err => console.log('Error', err.message));
        //setTimeout(()=>{sequelize.close()}, 5000);

        // return sequelize.transaction({isolationLevel: Sequelize.Transaction.ISOLATION_LEVELS.READ_COMMITTED})
        //     .then((t) =>{
        //         return Faculty.create({faculty: 'ИТТ', faculty_name: 'Информационных технологий технологий'}, {transaction: t})
        //             .then((r)=>{
        //                 return Pulpit.create({pulpit: 'ПИ', pulpit_name: 'Программной инженерии', faculty:'ИТТ'}, {transaction: t});
        //             })
        //             .then((r)=>{
        //                 // Faculty.findAll().then(Faculty => PrintInfo(Faculty));
        //                 // Pulpit.findAll().then(Pulpit => PrintInfo(Pulpit));
        //                 setTimeout(()=>{
        //                     console.log('--rollback');
        //                     return t.rollback();
        //                 }, 10000);
        //             })
        //             .catch((e) =>{console.log("-- Error rollback", e.name); return t.rollback();
        //             });
        //     })
    })

    .catch((err) => {
        console.log('Unable to connect to database', err);
    });

