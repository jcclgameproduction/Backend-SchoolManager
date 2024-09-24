const DataTypes = require("sequelize");

const db = require("../db/conn");

const InvalidToken = db.define('InvalidToken', {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        }
    },  {
        tableName: "invalidtoken",
    }
);

module.exports = InvalidToken;