// Importação da biblioteca express
import express from "express";

import supplierRoutes from "./src/routes/supplier.routes";

//import  express  from "express";
// Importação da biblioteca express
const Iexpress = require("express");

// Criação da aplicação
const app = express();

// Configura a aplicação para receber JSON no corpo das requisições
app.use(Iexpress.json());
app.use("/client", supplierRoutes);
/**
 * Inicia aplicação na Porta 3000
 *  */
app.listen(3000, () => {
  console.log("Servidor executando na Porta 3000");
});
