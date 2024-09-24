'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('CatchStudent', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      idFamiliar: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'familiar'
          },
          key: 'id'
        },
      allowNull: false,
      comment: 'familiar'
    },
    idStudent: {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'student'
        },
        key: 'id'
      },
      allowNull: false,
      comment: 'student'
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
    return queryInterface.dropTable('CatchStudent');
  },
};