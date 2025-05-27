/**
 * Configuração e inicialização do banco de dados SQLite
 * Cria tabelas e dados iniciais
 */

const Database = require('better-sqlite3');
const path = require('path');
const bcrypt = require('bcrypt');

const dbPath = path.join(__dirname, '../../database/biogen.sqlite');
let db;

// Conectar ao banco
function getDatabase() {
  if (!db) {
    db = new Database(dbPath, { verbose: console.log });
  }
  return db;
}

// Inicializar database com tabelas e dados iniciais
async function initDatabase() {
  const db = getDatabase();
  
  try {
    // Criar tabela users
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        role TEXT NOT NULL CHECK (role IN ('admin', 'fornecedor', 'beneficiario')),
        cnpj TEXT,
        razaoSocial TEXT,
        cep TEXT,
        endereco TEXT,
        numero TEXT,
        nis TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Criar tabela lancamentos
    db.exec(`
      CREATE TABLE IF NOT EXISTS lancamentos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER NOT NULL,
        ano INTEGER NOT NULL,
        mes TEXT NOT NULL,
        toneladasProcessadas REAL NOT NULL,
        energiaGerada REAL NOT NULL,
        impostoAbatido REAL NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users (id) ON DELETE CASCADE
      )
    `);

    // Criar usuários padrão se não existirem
    await createDefaultUsers(db);
    
    console.log('✅ Tabelas criadas com sucesso');
    
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
    throw error;
  }
}

// Criar usuários padrão para desenvolvimento
async function createDefaultUsers(db) {
  const adminPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
  const fornecedorPassword = await bcrypt.hash(process.env.FORNECEDOR_PASSWORD, 10);
  
  // Inserir admin padrão
  db.prepare(`
    INSERT OR IGNORE INTO users (email, password, role)
    VALUES (?, ?, ?)
  `).run(process.env.ADMIN_EMAIL, adminPassword, 'admin');

  // Inserir fornecedor de teste
  db.prepare(`
    INSERT OR IGNORE INTO users (
      email, password, role, cnpj, razaoSocial, cep, endereco, numero
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    process.env.FORNECEDOR_EMAIL, 
    fornecedorPassword, 
    'fornecedor',
    '12.345.678/0001-90',
    'Empresa Fornecedora Ltda',
    '01234-567',
    'Rua das Empresas, 123',
    '456'
  );

  // Inserir dados de exemplo para o fornecedor
  const user = db.prepare('SELECT id FROM users WHERE email = ?').get(process.env.FORNECEDOR_EMAIL);
  
  if (user) {
    const lancamentosExemplo = [
      { ano: 2024, mes: 'Janeiro', toneladas: 150.5, energia: 1200.8, imposto: 5500.00 },
      { ano: 2024, mes: 'Fevereiro', toneladas: 175.2, energia: 1350.5, imposto: 6200.50 },
      { ano: 2024, mes: 'Março', toneladas: 200.1, energia: 1500.2, imposto: 7100.75 }
    ];

    const stmt = db.prepare(`
      INSERT OR IGNORE INTO lancamentos (
        userId, ano, mes, toneladasProcessadas, energiaGerada, impostoAbatido
      ) VALUES (?, ?, ?, ?, ?, ?)
    `);

    lancamentosExemplo.forEach(l => {
      stmt.run(user.id, l.ano, l.mes, l.toneladas, l.energia, l.imposto);
    });
  }
}

// Fechar conexão com o banco
function closeDatabase() {
  if (db) {
    db.close();
    db = null;
  }
}

module.exports = { getDatabase, initDatabase, closeDatabase };
