/**
 * Servidor principal do backend Biogen
 * Configuração do Express, middlewares e rotas
 */

const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Importar rotas
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const lancamentoRoutes = require('./routes/lancamentos');

// Inicializar database
const { initDatabase, closeDatabase } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3008;

// Middlewares globais
app.use(cors({
  origin: ['http://localhost:8080', 'http://localhost:5173', 'http://localhost:4200'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware de logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Rotas da API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lancamentos', lancamentoRoutes);

// Rota de health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Biogen API funcionando!',
    timestamp: new Date().toISOString()
  });
});

// Middleware de tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(err.status || 500).json({
    error: 'Erro interno do servidor',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Algo deu errado'
  });
});

// Rota 404
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Rota não encontrada' });
});

// Inicializar servidor
async function startServer() {
  try {
    // Inicializar database
    await initDatabase();
    console.log('✅ Database inicializado com sucesso');
    
    // Iniciar servidor
    const server = app.listen(PORT, () => {
      console.log(`🚀 Servidor Biogen rodando em http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`🔐 Credenciais de teste:`);
      console.log(`   Admin: ${process.env.ADMIN_EMAIL} / ${process.env.ADMIN_PASSWORD}`);
      console.log(`   Fornecedor: ${process.env.FORNECEDOR_EMAIL} / ${process.env.FORNECEDOR_PASSWORD}`);
    });

    // Gerenciar encerramento gracioso
    process.on('SIGTERM', () => gracefulShutdown(server));
    process.on('SIGINT', () => gracefulShutdown(server));

  } catch (error) {
    console.error('❌ Erro ao iniciar servidor:', error);
    process.exit(1);
  }
}

// Função para encerramento gracioso
function gracefulShutdown(server) {
  console.log('🔄 Iniciando encerramento gracioso...');
  
  server.close(() => {
    console.log('👋 Servidor HTTP fechado');
    closeDatabase();
    console.log('🔒 Conexão com banco de dados fechada');
    process.exit(0);
  });
}

startServer();
