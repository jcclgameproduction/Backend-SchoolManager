const DataTypes = require("sequelize");

const db = require("../db/conn");

const User = db.define("User", {
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
        cpf: {
            type: DataTypes.STRING,
            required: true,
        },
        email: {
            type: DataTypes.STRING,
            required: true,
            unique: true,
        },
        password: {
            type: DataTypes.STRING,
            required: true,
        }
    }, {
        tableName: "user",
    }
);

module.exports = User;