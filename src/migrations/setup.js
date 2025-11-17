const { pool } = require('../config/database');

async function setupDatabase() {
  const connection = await pool.getConnection();
  
  try {
    console.log(' Criando banco de dados...');
    
    // Criar banco se não existir
    await connection.query('CREATE DATABASE IF NOT EXISTS OmegaPetro');
    await connection.query('USE OmegaPetro');
    
    console.log(' Criando tabelas...');

    // 1. userRole
    await connection.query(`
      CREATE TABLE IF NOT EXISTS userRole(
        id INTEGER AUTO_INCREMENT NOT NULL PRIMARY KEY,
        nome CHAR(25) NOT NULL,
        email CHAR(50) NOT NULL,
        CNPJ VARCHAR(18) NOT NULL,
        password_hash CHAR(60) NOT NULL,
        phone VARCHAR(20),
        role ENUM('adm', 'user') DEFAULT 'user'
      )
    `);
    console.log(' Tabela userRole criada');

    // 2. categories
    await connection.query(`
      CREATE TABLE IF NOT EXISTS categories(
        id INT PRIMARY KEY AUTO_INCREMENT,
        nome VARCHAR(100) NOT NULL,
        description TEXT
      )
    `);
    console.log(' Tabela categories criada');

    // 3. produto
    await connection.query(`
      CREATE TABLE IF NOT EXISTS produto(
        id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        preco DECIMAL(10, 2) NOT NULL,
        descricao TEXT,
        img_url VARCHAR(500),
        category_id INT NOT NULL,
        quantidade INT DEFAULT 0,
        FOREIGN KEY (category_id) REFERENCES categories(id)
      )
    `);
    console.log('Tabela produto criada');

    // 4. cart_items
    await connection.query(`
      CREATE TABLE IF NOT EXISTS cart_items(
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        product_id INT NOT NULL,
        quantidade INT NOT NULL DEFAULT 1,
        FOREIGN KEY (user_id) REFERENCES userRole(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES produto(id) ON DELETE CASCADE,
        UNIQUE KEY unique_user_product (user_id, product_id)
      )
    `);
    console.log(' Tabela cart_items criada');

    // 5. compra
    await connection.query(`
      CREATE TABLE IF NOT EXISTS compra(
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        order_numero VARCHAR(50) UNIQUE NULL,
        total_preco DECIMAL(10, 2) NOT NULL,
        status VARCHAR(50) DEFAULT 'pending',
        notes TEXT,
        FOREIGN KEY (user_id) REFERENCES userRole(id)
      )
    `);
    console.log(' Tabela compra criada');

    // 6. order_items
    await connection.query(`
      CREATE TABLE IF NOT EXISTS order_items(
        id INT PRIMARY KEY AUTO_INCREMENT,
        compra_id INT NOT NULL,
        product_id INT NOT NULL,
        quantidade INT NOT NULL,
        preco_unidade DECIMAL(10, 2) NOT NULL,
        FOREIGN KEY (compra_id) REFERENCES compra(id) ON DELETE CASCADE,
        FOREIGN KEY (product_id) REFERENCES produto(id)
      )
    `);
    console.log(' Tabela order_items criada');

    console.log('\n Banco de dados configurado com sucesso!');
    
  } catch (error) {
    console.error(' Erro:', error.message);
  } finally {
    connection.release();
    await pool.end();
  }
}

setupDatabase();