'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Address', {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      allowNull: false,
      primaryKey: true
    },
    street: {
      type: Sequelize.DataTypes.STRING,
      required: true,
    },
    city: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    block: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    lot: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    sector: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    number: {
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
    return queryInterface.dropTable('Address');
  },
};