import { IRecipientsList } from "../../IRecipient";

const recipients = [
  {
    id: 1,
    nis: "123124141",
    email:"beneficiario@gmail.com"
  }
];


export const listRecipients = (supplierFilters : IRecipientsList) => {

  /*const { id, nis } = supplierFilters;

  const filteredsuppliers = suppliers.filter((supplier) => {
    let foundSuppliers = true;

    if (razaoSocial && !supplier.razaoSocial.toLowerCase().includes(razaoSocial.toLowerCase())) {
      foundSuppliers = false;
    }

    if (cnpj && !supplier.cnpj.toLowerCase().includes(razaoSocial.toLowerCase())) {
      foundSuppliers = false;
    }

    if (id && supplier.id !== Number(id)) {
      foundSuppliers = false;
    }

    return foundSuppliers;
  });*/

}

export const newRecipient = (supplierFilters : IRecipientsList) => {



}

export const updateRecipient = (supplierFilters : IRecipientsList) => {

  /**const index = products.findIndex((p) => p.id === Number(id));
    if (index === -1){

      res.status(404).send();

      return
    } 
    products[index] = { ...products[index], ...productAtualizado };
    res.status(200).json(products[index]);**/

}

export const deleteRecipient = (supplierFilters : IRecipientsList) => {

  /**const index = suppliers.findIndex((e) => e.id === Number(id));
  if (index === -1) res.status(404).send();
  suppliers.splice(index, 1);
  
  res.status(204).send();
  return;**/

}

