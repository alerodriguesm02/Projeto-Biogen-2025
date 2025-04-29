import { User } from './../models/user.model';
export const USERS_MOCK: User[] = [
  {
      id: 1,
      email: 'admin@teste.com',
      password: 'admin123',
      name: 'Administrador'
  },
  {
      id: 2,
      email: 'usuario@teste.com',
      password: 'user123',
      name: 'Usuário Teste'
  },
  {
      id: 3,
      email: 'maria@teste.com',
      password: 'maria123',
      name: 'Maria Silva'
  },
  {
    id: 4,
    email: 'tiago@biogen.com.br',
    password: 'tiago123',
    name: 'Tiago Muniz'
  },
];
