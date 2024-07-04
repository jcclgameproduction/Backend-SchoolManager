require('dotenv').config(); 
const { Sequelize } = require("sequelize");



const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT
});

try{
    sequelize.authenticate();
    console.log(`Conectado ao MySQL!`);
} catch(error){
    console.log(`Não foi possível conectar ao banco de dados: ${error}`);
}

module.exports = sequelize;