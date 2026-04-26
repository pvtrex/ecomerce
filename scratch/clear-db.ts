
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const url = process.env.DATABASE_URL!;
  const sql = neon(url);
  
  console.log('Dropping all tables...');
  
  // Get all table names
  const tables = await sql.query(`
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
  `);
  
  for (const row of tables) {
    const tableName = row.table_name;
    console.log(`Dropping table ${tableName}...`);
    await sql.query(`DROP TABLE IF EXISTS "${tableName}" CASCADE`);
  }

  // Also drop types
  const types = ['address_type', 'order_status', 'payment_method', 'payment_status', 'discount_type'];
  for (const typeName of types) {
    console.log(`Dropping type ${typeName}...`);
    await sql.query(`DROP TYPE IF EXISTS "${typeName}" CASCADE`);
  }
  
  console.log('Database cleared.');
}

run();
