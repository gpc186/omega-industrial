const { pool } = require('../config/database');

async function executar() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS compra(
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        order_numero VARCHAR(50) UNIQUE NULL,
        total_preco DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        data_compra DATETIME DEFAULT CURRENT_TIMESTAMP,
        frete JSON NULL,
        FOREIGN KEY (user_id) REFERENCES user(id)
      )
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