'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('InvalidToken', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      token: {
          type: Sequelize.DataTypes.STRING,
          allowNull: false,
          unique: true
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
    return queryInterface.dropTable('InvalidToken');
  },
};