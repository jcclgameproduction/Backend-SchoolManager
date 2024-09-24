'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('UserOffice', {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
      },
      idUser: {
        type: Sequelize.DataTypes.INTEGER,
        references: {
          model: {
            tableName: 'user'
          },
          key: 'id'
        },
      allowNull: false,
      comment: 'user'
    },
    idOffice: {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'office'
        },
        key: 'id'
      },
      allowNull: false,
      comment: 'office'
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
    return queryInterface.dropTable('UserOffice');
  },
};