'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Student', {
    enrollment: {
      type: Sequelize.DataTypes.STRING,
      primaryKey: true
    },
    name: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    birthDate: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    naturalness: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    monthlyPayment: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    healthCare: {
        type: Sequelize.DataTypes.STRING,
        required: true,
    },
    idMother: {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'familiar'
        },
        key: 'id'
      },
      allowNull: false,
      comment: 'mother'
    },
    idFather: {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'familiar'
        },
        key: 'id'
      },
      allowNull: false,
      comment: 'father'
    },
    idResponsible: {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'familiar'
        },
        key: 'id'
      },
      allowNull: false,
      comment: 'responsible'
    },
    idEmergencyContact: {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'familiar'
        },
        key: 'id'
      },
      allowNull: false,
      comment: 'emergencyContact'
    },
    idAddress: {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: {
          tableName: 'address'
        },
        key: 'id'
      },
      allowNull: false,
      comment: 'address'
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
    return queryInterface.dropTable('Student');
  },
};