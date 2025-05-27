
/**
 * Middlewares de autenticação e autorização
 * Verificação de JWT e roles de usuário
 */

const jwt = require('jsonwebtoken');
const { getDatabase } = require('../config/database');

// Middleware para verificar JWT
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    return res.status(401).json({ error: 'Token de acesso necessário' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Token inválido ou expirado' });
    }
    
    req.user = user; // { id, email, role }
    next();
  });
}

// Middleware para verificar role específica
function requireRole(roles) {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ error: 'Usuário não autenticado' });
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        error: 'Acesso negado - Role insuficiente',
        required: userRoles,
        current: req.user.role
      });
    }

    next();
  };
}

// Middleware para verificar se é admin
const requireAdmin = requireRole('admin');

// Middleware para verificar se é fornecedor
const requireFornecedor = requireRole('fornecedor');

// Middleware para verificar se é admin ou fornecedor
const requireAdminOrFornecedor = requireRole(['admin', 'fornecedor']);

module.exports = {
  authenticateToken,
  requireRole,
  requireAdmin,
  requireFornecedor,
  requireAdminOrFornecedor
};
