const DataTypes = require("sequelize");
const User = require("./User");
const Office = require("./Office");

const db = require("../db/conn");

const UserOffice = db.define("UserOffice", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
    },  {
        tableName: "useroffice",
    }
);

UserOffice.belongsTo(User, { foreignKey: 'idUser', as: 'user' });
UserOffice.belongsTo(Office, { foreignKey: 'idOffice', as: 'office' });

module.exports = UserOffice;