'use strict';

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    //operação DDL a ser realizada sobre os objetos do banco
    await queryInterface.createTable("beneficiario", {
      id_recipient: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      nis_recipient:{
        allowNull:false,
        type: DataTypes.STRING(19),
      },
      email_recipient:{
        allowNull:false,
        type: DataTypes.STRING(100),
      }
    })
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("beneficiario")
    
  }
};