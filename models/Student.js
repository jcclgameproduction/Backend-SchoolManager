const DataTypes = require("sequelize");

const db = require("../db/conn");
const Familiar = require("../models/Familiar");
const Address = require("./Address");

const Student = db.define("Student", {
        enrollment: {
            type: DataTypes.STRING,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            required: true,
        },
        birthDate: {
            type: DataTypes.STRING,
            required: true,
        },
        naturalness: {
            type: DataTypes.STRING,
            required: true,
        },
        monthlyPayment: {
            type: DataTypes.STRING,
            required: true,
        },
        healthCare: {
            type: DataTypes.STRING,
            required: true,
        }
    }, {
        tableName: "student",
    }
);

Student.belongsTo(Familiar, { foreignKey: 'idMother', as: 'mother' });
Student.belongsTo(Familiar, { foreignKey: 'idFather', as: 'father' });
Student.belongsTo(Familiar, { foreignKey: 'idResponsible', as: 'responsible' });
Student.belongsTo(Familiar, { foreignKey: 'idEmergencyContact', as: 'emergencyContact' });
Student.belongsTo(Address, { foreignKey: 'idAddress', as: 'address' });

module.exports = Student;