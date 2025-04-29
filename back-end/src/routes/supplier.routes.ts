import express from "express";
import { Request, Response } from "express";
import { ISuppliersList } from "../../ISupplier";
import { listSuppliers, updateSupplier, deleteSupplier } from "../controllers/supplier.controller";
import { newSupplier } from "../controllers/supplier.controller";

const router = express.Router();

//Listar fornecedores

router.get("/", (req: Request, res: Response) => {
  const supplierFilters = req.query as unknown as ISuppliersList;
  const suppliers = listSuppliers(supplierFilters);
  
  res.status(200).json(suppliers);
});

//Adicionar novo fornecedor

router.post("/suppliers", (req: Request, res: Response) => {
  const supplier = req.body; // O novo fornecedor deve vir do corpo da requisição
  const addSupplier = newSupplier(supplier);
  
  res.status(201).json(addSupplier); // Retorna o novo fornecedor adicionado
});

//Atualizar fornecedor

router.put("/suppliers/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const supplier = req.body;

  const updatedSupplier = updateSupplier(supplier);

  res.status(200).json(updatedSupplier);
});

// Excluir fornecedor

router.delete("/suppliers/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const supplier = req.body
  
  const deletedSupplier = deleteSupplier(supplier);

  res.status(200).json(deletedSupplier);
});

export default router;