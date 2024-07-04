const DataTypes = require("sequelize");

const db = require("../db/conn");

const Address = db.define("Address", {
    street: {
        type: DataTypes.STRING,
        required: true,
    },
    city: {
        type: DataTypes.STRING,
        required: true,
    },
    block: {
        type: DataTypes.STRING,
        required: true,
    },
    lot: {
        type: DataTypes.STRING,
        required: true,
    },
    sector: {
        type: DataTypes.STRING,
        required: true,
    },
    number: {
        type: DataTypes.STRING,
        required: true,
    }
});

module.exports = Address;