require('dotenv').config();
const mysql = require('mysql2/promise');

// Pool de conexões
const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD, 
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Testar conexão
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log(' MySQL conectado!');
    connection.release();
    return true;
  } catch (error) {
    console.error(' Erro:', error.message);
    return false;
  }
}

// Helper para queries
async function query(sql, params = []) {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Erro na query:', error.message);
    throw error;
  }
}

module.exports = { pool, testConnection, query };