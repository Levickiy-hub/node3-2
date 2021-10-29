const Sequelize = require('sequelize');
const Model = Sequelize.Model;

class Faculty extends Model{}
class Pulpit extends Model{}
class Teacher extends Model{}
class Subject extends Model{}
class Auditorium_type extends Model{}
class Auditorium extends Model{}

function internalORM(sequelize){

    Faculty.init({
        faculty: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
        faculty_name: {type: Sequelize.STRING, allowNull: false}
    },{
        hooks:{
            beforeCreate: (attributes, options) => {console.log('======== Local Faculty BeforeHook ========');},
            afterCreate: (attributes, options) => { console.log(`======== Local AfterHook, ${attributes.dataValues.faculty} faculty successfully added ========`);}
        },
        sequelize,
        modelName: 'Faculty',
        tableName: 'Faculty',
        timestamps: false
    });

    Pulpit.init({
        pulpit: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
        pulpit_name: {type: Sequelize.STRING, allowNull: false},
        faculty: {type: Sequelize.STRING, allowNull: false, references: {model: Faculty, key: 'faculty'}}
    },{
        hooks:{
            beforeCreate: (attributes, options) => {console.log('======== Local Pulpit  BeforeHook ========');},
            afterCreate: (attributes, options) => { console.log(`======== Local AfterHook, ${attributes.dataValues.faculty} pulpit successfully added ========`);}
        },
        sequelize,
        modelName: 'Pulpit',
        tableName: 'Pulpit',
        timestamps: false
    });

    Teacher.init({
        teacher: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
        teacher_name: {type: Sequelize.STRING, allowNull: false},
        pulpit: {type: Sequelize.STRING, allowNull: false, references: {model: Pulpit, key: 'pulpit'}}
    },{
        sequelize,
        modelName: 'Teacher',
        tableName: 'teacher',
        timestamps: false
    });

    Subject.init({
        subject: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
        subject_name: {type: Sequelize.STRING, allowNull: false},
        pulpit: {type: Sequelize.STRING, allowNull: false, references: {model: Pulpit, key: 'pulpit'}}
    },{
        sequelize,
        modelName: 'Subject',
        tableName: 'Subject',
        timestamps: false
    });

    Auditorium_type.init({
        auditorium_type: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
        auditorium_typename: {type: Sequelize.STRING, allowNull: false},
    },{
        sequelize,
        modelName: 'Auditorium_type',
        tableName: 'Auditorium_type',
        timestamps: false
    });

    Auditorium.init({
        auditorium: {type: Sequelize.STRING, allowNull: false, primaryKey: true},
        auditorium_name: {type: Sequelize.STRING, allowNull: false},
        auditorium_capacity: {type: Sequelize.INTEGER, allowNull: false},
        auditorium_type: {type: Sequelize.STRING, allowNull: false, references: {model: Auditorium_type, key: 'auditorium'}}
    },{
        scopes: {
            largeAuditorium: {
                where: {
                    auditorium_capacity: {[Sequelize.Op.gt]: 60}
                }
            }
        },
        sequelize,
        modelName: 'Auditorium',
        tableName: 'Auditorium',
        timestamps: false
    });

}

exports.ORM = (s)=>{internalORM(s); return {Faculty, Pulpit, Teacher, Subject, Auditorium_type, Auditorium};}
