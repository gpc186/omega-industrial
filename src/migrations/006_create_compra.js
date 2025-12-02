const { pool } = require('../config/database');

async function executar() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query(`
      c
    `);
    console.log('✓ Tabela compra criada');
  } finally {
    connection.release();
  }
}

async function reverter() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query('DROP TABLE IF EXISTS compra');
    console.log('✓ Tabela compra removida');
  } finally {
    connection.release();
  }
}

module.exports = { executar, reverter };