const { pool } = require('../config/database');

async function executar() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart_items(
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantidade INT NOT NULL DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES produto(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);
    console.log('✓ Tabela cart_items criada');
  } finally {
    connection.release();
  }
}

async function reverter() {
  const connection = await pool.getConnection();
  try {
    await connection.query('USE OmegaPetro');
    await connection.query('DROP TABLE IF EXISTS cart_items');
    console.log('✓ Tabela cart_items removida');
  } finally {
    connection.release();
  }
}

module.exports = { executar, reverter };
