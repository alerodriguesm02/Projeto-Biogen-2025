
# Biogen Backend API

Backend para o sistema Biogen - Plataforma de Energia Limpa através de Biodigestores.

## 🚀 Tecnologias

- **Node.js** + **Express.js** - Servidor e API REST
- **SQLite** - Banco de dados
- **JWT** - Autenticação
- **bcrypt** - Hash de senhas
- **Joi** - Validação de dados

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Inicializar banco de dados
npm run init-db

# Rodar em desenvolvimento
npm run dev

# Rodar em produção
npm start
```

## 🗄️ Estrutura do Banco de Dados

### Tabela `users`
- `id` - Chave primária
- `email` - Email único
- `password` - Senha com hash (bcrypt)
- `role` - Tipo: 'admin', 'fornecedor', 'beneficiario'
- `cnpj`, `razaoSocial`, `cep`, `endereco`, `numero` - Dados do fornecedor
- `nis` - Número de Identificação Social (beneficiário)

### Tabela `lancamentos`
- `id` - Chave primária
- `userId` - Chave estrangeira para users
- `ano`, `mes` - Período do lançamento
- `toneladasProcessadas` - Quantidade processada
- `energiaGerada` - Energia gerada (KW)
- `impostoAbatido` - Valor do imposto abatido (R$)

## 🔐 Autenticação

### Credenciais Padrão (Desenvolvimento)
```
Admin: admin@biogen.com / admin123
Fornecedor: fornecedor@exemplo.com / fornecedor123
```

### Login
```bash
curl -X POST http://localhost:3008/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@biogen.com",
    "password": "admin123"
  }'
```

## 📡 Rotas da API

### Autenticação

#### Cadastro de Fornecedor
```bash
curl -X POST http://localhost:3008/api/auth/register/fornecedor \
  -H "Content-Type: application/json" \
  -d '{
    "cnpj": "12.345.678/0001-90",
    "razaoSocial": "Empresa Teste Ltda",
    "cep": "01234-567",
    "endereco": "Rua Teste, 123",
    "numero": "456",
    "email": "empresa@teste.com",
    "senha": "senha123"
  }'
```

#### Cadastro de Beneficiário
```bash
curl -X POST http://localhost:3008/api/auth/register/beneficiario \
  -H "Content-Type: application/json" \
  -d '{
    "nis": "12345678901",
    "email": "beneficiario@teste.com"
  }'
```

### Usuários (Apenas Admin)

#### Listar Usuários
```bash
curl -X GET http://localhost:3008/api/users \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

#### Editar Usuário
```bash
curl -X PUT http://localhost:3008/api/users/1 \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "razaoSocial": "Nova Razão Social"
  }'
```

#### Excluir Usuário
```bash
curl -X DELETE http://localhost:3008/api/users/1 \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

### Lançamentos

#### Criar Lançamento (Fornecedor)
```bash
curl -X POST http://localhost:3008/api/lancamentos \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ano": 2024,
    "mes": "Janeiro",
    "toneladasProcessadas": 150.5,
    "energiaGerada": 1200.8,
    "impostoAbatido": 5500.00
  }'
```

#### Listar Lançamentos
```bash
curl -X GET http://localhost:3008/api/lancamentos \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

#### Editar Lançamento
```bash
curl -X PUT http://localhost:3008/api/lancamentos/1 \
  -H "Authorization: Bearer SEU_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "ano": 2024,
    "mes": "Fevereiro",
    "toneladasProcessadas": 200.0,
    "energiaGerada": 1500.0,
    "impostoAbatido": 6000.00
  }'
```

#### Excluir Lançamento
```bash
curl -X DELETE http://localhost:3008/api/lancamentos/1 \
  -H "Authorization: Bearer SEU_JWT_TOKEN"
```

## 🔒 Segurança

- **Hashing de senhas** com bcrypt (salt rounds: 10)
- **JWT tokens** com expiração de 24h
- **Validação rigorosa** de todos os dados de entrada
- **Autorização por roles** (admin, fornecedor, beneficiario)
- **CORS configurado** para aceitar apenas origem do frontend

## 🛠️ Health Check

```bash
curl http://localhost:3008/api/health
```

## 📊 Dados de Exemplo

O sistema cria automaticamente:
- 1 usuário admin
- 1 fornecedor de teste com dados de exemplo
- 3 lançamentos de exemplo para o fornecedor

## 🚨 Tratamento de Erros

A API retorna erros padronizados:
- `400` - Dados inválidos
- `401` - Não autenticado
- `403` - Sem permissão
- `404` - Recurso não encontrado
- `409` - Conflito (ex: email já existe)
- `500` - Erro interno do servidor
