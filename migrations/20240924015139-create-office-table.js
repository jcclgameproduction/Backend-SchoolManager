'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Office', {
    id: {
      type: Sequelize.DataTypes.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    name: {
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
    return queryInterface.dropTable('Office');
  },
};