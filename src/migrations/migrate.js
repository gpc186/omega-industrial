const fs = require('fs');
const path = require('path');
const { pool } = require('../config/database');

async function executarMigrations(direction = 'executar') {
  const migrationsDir = __dirname;
  const files = fs.readdirSync(migrationsDir).sort()
  .filter(f => f.endsWith('.js') && f !== 'migrate.js') // Ignorar o próprio migrate.js
    .sort()

  console.log(`\n Executando migrations (${direction})...\n`);

  for (const file of files) {
    if (file.endsWith('.js')) {
      const migration = require(path.join(migrationsDir, file));
      
      try {
        console.log(` ${file}`);
        await migration[direction]();
      } catch (error) {
        console.error(` Erro em ${file}:`, error.message);
        break;
      }
    }
  }

  await pool.end();
  console.log('\n Migrations concluídas!\n');
}

// Executar
const direction = process.argv[2] === 'reverter' ? 'reverter' : 'executar';
executarMigrations(direction);