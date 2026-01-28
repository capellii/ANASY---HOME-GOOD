import pool from '../src/db/pgPool';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  const sqlPath = path.join(__dirname, '../db/init.sql');
  const sql = fs.readFileSync(sqlPath, 'utf8');
  await pool.query(sql);
  console.log('Tabelas criadas com sucesso!');
  process.exit(0);
}

runMigrations().catch((err) => {
  console.error('Erro ao criar tabelas:', err);
  process.exit(1);
});
