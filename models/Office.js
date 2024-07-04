const DataTypes = require("sequelize");

const db = require("../db/conn");

const Office = db.define("Office", {
    name: {
        type: DataTypes.STRING,
        required: true,
    }
});

module.exports = Office;