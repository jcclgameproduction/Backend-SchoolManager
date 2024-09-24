const DataTypes = require("sequelize");

const db = require("../db/conn");

const Familiar = db.define("Familiar", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            required: true,
        },
        profession: {
            type: DataTypes.STRING,
            required: true,
        },
        cpf: {
            type: DataTypes.STRING,
            required: true,
        },
        email: {
            type: DataTypes.STRING,
            required: true,
        },
        phone: {
            type: DataTypes.STRING,
            required: true,
        }
    }, {
        tableName: "familiar",
    }
);

module.exports = Familiar;