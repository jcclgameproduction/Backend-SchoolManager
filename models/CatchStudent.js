const DataTypes = require("sequelize");

const db = require("../db/conn");
const Familiar = require("./Familiar");
const Student = require("./Student");

const CatchStudent = db.define("CatchStudent", {
});

CatchStudent.belongsTo(Student, { foreignKey: 'idStudent', as: 'student' });
CatchStudent.belongsTo(Familiar, { foreignKey: 'idFamiliar', as: 'familiar' });


module.exports = CatchStudent;