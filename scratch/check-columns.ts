
import { neon } from '@neondatabase/serverless';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

async function run() {
  const url = process.env.DATABASE_URL!;
  const sql = neon(url);
  
  const columns = await sql.query(`
    SELECT column_name, data_type 
    FROM information_schema.columns 
    WHERE table_name = 'products'
  `);
  
  console.log('Columns in "products" table:');
  console.log(JSON.stringify(columns, null, 2));
}

run();
