'use strict';

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    //operação DDL a ser realizada sobre os objetos do banco
    await queryInterface.createTable("dashboard", {
      id_dashboard: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      ano_dashboard:{
        allowNull:false,
        type: DataTypes.STRING(20),
      },
      mes_dashboard:{
        allowNull:false,
        type: DataTypes.STRING(10),
      },
      toneladas_processadas:{
        allowNull:false,
        type: DataTypes.STRING(100),
      },
      imposto_abatido:{
        allowNull:false,
        type: DataTypes.STRING(100),
      },

    })
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("dashboard")
    
  }
};