export interface User {
  id: number;
  email: string;
  role: 'admin' | 'fornecedor' | 'beneficiario';
  cnpj?: string;
  razaoSocial?: string;
  cep?: string;
  endereco?: string;
  numero?: string;
  nis?: string;
  createdAt?: string;
  updatedAt?: string;
}
