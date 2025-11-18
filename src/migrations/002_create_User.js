const { pool } = require('../config/database');

async function executar() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS user(
        id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
        email VARCHAR(100) UNIQUE NOT NULL,
        nome VARCHAR(50) NOT NULL,
        CNPJ VARCHAR(18) NOT NULL,
        password_hash VARCHAR(60) NOT NULL,
        phone VARCHAR(20),
        role ENUM('adm', 'user') DEFAULT 'user',
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log('✓ Tabela user criada');
  } finally {
    connection.release();
  }
}

async function reverter() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query('DROP TABLE IF EXISTS user');
    console.log('✓ Tabela user removida');
  } finally {
    connection.release();
  }
}

module.exports = { executar, reverter };