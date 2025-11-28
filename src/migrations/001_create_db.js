const { poolWithoutDB } = require('../config/database');

async function executar() {
  const connection = await poolWithoutDB.getConnection();
  try {
    await connection.query('CREATE DATABASE IF NOT EXISTS OmegaPetro');
    console.log('✓ Database OmegaPetro criado');
  } finally {
    connection.release();
  }
}

async function reverter() {
  const connection = await poolWithoutDB.getConnection();
  try {
    await connection.query('DROP DATABASE IF EXISTS OmegaPetro');
    console.log('✓ Database OmegaPetro removido');
  } finally {
    connection.release();
  }
}

module.exports = { executar, reverter };