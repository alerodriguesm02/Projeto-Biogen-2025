'use strict';

const { DataTypes } = require("sequelize");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    //operação DDL a ser realizada sobre os objetos do banco
    await queryInterface.createTable("fornecedor", {
      id_supplier: {
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        type: DataTypes.INTEGER,
      },
      cnpj_supplier:{
        allowNull:false,
        type: DataTypes.STRING(19),
      },
      razao_supplier:{
        allowNull:false,
        type: DataTypes.STRING(100),
      },
      cep_supplier:{
        allowNull:false,
        type: DataTypes.STRING(9),
      },
      endereco_supplier:{
        allowNull:false,
        type: DataTypes.STRING(100),
      },
      numero_supplier:{
        allowNull:false,
        type: DataTypes.STRING(10),
      },
      email_supplier:{
        allowNull:false,
        type: DataTypes.STRING(100),
      },
      senha_supplier:{
        allowNull:false,
        type: DataTypes.STRING(10),
      }
    })
  },
  
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("fornecedor")
    
  }
};


