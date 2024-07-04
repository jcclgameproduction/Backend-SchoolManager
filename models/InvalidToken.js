const DataTypes = require("sequelize");

const db = require("../db/conn");

const InvalidToken = db.define('InvalidToken', {
    token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
    }
});

module.exports = InvalidToken;