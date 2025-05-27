/**
 * Rotas de autenticação
 * Cadastro de usuários e login
 */

const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');
const { fornecedorSchema, beneficiarioSchema, loginSchema } = require('../utils/validation');

const router = express.Router();

// Cadastro de fornecedor
router.post('/register/fornecedor', async (req, res) => {
  try {
    // Validar dados
    const { error, value } = fornecedorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.details.map(d => d.message) 
      });
    }

    const { cnpj, razaoSocial, cep, endereco, numero, email, senha } = value;
    const db = getDatabase();

    // Verificar se email já existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    // Hash da senha
    const hashedPassword = await bcrypt.hash(senha, 10);

    // Inserir fornecedor
    const result = db.prepare(`
      INSERT INTO users (email, password, role, cnpj, razaoSocial, cep, endereco, numero)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(email, hashedPassword, 'fornecedor', cnpj, razaoSocial, cep, endereco, numero);

    res.status(201).json({ 
      message: 'Fornecedor cadastrado com sucesso',
      userId: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Erro no cadastro de fornecedor:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Cadastro de beneficiário
router.post('/register/beneficiario', async (req, res) => {
  try {
    // Validar dados
    const { error, value } = beneficiarioSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.details.map(d => d.message) 
      });
    }

    const { nis, email } = value;
    const db = getDatabase();

    // Verificar se email já existe
    const existingUser = db.prepare('SELECT id FROM users WHERE email = ?').get(email);

    if (existingUser) {
      return res.status(409).json({ error: 'Email já cadastrado' });
    }

    // Inserir beneficiário (sem senha - acesso por NIS)
    const result = db.prepare(`
      INSERT INTO users (email, password, role, nis)
      VALUES (?, ?, ?, ?)
    `).run(email, '', 'beneficiario', nis);

    res.status(201).json({ 
      message: 'Beneficiário cadastrado com sucesso',
      userId: result.lastInsertRowid
    });

  } catch (error) {
    console.error('Erro no cadastro de beneficiário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Login unificado
router.post('/login', async (req, res) => {
  try {
    // Validar dados
    const { error, value } = loginSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.details.map(d => d.message) 
      });
    }

    const { email, password } = value;
    const db = getDatabase();

    // Buscar usuário
    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Verificar se é beneficiário (não tem login por senha)
    if (user.role === 'beneficiario') {
      return res.status(401).json({ error: 'Beneficiários não fazem login por senha' });
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Email ou senha incorretos' });
    }

    // Gerar JWT
    const token = jwt.sign(
      { 
        id: user.id, 
        email: user.email, 
        role: user.role 
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Resposta sem senha
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login realizado com sucesso',
      token,
      user: userWithoutPassword
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para redefinir a senha de um usuário
router.put('/reset-password/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { novaSenha } = req.body;

    if (!novaSenha) {
      return res.status(400).json({ error: 'A nova senha é obrigatória' });
    }

    const db = getDatabase();

    // Gerar hash da nova senha
    const hashedPassword = await bcrypt.hash(novaSenha, 10);

    // Atualizar a senha no banco de dados
    const result = db.prepare('UPDATE users SET password = ? WHERE id = ?').run(hashedPassword, id);

    if (result.changes === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ message: 'Senha atualizada com sucesso' });

  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Rota para registrar um novo usuário
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const db = getDatabase();

    const result = db.prepare(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
    ).run(name, email, hashedPassword, 'user');

    res.status(201).json({ message: 'Usuário cadastrado com sucesso' });

  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
