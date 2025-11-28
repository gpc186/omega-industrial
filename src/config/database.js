require('dotenv').config();
const mysql = require('mysql2/promise');

// Pool SEM database (para criar o banco)
const poolWithoutDB = mysql.createPool({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD || '',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Pool COM database (para usar após criar)
const pool = mysql.createPool({
  host: process.env.DB_HOST, 
  port: process.env.DB_PORT,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD || '',
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

module.exports = { pool, poolWithoutDB, testConnection, query };