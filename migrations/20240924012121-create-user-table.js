'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('User', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
      type: Sequelize.DataTypes.STRING,
      required: true,
    },
    cpf: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
      email: {
        type: Sequelize.DataTypes.STRING,
        required: true,
        unique: true,
      },
      password: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    createdAt : Sequelize.DATE,
    updatedAt : Sequelize.DATE,
    },
    {
      charset: 'utf8mb4',
      collate: 'utf8mb4_general_ci'
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('User');
  },
};