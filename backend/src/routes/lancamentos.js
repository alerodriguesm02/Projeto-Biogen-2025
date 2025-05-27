/**
 * Rotas para gerenciamento de lançamentos
 * CRUD para fornecedores e visualização para admins
 */

const express = require('express');
const { getDatabase } = require('../config/database');
const { authenticateToken, requireAdmin, requireFornecedor, requireAdminOrFornecedor } = require('../middleware/auth');
const { lancamentoSchema } = require('../utils/validation');

const router = express.Router();

// Listar lançamentos (fornecedor vê apenas os seus, admin vê todos)
router.get('/', authenticateToken, (req, res) => {
  try {
    const db = getDatabase();
    let query, params = [];
    
    if (req.user.role === 'admin') {
      // Admin vê todos os lançamentos com dados do usuário
      query = `
        SELECT l.*, u.email, u.razaoSocial, u.cnpj
        FROM lancamentos l
        JOIN users u ON l.userId = u.id
        ORDER BY l.createdAt DESC
      `;
    } else if (req.user.role === 'fornecedor') {
      // Fornecedor vê apenas seus lançamentos
      query = `
        SELECT * FROM lancamentos 
        WHERE userId = ? 
        ORDER BY ano DESC, 
        CASE mes
          WHEN 'Janeiro' THEN 1 WHEN 'Fevereiro' THEN 2 WHEN 'Março' THEN 3
          WHEN 'Abril' THEN 4 WHEN 'Maio' THEN 5 WHEN 'Junho' THEN 6
          WHEN 'Julho' THEN 7 WHEN 'Agosto' THEN 8 WHEN 'Setembro' THEN 9
          WHEN 'Outubro' THEN 10 WHEN 'Novembro' THEN 11 WHEN 'Dezembro' THEN 12
        END DESC
      `;
      params = [req.user.id];
    } else {
      return res.status(403).json({ error: 'Acesso negado para este tipo de usuário' });
    }
    
    const lancamentos = db.prepare(query).all(...params);
    res.json(lancamentos);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar lançamentos' });
  }
});

// Criar novo lançamento (apenas fornecedor)
router.post('/', authenticateToken, requireFornecedor, (req, res) => {
  try {
    // Validar dados
    const { error, value } = lancamentoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.details.map(d => d.message) 
      });
    }

    const { ano, mes, toneladasProcessadas, energiaGerada, impostoAbatido } = value;
    const db = getDatabase();

    // Verificar se já existe lançamento para este ano/mês
    const existing = db.prepare(
      'SELECT id FROM lancamentos WHERE userId = ? AND ano = ? AND mes = ?'
    ).get(req.user.id, ano, mes);

    if (existing) {
      return res.status(409).json({ 
        error: 'Já existe um lançamento para este mês/ano' 
      });
    }

    // Inserir novo lançamento
    const result = db.prepare(`
      INSERT INTO lancamentos (userId, ano, mes, toneladasProcessadas, energiaGerada, impostoAbatido)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(req.user.id, ano, mes, toneladasProcessadas, energiaGerada, impostoAbatido);

    res.status(201).json({ 
      message: 'Lançamento criado com sucesso',
      id: result.lastInsertRowid
    });

  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Editar lançamento (fornecedor edita apenas os seus, admin edita qualquer um)
router.put('/:id', authenticateToken, requireAdminOrFornecedor, (req, res) => {
  try {
    // Validar dados
    const { error, value } = lancamentoSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ 
        error: 'Dados inválidos', 
        details: error.details.map(d => d.message) 
      });
    }

    const { id } = req.params;
    const { ano, mes, toneladasProcessadas, energiaGerada, impostoAbatido } = value;
    const db = getDatabase();

    // Verificar se o lançamento existe e se o usuário tem permissão
    let whereClause = 'WHERE id = ?';
    let whereParams = [id];
    
    if (req.user.role === 'fornecedor') {
      whereClause += ' AND userId = ?';
      whereParams.push(req.user.id);
    }

    const lancamento = db.prepare(`SELECT id, userId FROM lancamentos ${whereClause}`).get(...whereParams);

    if (!lancamento) {
      return res.status(404).json({ error: 'Lançamento não encontrado ou sem permissão' });
    }

    // Atualizar lançamento
    const result = db.prepare(`
      UPDATE lancamentos 
      SET ano = ?, mes = ?, toneladasProcessadas = ?, energiaGerada = ?, impostoAbatido = ?, updatedAt = CURRENT_TIMESTAMP
      WHERE id = ?
    `).run(ano, mes, toneladasProcessadas, energiaGerada, impostoAbatido, id);

    res.json({ message: 'Lançamento atualizado com sucesso' });

  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Excluir lançamento (fornecedor exclui apenas os seus, admin exclui qualquer um)
router.delete('/:id', authenticateToken, requireAdminOrFornecedor, (req, res) => {
  try {
    const { id } = req.params;
    const db = getDatabase();

    // Verificar se o lançamento existe e se o usuário tem permissão
    let whereClause = 'WHERE id = ?';
    let whereParams = [id];
    
    if (req.user.role === 'fornecedor') {
      whereClause += ' AND userId = ?';
      whereParams.push(req.user.id);
    }

    const lancamento = db.prepare(`SELECT id FROM lancamentos ${whereClause}`).get(...whereParams);

    if (!lancamento) {
      return res.status(404).json({ error: 'Lançamento não encontrado ou sem permissão' });
    }

    // Excluir lançamento
    const result = db.prepare('DELETE FROM lancamentos WHERE id = ?').run(id);

    res.json({ message: 'Lançamento excluído com sucesso' });

  } catch (error) {
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
