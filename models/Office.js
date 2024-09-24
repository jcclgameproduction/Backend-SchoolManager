const DataTypes = require("sequelize");

const db = require("../db/conn");

const Office = db.define("Office", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            allowNull: false,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            required: true,
        }
    }, {
        tableName: "office",
    }
);

module.exports = Office;