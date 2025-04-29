import express from "express";
import { Request, Response } from "express";
import { IRecipientsList } from "../../IRecipient";
import { listRecipients, newRecipient, updateRecipient, deleteRecipient } from "../controllers/recipient.controller";
const router = express.Router();

//Listar beneficiários

router.get("/", (req: Request, res: Response) => {
  const recipientFilters = req.query as unknown as IRecipientsList;
  const recipients = listRecipients(recipientFilters);
  
  res.status(200).json(recipients);
});

//Adicionar novo beneficiário

router.post("/recipients", (req: Request, res: Response) => {
  const recipient = req.body; // O novo beneficiário deve vir do corpo da requisição
  const addRecipient = newRecipient(recipient);
  
  res.status(201).json(addRecipient); // Retorna o novo beneficiário adicionado
});

//Atualizar beneficiário

router.put("/recipients/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const recipient = req.body;

  const updatedRecipient = updateRecipient(recipient);

  res.status(200).json(updatedRecipient);
});

// Excluir beneficiário

router.delete("/recipients/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const recipient = req.body
  
  const deletedRecipient = deleteRecipient(recipient);

  res.status(200).json(deletedRecipient);
});

export default router;