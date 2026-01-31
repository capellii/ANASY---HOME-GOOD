import pool from '../src/db/pgPool';
import fs from 'fs';
import path from 'path';

async function runMigrations() {
  try {
    const sqlPath = path.join(__dirname, '../db/init.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Split by semicolon and execute each statement
    const statements = sql
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0);
    
    console.log(`Executando ${statements.length} statements SQL...`);
    
    for (const statement of statements) {
      console.log(`Executando: ${statement.substring(0, 50)}...`);
      await pool.query(statement);
    }
    
    console.log('✅ Tabelas criadas com sucesso!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Erro ao criar tabelas:', err);
    process.exit(1);
  }
}

runMigrations();
