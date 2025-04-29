import { ISuppliersList } from "../../ISupplier";

const suppliers = [
  {
    id: 1,
    cnpj: "123123",
    razaoSocial: "Alessandro",
    cep: "0",
    address: "0",
    number: "0",
    email: "0",
    password: "asdadsa"
  }
];


export const listSuppliers = (supplierFilters : ISuppliersList) => {

  const { id, cnpj, razaoSocial } = supplierFilters;

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
  });

}

export const newSupplier = (supplierFilters : ISuppliersList) => {



}

export const updateSupplier = (supplierFilters : ISuppliersList) => {

  /**const index = products.findIndex((p) => p.id === Number(id));
    if (index === -1){

      res.status(404).send();

      return
    } 
    products[index] = { ...products[index], ...productAtualizado };
    res.status(200).json(products[index]);**/

}

export const deleteSupplier = (supplierFilters : ISuppliersList) => {

  /**const index = suppliers.findIndex((e) => e.id === Number(id));
  if (index === -1) res.status(404).send();
  suppliers.splice(index, 1);
  
  res.status(204).send();
  return;**/

}

