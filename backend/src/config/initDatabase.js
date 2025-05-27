const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcrypt');

// Caminho para o banco de dados
const dbPath = path.resolve(__dirname, '../../database/biogen.sqlite');

// Criar conexão com o banco de dados
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Erro ao conectar ao banco:', err);
        return;
    }
    console.log('Conectado ao banco de dados SQLite');

    // Criar tabelas
    db.serialize(() => {
        // Tabela de usuários
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);

        // Tabela de lançamentos
        db.run(`CREATE TABLE IF NOT EXISTS lancamentos (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            tipo TEXT NOT NULL,
            quantidade REAL NOT NULL,
            data DATE NOT NULL,
            observacoes TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )`);

        // Inserir usuário admin padrão
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@biogen.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
        
        bcrypt.hash(adminPassword, 10, (err, hash) => {
            if (err) {
                console.error('Erro ao criar hash da senha:', err);
                return;
            }

            const insertAdmin = `INSERT OR IGNORE INTO users (name, email, password, role) 
                               VALUES (?, ?, ?, ?)`;
            
            db.run(insertAdmin, ['Administrador', adminEmail, hash, 'admin'], 
                function(err) {
                    if (err) {
                        console.error('Erro ao inserir admin:', err);
                    } else if (this.changes > 0) {
                        console.log('Usuário admin criado com sucesso');
                    } else {
                        console.log('Usuário admin já existe');
                    }
                }
            );
        });
    });
});

// Fechar conexão quando terminar
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Erro ao fechar banco:', err);
        } else {
            console.log('Conexão com banco fechada');
        }
        process.exit();
    });
});
