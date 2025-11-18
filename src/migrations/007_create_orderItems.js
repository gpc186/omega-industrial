const { pool } = require('../config/database');

async function executar() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items(
        id INT PRIMARY KEY AUTO_INCREMENT,
        compra_id INT NOT NULL,
        product_id INT NOT NULL,
        quantidade INT NOT NULL,
        preco_unidade DECIMAL(10, 2) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (compra_id) REFERENCES compra(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES produto(id)
      )
    `);
    console.log('✓ Tabela order_items criada');
  } finally {
    connection.release();
  }
}

async function reverter() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query('DROP TABLE IF EXISTS order_items');
    console.log('✓ Tabela order_items removida');
  } finally {
    connection.release();
  }
}

module.exports = { executar, reverter };
