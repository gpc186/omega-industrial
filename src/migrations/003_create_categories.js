const { pool } = require('../config/database');

async function executar() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories(
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(100) NOT NULL,
        description TEXT
      )
    `);
    console.log('✓ Tabela categories criada');
  } finally {
    connection.release();
  }
}

async function reverter() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query('DROP TABLE IF EXISTS categories');
    console.log('✓ Tabela categories removida');
  } finally {
    connection.release();
  }
}

module.exports = { executar, reverter };